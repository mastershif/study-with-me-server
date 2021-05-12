const express = require("express");
const router = express.Router();
let Group = require("../models/group").Group;
const { User } = require("../models/user");

router.post("/", async(request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email }).select('groups');
        if (user === null) {
            return response.status(500).json({ message: `User with email ${request.body.email} was not found` });
        }
        const userGroups = await User.findOne({ email: request.body.email }).select('groups');
        if (userGroups === null) {
            return response.status(500).json({ message: `User with email ${request.body.email} doesn't have field 'groups'` });
        }
        const groupId = await Group.findById(request.body.groupId);
        // add the new group to the user's groups
        User.findByIdAndUpdate(user, { groups: [...userGroups, groupId] });
        response.status(200).json({ message: `User ${user} asked to join group ${groupId}`});
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;
