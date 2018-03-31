
import mysql from "mysql"
// import connInfo from "./connect"

import { KEY } from "./connect"
import { testSets } from "./constants"

import fs from "fs"
import readline from "readline"
import { google } from "googleapis"
const OAuth2 = google.auth.OAuth2

var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']

const googleAuthDir = __dirname.slice(0, __dirname.indexOf("smash-db")+8) + "/googleAuth/"

const TOKEN_PATH = googleAuthDir + "youtube-token.json"

fs.readFile(googleAuthDir + "client_secret.json", (err, content) => {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }

    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getChannel);
})

const authorize = (credentials, callback) => {
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.auth_provider_x509_cert_url;
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    })
}

const getNewToken = (oauth2Client, callback) => {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client);
      });
    });
}

const storeToken = (token) => {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) throw err;
      console.log('Token stored to ' + TOKEN_PATH);
    });
    console.log('Token stored to ' + TOKEN_PATH);
}

const getChannel = (auth) => {
    var service = google.youtube('v3');
    service.channels.list({
      auth: auth,
      part: 'snippet,contentDetails,statistics',
      forUsername: 'GoogleDevelopers'
    }, (err, response) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var channels = response.data.items;
      if (channels.length == 0) {
        console.log('No channel found.');
      } else {
        console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                    'it has %s views.',
                    channels[0].id,
                    channels[0].snippet.title,
                    channels[0].statistics.viewCount);
      }
    })
}

console.log("Testing...")
