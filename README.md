# fc2-scratch-project
FC2 Scratch Project with Katy, Lawrenzo, Robyn, &amp; Sarai
After cloning:
* in server folder - npm install
* in client folder - npm install
* in PANTRY-INVENTORY-FCSCRATCH - npm run dev
    *this should start both server and client side dev environments

    Further in the client side, run "npm install react-hook-form" to install the dependency to allow the useForm hook to run on the page client/src/components/createcontaier/CreatePantryItemForm

    This project uses MongoDB and will require the user to import their MongoUrl into their .env file. 
        1. From the root directory in the command line type "touch .env"
        2. Inside of the folder created in step one enter:
        MONGO_URL= (insert your conneciton link from your created cluster here)