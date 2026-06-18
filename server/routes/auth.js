import { Router } from 'express';
import supabase from '../db/supabase.js';

const router = Router();

// POST /v1/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      return res.status(400).json({ error: '이메일, 닉네임, 비밀번호를 모두 입력해주세요.' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nickname },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        return res.status(409).json({ error: '이미 사용 중인 이메일이에요.' });
      }
      throw error;
    }

    res.status(201).json({
      message: '회원가입이 완료됐어요.',
      user: { id: data.user.id, email: data.user.email, nickname },
    });
  } catch (err) {
    next(err);
  }
});

// POST /v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않아요.' });
    }

    const { id, email: userEmail, user_metadata } = data.user;

    res.json({
      token: data.session.access_token,
      user: { id, email: userEmail, nickname: user_metadata?.nickname },
    });
  } catch (err) {
    next(err);
  }
});

// POST /v1/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: '로그아웃됐어요.' });
});

export default router;
