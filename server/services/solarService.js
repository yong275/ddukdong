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


async function callSolar(systemPrompt, userPrompt, maxTokens = 1024) {
  const response = await solar.chat.completions.create({
    model: 'solar-pro',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    max_tokens: maxTokens,
  });
  const choice = response.choices[0];
  if (choice.finish_reason === 'length') {
    throw new Error('Solar 응답이 잘렸습니다. 프롬프트를 줄이거나 max_tokens를 늘려주세요.');
  }
  return JSON.parse(choice.message.content);
}

export async function generateStoryDebug(input, opts = {}) {
  const { input_mode, age_group } = input;
  const planTemplate = await loadPrompt('plan', input_mode, age_group);
  const planUserMsg = opts.forcedPages
    ? `동화 계획을 JSON으로 세워줘. 반드시 정확히 ${opts.forcedPages}페이지로만 구성해줘.`
    : '동화 계획을 JSON으로 세워줘.';
  const plan = await callSolar(fillTemplate(planTemplate, input), planUserMsg, 3000);

  const writeTemplate = await loadPrompt('write', input_mode, age_group);
  const systemPrompt = fillTemplate(
    writeTemplate.replace(/{story_plan}/g, JSON.stringify(plan, null, 2)),
    input
  ) + '\n\n페이지는 한 번에 하나씩 요청한다. 매 요청마다 지시된 페이지 1개만 JSON으로 출력해줘. 기존 출력 형식은 무시하고 요청의 출력 형식을 따라줘.';

  const writtenPages = [];
  let character = null;

  for (const pagePlan of plan.pages) {
    const isFirst = pagePlan.page_number === 1;
    const prevContext = writtenPages.length > 0
      ? `[지금까지 작성된 내용]\n${writtenPages.map(p => `${p.page_number}페이지: ${p.text}`).join('\n')}\n\n`
      : '';
    const charContext = character
      ? `[확정된 캐릭터 외모 — 변경 금지]\n${JSON.stringify(character)}\n\n`
      : '';

    const nameHint = input.character_name
      ? `- 주인공 이름: 반드시 "${input.character_name}" 그대로만 사용. 다른 이름 절대 금지\n`
      : '';
    const subHint = input.sub_characters?.length
      ? `- 조연 이름: ${input.sub_characters.map(s => `"${s.name}"`).join(', ')} — 반드시 이 이름 그대로만 사용. 새 이름 만들지 마\n`
      : `- 조연 등장인물에게 이름을 만들어 붙이지 마 — "친구", "오빠", "선생님" 등 역할로만 부를 것\n`;
    const userMsg = `${prevContext}${charContext}이번에 작성할 페이지:
- page_number: ${pagePlan.page_number}
- role: ${pagePlan.role}
- scene: ${pagePlan.scene}
- emotion: ${pagePlan.emotion}
- fun_element: ${pagePlan.fun_element}

[이 페이지 작성 규칙]
${nameHint}${subHint}- 반드시 1-2문장으로만. 3문장 이상 절대 금지
- 한 문장에는 한 순간, 한 행동만. "A하자 B했어요" 형태 금지
- 의성어·의태어 최대 1개
- 괄호 표현 (예: (까르르), (방긋)) 절대 금지
- 앞 페이지와 자연스럽게 이어지는 한 장면만 묘사해줘
- 이미 앞 페이지에 나온 소품(예: 나뭇가지, 열매 등)을 이 페이지에 다시 등장시키지 마

${isFirst
  ? '출력 형식: {"character":{"hair":"...","eyes":"...","skin":"...","outfit":"...","features":"..."},"text":"페이지 내용"}'
  : '출력 형식: {"text":"페이지 내용"}'
}`;

    let result = await callSolar(systemPrompt, userMsg);
    // 1페이지에서 text가 비었으면 한 번 재시도
    if (isFirst && !result.text) {
      result = await callSolar(systemPrompt, userMsg);
    }
    if (isFirst && result.character) character = result.character;
    const text = result.text ?? result.content ?? result.story ?? result.page ?? '';
    writtenPages.push({ page_number: pagePlan.page_number, text });
  }

  const ageMap = { '4-6': '5-year-old', '7-9': '8-year-old', '10-12': '11-year-old' };
  const isMale = input.character_gender === 'male' || input.character_gender === '남자';
  const story = {
    title: plan.title,
    character: {
      age_appearance: `${ageMap[input.age_group] || '7-year-old'} Korean ${isMale ? 'boy' : 'girl'}`,
      ...(character ?? {}),
    },
    pages: writtenPages,
  };
  return { plan, story };
}

