//UserController


// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';

import User from '../models/User';

  

//Create User

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

try {

    console.log('=== CREATE USER DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Username from request:', req.body.username);

    //Takes in a username and password from the request body

    const { username, password } = req.body;

     if (!username || !password) {
      console.log('Missing username or password');
      return next({
        log: 'Missing username or password',
        status: 400,
        message: { err: 'Username and password required' }
      });
    }

       
    console.log('Checking if user exists...');

    //Check for existing user
    const existingUser = await User.findOne({ username });
    console.log('Existing user found?', existingUser ? 'Yes' : 'No');
    
    
    if (existingUser) {
      console.log('User already exists with username:', existingUser.username);
      return next({
        log: 'Username already taken',
        status: 400,
        message: { err: 'Could not create user. Username may be taken.' }
      });
    }

    //Else,
    //Creates a new user in databases (user schema)

    console.log('Creating new user...');

    // Create user
    const user = await User.create({ username, password });
    console.log('User created successfully:', user._id);
    

    //Stores the user id in res.locals

    res.locals.userId = user._id; // Pass user ID to next middleware

    console.log('=== CREATE USER SUCCESS ===');

    return next();

} catch (error: any) {
    console.error('❌ CREATE USER ERROR DETAILS:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      console.log('Duplicate key error - username already exists');
      return next({
        log: 'Username already exists in DB',
        status: 400,
        message: { err: 'Could not create user. Username may be taken.' }
      });
    }

     // Handle validation errors
    if (error.name === 'ValidationError') {
      console.log('Validation error:', error.errors);
      return next({
        log: 'User validation failed',
        status: 400,
        message: { err: error.message }
      });
    }

    return next({
        log: 'Error in userController.createUser',
        status: 500,
        message: { err: 'Server error.' }
        });
    }
};

  

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        //Take in a username nad password from request body
        const { username, password } = req.body;

//Tries to find one user that has that username in database

const user = await User.findOne({ username });

//If there is no user, return error

if (!user) {

return next({ log: 'User not found', status: 401, message: { err: 'Invalid credentials' } });

}

//If the comparePassword method fails, the password is incorrect

const isValid = await user.comparePassword(password);

if (!isValid) {

return next({ log: 'Password incorrect', status: 401, message: { err: 'Invalid credentials' } });

}

//Store the user id in res.locals

res.locals.userId = user._id;

//Move onto next middleware

return next();

} catch (error) {

return next({ log: 'Error in userController.verifyUser', status: 500, message: { err: 'Server error' } });

}

};
