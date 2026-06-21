import supabase from '../db/supabase.js';
import sharp from 'sharp';

const BUCKET = 'stories-images';

export async function uploadImageFromBase64(b64, filePath) {
  const pngBuffer = Buffer.from(b64, 'base64');
  const buffer = await sharp(pngBuffer).webp({ quality: 87 }).toBuffer();
  const webpPath = filePath.replace(/\.png$/, '.webp');

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(webpPath, buffer, { contentType: 'image/webp', upsert: true });

  if (error) throw new Error(`Storage 업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(webpPath);
  return data.publicUrl;
}

export async function uploadImageFromUrl(imageUrl, filePath) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`이미지 다운로드 실패: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType: 'image/png', upsert: true });

  if (error) throw new Error(`Storage 업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
