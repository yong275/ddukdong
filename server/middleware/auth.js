import supabase from '../db/supabase.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '로그인이 필요해요.' });
  }

  const token = header.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: '토큰이 유효하지 않아요.' });
  }

  req.user = user;
  next();
}
