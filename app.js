const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8181;
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let counter = {
    encuentrosCodear: 0,
    quedateEnCasa: 0
};

require("dotenv").config();

// configure twit
const Twit = require("twit");
const twit = new Twit({
    consumer_key: process.env.TWIT_CONSUMER_KEY,
    consumer_secret: process.env.TWIT_CONSUMER_SECRET,
    access_token: process.env.TWIT_ACCESS_TOKEN,
    access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});

function configureRoutes() {
    app.use(express.static(path.join(__dirname,"/public")));
    app.get("/", (req, res) => {
        res.sendfile(path.join(__dirname, "/public/index.html"));
    })
}

function configureTwit() {

    // create stream
    const streamCasa = twit.stream('statuses/filter', { track: "#QuedateEnCasa" });

    // listen to tweets with those words
    streamCasa.on('tweet', (tweet) => {
        counter.quedateEnCasa ++;
        console.log("Tweets:",counter);
        io.sockets.emit("update", counter);
    });

    // create stream
    const streamCodear = twit.stream('statuses/filter', { track: "#EncuentrosCodear" });

    // listen to tweets with those words
    streamCodear.on('tweet', (tweet) => {
        counter.encuentrosCodear ++;
        console.log("Tweets:",counter);
        io.sockets.emit("update", counter);
    });

}

function configureSocket() {
    io.on('connection', function (socket) {
        console.log("new socket connected:", socket.id);
    });
}

function startServer() {

    configureRoutes();
    configureSocket();
    configureTwit();

    server.listen(port, () => {
        console.log("conectado a " + port);
    })
}

startServer();

