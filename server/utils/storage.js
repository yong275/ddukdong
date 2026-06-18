import supabase from '../db/supabase.js';

const BUCKET = 'stories-images';

export async function uploadImageFromBase64(b64, filePath) {
  const buffer = Buffer.from(b64, 'base64');

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, buffer, { contentType: 'image/png', upsert: true });

  if (error) throw new Error(`Storage 업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
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
