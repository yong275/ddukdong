import supabase from '../db/supabase.js';

export async function loadConfig() {
  const { data, error } = await supabase.from('config').select('key, value');

  if (error) {
    console.error('config 로드 실패:', error.message);
    return;
  }

  for (const { key, value } of data) {
    process.env[key] = value;
  }

  console.log(`config ${data.length}개 로드 완료`);
}
