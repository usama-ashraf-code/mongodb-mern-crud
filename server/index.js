// requires
const dns = require("dns");
dns.setServers(['8.8.8.8','8.8.8.8'])
const express = require('express')
const dotenv = require("dotenv");
const path = require('path');
dotenv.config({path:path.join(__dirname , ".env")})
const fs = require('fs');
const formidable = require("formidable");
const {MongoClient, ObjectId} = require("mongodb"); 
const cors = require("cors");
const bcrypt = require("bcrypt");


// express server/PORT
const app = express()
const PORT = process.env.PORT || 3001;

// Mongodb
const url = process.env.MONGODB_URL
const client = new MongoClient(url);
const DATABASE = "mongo-crud"
const COLLECTION = "users"

async function ConnectToDatabase(){
    try{
        await client.connect();
        console.log("connected to database");
    }
    catch(err){
        console.log(err);
    }
}
ConnectToDatabase();
    
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , "public")));
app.set("view engine" , 'ejs');
app.use("/uploads" , express.static(path.join(__dirname , "uploads")))
app.use(cors())


app.post("/upload" , (req,res)=>{
    const form = new formidable.IncomingForm();
    form.parse(req, async (err,fields,files)=>{
        if(err){
            console.log(err);
            return res.json({staus: false , msg:"Form parse error"})
        }
        const name = fields.name[0];
        const email = fields.email[0]; 
        const plainpassword = fields.password[0];
        const hashedpassword = await bcrypt.hash(plainpassword , 10);
        const originalFilename = files.image[0].originalFilename;
        const filepath = files.image[0].filepath;
        const extension = originalFilename.split(".").pop();

        const collection = client.db(DATABASE).collection(COLLECTION);
        
        const userFound = await collection.findOne({ email })

        if(userFound){
            res.send("User with this email already exist!")
            return res.json({status: false , msg: "Email already exists"})
        }
        const result = await collection.insertOne({
            name:name,
            email:email,
            password:hashedpassword,
            image:originalFilename
        })

        const insertedId = result.insertedId.toString();
        const newFilename = `${insertedId}.${extension}`
        
        
        const uploadDir = (path.join(__dirname , "uploads"))
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }

        const newFilepath = path.join(uploadDir , newFilename);
        fs.copyFile(filepath , newFilepath , (copyerr)=>{
            if(copyerr){
                res.send("Failed to copy file!");
                return res.json({ status: false, msg: "Failed to save image" });
            }

            fs.unlink(filepath , (unlinkErr)=>{
                 if(unlinkErr){
                     console.log(unlinkErr);
                 }
            })
        })
          
        return res.json({
            status:true,
            msg:"User inserted successfully",
            userID: insertedId,
            image:newFilename
        });
      

        
    })
    

});

app.get("/show" , async (req,res)=>{
    try{
    const collection = client.db(DATABASE).collection(COLLECTION);
    const users = await collection.find({}).toArray();

      const finalusers = users.map((u) => {
        return {
           _id :u._id,
           name:u.name,
           email:u.email,
           image: `${u._id}.${u.image.split(".").pop()}`,
        };
      });
      
      res.json(finalusers);

    }
    catch (err){
        console.log(err);
        res.status(500).json({ error: "Server Error" })
    }
});


app.post("/delete" , async(req,res)=>{
    try {
    const id = req.body.id
    const collection = client.db(DATABASE).collection(COLLECTION);
    const userFound = await collection.findOne({_id: new ObjectId(id)})

    if(!userFound){
        return res.json({ status: false, msg: "User not found" });
    }
    
    const userImageExtension = userFound.image.split('.').pop();
    const userImage = `${id}.${userImageExtension}`
    
    const imagePath = path.join(__dirname , "uploads" , userImage)
    fs.unlink(imagePath , (unlinkErr)=>{
        if(unlinkErr){
            console.log(unlinkErr);
        }
    })


    const result = collection.deleteOne({_id: new ObjectId(id)});
    return res.json({status:true , msg: "User deleted sccessfully"})
        
   
   } catch(err) {
       console.log(err);
       res.json({ status: false, msg: "Delete failed" });
   }
})

app.post("/edit" , async (req,res)=>{
   try {
    const id = req.body.id;
    const collection = client.db(DATABASE).collection(COLLECTION);
    const userFound = await collection.findOne({_id : new ObjectId(id)});

    if (!userFound) {
            return res.json({ status: false, msg: "User not found" });
        }
    
        const extension = userFound.image.split(".").pop();
        const finalimage = `${id}.${extension}`;

         return res.json({
            status: true,
            user: {
                _id: userFound._id,
                name: userFound.name,
                email: userFound.email,
                password: userFound.password,
                image: finalimage
            }
        });
   } catch (err) {
        console.log(err);
        res.json({ status: false, msg: "Edit route error" });
    }

})

app.post("/update" ,  (req,res)=>{
    const form = new formidable.IncomingForm();
    form.parse(req, async (err,fields,files)=>{
        if(err){
            console.log(err);
            return res.json({ status: false, msg: "Form parse error" });    
        }
        const name = fields.name[0];
        const email = fields.email[0];
        const password = fields.password[0];
        const id = fields.id[0];

        const collection = client.db(DATABASE).collection(COLLECTION);
        const userFound = await collection.findOne({_id : new ObjectId(id)});

        if (!userFound) {
            return res.json({ status: false, msg: "User not found" });
        }

         const updateData = {
            name,
            email,
            password
        };

        if(files.image && files.image[0].originalFilename !== ""){

        const oldUserImageExtension = userFound.image.split('.').pop();
        const OldUserImageName = `${id}.${oldUserImageExtension}`
       
        const oldUserImagePath = path.join(__dirname , "uploads" , OldUserImageName)
        
        const newUserImageExtension = originalFilename.split('.').pop();
        const newUserImageName = `${id}.${newUserImageExtension}`
        
        const newUserImagePath = path.join(__dirname , "uploads" , newUserImageName);
        fs.copyFile(filepath , newUserImagePath , async (copyerr)=>{
         if(copyerr){
            console.log(copyerr);
         }
         fs.unlink( oldUserImagePath , (unlinkErr)=>{
           if(unlinkErr){
              console.log(unlinkErr);
          }
           })

        })


        updateData.image = originalFilename;
    } 
        
          await collection.updateOne({_id : new ObjectId(id) } , 
                                         {$set: updateData} )
        
           return res.json({
            status: true,
            msg: "User updated successfully"
        });
    });
});




app.listen(PORT , ()=>{
      console.log(`app is listening on port ${PORT}`);
})
