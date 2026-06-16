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
