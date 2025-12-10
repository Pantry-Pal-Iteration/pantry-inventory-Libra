import PantryItem from '../models/pantryModel';
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

//create controller
const pantryController = {
    async createPantryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body;
            console.log(data);
            console.log(data.name);
            console.log(data.category);
            console.log(data.quantity);
            console.log(data.unitType);
            console.log(data.threshold);
            console.log(data.expirationDate);
            
        // const {name, category, quantity, unitType, threshold, expirationDate} = req.body;
            //data validation for required items
                if (!data.name || !data.quantity) {
                    return next("Enter the required information (name & quantity)")
                };
            //data validation for data types


            const newPantryItem = await PantryItem.create({
                name: data.name,
                category: data.category,
                quantity: data.quantity,
                unitType: data.unitType,
                threshold: data.threshold,
                expirationDate: data.expirationDate
            });
            res.locals.newPantryItem = newPantryItem;
            return next();
        } catch(err) {
            return next(err);
        }
    },
    //get individual pantry item: getPantryItem
    async getPantryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const name = req.params.name;
            console.log(req.params["name"]);
            res.locals.pantryItem = await PantryItem.find( { name: name });
            return next();
        } catch(err) {
            return next(err);
        }
    },
    //get entire inventory: getPantryInventory
    async getPantryInventory(req: Request, res:Response, next: NextFunction): Promise<void> {
        try{
            const inventory = await PantryItem.find({});
            res.locals.inventory = inventory;
            console.log("Inventory retrieved: ", inventory);
            return next();
        } catch (err) {
            return next(err);
        }
    }
}
 
//update: Patch(stretch)
//delete: delete pantryItem (stretch)



export default pantryController;