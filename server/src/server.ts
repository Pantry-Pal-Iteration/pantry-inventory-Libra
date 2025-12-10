import dotenv, { config } from 'dotenv';
// import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// require('dotenv').config();

// import process from 'process';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uri = `mongodb+srv://lawrenzolue_db_user:JKLzqiO8GtfgnIFm@inventory-cluster.rja5yup.mongodb.net/?appName=Inventory-Cluster`;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to the database');
  } catch (error) {
    console.error(error);
  }
})();

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('Server is running');
});

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
