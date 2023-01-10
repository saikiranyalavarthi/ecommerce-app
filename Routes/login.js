const express = require("express");
const {MongoClient} = require("mongodb");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const parser = bodyparser.json();

const url = "mongodb+srv://saikiran:sai123@cluster0.bhvf21i.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url);


const router = express.Router();
let collection;


const run = async () => {
    await client.connect();

    const db = client.db("your-cart-db");
    const collection1 = db.collection("users");
    collection = collection1;
}

run();



router.post("/login", parser, async (req, res) => {
    if(JSON.stringify(req.body) != "") {
        const email = req.body.email;
        const password = req.body.password;
        
        const response  = await collection.findOne({email: email});
        if(response) {
            const response2 = await bcrypt.compare(password, response.password);
            if(response2) {
                response.password = null;
                const response3 = await collection.updateOne(
                    {email: email},
                    {
                       $set: {
                           loggedIn: true
                       } 
                    }
                    );
                response.loggedIn = true;
                res.json(response);
            } else {
                res.json("wrong password");
            }
        } else {
            res.json("user not found");
        }
    } else {
        res.json("invalid request");
    }

});


module.exports = router;