const express = require('express');
const User = require('../models/User');
const router = express.Router();


router.get('/user/:username', async(req,res)=>{
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user){
            return res.status(500).send({msg: "User Not Available With This Username"});
        }
        return res.status(200).send({user});
    } catch (error) {
        return res.status(500).send({msg: "Internal Server Error Faced While Searching User"});
    }
})

module.exports = router