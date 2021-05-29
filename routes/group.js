const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const groupValidation = require("../validation/groupValidation").groupValidation;
let Group = require("../models/group").Group;
const { User } = require("../models/user");
const notifyByEmail = require('../email_notifications/notifier');

router.get("/:_id", async(request, response) => {
    try {
        const group = await Group.findById(request.params._id);
        response.json(group);
    } catch (error) {
        response.json({ message: error });
    }
});

router.post("/", async(request, response) => {
    let isExists = false;
    const _id = request.body._id;
    try {
        if (_id !== '') {
            isExists = await Group.exists({ _id: mongoose.Types.ObjectId(_id) })
        }
    } catch (error) {
        return response.status(400).json({ message: "An error occurred because of the ObjectId." });
    }
    const adminUser = await User.findById(request.body.admin);
    const group = new Group({
        _id: isExists ? mongoose.Types.ObjectId(_id) : new mongoose.Types.ObjectId,
        groupTitle: request.body.groupTitle,
        groupPurpose: request.body.groupPurpose,
        groupDescription: request.body.groupDescription,
        institution: request.body.institution || false,
        date: request.body.date,
        startHour: request.body.startHour,
        endHour: request.body.endHour,
        groupSize: request.body.groupSize,
        meetingType: request.body.meetingType,
        city: request.body.city,
        place: request.body.place,
        link: request.body.link,
        users: isExists ? request.body.users : [{
            _id: request.body.admin,
            name: adminUser.username,
            imageUrl: adminUser.userImg
        }],
        admin: request.body.admin
    });
    try {
        await groupValidation.validate(group, { abortEarly: false })
        try {
            const filter = { _id: group._id };
            const flags = { new: true, upsert: true };
            const savedGroup = await Group.findOneAndUpdate(filter, group, flags);
            if (!isExists) {
                const userGroups = await User.findById(request.body.admin).select('groups');
                await User.findByIdAndUpdate(request.body.admin, { groups: [...userGroups.groups, group._id] }, { strict: false }).exec();
            } else {
                /// Send Email to all group members informing them about the update in the group details
                const message = `
                <p style="text-align:right; font-size:large;">: עדכון בנוגע לקבוצה <strong style="font-size:x-large;">${group.groupTitle}</strong></p>
                <p style="text-align:right; font-size:large;"> בוצעו שינויים בפרטי הקבוצה, היכנס/י לאתר כדי לצפות בהם </p>
                `;

                const groupUsers = await User.find({ _id: { $in: group.users } });
                const mailOptions = {
                    from: '"Study With Me" <studywithmetau@gmail.com>', // sender address
                    to: groupUsers.map((member) => { if (String(member._id) !== String(group.admin)) { return member.email } }), // list of recievers
                    subject: `עדכון בקבוצה ${group.groupTitle}`, // subject line
                    text: '', // plain text body
                    html: message // html body
                };

                notifyByEmail(mailOptions);
            }
            response.status(201).json(savedGroup);
        } catch (error) {
            return response.status(500).json({ message: "An error occurred while saving the group." });
        }
    } catch (error) {
        return response.status(400).json({ message: error });
    }
});

module.exports = router;