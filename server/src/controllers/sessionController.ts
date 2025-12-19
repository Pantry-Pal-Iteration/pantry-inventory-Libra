import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose'; // Add this import



////////////////////////////////////////////////////////////////////////////////////////

// You would typically use a session store like Redis or MongoDB here.

// For now, we'll use a simple in-memory object for demonstration.

//You're not using express-session middleware

//You're generating simple session IDs with Date.now() + Math.random()

//Sessions are stored in a plain JavaScript object

//Simple memory cookie session (no express-session:)

//Leave cookie sessions for now or will break, but should use express sessions
const sessions: { [key: string]: string } = {}; // sessionId -> userId

export const startSession = (req: Request, res: Response, next: NextFunction) => {

  

// Create a simple session ID (use a more robust method like `uuid` in production)

    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    const userId = res.locals.userId;

      // Store the ObjectId string (MongoDB ID)
    sessions[sessionId] = userId; // Store session
    res.locals.ssid = sessionId; // Pass to cookie controller

    console.log(`Session started for user ${userId}`);

    return next();

};

  

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {

    const sessionId = req.cookies?.ssid;

    if (!sessionId || !sessions[sessionId]) {

    return res.status(401).json({ error: 'Not authenticated' });

}

    // CRITICAL: Convert string to ObjectId for Mongoose
    const userIdString = sessions[sessionId];

     // Check if it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userIdString)) {
        console.log('❌ Invalid ObjectId format:', userIdString);
        return res.status(401).json({ error: 'Invalid user session' });
    }

    // Convert to ObjectId and store in res.locals
    res.locals.userId = new mongoose.Types.ObjectId(userIdString);
    console.log('✅ User authenticated, ObjectId:', res.locals.userId)

    // Attach the user ID from the session to the request for use in other middleware/controllers
    res.locals.userId = sessions[sessionId];

    return next();

}; 

///////////////////////////////////////////////////////////////////////////////////////////////////

//Neccessary for production: expression session:

//Instead of in memory, use express session:
//npm install connect-mongo express-session
//npm i --save-dev @types/express-session
import session from 'express-session';


/*

//Interface for typescript session
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}


// NEW: Simple middleware to pass user info
export const startSession = (req: Request, res: Response, next: NextFunction) => {
  // express-session automatically handles sessions
  // Just pass user info from res.locals to req.session
  if (res.locals.userId) {
    req.session.userId = res.locals.userId;
    console.log(`Session started for user ${res.locals.userId}`);
  }
  next();
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  // Check express-session instead of your custom sessions
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Attach to res.locals for controllers
  res.locals.userId = req.session.userId;
  console.log('User authenticated via express-session:', req.session.userId);
  
  next();
};*/