const uuid = require('uuid').v4;
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const axios = require('axios');
const fs = require('fs');

const DialogFlow = require('./dialogFlow');
const dialogFlow = new DialogFlow();

const API = require('./API');

const host = process.env.APP_HOST || '127.0.0.1';
const port = process.env.APP_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let secrets = fs.readFileSync('secrets.json');
let config = JSON.parse(secrets);

io.on("connection", socket => {
    console.log("a user connected")
    socket.on('join', function (data) {
        socket.join(data.username);
    });
    var sessionId = uuid()
    socket.on("inputMsg", msg => {
        var trimmedMessageText = msg.replace(/[^a-zA-Z0-9 ]/g, "")
        console.log(trimmedMessageText)
        var chatBotResponse = dialogFlow.sendTextMessageToDialogFlow(trimmedMessageText, sessionId)
        chatBotResponse.then((res) => {
            var botReply = res[0]
            var botQueryResult = botReply['queryResult']
            var intentName = botQueryResult['intent']['displayName']
            var fulfillmentMessages = botQueryResult['fulfillmentMessages']
            var botResponse = fulfillmentMessages[0]["text"]["text"][0]
            console.log("Bot fulfillment reply", botResponse)
            console.log("intent name ", intentName)
            if (intentName !== undefined && intentName !== null && intentName !== ""){ 
              if (intentName === "UserProvidesShowChoice"){
              botResponse = prepareMoviesListResponse(sessionId, botResponse);
            } else if (intentName === "UserProvidesMovieNameYes"){
              botResponse = prepareSeatLayoutResponse(sessionId, botResponse);
            } else if (intentName === "UserProvidesGenre"){
              botResponse = prepareWebSeriesListResponse(sessionId, botResponse);
            } else if (intentName === "UserProvidesWebSeriesNameYes"){
              botResponse = prepareWebSeriesDataResponse(sessionId, botResponse);
            } else {
              sendResponse(botResponse);
            }
          }
        }).catch((err) => {
            console.log(err)
            sendResponse("Some Error Occured!!!");
        })
    })
})

server.listen(port, host, () => {
   console.log('Server is up and running on host ' + host + ' port numner ' + port);
})

function prepareWebSeriesDataResponse(sessionId, botResponse) {
  dialogFlow.getContextParameters(sessionId, "hackathon").then((ctxRes) => {
    var webseriesName = ctxRes["webseries"]["stringValue"];
    var genre = ctxRes["genre"]["stringValue"];
    var showPlatform = "";
    var showUrl = "";
    axios.get(API.WEBSERIES).then((wsRes) => {
      let wsResData = wsRes.data;
      wsResData.forEach((ws) => {
        if (ws["genre"].toLowerCase() === genre) {
          let wsList = ws["movies"];
          for (var i = 0; i < wsList.length; i++) {
            let wsDtl = wsList[i];
            if (wsDtl["name"].toLowerCase() === webseriesName.toLowerCase()) {
              showPlatform = wsDtl["platform"];
              showUrl = wsDtl["url"];
              break;
            }
          }
        }
      });
      botResponse += "\n" + `Platform : ${showPlatform}\n and watch the show by visiting the URL: ${showUrl}`;
      sendResponse(botResponse);
    });
  });
  return botResponse;
}

function prepareWebSeriesListResponse(sessionId, botResponse) {
  dialogFlow.getContextParameters(sessionId, "hackathon").then((ctxRes) => {
    var genre = ctxRes["genre"]["stringValue"];
    var wsShows = [];
    axios.get(API.WEBSERIES).then((wsRes) => {
      let wsResData = wsRes.data;
      wsResData.forEach((ws) => {
        if (ws["genre"].toLowerCase() === genre) {
          ws["movies"].forEach((wsShow) => {
            wsShows.push(wsShow["name"]);
          });
        }
      });
      botResponse += "\n" + wsShows.join(", ");
      sendResponse(botResponse);
    });
  });
  return botResponse;
}

function prepareMoviesListResponse(sessionId, botResponse) {
  dialogFlow.getContextParameters(sessionId, "hackathon").then((ctxRes) => {
    console.log("contextParams ", ctxRes);
    var choice = ctxRes["choice"]["stringValue"];
    console.log("choice ", choice);
    if (choice !== undefined && choice !== null && choice !== "") {
      if (choice === "movie") {
        var movList = [];
        axios.get(API.MOVIES).then((movRes) => {
          var moviesList = movRes.data;
          moviesList.forEach(movieData => {
            if (movieData["regionCode"] === config["region"]["code"]) {
              var movies = movieData["movies"];
              movies.forEach((movie) => {
                movList.push(movie["name"]);
              });
            }
          });
          console.log("movieList ", movList);
          botResponse += ":\n" + movList.join(', ');
          console.log("movie choice response ", botResponse);
          sendResponse(botResponse);
        }).catch((err) => {
          console.log(err);
        });
      } else {
        sendResponse("Please select the genre from below you're interested in.\n Action, Crime, Suspense, Horror");
      }
    }
  });
  return botResponse;
}

function prepareSeatLayoutResponse(sessionId, botResponse) {
  dialogFlow.getContextParameters(sessionId, "hackathon").then((ctxParams) => {
    var movieName = ctxParams["movie"]["stringValue"];
    var movieSlug = "";
    var movieEventCode = "";
    var seatLayoutUrl = API.BMSWEBSITE;
    var today = new Date();
    var todaystring = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
    axios.get(API.MOVIES).then((movRes) => {
      var moviesList = movRes.data;
      moviesList.forEach(movieData => {
        if (movieData["regionCode"] === config["region"]["code"]) {
          var movies = movieData["movies"];
          for (var i = 0; i < movies.length; i++) {
            var movie = movies[i];
            if (movie["name"] === movieName) {
              movieSlug = movie["slug-name"];
              movieEventCode = movie["code"];
              break;
            }
          }
        }
      });
      seatLayoutUrl += `/buytickets/${movieSlug}-${config["region"]["name"]}/movie-${config["region"]["code"]}-${movieEventCode}-MT/${todaystring}#!seatlayout`;
      botResponse += "\n" + seatLayoutUrl;
      console.log("movie seat layout url ", botResponse);
      sendResponse(botResponse);
    }).catch((err) => {
      console.log(err);
    });
  });
  return botResponse;
}

function sendResponse(botResponse) {
  var chatBotMessage = {};
  chatBotMessage['_id'] = uuid();
  chatBotMessage['text'] = botResponse;
  chatBotMessage['sender'] = 'SlytherinChatBot';
  chatBotMessage['createdAt'] = new Date().toISOString();
  chatBotMessage['timestamp'] = Date.now();
  chatBotMessage['user'] = { '_id': 'SlytherinChatBot', 'name': 'SlytherinChatBot', 'avatar': '' };
  io.sockets.emit("outputMsg", chatBotMessage);
}
