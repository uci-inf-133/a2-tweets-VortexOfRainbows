function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const options = { weekday: "long", year: "numeric", month: "long", day: "numeric", };

	var completedEvents = 0;
	var liveEvents = 0;
	var achieveEvents = 0;
	var miscEvents = 0;
	var total = tweet_array.length;
	var totalWritten = 0;

	tweet_array.forEach(function(tweet) {
		if (tweet.source == "completed")
			completedEvents++;
		else if (tweet.source == "achievement")
			achieveEvents++;
		else if (tweet.source == "live event")
			liveEvents++;
		else
			miscEvents++;
		if (tweet.written) 
			totalWritten++;
	});

	function toPercent(val, outOf) {
		return math.format(val / outOf * 100, { notation: 'fixed', precision: 2 }) + '%';
	}


	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = total;	
	document.getElementById('firstDate').innerText = tweet_array[tweet_array.length - 1].time.toLocaleDateString("en", options);
	document.getElementById('lastDate').innerText = tweet_array[0].time.toLocaleDateString("en", options);	
	document.getElementsByClassName('completedEvents')[0].innerText = completedEvents;
	document.getElementsByClassName('completedEventsPct')[0].innerText = toPercent(completedEvents, total);
	document.getElementsByClassName('completedEvents')[1].innerText = completedEvents;
	document.getElementsByClassName('liveEvents')[0].innerText = liveEvents;
	document.getElementsByClassName('achievements')[0].innerText = achieveEvents;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscEvents;
	document.getElementsByClassName('liveEventsPct')[0].innerText = toPercent(liveEvents, total);
	document.getElementsByClassName('achievementsPct')[0].innerText = toPercent(achieveEvents, total);
	document.getElementsByClassName('miscellaneousPct')[0].innerText = toPercent(miscEvents, total);
	document.getElementsByClassName('written')[0].innerText = totalWritten;
	document.getElementsByClassName('writtenPct')[0].innerText = toPercent(totalWritten, completedEvents);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});