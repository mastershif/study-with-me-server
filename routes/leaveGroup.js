const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
let Group = require("../models/group").Group;
const { User } = require("../models/user");
const notifyByEmail = require('../email_notifications/notifier');

router.put("/", async(request, response) => {
    try {
        const user = await User.findOne({ email: request.session.verifiedEmail });
        if (user === null) {
            return response.status(500).json({ message: 'user not found' })
        }

        const group = await Group.findById(mongoose.Types.ObjectId(request.body.groupId));
        if (group === null) {
            return response.status(500).json({ message: 'group does not exist' })
        }

        await User.findByIdAndUpdate(user._id, { $pull: { groups: group._id } }, { new: true }); // filter & delete
        await Group.findByIdAndUpdate(group._id, { $pull: { users: { _id: user._id } } }, { new: true }); // filter & delete

        /// Send Email to the group admin informing him/her about the member leaving the group
        const message = `
        <p style="text-align:right; font-size:large;">עדכון בנוגע לקבוצה <strong style="font-size:x-large;">${group.groupTitle}</strong></p>
        <p style="text-align:right; font-size:large;"> עזב את הקבוצה <strong style="font-size:large;">${user.username}</strong> המשתמש</p>
        `;

        const groupAdmin = await User.findOne({ _id: group.admin });
        const mailOptions = {
            from: '"Study With Me" <studywithmetau@gmail.com>', // sender address
            to: groupAdmin.email, // list of receivers
            subject: `עדכון בקבוצה ${group.groupTitle}`, // subject line
            text: '', // plain text body
            html: message // html body
        };

        notifyByEmail(mailOptions);
        response.status(200).json("User Left Group!");

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;