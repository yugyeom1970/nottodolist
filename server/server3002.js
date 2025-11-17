import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());

const diaryData = JSON.parse(fs.readFileSync(new URL('./diary.json', import.meta.url)));

app.get('/diaries', (req, res) => {
  res.json(diaryData.diaries);
});

app.listen(3002, () => console.log('Server running on 3002'));

