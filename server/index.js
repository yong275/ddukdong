import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { loadConfig } from './utils/loadConfig.js';
import authRouter from './routes/auth.js';
import storiesRouter from './routes/stories.js';
import translateRouter from './routes/translate.js';
import translateRawRouter from './routes/translateRaw.js';
import shareRouter from './routes/share.js';
import optionsRouter from './routes/options.js';

const app = express();
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://yong275.github.io',
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/v1/auth', authRouter);
app.use('/v1/stories', storiesRouter);
app.use('/v1/stories', translateRouter);
app.use('/v1/translate', translateRawRouter);
app.use('/v1/share', shareRouter);
app.use('/v1/options', optionsRouter);

await loadConfig();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
