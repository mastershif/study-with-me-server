const notifyByEmail = require('../email_notifications/notifier');
const express = require("express");
// const nodemailer = require("nodemailer");
const router = express.Router();
let User = require("../models/user").User;
const Group = require("../models/group").Group;

router.delete("/:groupID", async(request, response) => {
    try {
        const groupID = request.params.groupID;
        const group = await Group.findOne({ _id: groupID })
        const groupUsers = await User.find({ _id: { $in: group.users } });
        for (i = 0; i < groupUsers.length; i++) {
            await User.updateOne({ _id: groupUsers[i]._id }, { $pull: { 'groups': groupID } });
        }
        await Group.deleteOne({ _id: groupID })
        response.status(200).json({ message: `Group ${groupID} was deleted successfully` });

        /// Send Email to all group members informing them about the deletion of the group by the admin
        const message = `
        <p style="text-align:right; font-size:large;">היי</p>
        <p style="text-align:right; font-size:large;">רק רצינו ליידע אותך שהקבוצה <strong style="font-size:x-large;"> ${group.groupTitle} </strong> נמחקה ע"י מנהל הקבוצה</p>
        <p style="text-align:right; font-size:large;">אם ברצונך ליצור קבוצה חדשה במקומה אנא התחבר/י לאתר</p>
        `;

        let mailOptions = {
            from: '"Study With Me" <studywithmetau@gmail.com>', // sender address
            to: groupUsers.map((member) => { if (String(member._id) !== String(group.admin)) { return member.email } }), // list of recievers
            subject: 'קבוצה שאת/ה חבר/ה בה נמחקה', // subject line
            text: '', // plain text body
            html: message // html body
        };

        notifyByEmail(mailOptions);

    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;