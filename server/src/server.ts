//To-Dos for security:

/* Neccessary before deployment:

| **1. CORS Configuration**                  | ✅ Explicit origin (`localhost:5173` or env variable) with `credentials: true` | ✅                        |
| ------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------ |
| **2. Session & Cookie**                    | ❓ Using `express-session` with MongoStore; cookies use `secure: isProduction` |  ⚠️ **Needs Action**   

                                                                                                                             Partially Done - cookies are 
                                                                                                                            set to `secure: isProduction` |

| **3. Database Connection**                 | ✅ Password encoded (`!` → `%21`); includes database name                      | ✅                        |
| **4. Environment Variables**               | ❓  `.env` file with `SESSION_SECRET`, `NODE_ENV`, etc.                        |  ⚠️ **Needs Action**     |
| **5. **Security Headers** (Helmet.js)**    | ❓ Not yet discussed. Adds crucial HTTP headers.                               | ⚠️ **Needs Action**      |
| **6. **Rate Limiting****                   | ❓ Not yet discussed. Protects against brute-force attacks.                    | ⚠️ **Needs Action**      |
| **7. **Input Validation & Sanitization**** | ❓ Partially done. Critical for all user input (signup/login/create).          | ⚠️ **Needs Review**      |
| **8. **Error Handling & Logging****        | ❓ Basic setup exists. Should not leak stack traces to users.                  | ⚠️ **Needs Review**      |
*/


import dotenv, { config } from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import pantryController from './controllers/pantryController';

//Going to localhost:3000 gives not authenticated

//For Authentication

//Cookie Parser and its types are neccessary for working with cookies
//npm i --save-dev @types/cookie-parser for types
import cookieParser from 'cookie-parser';

  
//Import createUser and verifyUser from userController

import {
    createUser, verifyUser
} from './controllers/userController';

//Import startSession and isLoggedIn from sessionController
import {
    startSession, isLoggedIn
} from './controllers/sessionController';

//Import SSIDCookie from cookieController

import {
    setSSIDCookie
} from './controllers/cookieController'

//////////////////////////////////////////////////////////////////////

  

dotenv.config();
const app: Express = express();

/*app.use(cors({

//These changes are neccessary to allow CORS to read frontend login page

//No, your current CORS setup is NOT safe for production because it hardcodes localhost:5173 and
//  doesn't handle HTTPS or your real domain. Here's the easy fix:


  origin: 'http://localhost:5173', // Your React frontend URL
  credentials: true, // Allow cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); */


//Safer for production:
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL_PROD 
    : 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Must be added as middleware before any routes

app.use(cookieParser());
//const PORT: string | number = process.env.PORT || 3000;

const PORT = process.env.PORT || 3000;

//const uri: string | any = process.env.MONGODB_URI;

(async () => {

    try {

        //Type error when I remove this OR Statement for some reason -- server crashes

        //Non-null assertion
        // The "!" tells TypeScript "I know this isn't undefined"
        //Not playing nice with this line of code for some reason:
        //await mongoose.connect(process.env.MONGODB_URI!);

        //Provide or an empty string - works
    await mongoose.connect(process.env.MONGODB_URI || '', {
        // CRITICAL: These options fix timeout issues
         serverSelectionTimeoutMS: 10000, // 10 seconds
         socketTimeoutMS: 45000, // 45 seconds
         connectTimeoutMS: 10000, // 10 seconds
         maxPoolSize: 10,
         minPoolSize: 2,
         maxIdleTimeMS: 30000,
         retryWrites: true,
         w: 'majority'
    });

console.log('Connected to the database');

} catch (error) {

    console.error(error);

}

})();

const pantryRouter = express.Router();

  

//Authentication routes must must come before pantry routes

app.post('/api/auth/signup',

    createUser,
    startSession,
    setSSIDCookie,
(req: Request, res: Response) => {
    res.status(201).json({ message: 'User created successfully' });
}
);

app.post('/api/auth/login',
    verifyUser,
    startSession,
    setSSIDCookie,
(req: Request, res: Response) => {
    res.status(200).json({ message: 'Login successful' });
}
);

app.post('/api/auth/logout', (req: Request, res: Response) => {

    const isProduction = process.env.NODE_ENV === 'production';

// You would need to clear the session from your store here
    res.clearCookie('ssid', {

        

        //These options are neccessary for cookie to clear properly after logging out
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        //domain: 'localhost' // Add if accessing via localhost
    });
    res.status(200).json({ message: 'Logged out' });

});

  
////////////////////////////////////////////////////////////////////////


//home page

app.use('/', pantryRouter);

//getting the full inventory

pantryRouter.get(
'/',
//Checks to see if logged in
isLoggedIn,
pantryController.getPantryInventory,
(req: Request, res: Response) => {
    res.status(200).json(res.locals.inventory);
}
);

//updating pantry items
pantryRouter.patch(
'/:id',

//Checks to see if logged in
isLoggedIn,
pantryController.updatePantryItemById,
(req: Request, res: Response) => {
    return res.status(200).json(res.locals.updatedPantryItem);
}
);

  
//update expiry data - dont need this route. the patch route also handles setting a pantry item to expired.
/*pantryRouter.patch(
'/expiry/:name',
// pantryController.updateExpiryItem,
(req: Request, res: Response) => {
    res.status(201).json(res.locals.updatedExpiryItem)  
}
) */

//delete pantry item

pantryRouter.delete(
'/:id',
//Checks to see if logged in
isLoggedIn,
pantryController.deletePantryItemByID,
(req: Request, res: Response) => {
    return res.status(200).json(res.locals.deletedPantryItem);
}
);

  

//redirecting to full inventory

pantryRouter.get(

'/inventory',
//Checks to see if logged in
isLoggedIn,
pantryController.getPantryInventory,
(req: Request, res: Response) => {
    res.redirect('/');
}
);

  
  

//getPantryItem */
pantryRouter.get(
'/:name',
pantryController.getPantryItem,
(req: Request, res: Response) => {
    res.status(200).json(res.locals.pantryItem);
}
);

//create pantry item

pantryRouter.post(
'/create',

//Checks to see if logged in
isLoggedIn,
pantryController.createPantryItem,
(req: Request, res: Response) => {
    res.status(201).json(res.locals.newPantryItem);
}
);

  

//health check
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('Server is running');
});

  

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