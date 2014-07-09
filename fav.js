var Twit = require('twit')
, https = require('https')
, fs = require('fs')
, config = require('./config.js')

var t = new Twit({

consumer_key : CONSUMER_KEY 
, consumer_secret : CONSUMER_SECRET 
, access_token: ACCESS_TOKEN
, access_token_secret: ACCESS_TOKEN_SECRET

})

function printTweet(tweet){
	console.log(
	'\nUser: @' + tweet.user.screen_name
	+ '\nText: ' + tweet.text
	+ '\nid: ' + tweet.id
	+ '\nid_str: ' + tweet.id_str
	+ '\nHora: ' + tweet.created_at
	+ '\n\n'
	);
	}

var stream = t.stream('user')
		
var d = new Date();

stream.on('favorite', function(favorite)
		{
			tuit_id = favorite.target_object.id_str
		
			//deleteTuit
			t.post('statuses/destroy/:id', { id: tuit_id},
				function(err, data, response)
				{
					console.log('borrado')
				});
			//Avisar que fue borrado
			t.post('statuses/update', {status: '@'+DM_RECEIVER+' shh ;) '+ tuit_id },
			function(err, data, response){});},
function(err,reply){}
 )
			
