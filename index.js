const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const signup = require("./Routes/signup");
const login = require("./Routes/login");
const cart = require("./Routes/cart");
const {MongoClient} = require("mongodb");
const payment = require("./Routes/payment");
const parser = bodyparser.json();
const port = process.env.PORT || 6000;


const url = "mongodb+srv://saikiran:sai123@cluster0.bhvf21i.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(url);

let collection;

const run = async () => {
    await client.connect();
    const db = client.db("your-cart-db");
    const collection1 = db.collection("products");
    collection = collection1;
}

run();




const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("your cart server")
});

app.get("/products", async (req, res) => {
    const response =  await collection.find().toArray();
    if(response) {
        res.json(response);
    }
})

app.use("/user", signup);

app.use("/user", login);

app.use("/cart", cart);

app.use("/buy", payment);


app.listen(port, () => {
    console.log("your server live!");
})