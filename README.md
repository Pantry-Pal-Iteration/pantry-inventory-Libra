# fc2-scratch-project
FC2 Scratch Project with Katy, Lawrenzo, Robyn, &amp; Sarai
After cloning:
* in server folder - npm install
* in client folder - npm install
* in PANTRY-INVENTORY-FCSCRATCH - npm run dev
    *this should start both server and client side dev environments

    
    Further in the client side, run "npm install react-hook-form" to install the dependency to allow the useForm hook to run on the page client/src/components/createcontaier/CreatePantryItemForm

    This project uses MongoDB and will require the user to import their MongoUrl into their .env file. 
        1. From the server directory in the command line type "touch .env" 
        2. Inside of the file created in step one enter:
        MONGO_URL= (insert your conneciton link from your created cluster here)
        3. Also add PORT=3000 in the .env file

    ## Brief Overview
    Problem:
    * We lose track of grocery items we have in our homes, leading to food waste if it expires, or overbuying when duplicates are puchased
    * We have certain items that we NEVER want to run out of (toilet paper!!), but don't always notice when we're running low

    Solution:
    * Pantry inventory tracker stores your personal pantry data and keeps track of all the relevant info
        * Quantity
        * Expiration date
        * When you're running low on essentials
        * Item category

    MVP:
    * Page auto populates with all items currently in pantry inventory
    * User can add new items and item details to their inventory

    Both of the above work.

    What doesn't work yet:
    * Update and Delete buttons don't do anything
    * Expiration Date feature (existing code for this is in repo but commented out due to all kinds of issues sending and receiving the date in the correct format and then converting it to something React understands)

    
    //mvp working
