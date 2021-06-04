const express = require("express");
const router = express.Router();
const User = require("../models/user").User;
const Group = require("../models/group").Group;
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Get Required Configuration for Google Calendar Integration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = 'http://localhost:5000/profileSettings/oauthCallback';
const ISRAEL_TIMEZONE = 'Asia/Jerusalem';

// Configure OAuth2 Client
function getOAuthClient() {
    return new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);
}

// Define Consent Screen Url
function getAuthUrl() {
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
        // response_type: code,
        redirect_uri: REDIRECT_URL,
        client_id: GOOGLE_CLIENT_ID
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
    // const session = req.session;
    const code = req.query.code;
    oauth2Client.getToken(code, async function(err, tokens) {
        // console.log("tokens : ", tokens);
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
            // session["tokens"] = tokens;
            const oauth2 = google.oauth2({
                auth: oauth2Client,
                version: 'v2'
            });
            let { data } = await oauth2.userinfo.get(); // get user info
            await User.updateOne({ email: data.email }, { calendarIntegration: true });
            let user = await User.findOne({ email: data.email });
            let userGroups = await Group.find({ _id: { $in: user.groups } });
            const calendar = google.calendar({
                version: 'v3',
                auth: oauth2Client
            })
            for (i = 0; i < userGroups.length; i++) {
                let location;
                if (userGroups[i].meetingType === "וירטואלית") {
                    location = userGroups[i].link;
                } else {
                    location = userGroups[i].place + ", " + userGroups[i].city;
                }
                groupEvent = {
                    summary: userGroups[i].groupTitle,
                    location: location,
                    description: userGroups[i].groupDescription,
                    start: {
                        dateTime: ISODateString(userGroups[i].date, userGroups[i].startHour),
                        timeZone: ISRAEL_TIMEZONE
                    },
                    end: {
                        dateTime: ISODateString(userGroups[i].date, userGroups[i].endHour),
                        timeZone: ISRAEL_TIMEZONE
                    },
                    colorId: 1,
                }
                calendar.events.insert({ calendarId: 'primary', resource: groupEvent }, (err) => {
                    if (err) { return console.log(err) };
                    return console.log('Calendar Event Created!');
                })
            }
        }
        res.redirect('http://localhost:3000/profileSettings');
    });
});

router.get("/:email", async(request, response) => {
    let email = request.params.email;
    let oAuthConsentUrl = getAuthUrl();
    let user = await User.findOne({ email: email });
    response.send([user, oAuthConsentUrl]);
});

router.put("/:email", async(request, response) => {
    let email = request.params.email;
    ///////////////////////////////////////////////////////////////////////////// ====> need to change after uniting the repositories
    let newUserImg = request.file.path
        .substring(request.file.path.indexOf("assets"), request.file.path.length)
        .replace(/\\/g, "/");
    /////////////////////////////////////////////////////////////////////////////
    await User.updateOne({ email: email }, { userImg: newUserImg });
    response.send("User Profile Picture Updated!");
});

router.put("/", async(request, response) => {
    let email = request.body.email;
    await User.updateOne({ email: email }, request.body);
    response.send("User Updated!");
});

module.exports = router;