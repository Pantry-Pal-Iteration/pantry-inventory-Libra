import PantryItem from '../models/pantryModel';

import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

import { body, validationResult } from 'express-validator';

  

//create controller

const pantryController = {

// validatePantryItem: [

// body('quantity').isNumeric().withMessage('Quantity must be a number'),

// body('expirationDate')

// .optional({ checkFalsy: true })

// .isISO8601()

// .withMessage('Expiration Date must be a valid YYYY-MM-DD format')

// .toDate(),

// ],

  

async createPantryItem(

req: Request,

res: Response,

next: NextFunction

): Promise<void> {

const errors = validationResult(req);

if (!errors.isEmpty()) {

return next({

log: 'Validation error in createPantryItem',

status: 400,

message: { errors: errors.array() },

});

}

try {

const data = req.body;

  

//From authentication middleware

const userId = res.locals.userId;

  

// const {name, category, quantity, unitType, threshold, expirationDate} = req.body;

//data validation for required items

if (!data.name || !data.quantity) {

return next('Enter the required information (name & quantity)');

}

//data validation for data types

  

const newPantryItem = await PantryItem.create({

//Attach userId to each pantry item

user: userId,

name: data.name,

category: data.category,

quantity: data.quantity,

unitType: data.unitType,

threshold: data.threshold,

expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,

});

res.locals.newPantryItem = newPantryItem;

return next();

} catch (err) {

return next(err);

}

},

//get individual pantry item: getPantryItem

async getPantryItem(

req: Request,

res: Response,

next: NextFunction

): Promise<void> {

try {

const name = req.params.name;

console.log(req.params['name']);

const userId = res.locals.userId; // Get the user ID from authentication middleware

// Find items with the given name AND belonging to the current user

res.locals.pantryItem = await PantryItem.find({ name: name, user: userId});

return next();

} catch (err) {

return next(err);

}

},

//get entire inventory: getPantryInventory

async getPantryInventory(

req: Request,

res: Response,

next: NextFunction

): Promise<void> {

try {

//Store userId in res.locals.userId

const userId = res.locals.userId;

//Filter inventory by user

const inventory = await PantryItem.find({ user: userId });

res.locals.inventory = inventory;

console.log('Inventory retrieved: ', inventory);

return next();

} catch (err) {

return next(err);

}

},

  

//update: Patch(stretch)

async updatePantryItemById(

req: Request,

res: Response,

next: NextFunction

): Promise<void> {

try {

const id = req.params.id;

const updates = req.body;

const userId = res.locals.userId;

  

const updatedPantryItem = await PantryItem.findOneAndUpdate(

{ _id: id, user: userId },

{ $set: updates },

{ new: true }

);

  

if (!updatedPantryItem) {

res.status(404).json({ message: `Pantry item with id ${id} not found.` });

return;

}

  

res.locals.updatedPantryItem = updatedPantryItem;

return next();

} catch (err) {

return next(err);

}

},

  
  

//delete: path

async deletePantryItemByID(

req: Request,

res: Response,

next: NextFunction

): Promise<void> {

try {

const id = req.params.id;

const userId = res.locals.userId; // Get the user ID

  

console.log(id)

  

// const deletedPantryItem = await PantryItem.findOneAndDelete({name: name});

  

const deletedPantryItem = await PantryItem.findOneAndDelete({_id: id, user: userId })

  

if (!deletedPantryItem) {

res.status(404).json({ message: `Pantry item with the id ${id} not found.` });

return;

}

  

res.locals.deletedPantryItem = deletedPantryItem;

return next();

} catch (err) {

return next(err);

}

},

};

  
  

export default pantryController;