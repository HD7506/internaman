const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
//const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

const db_name = "__CONCOX__"
const url = "mongodb+srv://backendconcoxdeveloper:V3jUV7QXqEoAtnhy@cluster0-zhjde.mongodb.net/" + db_name;

const client = new MongoClient(url, { useNewUrlParser: true });

var devices = [];
var final = [];

client.connect(function(err) {
    if (err) throw err;

    const db = client.db(db_name);

    db.collection("devices").find().toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);

        var count1 = result.length;
        //console.log();

        if (count1 > 0) {
            var devices = [];
            for (var i = count1 - 1; i >= (count1 - 30); i--) {
                devices.push(result[i].id);

            }
            //console.log(devices);
        } else {
            console.log("no data");
        }



    });

    db.collection("status").find({}).toArray((err, result2) => {
        if (err) throw err;
        //console.log(result2);
        var count2 = result2.length;
        //console.log();
        var locs = []
        if (count2 > 0) {
            for (var j = 0; j < devices.length; j++) {
                var locs = [];
                var id = devices[j].id;

                for (var i = 0; i < count2; i++) {

                    if (result2[i].device === id) {

                        locs.push(result2[i]);
                        //console.log(result2[i]);
                    }
                    /* else {
                                           console.log("no matching");
                                       } */

                }
                final.push(locs);
            }
            //console.log(final);

        } else {
            console.log("no data");
        }

    });
    //const col2 = db.collection("status");


});

//mongoose.connect(url, { useNewUrlParser: true });


// device.find(function(err, devices) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(devices);

//         devices.forEach(function(device) {
//             console.log(device.name)
//         });
//     }
//});



app.post("/", function(req, res) {


    const finalans = [];
    const key = "AIzaSyA5bwbEsAOUMOI4RK2zXcIayG4vjuQSpcw";
    const query = ["Plot No:1, Sadarpur, Sector-45, Noida, Uttar Pradesh 201303, India", "New Link Road, Behind Infinity Mall, Andheri West, Mumbai, Maharashtra 400053, India", "D-002, Sector 75 Road, Sector 75, Noida, Uttar Pradesh 201301, India", "Ambrahi Village, Sector 19 Dwarka, Dwarka, Delhi, 110075, India"];
    for (let i = 0; i < query.length; i++) {
        const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query[i] + "&key=" + key;
        https.get(url, function(response) {
            console.log(response.statusCode);


            response.on("data", function(data) {
                const geoData = JSON.parse(data);


                var lat = data.results[0].geometry.location.lat;
                var lng = data.results.geometry.bounds.northeast.lng;
                // console.log(lat);
                //console.log(lng);
                var address = {
                    add: query,
                    location: [lat, lng]
                };
                finalans.push(address);

            });

        })


    }
    response.send(finalans);
});



app.listen(8000, function() {
    console.log("server is running on port 3000.");
});