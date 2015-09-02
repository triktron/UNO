var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/client"));

app.listen(port);
console.log("listening on *:" + port);