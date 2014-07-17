var Twit = require('twit')
, https = require('https')
, fs = require('fs')
, config = require('./config.js')

require('./presas.js')


var i = 0
while(i < media.length)
{
console.log(media[i])
i++
}
console.log('\n')

function isThisMedia(screen_name)
{
	var i = 0
	while(i < media.length)
	{
		if(screen_name == media[i])
			return 1;
		i++;
	}
	return 0;
}

var t = new Twit({

consumer_key : CONSUMER_KEY 
, consumer_secret : CONSUMER_SECRET 
, access_token: ACCESS_TOKEN
, access_token_secret: ACCESS_TOKEN_SECRET

})

function filterUsers(user)
{
	switch(user)
	{
		case 'tecavaret':
			return 1;
			break;
		case 'zafiroperu':
			return 1;
			break;
		default:
			return 0;
			break;
	}
}

function saveToFile(tweet)
{	
	filename = __dirname + "/tuits/" + tweet.user.screen_name + tweet.id.toString();
	data = tweet.id_str+','+tweet.user.screen_name+','+tweet.text+'\n'

	
	fs.writeFile(filename, data, function (err){
		if(err) throw err;
		console.log("Tweet archivado");
	});
}

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

function isThisRT(tuit){
	if(tuit.indexOf("RT ") == 0)
		return true;
	else
		return false;
	}

function isThisRevendedor(tuit){
	if(tuit.indexOf("vendo") == 0)
		return true;
	else if(tuit.indexOf("me sobra") == 0)
		return true;
	else if(tuit.indexOf("Vendo") == 0)
		return true;
	else
		return false;
	}

var evento = process.argv[2];
keyword_list = [];
if(process.argv.length > 3)
{
	keyword_list.push(process.argv[2]);
	var i = 3;
	while(i < process.argv.length)
	{
		keyword_list.push(process.argv[i]);
		i++;
	}


console.log(keyword_list.toString());
}

function generateWordList(keyword)
	{
		
		var wordlist = [

		 	keyword + ' boletos',
			keyword + ' boleto',	
			keyword + ' regalaremos',
			keyword + ' regale',
			keyword + ' regalare',
			keyword + ' regalar',
			keyword + ' pendientes',
			keyword + ' pase',
			keyword + ' pases',
			keyword + ' ganar',
			keyword + ' abono',
			keyword + ' entradas',
			keyword + ' entrada',
			keyword + ' tengo',
			keyword + ' tenemos',
			keyword + ' cortesia',
			keyword + ' cortesias',
			keyword + ' sortear',
			keyword + ' sortearemos',
			keyword + ' invitacion',
			keyword + ' invitaciones',
			keyword + ' pulsera',
			keyword + ' pulseras',
			keyword + ' rifa',
			keyword + ' rifar',
			keyword + ' rifare',
			keyword + ' rifaremos',
			keyword + ' sencillo',
			keyword + ' sencilla',	
			'tortapuerca'

		];

		return wordlist;

	};


function generateParameterArray(keyword)
	{
		var paramArray = [];
		var i = 0;
		while(i < keyword.length)
		{
			paramArray = paramArray.concat(generateWordList(keyword[i]));
			i++;
		}
		return paramArray;
	};	

wordlist = generateParameterArray(keyword_list);

var stream = t.stream('statuses/filter',{
		
	track: wordlist 

	 })

var d = new Date();

function tuitUrl(screen_name, id_str)
{
return 'https://twitter.com/' + screen_name + '/status/' + id_str;
}

function tuitMetaData(tweet)
{
	var dataString = '@' + tweet.user.screen_name
			  + ' at:' + tweet.created_at
		       	  + ' ' + tuitUrl(tweet.user.screen_name, tweet.id_str);

	return dataString; 
}

function sendDM(tweet)
{
	t.post('direct_messages/new', 
			{
			screen_name	: DM_RECEIVER,
			text		: tuitMetaData(tweet)
			},
		function(err,reply){}
		)

	t.post('direct_messages/new', 
			{
			screen_name	: DM_RECEIVER,
			text		: tweet.text
			},
		function(err,reply){}
		)
}
 
function createStatus(tweet)
{
		var status = 	tweet.user.screen_name
			+	' '
			+	tweet.user.followers_count
			+	' @'
			+	DM_RECEIVER
			+	' https://twitter.com/'
			+	tweet.user.screen_name
			+	'/status/'
			+	tweet.id_str
			+ 	' '
			+ 	tweet.user.description
			;
		return status;
}

//Comienzo del script
//t.post('statuses/update', {status: 'andas chido @paranoidhominid  '+ d.toDateString()}, function(err, reply){});
console.log("Cazando boletos de " + evento + "\n" + d.toDateString());
stream.on('tweet', function(tweet)
		{
			printTweet(tweet);
			if( isThisMedia(tweet.user.screen_name) )
			{
				console.log('No apto para el pueblo');
				sendDM(tweet)
				return;
			}	
			
  if((filterUsers(tweet.user.screen_name) || tweet.retweet_count > 0) ||(isThisRT(tweet.text)) || isThisRevendedor(tweet.text)){console.log('no procede')}
        else{
                t.post('statuses/update',
                {
			status: createStatus(tweet)
                },
                        function(err,reply){}
                )
        }

		});
