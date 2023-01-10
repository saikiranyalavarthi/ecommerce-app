const express = require("express");
const {MongoClient} = require("mongodb");
const bodyparser = require("body-parser");
const ObjectID = require("mongodb").ObjectId;


const router = express.Router();
const parser = bodyparser.json();
const url = "mongodb+srv://saikiran:sai123@cluster0.bhvf21i.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url);
let collection, products;



const run = async () => {
    await client.connect();
    const db = client.db("your-cart-db");
    const collection1 = db.collection("users");
    const collection2 = db.collection("products");
    collection = collection1;
    products = collection2;
}

run();


router.post("/add", parser, async (req, res) => {
    if(JSON.stringify(req.body) != "") {
        const newItem = {
            productId: req.body.productId,
            quantity: req.body.quantity
        }

        const response = await collection.updateOne(
            {_id: ObjectID(req.body.userId)},
            {$push: {
                cart: newItem
            }}
        );

        if(response.modifiedCount > 0) {
            console.log("new item add to cart");
            res.send("item added to cart");
        } else {
            res.send("request rejected");
        }


    } else {
        res.send("request rejected");
    }
});

router.post("/all", parser, async (req, res) => {
    if(JSON.stringify(req.body) != "") {
        const arr = new Array();
        const response1 = await collection.findOne({
            _id: ObjectID(req.body.userId)
        })

        if(response1) {
            let arr = new Array();
            for(let i=0; i<response1.cart.length; i++) {
                const response3 = await products.findOne({_id : ObjectID(response1.cart[i].productId)})
                if(response3) {
                    response3.quantity = response1.cart[i].quantity;
                    arr.push(response3);
                }
            }
            res.json(arr);
        } else {
            res.send("user not found");
        }
    } else {
        res.send("user not found");
    }
})


module.exports = router;