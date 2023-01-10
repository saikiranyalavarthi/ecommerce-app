const express = require("express");
const {MongoClient} = require("mongodb");
const bcrypt = require("bcryptjs");
const bodyparser = require("body-parser");
const parser = bodyparser.json();

const url ="mongodb+srv://saikiran:sai123@cluster0.bhvf21i.mongodb.net/?retryWrites=true&w=majority";
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



router.post("/signup", parser, async (req, res) => {
    let userAlreadyExist = false;
    if(JSON.stringify(req.body) == "") {
        res.send("error!")
    } 

    let hashedpassword = "";

    try {
        hashedpassword = await bcrypt.hash(req.body.password, 10);
    } catch(err) {
        console.log(err);
    }

    user = {
        email: req.body.email,
        name: req.body.name,
        password: hashedpassword,
        loggedIn: false,
        cart: [],
        purchased: []
    }

    try{
        const response  = await collection.findOne({email: req.body.email});
        console.log(response);
        if(response) {
            userAlreadyExist = true;
        } 
    } catch(err) {
        console.log(err);
    }


    if(!userAlreadyExist) {
        try{
            const response = await collection.insertOne(user);
            if(response) {
                console.log("sending response...");
                res.json("registration successful!");
            } else {
                res.json("request rejected");
            }
        } catch(err) {
            console.log(err);
        }
    } else {
        res.json("User Already Exists")
    }


});


module.exports = router;