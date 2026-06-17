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

const PAGE_COUNT = { '4-6': 6, '7-9': 8, '10-12': 10, child: 6 };

async function loadPrompt(input_mode, age_group) {
  const file =
    input_mode === 'child'
      ? 'story_child.txt'
      : `story_parent_${age_group.replace(/-/g, '_')}.txt`;
  const filePath = path.join(__dirname, '../prompts', file);
  return fs.readFile(filePath, 'utf-8');
}

export async function generateStory(input) {
  const { input_mode, age_group, character_name, character_gender, sub_characters, background, situation, moral, art_style } = input;

  const systemPrompt = await loadPrompt(input_mode, age_group);
  const pages = PAGE_COUNT[input_mode === 'child' ? 'child' : age_group] ?? 6;

  const userPrompt = input_mode === 'parent'
    ? `주인공 이름: ${character_name}, 성별: ${character_gender}
조연: ${JSON.stringify(sub_characters ?? [])}
나이대: ${age_group}세
배경: ${background}
상황: ${situation}
교훈: ${moral}
그림 스타일: ${art_style}
페이지 수: ${pages}컷`
    : `주인공 이름: ${character_name}, 성별: ${character_gender}
배경: ${background}
상황: ${situation}
그림 스타일: ${art_style}
페이지 수: ${pages}컷`;

  try {
    const response = await solar.chat.completions.create({
      model: 'solar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (err) {
    const classified = classifyApiError(err);
    const error = new Error(classified.error_message);
    error.error_code = classified.error_code;
    throw error;
  }
}
