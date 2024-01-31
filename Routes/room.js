const express = require('express');
const Room = require('../models/roomModel');
const router = express.Router();

router.get('/fetch-message/:roomId', async (req,res)=>{
    try {
        const {roomId} = req.params;
        console.log("roomID", roomId);

        if(!roomId) return res.status(400).send("Room Creation failed");
        try {
            const roomMessages = await Room.findOne({roomId});
            console.log("Room Messages", roomMessages);
            return res.send(200).send(roomMessages);
        } catch (error) {
            return res.status(400).send({mesg: "Message Fetching Failed"});
            
        }
    } catch (err) {
        return res.status(500).send({msg: "Internal server Error faced while fetching the data of the room from room ID"});
    }
})

module.exports = router;