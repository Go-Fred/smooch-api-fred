'use strict';

var path = require('path');
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
var postrequest = require('superagent');


// const smooch = new Smooch({
//     keyId: KEY_ID,
//     secret: SECRET,
//     scope: 'app'
// });

// Server https://expressjs.com/en/guide/routing.html
const app = express();

var jwt = require('jsonwebtoken');
var token = jwt.sign({scope: 'app'}, SECRET, {header: {kid: KEY_ID}});

app.use(bodyParser.json());

// Expose /messages endpoint to capture webhooks https://docs.smooch.io/rest/#webhooks-payload
app.post('/messages', function(req, res) {
  console.log('webhook PAYLOAD:\n', JSON.stringify(req.body, null, 4));

  const appUserId = req.body.appUser._id;
  console.log(appUserId);
  // Call REST API to send message https://docs.smooch.io/rest/#post-message
  if (req.body.trigger === 'message:appUser') {
      // smooch.appUsers.sendMessage(appUserId, {
      //     type: 'image',
      //     text: 'Live long and prosper',
      //     //mediaUrl:'https://c1.staticflickr.com/6/5519/30725254545_62fc46416d_k.jpg',
      //     mediaUrl:'http://data.freehdw.com/toyota-devolro-back-view.jpg',
      //     role: 'appMaker'
      // })
      postrequest
        .post('https://api.smooch.io/v1/appusers/' + appUserId + '/messages')
        .send({
          text: 'test',
          type: 'text',
          role: 'appMaker'
        })
        .set('authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err2, postres) {
          console.log(err2, postres.body, postres.statusCode);
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

// Route the home Get request to index.html

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res) =>{
  res.sendFile(path.join(__dirname +'/public/index.html'))
})

// Listen on port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
