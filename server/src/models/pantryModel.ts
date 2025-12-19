import mongoose, { Schema } from 'mongoose';

  
  

const pantryItemSchema = new mongoose.Schema({

name: {

type: String,

required: [true, 'Item name is required'],

},

category: {

type: String,

required: false,

},

quantity: {

type: Number,

required: [true, 'Quantity is required'],

min: 1,//do we want a minimum quantity of 1?

},

unitType: {

type: String,

required: false,

},

threshold: {

type: Number,

required: false,

},

expirationDate: {

type: Date,

required: false,

},

//Imports the userSchema into PantryItem

user: {

type: Schema.Types.ObjectId,

ref: 'User',

required: true

}

});

  

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);

  

export default PantryItem;