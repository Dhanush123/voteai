'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const myVoiceIt = require('VoiceIt');

const server = express();
server.use(bodyParser.json());

server.post('/', function (req, res) {
  console.log('webhook request');
  try {
      if (req.body) {
          var requestBody = req.body;
          if (requestBody.result) {
            if (requestBody.result.action == 'auth') {
              console.log("going to auth intent...");
              auth(requestBody,res);
            }
          }
      }
  }
  catch (err) {
    console.error('Cannot process request', err);
    return res.status(400).json({
        status: {
            code: 400,
            errorType: err.message
        }
    });
  }
});

function auth(body,clbk) {
  var url = body["originalRequest"]["data"]["message"]["attachments"][0]["payload"]["url"];
  console.log("url:",url);
//  if (url.includes(".jpg")) {
//    photoAuth(url, clbk);
//  }
//  else if (url.includes(".mp4")) {
//    voiceAuth(url, clbk);
//  }
}

function voiceAuth(audioUrl,clbk) {
  myVoiceIt.authenticationByWavURL({
      userId: 'dhanushp',
      password: 'db135c5b81e061bd4a7bb7b360ee34e778894979440ecace0eb8d12cfe9061cd',
      urlToAuthenticationWav: audioUrl,
      contentLanguage: 'en-US',
      callback: function(response){
        var authStatus = response["Result"].includes("successful");
        console.log("voice auth status:",response["Result"]);
        var speech = authStatus ? "Voice authentication has found eligible voter Dhanush Patel." : "Unauthorized access attempt. This incident has been reported!"; 
        return clbk.json({
          speech: speech,
          displayText: speech,
        });
      }
  });  
}

function photoAuth(photoUrl,clbk) {
    var options = { method: 'POST',
    url: 'https://api.clarifai.com/v2/models/SFHacks2018/outputs',
    headers: 
     { authorization: 'Key a55f155142f9481dbb369f5f34bc04e2',
       'content-type': 'application/json' },
    body: { inputs: [ { data: { image: { url: photoUrl } } } ] },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var confidence = body["outputs"][0]["data"]["concepts"][0]["value"];
    console.log("photo match confidence:",confidence);
    var speech = confidence > 0.9 ? "Facial authentication has found eligible voter Dhanush Patel." : "Unauthorized access attempt. This incident has been reported!"; 
    return clbk.json({
        speech: speech,
        displayText: speech,
      });
    });
}

server.listen((process.env.PORT || 8000), function () {
  myVoiceIt.initialize('c2e297ef8a444fcab3026f0838856a53');
  console.log('Server listening');
});