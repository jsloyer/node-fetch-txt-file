var express = require("express"),
    app = express(),
    request = require("request"),
    _ = require("underscore"),
    dust = require("dustjs-linkedin"),
    consolidate = require("consolidate");

var port = process.env.VCAP_APP_PORT || 8080;

app.engine("dust", consolidate.dust);
app.set("template_engine", "dust");
app.set("views", __dirname + '/views');
app.set("view engine", "dust");

app.listen(port);

function getData(callback) {
    var data = [];

    var options = {
        url: "http://epec.saw.usace.army.mil/dsskerr.txt"
    }
    request(options, function(error, response, body) {
        if (error) {
            callback(error);
        }
        _.each(body.split("\r\n"), function (line) {
            var splitLine;
            //see if the line contains the data we want
            //ensure it really is the data line, filter out some things
            line = line.trim();
            splitLine = line.split(/[ ]+/);
            if ( splitLine.length === 10 && !isNaN(parseInt(line.substring(0,2))) ) {
                data.push({
                    date: splitLine[0],
                    time: splitLine[1],
                    grossGen: splitLine[6],
                    kerr: {
                        inflow: splitLine[2],
                        outflow: splitLine[3],
                        hwGageElev: splitLine[4],
                        dcpGageElev: splitLine[5],
                        rainfall: splitLine[7]
                    },
                    islandCreek: {
                        hwGageElev: splitLine[8],
                        dcpGageElev: splitLine[9]
                    }
                });
            }
        });
        callback(null, data);
    });
}

app.get("/data", function (request, response) {
    getData(function(error, data) {
        if (error) {
            response.send(error);
            return;
        }
        else {
            response.send(data);
        }
    });
});
app.get("/", function (request, response) {
    getData(function(error, data) {
        if (error) {
            response.send(error);
            return;
        }
        else {
            response.render("index", {data: data});
        }
    });
});
