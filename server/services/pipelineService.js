import { generateStory } from './solarService.js';
import { generateAllImagePrompts, generateAndSaveImage, generateCoverImage } from './dalleService.js';
import { createJob, updateJob, getJob } from '../utils/jobStore.js';
import supabase from '../db/supabase.js';
import { randomUUID } from 'crypto';

export async function startGeneratePipeline(job_id, input, user_id) {
  try {
    updateJob(job_id, { status: 'pending' });

    const story = await generateStory(input);
    updateJob(job_id, { status: 'story_done', story, input, user_id });
    // 사용자가 줄거리 확인 후 confirm 호출 시 이미지 생성 시작
  } catch (err) {
    updateJob(job_id, { status: 'failed', error_code: err.error_code ?? 'UNKNOWN', error: err.message });
  }
}

export async function regenerateStory(job_id) {
  const job = getJob(job_id);
  if (!job) throw new Error('job을 찾을 수 없습니다.');

  if (job.regenerate_count >= 3) {
    const err = new Error('재생성은 최대 3회까지 가능합니다.');
    err.status = 429;
    throw err;
  }

  updateJob(job_id, { status: 'pending', regenerate_count: job.regenerate_count + 1, story: null });
  startGeneratePipeline(job_id, job.input);
}

export async function confirmStory(job_id) {
  const job = getJob(job_id);
  const { story, input, user_id } = job ?? {};
  if (!story) throw new Error('job을 찾을 수 없습니다.');

  const story_id = randomUUID();
  const { error: storyError } = await supabase.from('stories').insert({
    id: story_id,
    user_id: user_id ?? null,
    title: story.title,
    input_mode: input.input_mode,
    character_name: input.character_name,
    character_gender: input.character_gender,
    sub_characters: story.sub_characters ?? [],
    age_group: input.age_group ?? null,
    background: input.background,
    situation: input.situation,
    moral: input.moral ?? null,
    art_style: input.art_style,
    character_description: story.character ?? null,
    status: 'story_done',
  });
  if (storyError) throw new Error(storyError.message);

  const pageRows = story.pages.map((p, i) => ({
    story_id,
    page_number: i + 1,
    text_ko: p.text,
  }));
  const { data: savedPages, error: pagesError } = await supabase
    .from('pages')
    .insert(pageRows)
    .select('id, page_number, text_ko');
  if (pagesError) throw new Error(pagesError.message);

  // 이미지 생성 시작 전 상태 변경 → LoadingPage의 story_done 재감지 방지
  updateJob(job_id, { status: 'generating_images' });

  generateImages(job_id, story_id, story.title, savedPages, story, input);

  return story_id;
}

async function generateImages(job_id, story_id, title, savedPages, story, input) {
  try {
    await supabase.from('stories').update({ status: 'image_done' }).eq('id', story_id);
    updateJob(job_id, { status: 'image_done' });

    const imagePromptPages = await generateAllImagePrompts(story, input);
    const promptMap = Object.fromEntries(imagePromptPages.map(p => [p.page_number, p.image_prompt]));

    await Promise.all([
      generateCoverImage(story_id, title, input.art_style_en ?? input.art_style, story.character),
      ...savedPages.map((p, i) =>
        generateAndSaveImage(p.id, story_id, promptMap[i + 1] ?? '')
      ),
    ]);

    await supabase.from('stories').update({ status: 'completed' }).eq('id', story_id);
    updateJob(job_id, { status: 'completed', story_id });
  } catch (err) {
    const error_code = err.error_code ?? 'UNKNOWN';
    const error_message = err.message ?? '알 수 없는 오류가 발생했습니다.';
    await supabase.from('stories').update({ status: 'failed', error_code }).eq('id', story_id);
    updateJob(job_id, { status: 'failed', error_code, error_message });
  }
}
