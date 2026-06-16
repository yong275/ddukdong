import 'dotenv/config';
import OpenAI from 'openai';
import supabase from '../db/supabase.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function translateStory(story_id, lang = 'en') {
  // 이미 번역된 경우 캐시 반환
  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, text_ko, text_translated, translate_lang')
    .eq('story_id', story_id)
    .order('page_number');

  if (error) throw new Error(error.message);
  if (!pages.length) throw new Error('페이지가 없습니다.');

  const cached = pages.every(p => p.translate_lang === lang && p.text_translated);
  if (cached) return pages.map(p => ({ id: p.id, text_translated: p.text_translated }));

  // 전체 텍스트를 한 번에 번역 (비용 절감)
  const combined = pages.map((p, i) => `[${i}] ${p.text_ko}`).join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a children's book translator. Translate each numbered line from Korean to English. Keep the same numbering format [N]. Keep the tone warm and simple, appropriate for children.`,
      },
      { role: 'user', content: combined },
    ],
  });

  const translated = response.choices[0].message.content;

  // [N] 형식으로 파싱
  const lines = translated.split('\n').filter(l => l.trim());
  const results = [];

  for (let i = 0; i < pages.length; i++) {
    const match = lines.find(l => l.startsWith(`[${i}]`));
    const text_translated = match ? match.replace(`[${i}]`, '').trim() : '';

    await supabase
      .from('pages')
      .update({ text_translated, translate_lang: lang })
      .eq('id', pages[i].id);

    results.push({ id: pages[i].id, text_translated });
  }

  return results;
}
