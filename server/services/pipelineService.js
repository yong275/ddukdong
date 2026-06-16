import { generateStory } from './solarService.js';
import { generateAndSaveImage } from './dalleService.js';
import { createJob, updateJob, getJob } from '../utils/jobStore.js';
import supabase from '../db/supabase.js';
import { randomUUID } from 'crypto';

export async function startGeneratePipeline(job_id, input) {
  try {
    updateJob(job_id, { status: 'pending' });

    // 1. Solar API → 스토리 생성
    const story = await generateStory(input);
    updateJob(job_id, { status: 'story_done', story, input });
  } catch (err) {
    updateJob(job_id, { status: 'failed', error: err.message });
  }
}

export async function confirmStory(job_id) {
  const job = getJob(job_id);
  const { story, input } = job ?? {};
  if (!story) throw new Error('job을 찾을 수 없습니다.');

  // 2. DB에 stories 저장
  const story_id = randomUUID();
  const { error: storyError } = await supabase.from('stories').insert({
    id: story_id,
    title: story.title,
    input_mode: input.input_mode,
    character_name: input.character_name,
    character_gender: input.character_gender,
    sub_characters: input.sub_characters ?? [],
    age_group: input.age_group ?? null,
    background: input.background,
    situation: input.situation,
    moral: input.moral ?? null,
    art_style: input.art_style,
    status: 'story_done',
  });
  if (storyError) throw new Error(storyError.message);

  // 3. DB에 pages 저장
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

  // 4. 이미지 생성 (백그라운드)
  generateImages(story_id, savedPages, story.pages, input.art_style);

  return story_id;
}

async function generateImages(story_id, savedPages, storyPages, art_style) {
  try {
    await supabase.from('stories').update({ status: 'image_done' }).eq('id', story_id);

    await Promise.all(
      savedPages.map((p, i) =>
        generateAndSaveImage(p.id, story_id, storyPages[i].text, art_style)
      )
    );

    await supabase.from('stories').update({ status: 'completed' }).eq('id', story_id);
  } catch {
    await supabase.from('stories').update({ status: 'failed' }).eq('id', story_id);
  }
}
