import 'dotenv/config';
import OpenAI from 'openai';
import supabase from '../db/supabase.js';
import { uploadImageFromBase64 } from '../utils/storage.js';
import { classifyApiError } from '../utils/classifyError.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const styleMap = {
  watercolor: 'soft watercolor style',
  cartoon: 'flat cartoon style',
  fairytale: 'classic fairytale illustration',
  animation: 'vibrant animation style',
};

function buildCharacterDesc(c) {
  const parts = [
    c.age_appearance,
    `${c.hair}`,
    `${c.eyes}`,
    `${c.skin} skin`,
    `wearing ${c.outfit}`,
  ];
  if (c.features) parts.push(c.features);
  return parts.join(', ');
}

function buildCharacterContext(character, sub_characters = [], characters_in_scene = []) {
  const main = `Main character: ${buildCharacterDesc(character)}`;
  if (!sub_characters.length) return main;

  const appearing = characters_in_scene.length
    ? sub_characters.filter(s => characters_in_scene.includes(s.name))
    : sub_characters;

  if (!appearing.length) return main;
  const subs = appearing.map(s => `${s.name}: ${buildCharacterDesc(s)}`).join('. ');
  return `${main}. Supporting characters — ${subs}`;
}

async function buildImagePrompt(text_ko, art_style, character, sub_characters, characters_in_scene) {
  const style = styleMap[art_style] ?? 'soft watercolor style';
  const characterContext = buildCharacterContext(character, sub_characters, characters_in_scene);

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
  return `${characterContext}. Scene: ${scene}, ${style}, children's book illustration, no text`;
}

export async function generateCoverImage(story_id, title, art_style, character) {
  try {
    const style = styleMap[art_style] ?? 'soft watercolor style';
    const characterDesc = buildCharacterDesc(character);
    const prompt = `Children's book cover illustration. Title theme: "${title}". Main character: ${characterDesc}. Warm and inviting composition, centered character, ${style}, no text, no words`;

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const b64 = response.data[0].b64_json;
    const filePath = `${story_id}/cover.png`;
    const publicUrl = await uploadImageFromBase64(b64, filePath);

    await supabase
      .from('stories')
      .update({ cover_url: publicUrl })
      .eq('id', story_id);

    return publicUrl;
  } catch (err) {
    if (err.error_code) throw err;
    const classified = classifyApiError(err);
    const error = new Error(classified.error_message);
    error.error_code = classified.error_code;
    throw error;
  }
}

export async function generateAndSaveImage(page_id, story_id, text_ko, art_style, character, sub_characters = [], characters_in_scene = []) {
  try {
    const prompt = await buildImagePrompt(text_ko, art_style, character, sub_characters, characters_in_scene);

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
  } catch (err) {
    if (err.error_code) throw err;
    const classified = classifyApiError(err);
    const error = new Error(classified.error_message);
    error.error_code = classified.error_code;
    throw error;
  }
}
