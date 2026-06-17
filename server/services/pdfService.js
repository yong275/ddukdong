import PDFDocument from 'pdfkit';
import supabase from '../db/supabase.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_PATH = path.join(__dirname, '../fonts/NotoSansKR.ttf');

const PAGE_W = 816;
const PAGE_H = 612;

// 이미지 영역 (좌측, 여백 포함)
const IMG_MARGIN = 20;
const IMG_AREA_W = PAGE_W / 2;
const IMG_W = IMG_AREA_W - IMG_MARGIN * 2;
const IMG_H = IMG_W;
const IMG_X = IMG_MARGIN;
const IMG_Y = (PAGE_H - IMG_H) / 2; // 세로 중앙

// 우측 텍스트 영역
const TEXT_GAP = 20;
const TEXT_X = IMG_AREA_W + TEXT_GAP;
const TEXT_W = PAGE_W / 2 - TEXT_GAP * 2;
const TEXT_FONT_SIZE = 18;

async function fetchImageBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`이미지 로드 실패: ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function generateStoryPdf(story_id) {
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('title, cover_url')
    .eq('id', story_id)
    .single();
  if (storyError) throw new Error(storyError.message);

  const { data: pages, error: pagesError } = await supabase
    .from('pages')
    .select('page_number, text_ko, image_url')
    .eq('story_id', story_id)
    .order('page_number');
  if (pagesError) throw new Error(pagesError.message);

  const doc = new PDFDocument({ size: [PAGE_W, PAGE_H], margin: 0, autoFirstPage: false });
  doc.registerFont('NotoSansKR', FONT_PATH);

  // 표지 — 이미지 전체 + 제목 오버레이
  if (story.cover_url) {
    doc.addPage();
    const coverBuf = await fetchImageBuffer(story.cover_url);
    doc.image(coverBuf, 0, 0, { width: PAGE_W, height: PAGE_H });

    // 하단 반투명 배경
    doc.rect(0, PAGE_H - 100, PAGE_W, 100).fill('rgba(0,0,0,0.45)');

    // 제목 텍스트
    doc
      .font('NotoSansKR')
      .fontSize(32)
      .fillColor('#ffffff')
      .text(story.title, 0, PAGE_H - 72, {
        width: PAGE_W,
        align: 'center',
      });
  }

  // 스토리 페이지 — 좌측 이미지 / 우측 텍스트
  for (const page of pages) {
    doc.addPage();

    if (page.image_url) {
      const imgBuf = await fetchImageBuffer(page.image_url);
      doc.image(imgBuf, IMG_X, IMG_Y, { width: IMG_W, height: IMG_H });
    }

    if (page.text_ko) {
      const textHeight = doc.heightOfString(page.text_ko, { width: TEXT_W });
      const textY = (PAGE_H - textHeight) / 2; // 세로 중앙 정렬

      doc
        .font('NotoSansKR')
        .fontSize(TEXT_FONT_SIZE)
        .fillColor('#333333')
        .text(page.text_ko, TEXT_X, textY, {
          width: TEXT_W,
          align: 'left',
          lineGap: 6,
        });
    }
  }

  doc.end();
  return doc;
}
