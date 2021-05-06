const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const groupValidation = require("../validation/groupValidation").groupValidation;
let Group = require("../models/group").Group;

router.get("/:groupId", async(request, response) => {
    try {
        const groupId = await Group.findById(request.params.groupId);
        response.json(groupId);
    } catch (error) {
        response.json({ message: error });
    }
});

router.post("/", async(request, response) => {
    const group = new Group({
        _id: new mongoose.Types.ObjectId,
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
        calendar: request.body.calendar || false,
    });
    try {
        await groupValidation.validate(group, { abortEarly: false })
        try {
            const savedGroup = await group.save();
            response.status(201).json(savedGroup);
        } catch (error) {
            return response.status(500).json({ message: "An error occurred while saving the group." });
        }
    } catch (error) {
        return response.status(400).json({ message: error });
    }
});

module.exports = router;
