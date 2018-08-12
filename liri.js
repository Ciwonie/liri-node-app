require("dotenv").config();

var keys = require('./keys');
var inquirer = require("inquirer");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require('request');
var fs = require('fs');

var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

var space = '\n-------------------------------------\n\n';

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
                            console.log('\nArtist: ' + response.tracks.items[0].artists[0].name);
                            console.log('\nAlbum: ' + response.tracks.items[0].album.name);
                            console.log('\nLink: ' + response.tracks.items[0].album.external_urls.spotify);
                            console.log('\nSong: ' + response.tracks.items[0].name);

                            data = [
                                '\nArtist: ' + response.tracks.items[0].artists[0].name,
                                '\nAlbum: ' + response.tracks.items[0].album.name,
                                '\nLink: ' + response.tracks.items[0].album.external_urls.spotify,
                                '\nSong: ' + response.tracks.items[0].name
                            ]

                            fs.appendFile("log.txt", data + space, function(err) {

                                // If the code experiences any errors it will log the error to the console.
                                if (err) {
                                  return console.log(err);
                                }
                              
                                // Otherwise, it will print: "movies.txt was updated!"
                                console.log("log.txt was updated!");
                              
                              });
                        })
                        .catch(function (err) {
                            console.log(err);
                        });

                });
        }
        else if (inquirerResponse.liri === 'Check Tweets') {
            console.log("\nYou chose: " + inquirerResponse.liri);

            inquirer
                .prompt([
                    {
                        type: "name",
                        message: "Whose Tweets do you want to see?",
                        name: "twitterName"
                    },
                ])
                .then(function (tweetChoice) {

                    if (tweetChoice.twitterName) {
                        var params = { screen_name: tweetChoice.twitterName, count: 20 };
                        client.get('statuses/user_timeline', params, function (error, tweets, response) {
                            if (!error) {
                                for (var i in tweets) {
                                    console.log('\nTweets:  ' + tweets[i].text);
                                }
                            }
                        });
                    }
                    else {
                        var params = { screen_name: 'rickygervais', count: 20 };
                        client.get('statuses/user_timeline', params, function (error, tweets, response) {
                            if (!error) {
                                console.log('Ricky Gervais: ')
                                for (var i in tweets) {
                                    console.log('\nTweets:  ' + tweets[i].text);
                                }
                            }
                        });
                    }

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
                        request(queryUrl, function (error, response, body) {
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

                            data = [
                                '\nTitle: ' + JSON.parse(body).Title,
                                '\nRelease Year: ' + JSON.parse(body).Year,
                                '\nRated: ' + JSON.parse(body).Rated,
                                '\nActors: ' + JSON.parse(body).Actors,
                                '\nPlot: ' + JSON.parse(body).Plot,
                                '\nLanguages: ' + JSON.parse(body).Language,
                                '\nCountries: ' + JSON.parse(body).Country,
                                '\nIMDB Rating: ' + JSON.parse(body).Ratings[0].Value,
                                '\nRotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value,
                            ]

                            fs.appendFile("log.txt", data + space, function(err) {

                                // If the code experiences any errors it will log the error to the console.
                                if (err) {
                                  return console.log(err);
                                }
                              
                                // Otherwise, it will print: "movies.txt was updated!"
                                console.log("log.txt was updated!");
                              
                              });

                        })
                    }
                    else {
                        request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
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

            fs.readFile('random.txt', 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }

                var output = data.split(',');
                console.log('\nCommand: ' + output[0]);
                console.log('\nOption: ' + output[1]);

                if (output[0] === 'spotify-this-song') {
                    spotify
                        .search({ type: 'track', query: output[1] })
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
                else if (output[0] === 'my-tweets') {
                    var name = output[1].replace(/["']/g, "")
                    var params = { screen_name: name, count: 20 };
                    client.get('statuses/user_timeline', params, function (error, tweets, response) {
                        if (!error) {
                            for (var i in tweets) {
                                console.log('\nTweets:  ' + tweets[i].text);
                            }
                        }
                    });
                }
                else if (output[0] === 'movie-this') {
                    var randomMovie = output[1].replace(/\s+/g, '+').toLowerCase();
                    request("http://www.omdbapi.com/?t=" + randomMovie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
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
