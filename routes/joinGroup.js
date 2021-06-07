const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
let Group = require("../models/group").Group;
const { User } = require("../models/user");

router.put("/", async(request, response) => {
    try {
        const user = await User.findOne({email: request.session.verifiedEmail})
            .select(['groups', 'username', 'userImg', 'email']);
        if (user === null) {
            return response.status(500).json({ message: `User was not found.` });
        }
        const userGroups = await User.findOne({email: request.session.verifiedEmail}).select('groups');
        if (userGroups === null) {
            return response.status(500).json({ message: `User with email ${user.email} doesn't have field 'groups'` });
        }
        const group = await Group.findById(mongoose.Types.ObjectId(request.body.groupId));
        if (group.users.length >= group.groupSize) {
            return response.status(400).json({ message: "The group is already full." });
        }
        // add the new group to the user's groups.
        await User.findByIdAndUpdate(user._id, { groups: [...userGroups.groups, group._id] }, { strict: false }).exec();
        // add the new user to the group's users array.
        await Group.findByIdAndUpdate(group._id, { users: [...group.users, {
                _id: user._id,
                name: user.username,
                imageUrl: user.userImg
            }] }, { strict: false }).exec();
        response.status(200).json({ message: `User ${user.email} has joined the group ${group.groupTitle}`});
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;
