import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());

const dbData = JSON.parse(fs.readFileSync(new URL('./db.json', import.meta.url)));

app.get('/todos', (req, res) => {
  // const todos = Array.isArray(dbData.todos) ? dbData.todos : [];
  res.json(dbData);
});


app.listen(3000, () => console.log('Server running on 3000'));


