import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());

const goalData = JSON.parse(fs.readFileSync(new URL('./goal.json', import.meta.url)));

app.get('/bigGoals', (req, res) => {
  res.json(goalData.bigGoals);
});
app.get('/steps', (req, res) => {
  res.json(goalData.steps);
});

app.listen(3003, () => console.log('Server running on 3003'));