export async function generateStory(input) {
  const { input_mode, age_group } = input;

  try {
    // Step 1: 동화 계획 생성
    const planTemplate = await loadPrompt('plan', input_mode, age_group);
    const planPrompt = fillTemplate(planTemplate, input);
    const plan = await callSolar(planPrompt, '동화 계획을 JSON으로 세워줘.', 3000);

    // Step 2: 페이지별 순차 생성 (이전 페이지 컨텍스트 누적)
    const writeTemplate = await loadPrompt('write', input_mode, age_group);
    const systemPrompt = fillTemplate(
      writeTemplate.replace(/{story_plan}/g, JSON.stringify(plan, null, 2)),
      input
    ) + '\n\n페이지는 한 번에 하나씩 요청한다. 매 요청마다 지시된 페이지 1개만 JSON으로 출력해줘. 기존 출력 형식은 무시하고 요청의 출력 형식을 따라줘.';

    const writtenPages = [];
    let character = null;

    for (const pagePlan of plan.pages) {
      const isFirst = pagePlan.page_number === 1;

      const prevContext = writtenPages.length > 0
        ? `[지금까지 작성된 내용]\n${writtenPages.map(p => `${p.page_number}페이지: ${p.text}`).join('\n')}\n\n`
        : '';
      const charContext = character
        ? `[확정된 캐릭터 외모 — 변경 금지]\n${JSON.stringify(character)}\n\n`
        : '';

      const nameHint = input.character_name
      ? `- 주인공 이름: 반드시 "${input.character_name}" 그대로만 사용. 다른 이름 절대 금지\n`
      : '';
    const subHint = input.sub_characters?.length
      ? `- 조연 이름: ${input.sub_characters.map(s => `"${s.name}"`).join(', ')} — 반드시 이 이름 그대로만 사용. 새 이름 만들지 마\n`
      : `- 조연 등장인물에게 이름을 만들어 붙이지 마 — "친구", "오빠", "선생님" 등 역할로만 부를 것\n`;
    const userMsg = `${prevContext}${charContext}이번에 작성할 페이지:
- page_number: ${pagePlan.page_number}
- role: ${pagePlan.role}
- scene: ${pagePlan.scene}
- emotion: ${pagePlan.emotion}
- fun_element: ${pagePlan.fun_element}

[이 페이지 작성 규칙]
${nameHint}${subHint}- 반드시 1-2문장으로만. 3문장 이상 절대 금지
- 한 문장에는 한 순간, 한 행동만. "A하자 B했어요" 형태 금지
- 의성어·의태어 최대 1개
- 괄호 표현 (예: (까르르), (방긋)) 절대 금지
- 앞 페이지와 자연스럽게 이어지는 한 장면만 묘사해줘
- 이미 앞 페이지에 나온 소품(예: 나뭇가지, 열매 등)을 이 페이지에 다시 등장시키지 마

${isFirst
  ? '출력 형식: {"character":{"hair":"...","eyes":"...","skin":"...","outfit":"...","features":"..."},"text":"페이지 내용"}'
  : '출력 형식: {"text":"페이지 내용"}'
}`;

      const result = await callSolar(systemPrompt, userMsg);

      if (isFirst && result.character) character = result.character;
      writtenPages.push({ page_number: pagePlan.page_number, text: result.text ?? '' });
    }

    const ageMap = { '4-6': '5-year-old', '7-9': '8-year-old', '10-12': '11-year-old' };
    const isMale = input.character_gender === 'male' || input.character_gender === '남자';

    return {
      title: plan.title,
      character: {
        age_appearance: `${ageMap[input.age_group] || '7-year-old'} Korean ${isMale ? 'boy' : 'girl'}`,
        ...(character ?? {}),
      },
      pages: writtenPages,
    };
  } catch (err) {
    const classified = classifyApiError(err);
    const error = new Error(classified.error_message);
    error.error_code = classified.error_code;
    throw error;
  }
}
