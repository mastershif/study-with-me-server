const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

function verifyToken(req, res, next) {
    const tokenArray = req.header('Authorization').split(" ");
    if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
        return res.status(401).send('Access Denied!');
    }
    const token = tokenArray[1];
    if (!token) {
        return res.status(401).send('Access Denied!');
    }
    try {
        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_AUTH_CLIENT_ID,
        })
            .then((ticket) => {
                const payload = ticket.getPayload();
                const { email } = payload;
                req.session.verifiedEmail = email;
                next();
            })
            .catch((error) => {return res.status(400).send('Invalid Token!')});
    }
    catch (err) {
        return res.status(400).send('Invalid Token!');
    }
}

module.exports = verifyToken;
