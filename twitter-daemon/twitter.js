const Twitter = require('twitter');
const conf = require('./config');


const client = new Twitter({
    consumer_key: conf.twitter.consumer_key,
    consumer_secret: conf.twitter.consumer_secret,
    access_token_key: conf.twitter.access_token_key,
    access_token_secret: conf.twitter.access_token_secret
});


module.exports = {
    newTweet: async (tweet) => {
        return client.post('statuses/update', tweet)
    }
};