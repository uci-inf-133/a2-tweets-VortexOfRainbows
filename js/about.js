function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	//document.getElementById('firstDate').innerText = tweet_array.length;	
	//document.getElementById('lastDate').innerText = tweet_array.length;	
	//document.getElementsByClassName('completedEvents')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('completedEventsPct')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('completedEvents')[1].innerText = tweet_array.length;
	//document.getElementsByClassName('liveEvents')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('achievements')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('miscellaneous')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('liveEventsPct')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('achievementsPct')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('miscellaneousPct')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('written')[0].innerText = tweet_array.length;
	//document.getElementsByClassName('writtenPct')[0].innerText = tweet_array.length;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});