var express = require("express"),
    app = express(),
    request = require("request");

var port = process.env.VCAP_APP_PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.listen(port);

app.get("/data", function (req, res) {
    request.get("http://epec.saw.usace.army.mil/dsskerr.txt").pipe(res);
});
