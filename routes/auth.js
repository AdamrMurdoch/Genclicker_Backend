require("dotenv").config()
const express = require("express")
const router = express.Router()
const User = require("./../models/User")
const Utils = require('../utils')
const jwt = require('jsonwebtoken')

// Signin
router.post('/signin', (req, res) => 
{
    if(req.body.email == null || req.body.password == null)
    {
        return res.status(400).json(
        {
            message: "Please provide an email and password"
        })
    }

    User.findOne({email: req.body.email}).then(user => 
    {
        if(user == null)
        {
            return res.status(400).json({
                message: "This account does not exist"
            })
        }

        if(Utils.verifyPassword(req.body.password, user.password))
        {
            const userObject = {
                id: user._id,
                username: user.username,
                email: user.email
            }

            const accessToken = Utils.generateAccessToken(userObject)

            res.json({
                accessToken: accessToken,
                user: userObject
            })
        }
        else
        {
            return res.status(400).json(
            {
                message: "Password or email is incorrect"
            })
        }
    })
    .catch(err => 
    {
        console.log(err)
        res.status(500).json({
            message: "problem signin in",
            error: err
        })
    })
})

// Validate
router.get('/validate', (req, res) => 
{
    const token = req.headers['authorization'].split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenData) => 
    {
        if(err)
        {
            return res.sendStatus(403)
        }
        else
        {
            res.json(tokenData)
        }
    })
})

module.exports = router