import dotenv, { config } from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import pantryController from './controllers/pantryController';
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT: string | number = process.env.PORT || 3000;

const uri: string | any = process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to the database');
  } catch (error) {
    console.error(error);
  }
})();
const pantryRouter = express.Router();

//home page
app.use('/', pantryRouter);

//getPantryItem */
pantryRouter.get(
  '/:name',
  pantryController.getPantryItem,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.pantryItem);
  }
);

//getting the full inventory
pantryRouter.get(
  '/',
  pantryController.getPantryInventory,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.inventory);
  }
);
pantryRouter.get(
  '/',
  pantryController.getPantryInventory,
  (req: Request, res: Response) => {
    res.status(200).json('testing get request' + res.locals.inventory);
  }
);

//redirecting to full inventory
pantryRouter.get(
  '/inventory',
  pantryController.getPantryInventory,
  (req: Request, res: Response) => {
    res.redirect('/');
  }
);

//create pantry item
pantryRouter.post(
  '/create',
  pantryController.createPantryItem,
  (req: Request, res: Response) => {
    res.status(201).json(res.locals.newPantryItem);
  }
);

//health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('Server is running');
});

//updating pantry items
pantryRouter.patch(
  '/:name',
  pantryController.updatePantryItem,
  (req: Request, res: Response) => {
    res.status(201).json(res.locals.updatedPantryItem);
  }
);

//delete pantry item
pantryRouter.delete(
  '/:name',
  pantryController.deletePantryItem,
  (req, res, next) => {
    res
      .status(200)
      .send(`${res.locals.deletedPantryItem} deleted successfully`);
  }
);

app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
