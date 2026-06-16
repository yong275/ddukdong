import 'dotenv/config';
import OpenAI from 'openai';
import supabase from '../db/supabase.js';
import { uploadImageFromBase64 } from '../utils/storage.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const styleMap = {
  watercolor: 'soft watercolor style',
  cartoon: 'flat cartoon style',
  fairytale: 'classic fairytale illustration',
  animation: 'vibrant animation style',
};

async function buildImagePrompt(text_ko, art_style) {
  const style = styleMap[art_style] ?? 'soft watercolor style';

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "Convert the Korean children's story text into a concise English image scene description (1-2 sentences). Focus on visual elements only. No text in the image.",
      },
      { role: 'user', content: text_ko },
    ],
  });

  const scene = res.choices[0].message.content.trim();
  return `${scene}, ${style}, children's book illustration, no text`;
}

export async function generateAndSaveImage(page_id, story_id, text_ko, art_style) {
  const prompt = await buildImagePrompt(text_ko, art_style);

  const response = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1024x1024',
  });

  const b64 = response.data[0].b64_json;
  const filePath = `${story_id}/${page_id}.png`;
  const publicUrl = await uploadImageFromBase64(b64, filePath);

  await supabase
    .from('pages')
    .update({ image_url: publicUrl })
    .eq('id', page_id);

  return publicUrl;
}

export async function generateImagesForStory(story_id) {
  const { data: story } = await supabase
    .from('stories')
    .select('art_style')
    .eq('id', story_id)
    .single();

  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, text_ko')
    .eq('story_id', story_id)
    .order('page_number');

  if (error) throw new Error(error.message);

  // 컷별 병렬 생성
  const results = await Promise.all(
    pages.map(p => generateAndSaveImage(p.id, story_id, p.text_ko, story.art_style))
  );

  return results;
}
