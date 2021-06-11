const express = require("express");
const router = express.Router();
const Group = require("../models/group").Group;
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Get Required Configuration for Google Calendar Integration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_AUTH_SECRET;
const REDIRECT_URL = 'http://localhost:5000/calendarSync/oauthCallback';
const ISRAEL_TIMEZONE = 'Asia/Jerusalem';

// Configure OAuth2 Client
function getOAuthClient() {
    return new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);
}

// Define Consent Screen Url
function getAuthUrl(groupID) {
    const oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google Calendar scopes
    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.email'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true,
        redirect_uri: REDIRECT_URL,
        client_id: GOOGLE_CLIENT_ID,
        state: groupID
    });

    return url;
}

function ISODateString(date, time) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return date.getUTCFullYear() + '-' +
        pad(date.getUTCMonth() + 1) + '-' +
        pad(date.getUTCDate()) + 'T' +
        pad(time.getUTCHours()) + ':' +
        pad(time.getUTCMinutes()) + ':' +
        pad(time.getUTCSeconds()) + 'Z'
}

/// Callback for Google Calendar Integration /////////////////////////////////////////
router.use("/oauthCallback", function(req, res) {
    const oauth2Client = getOAuthClient();
    const groupID = req.query.state;
    const code = req.query.code;
    oauth2Client.getToken(code, async function(err, tokens) {
        if (!err) {
            let location;
            oauth2Client.setCredentials(tokens);
            const group = await Group.findById(groupID);
            const calendar = google.calendar({
                version: 'v3',
                auth: oauth2Client
            })
            if (group.meetingType === "וירטואלית") {
                location = group.link;
            } else {
                location = group.place + ", " + group.city;
            }
            groupEvent = {
                summary: group.groupTitle,
                location: location,
                description: group.groupDescription,
                start: {
                    dateTime: ISODateString(group.date, group.startHour),
                    timeZone: ISRAEL_TIMEZONE
                },
                end: {
                    dateTime: ISODateString(group.date, group.endHour),
                    timeZone: ISRAEL_TIMEZONE
                },
                colorId: 1,
            }
            calendar.events.insert({ calendarId: 'primary', resource: groupEvent }, (err) => {
                if (err) { return console.log(err) }
                return console.log('Calendar Event Created!');
            })
        }
        res.redirect('http://localhost:3000/profile');
    });
});

router.put("/", (request, response) => {
    let groupID = request.body.groupID;
    let oAuthConsentUrl = getAuthUrl(groupID);
    response.send(oAuthConsentUrl);
});

module.exports = router;