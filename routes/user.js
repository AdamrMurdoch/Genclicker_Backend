const express = require("express")
const router = express.Router()
const User = require("./../models/User")

// Get all users
router.get('/', (req, res) => {

    User.find({}).then(users => 
        {
            res.json(users)
        })
        .catch(err => 
        {
            console.error("Could not get users", err);
        })
})

// get a single user
router.get('/:id', (req, res) => {

    User.findById(req.params.id).then(user => 
    {
        if(user == false)
        {
            res.status(404).json({
                message: "This user does not exist"
            })
        }
        else
        {
            res.json(user)
        }
    })
    .catch(err => 
    {
        console.log("Error with getting user", err)
        res.status(500).json({
            message: "problem getting this user",
            error: err
        })
    })
})

// Create new user
router.post('/new', (req, res) => {

    console.log("request body = ", req.body)

    if(req.body == null)
    {
        return res.status(400).json({
            message: "user content is empty"
        })
    }

    User.findOne({email: req.body.email}).then(user => 
    {
        if(user != null)
        {
            return res.status(400).json({
                message: "email already in use"
            })
        }

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })

        newUser.save().then(user => 
        {
            res.status(201).json(user)
        })
        .catch(err => 
        {
            console.log("error creating user", err);

            res.status(500).json({
                message: "problem creating user",
                error: err
            })
        })
    })
    .catch((err) => 
    {
        console.log(err)
        res.status(500).json({
            message: "problem creating account"
        })
    })
})

module.exports = router;