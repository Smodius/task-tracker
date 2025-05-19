import 'dotenv/config';                      // load .env keys
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import AWS from 'aws-sdk';

const app = express();
app.use(cors());                             // enable cross-origin calls
app.use(express.json());                     // parse JSON bodies

// PostgreSQL client
const pool = new Pool({ connectionString: process.env.PG_URL });

// DynamoDB client
const ddb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

// 1) Auth route (dummy for now)
app.post('/auth', (req, res) => {
//   const { email, password } = req.body;
//   if (email === 'test@example.com' && password === 'password123') {
//     return res.json({ success: true });
//   }
//   return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// 2) Users route (Postgres)
app.get('/users', async (_req, res) => {
  const { rows } = await pool.query('SELECT id, email FROM users');
  res.json(rows);
});

// 3) Tasks route (DynamoDB)
app.post('/tasks', async (req, res) => {
  await ddb.put({ TableName: 'Tasks', Item: req.body }).promise();
  res.sendStatus(201);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
