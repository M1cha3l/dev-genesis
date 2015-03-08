﻿//server.js

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {

    // URL we will scrape from - Ghost in the Shell

    url = 'http://www.imdb.com/title/tt0113568/';

    /* The structure of our request call
     * The first parameter is our URL The callback 
     * function takes 3 parameters, an error, response
     * status code and the html
     */
    request(url, function (error, response, html) {
        // First we'll check to make sure no errors occured when making the request

        if (!error) {
            // Next, we'll utilize the cheerio library on the return html
            // which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var json = { title: "", release: "", rating: "" };

            // We'll use the unique header class as a starting point

            $('.header').filter(function () {
                // Let's store the data we filter into a variable so we can easily see what's going on

                var data = $(this);

                // In examining the DOM we notice that the title rests within
                // the first child element of the header tag. Utilizing jQuery
                // we can easily navigate and get the text by writing the
                // following code:
                title = data.children().first().text();

                // We will repeat the same process as above. This time we notice
                // that the release is located within the last element

                release = data.children().last().children().text();

                // Once we have our title and release, we'll store it to the json object.

                json.title = title;
                json.release = release;

            })

            // Since the rating is in a different section of the DOM, we'll
            // have to write a new jQuery filter to extract this information.

            $('.star-box-giga-star').filter(function () {
                var data = $(this);

                // The .star-box-giga-star class was exactly where we wanted it
                // to be. To get the rating, we can simply just get the .text()
                // no need to traverse the DOM any further

                rating = data.text();
                json.rating = rating;
            })
        }

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1: output.json - this is what the created filename will be called
        // Parameter 2: JSON.stringify(json, null, 4) - the data to write, here we do
        // an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3: callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console')
    });
})

app.listen('8081')

console.log('Stuff happens on port 8081');

exports = module.exports = app;