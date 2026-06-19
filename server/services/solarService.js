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

async function loadPrompt(type, input_mode, age_group) {
  const ageKey = age_group.replace(/-/g, '_');
  const file = `${type}_${input_mode}_${ageKey}.txt`;
  return fs.readFile(path.join(__dirname, '../prompts', file), 'utf-8');
}

function fillTemplate(template, input) {
  const ageMap = { '4-6': '5', '7-9': '8', '10-12': '11' };
  const extras = input.sub_characters?.length
    ? input.sub_characters.map(s => `${s.name}(${s.gender})`).join(', ')
    : '없음';
  return template
    .replace(/{character_name}/g, input.character_name ?? '')
    .replace(/{age}/g, ageMap[input.age_group] ?? input.age_group ?? '')
    .replace(/{gender}/g, input.character_gender ?? '')
    .replace(/{extra_characters}/g, extras)
    .replace(/{setting}/g, input.background ?? '')
    .replace(/{situation}/g, input.situation ?? '')
    .replace(/{lesson}/g, input.moral ?? '')
    .replace(/{art_style}/g, input.art_style ?? '');
}

function makeCharacterFromInput(input) {
  const ageMap = { '4-6': '5-year-old', '7-9': '8-year-old', '10-12': '11-year-old' };
  const isMale = input.character_gender === 'male' || input.character_gender === '남자';
  const genderStr = isMale ? 'boy' : 'girl';
  return {
    age_appearance: `${ageMap[input.age_group] || '7-year-old'} Korean ${genderStr}`,
    hair: 'black hair',
    eyes: 'dark brown eyes',
    skin: 'warm beige',
    outfit: 'casual children\'s clothing',
    features: 'friendly smile, round face',
  };
}

async function callSolar(systemPrompt, userPrompt) {
  const response = await solar.chat.completions.create({
    model: 'solar-pro',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0].message.content);
}

export async function generateStory(input) {
  const { input_mode, age_group } = input;

  try {
    // Step 1: 동화 계획 생성
    const planTemplate = await loadPrompt('plan', input_mode, age_group);
    const planPrompt = fillTemplate(planTemplate, input);
    const plan = await callSolar(planPrompt, '동화 계획을 JSON으로 세워줘.');

    // Step 2: 계획 기반 본문 작성
    const writeTemplate = await loadPrompt('write', input_mode, age_group);
    const writePrompt = writeTemplate.replace(/{story_plan}/g, JSON.stringify(plan, null, 2));
    const story = await callSolar(writePrompt, '동화 본문을 JSON으로 작성해줘.');

    // 캐릭터 외형 설명 (입력값 기반 생성)
    story.character = makeCharacterFromInput(input);

    return story;
  } catch (err) {
    const classified = classifyApiError(err);
    const error = new Error(classified.error_message);
    error.error_code = classified.error_code;
    throw error;
  }
}
