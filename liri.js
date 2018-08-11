require("dotenv").config();

var keys = require('./keys');
var inquirer = require("inquirer");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require('request');
var fs = require('fs');
// var client = new Twitter(keys.twitter);

inquirer
    .prompt([
        {
            type: "list",
            message: "Welcome to LIRI, which command would you like to use?",
            choices: ["Check Tweets", "Find Songs", "Find Movies", "Random.txt"],
            name: "liri"
        },
    ])
    .then(function (inquirerResponse) {
        if (inquirerResponse.liri === 'Find Songs') {
            console.log("\nYou chose: " + inquirerResponse.liri);

            inquirer
                .prompt([
                    {
                        type: "name",
                        message: "Which song is on your mind?",
                        name: "songName"
                    },
                ])
                .then(function (songChoice) {
                    spotify
                        .search({ type: 'track', query: (songChoice.songName) ? songChoice.songName : 'The Sign by Ace of Base' })
                        .then(function (response) {
                            console.log('\nTEST: ' + response)
                            console.log('\nArtist: ' + response.tracks.items[0].artists[0].name);
                            console.log('\nAlbum: ' + response.tracks.items[0].album.name);
                            console.log('\nLink: ' + response.tracks.items[0].album.external_urls.spotify);
                            console.log('\nSong: ' + response.tracks.items[0].name);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });

                });
        }
        else if (inquirerResponse.liri === 'Find Movies') {
            console.log("\nYou chose: " + inquirerResponse.liri);

            inquirer
                .prompt([
                    {
                        type: "name",
                        message: "Which movie are you searching for?",
                        name: "movieName"
                    },
                ])
                .then(function (movieChoice) {
                    var movie = movieChoice.movieName.replace(/\s+/g, '+').toLowerCase();
                    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
                    
                    if (movie) {
                        request(queryUrl, function(error, response, body) {
                            if (!error && response.statusCode === 200) {
                                console.log('\nTitle: ' + JSON.parse(body).Title);
                                console.log('\nRelease Year: ' + JSON.parse(body).Year);
                                console.log('\nRated: ' + JSON.parse(body).Rated);
                                console.log('\nActors: ' + JSON.parse(body).Actors);
                                console.log('\nPlot: ' + JSON.parse(body).Plot);
                                console.log('\nLanguages: ' + JSON.parse(body).Language);
                                console.log('\nCountries: ' + JSON.parse(body).Country);
                                console.log('\nIMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
                                console.log('\nRotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
                            }
                            
                        })
                    }
                    else {
                        request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {
                            if (!error && response.statusCode === 200) {
                                console.log('\nTitle: ' + JSON.parse(body).Title);
                                console.log('\nRelease Year: ' + JSON.parse(body).Year);
                                console.log('\nRated: ' + JSON.parse(body).Rated);
                                console.log('\nActors: ' + JSON.parse(body).Actors);
                                console.log('\nPlot: ' + JSON.parse(body).Plot);
                                console.log('\nLanguages: ' + JSON.parse(body).Language);
                                console.log('\nCountries: ' + JSON.parse(body).Country);
                                console.log('\nIMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
                                console.log('\nRotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
                            }
                            
                        })
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        else if (inquirerResponse.liri === 'Random.txt') {
            console.log("\nYou chose: " + inquirerResponse.liri);

            fs.readFile('random.txt', 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }

                var output = data.split(',');
                console.log('\nCommand: ' + output[0]);
                console.log('\nOption: ' + output[1]);

                if (output[0] === 'spotify-this-song') {
                    spotify
                    .search({ type: 'track', query: output[1]})
                    .then(function (response) {
                        console.log('\nArtist: ' + response.tracks.items[0].artists[0].name);
                        console.log('\nAlbum: ' + response.tracks.items[0].album.name);
                        console.log('\nLink: ' + response.tracks.items[0].album.external_urls.spotify);
                        console.log('\nSong: ' + response.tracks.items[0].name);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                } 
                else if (output[0] === 'movie-this') {
                    var randomMovie = output[1].replace(/\s+/g, '+').toLowerCase();
                    request("http://www.omdbapi.com/?t=" + randomMovie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
                        if (!error && response.statusCode === 200) {
                            console.log('\nTitle: ' + JSON.parse(body).Title);
                            console.log('\nRelease Year: ' + JSON.parse(body).Year);
                            console.log('\nRated: ' + JSON.parse(body).Rated);
                            console.log('\nActors: ' + JSON.parse(body).Actors);
                            console.log('\nPlot: ' + JSON.parse(body).Plot);
                            console.log('\nLanguages: ' + JSON.parse(body).Language);
                            console.log('\nCountries: ' + JSON.parse(body).Country);
                            console.log('\nIMDB Rating: ' + JSON.parse(body).Ratings[0].Value);
                        }
                    })
                }
            })
        }
        else {
            console.log("\nThat's okay, maybe next time?");
        }
    });
