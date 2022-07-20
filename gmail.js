const {google} = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
const credentials = require('./credentials.json');
const tokens = require('./token.json');
const _ = require('lodash');
const getGmailService = () => {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(tokens);
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    return gmail;
};

const encodeMessage = (message) => {
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
    const mailComposer = new MailComposer(options);
    const message = await mailComposer.compile().build();
    return encodeMessage(message);
};

const sendMail = async (options) => {
    const gmail = getGmailService();
    const rawMessage = await createMail(options);
    const {data: {id} = {}} = await gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: rawMessage,
        },
    });
    return id;
};

const listMessages = async (req, res) => {
    try {

        const gmail = getGmailService();
        const mailList = await gmail.users.messages.list({
            userId: 'me',
            q: 'in:inbox is:unread from:chainbucks11@gmail.com',
        });
        const messages = await Promise.all(_.map(mailList.data.messages, async x => await gmail.users.messages.get({
            userId: 'me',
            id: x.id,
            format: "METADATA",
            metadataHeaders: "Cc",
        })))
        const result =await Promise.all(_.map(messages,m =>
              m["data"]["payload"]["headers"]
        ))
        console.log("here")
        console.log(messages.length)
        res.json(result);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error});
    }
}
module.exports = {sendMail, listMessages};