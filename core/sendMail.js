const fs = require('fs');
const path = require('path');
const sendMail = require('./gmail');

const main = async () => {
    const fileAttachments = [
        {
            filename: 'websites.pdf',
            path: 'https://www.labnol.org/files/cool-websites.pdf',
        },
    ];

    const options = {
        to: 'odel.fhima@gmail.com',
        cc: 'dinapinchuck@gmail.com',
        replyTo: 'chainbucks11@gmail.com',
        subject: 'Hello Odel 🚀',
        text: 'This email is sent from the command line',
        html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
        attachments: fileAttachments,
        textEncoding: 'base64',
        headers: [
            { key: 'X-Application-Developer', value: 'Amit Agarwal' },
            { key: 'X-Application-Version', value: 'v1.0.0.2' },
        ],
    };

    const messageId = await sendMail(options);
    return messageId;
};

main()
    .then((messageId) => console.log('Message sent successfully:', messageId))
    .catch((err) => console.error(err));