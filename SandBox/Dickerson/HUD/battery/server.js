var express = require('express');
var app = express();

app.configure(function() {
    app.use(
       "/hud",
       express.static(__dirname + '/www'));
    });

app.listen(8888, '0.0.0.0');
