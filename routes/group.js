const express = require("express");
const router = express.Router();
let Group = require("../models/group").Group;

router.get("/:groupId", async(request, response) => {
    try {
        const group = await Group.findById(request.params.groupId);
        response.json(group);
    } catch (error) {
        response.json({ message: error });
    }
});

router.put("/", async(request, response) => {
    const group = new Group({
        topic: request.body.topic,
        purpose: request.body.purpose,
        description: request.body.description,
        sameInstituteOnly: request.body.sameInstituteOnly || false,
        date: request.body.date,
        startHour: request.body.startHour,
        endHour: request.body.endHour,
        maxSize: request.body.maxSize,
        frontalOrVirtual: request.body.frontalOrVirtual,
        city: request.body.city,
        location: request.body.location,
        videoLink: request.body.videoLink,
    });
    try {
        const savedGroup = await group.save();
        response.json(savedGroup);
    } catch (error) {
        response.json({ message: error });
    }
});

module.exports = router;
