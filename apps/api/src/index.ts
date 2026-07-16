import express, { Request, Response } from 'express';
import cors from 'cors';
import meetingsRouter from './routes/meetings';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/meetings', meetingsRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Transcripto API is running on http://localhost:${PORT}`);
});
