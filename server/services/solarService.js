import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { classifyApiError } from '../utils/classifyError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const solar = new OpenAI({
  apiKey: process.env.SOLAR_API_KEY,
  baseURL: 'https://api.upstage.ai/v1',
});

async function loadPrompt(input_mode, age_group) {
  const ageKey = age_group.replace(/-/g, '_');
  const file = input_mode === 'child'
    ? `story_child_${ageKey}.txt`
    : `story_parent_${ageKey}.txt`;
  return fs.readFile(path.join(__dirname, '../prompts', file), 'utf-8');
}

function fillTemplate(template, input) {
  const extras = input.sub_characters?.length
    ? input.sub_characters.map(s => `${s.name}(${s.gender})`).join(', ')
    : '없음';
  return template
    .replace(/{character_name}/g, input.character_name ?? '')
    .replace(/{gender}/g, input.character_gender ?? '')
    .replace(/{extra_characters}/g, extras)
    .replace(/{setting}/g, input.background ?? '')
    .replace(/{situation}/g, input.situation ?? '')
    .replace(/{art_style}/g, input.art_style ?? '')
    .replace(/{lesson}/g, input.moral ?? '');
}

export async function generateStory(input) {
  const { input_mode, age_group } = input;
  const template = await loadPrompt(input_mode, age_group);
  const systemPrompt = fillTemplate(template, input);

  try {
    const response = await solar.chat.completions.create({
      model: 'solar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: '위 조건에 맞는 동화를 JSON 형식으로 생성해줘.' },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    const classified = classifyApiError(err);
    const error = new Error(classified.error_message);
    error.error_code = classified.error_code;
    throw error;
  }
}
