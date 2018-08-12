# liri-node-app How to

* This is language recognition software appropriately named Liri. To begin, [Git Clone](https://github.com/Ciwonie/liri-node-app.git)

* In your terminal, run `npm install` to download necessary node modules

* Create a `.env` file in the root, fill in like such:
```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

```

If you need keys, use the following hyperlinks: [Spotify](https://www.npmjs.com/package/node-spotify-api) & [Twitter](https://apps.twitter.com/app/new)

* Once your .env file is prepared, you are ready to run the app.

###Final Note:
* The file `random.txt` will randomly call on one of Liri's commands. The .txt file is delimited by a `,`.
* Left of the `,` must hold one of the following command strings:
    * `my-tweets`

    * `spotify-this-song`

    * `movie-this`

    * `do-what-it-says`
* Right of the `,` contains the search parameters for the specific categories

