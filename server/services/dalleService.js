import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../db/supabase.js';
import { uploadImageFromBase64 } from '../utils/storage.js';
import { classifyApiError } from '../utils/classifyError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// styleMap 제거 — art_style_en을 input에서 직접 받음
const DEFAULT_STYLE = "children's book illustration, warm colors, gentle lines";

const AGE_MIDPOINT = { '4-6': '5', '7-9': '8', '10-12': '11' };

function buildCharacterDesc(c) {
  if (!c) return 'A Korean child, friendly appearance';
  const parts = [
    c.age_appearance,
    c.hair,
    c.eyes,
    c.skin ? `${c.skin} skin` : null,
    c.outfit ? `wearing ${c.outfit}` : null,
  ].filter(Boolean);
  if (c.features) parts.push(c.features);
  return parts.length ? parts.join(', ') : 'A Korean child, friendly appearance';
}

async function loadImagePrompt(input_mode, age_group) {
  const ageKey = age_group.replace(/-/g, '_');
  const file = `image_${input_mode}_${ageKey}.txt`;
  return fs.readFile(path.join(__dirname, '../prompts', file), 'utf-8');
}

function fillImageTemplate(template, input, storyPages) {
  return template
    .replace(/{character_name}/g, input.character_name ?? '')
    .replace(/{age}/g, AGE_MIDPOINT[input.age_group] ?? input.age_group ?? '')
    .replace(/{gender}/g, input.character_gender ?? '')
    .replace(/{art_style}/g, input.art_style_en ?? input.art_style ?? DEFAULT_STYLE)
    .replace(/{setting}/g, input.setting_en ?? input.background ?? '')
    .replace(/{story_pages}/g, JSON.stringify(storyPages));
}

export async function generateAllImagePrompts(story, input) {
  const template = await loadImagePrompt(input.input_mode, input.age_group);
  const storyPages = story.pages.map((p, i) => ({ page_number: i + 1, text: p.text }));
  const systemPrompt = fillImageTemplate(template, input, storyPages);

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: '위 동화 내용을 바탕으로 각 페이지의 이미지 프롬프트를 JSON으로 생성해줘.' },
      ],
      response_format: { type: 'json_object' },
    });
    const result = JSON.parse(res.choices[0].message.content);
    return result.pages; // [{ page_number, image_prompt }]
  } catch (err) {
    const classified = classifyApiError(err);
    const error = new Error(classified.error_message);
    error.error_code = classified.error_code;
    throw error;
  }
}

export async function generateCoverImage(story_id, title, art_style_en, character) {
  try {
    const style = art_style_en || DEFAULT_STYLE;
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

export async function generateAndSaveImage(page_id, story_id, imagePrompt) {
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: imagePrompt,
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
