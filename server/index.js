import 'dotenv/config';
import express from 'express';
import storiesRouter from './routes/stories.js';
import translateRouter from './routes/translate.js';

const app = express();
app.use(express.json());

app.use('/v1/stories', storiesRouter);
app.use('/v1/stories', translateRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
