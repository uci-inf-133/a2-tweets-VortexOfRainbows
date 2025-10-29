var tweet_array;
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	tweet_array = runkeeper_tweets.map(function (tweet) {
		//TODO: Filter to just the written tweets
		return new Tweet(tweet.text, tweet.created_at);
	});
	tweet_array = tweet_array.filter(function (tweet) {
		return tweet.written;
	});
}
function addEventHandlerForSearch() {
	var searchString = document.getElementById('textFilter').value;
	var total = 0;
	if (tweet_array != undefined && searchString != '') {
		tweet_array.forEach(function (tweet) {
			if (tweet.written && tweet.writtenText.includes(searchString))
				total++;
		});
	}
	document.getElementById('searchCount').innerText = total;
	document.getElementById('searchText').innerText = searchString;
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	const input = document.getElementById("textFilter");
	input.addEventListener("keyup", function () {
		addEventHandlerForSearch();
	});
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});