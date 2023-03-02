require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email } = req.body;

        // Validate user input
        if (!(email && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
        });

        // Create token
        const token = jwt.sign(
            {
                first_name,
                last_name,
                user_id: user._id,
                email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "5h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

app.post("/generate", async (req, res) => {
    try {
        const { email } = req.body;

        // check if user already exist
        // Validate if user exist in our database
        const user = await User.findOne({email});

        if (!user) {
            return res.status(409).send("User not found! please register");
        }

        const token = jwt.sign(
            {
                first_name: user.first_name,
                last_name: user.last_name,
                user_id: user._id,
                email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "5h",
            }
        );

        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
})

// Login
app.post("/validate", (req, res) => {
    jwt.verify(req.body.token, process.env.TOKEN_KEY, (err, decode) => {
        if (err) {
            res.status(401).send({
                "status": false,
                "msg": "invalid signature",
                "data": null
            })
        } else {
            res.status(200).json({
                "status": true,
                "msg": "User token validated",
                "data": decode
            })
        }
    })

});

module.exports = app;
