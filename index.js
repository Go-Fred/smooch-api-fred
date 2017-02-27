'use strict';

var dotenv = require('dotenv');
dotenv.config();
dotenv.load();

// Imports
const express = require('express');
const bodyParser = require('body-parser');
const Smooch = require('smooch-core');

// Config
const PORT = 8001;
const KEY_ID = process.env.KEY_ID;
const SECRET = process.env.SECRET;

const smooch = new Smooch({
    keyId: KEY_ID,
    secret: SECRET,
    scope: 'app'
});

// Server https://expressjs.com/en/guide/routing.html
const app = express();

app.use(bodyParser.json());

// Expose /messages endpoint to capture webhooks https://docs.smooch.io/rest/#webhooks-payload
app.post('/messages', function(req, res) {
  console.log('webhook PAYLOAD:\n', JSON.stringify(req.body, null, 4));

  const appUserId = req.body.appUser._id;
  console.log(appUserId);
  // Call REST API to send message https://docs.smooch.io/rest/#post-message
  if (req.body.trigger === 'message:appUser') {
      smooch.appUsers.sendMessage(appUserId, {
          type: 'image',
          text: 'Live long and prosper',
          //mediaUrl:'https://c1.staticflickr.com/6/5519/30725254545_62fc46416d_k.jpg',
          mediaUrl:'http://data.freehdw.com/toyota-devolro-back-view.jpg',
          role: 'appMaker'
      })
          .then((response) => {
              console.log('API RESPONSE:\n', response);
              res.end();
          })
          .catch((err) => {
              console.log('API ERROR:\n', err);
              res.end();
          });
  }
});

// Listen on port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
