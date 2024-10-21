const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 9000;

app.use(bodyParser.json());

const secret = 'your-secret';  // Replace with your actual secret

function verifySignature(req, res, buf, encoding) {
    const signature = `sha1=${crypto.createHmac('sha1', secret).update(buf).digest('hex')}`;
    if (req.headers['x-hub-signature'] !== signature) {
        res.status(401).send('Unauthorized');
        throw new Error('Unauthorized');
    }
}

app.post('/webhooks/github', bodyParser.json({ verify: verifySignature }), (req, res) => {
    console.log('Received GitHub webhook:', req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Webhook server running at http://localhost:${port}`);
});
