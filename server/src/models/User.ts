
/*import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);

*/



//Imports the core Mongoose library,
    //Specifically the Schema class for creating data models and Document type for TypeScript.
import mongoose, { Schema, Document } from 'mongoose';


//BCrypt is neccessary for hashing and encryption
//npm install --save-dev @types/bcrypt
import bcrypt from 'bcryptjs';

  
  

//Defines a TypeScript interface. This tells

// TypeScript what properties a User document will have.

// extends Document means it inherits all Mongoose document properties.

export interface IUser extends Document {

//Username property must be a string.

username: string;

//Password property must be a string.

password: string;

//Createdat property at type Date to track when user was created.

createdAt: Date;

//Declares a custom method that any User instance will have. It takes a password attempt

// and returns a Promise that resolves to true if it matches, false if not.

comparePassword(candidatePassword: string): Promise<boolean>;

}

  

//User Schema

const UserSchema: Schema = new Schema({

username: { type: String, required: true, unique: true },

password: { type: String, required: true },

createdAt: { type: Date, default: Date.now }

});

  

// Hash password before saving

//

//Defines a "pre-save" hook. This function runs automatically just

// before a User document is saved to the datab

  
  

//This is now typed as IUser

UserSchema.pre('save', async function(this: IUser) {

// Now 'this' is typed as IUser

if (!this.isModified('password')) return;

try {

const salt = await bcrypt.genSalt(10);

this.password = await bcrypt.hash(this.password, salt);

} catch (error: any) {

throw error;

}

});

/*

  

UserSchema.pre('save', async function(next) {

  

//const user = this as IUser;

  

//If the password is not modified, move onto the next middleware

if (!this.isModified('password')) return;

try {

//Security step 1: Generates a "salt" - random data used to make the hash unique.

// The number 10 is the "cost factor" (higher = more secure but slower).

const salt = await bcrypt.genSalt(10);

// Overwrites & hashes the plain-text password with the salt. Canno't be reversed.

this.password = await bcrypt.hash(this.password, salt);

//Move onto next middleware

//next();

}

//Closes the try-catch block.

catch (error: any) {

//If any error is caught, move onto Mongoose's middleware error handler

//next(error);

throw error;

}

  

//Closes the pre-save hook.

});

*/

  

//Adds a custom instace method to the schema. Any User document can call .comparePassword

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {

//Run this method will use bcrypt to compare the attempted password with the stored hash.

//Will return true or false

  

//BCrypt:

//1. Extracts the salt from the stored hash

//2. Hashes the candidate password with that exact salt

//3. Compares the resulting hash with the stored hash

  

//Therefore, even two different users with the same password will have different Salts.

  
  

return bcrypt.compare(candidatePassword, this.password);

  

}

  

//Creates and exports the mongoose model.

  

//User is the collection name in MongoDB

//UserSchema is the blueprint

//<IUser> provides the typescript safety

export default mongoose.model<IUser>('User', UserSchema);


