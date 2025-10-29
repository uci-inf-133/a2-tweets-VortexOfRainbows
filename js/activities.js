function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	var button = document.getElementsByClassName("btn btn-primary")[0];

	// Add a click event listener to the button

	let counts = new Object();
	let dists = new Object();
	let countAdjust = new Object();
	tweet_array.forEach(function (tweet) {
		var type = tweet.activityType;
		if (counts[type] == undefined) {
			counts[type] = 0;
		}
		counts[type]++;
		if (type != "unknown") {
			if (dists[type] == undefined)
				dists[type] = 0;
			if (!isNaN(tweet.distance))
				dists[type] += tweet.distance;
			else {
				if (countAdjust[type] == undefined)
					countAdjust[type] = 1;
				else
					countAdjust[type]++;
			}
		}
	});
	Object.keys(dists).forEach(function (key) {
		dists[key] /= counts[key] - countAdjust[key];
	});
	var bestName = "";
	var best = -1;
	var secondBestName = "";
	var secondBest = -1;
	var thirdBestName = "";
	var thirdBest = -1;
	var longestDistName = "";
	var fourthBest = -1;
	var shortestDistName = "";
	var fifthBest = -1;
	Object.keys(counts).forEach(function (key) {
		if (best < counts[key]) {
			best = counts[key];
			bestName = key;
		}
	});
	Object.keys(counts).forEach(function (key) {
		if (secondBest < counts[key] && key != bestName) {
			secondBest = counts[key];
			secondBestName = key;
		}
	});
	Object.keys(counts).forEach(function (key) {
		if (thirdBest < counts[key] && key != secondBestName && key != bestName) {
			thirdBest = counts[key];
			thirdBestName = key;
		}
	});
	Object.keys(dists).forEach(function (key) {
		if (fourthBest < dists[key] && (key == bestName || key == secondBestName || key == thirdBestName)) {
			fourthBest = dists[key];
			longestDistName = key;
		}
	});
	Object.keys(dists).forEach(function (key) {
		if ((fifthBest > dists[key] || fifthBest == -1) && (key == bestName || key == secondBestName || key == thirdBestName)) {
			fifthBest = dists[key];
			shortestDistName = key;
		}
	});


	//graph of the number of tweets containing each type of activity.
	var i = 0;
	let countDictionary = [];
	Object.keys(dists).forEach(function (key) {
		countDictionary[i++] = { "Activity Type": key, "Number of Tweets": counts[key]};
	});

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": countDictionary
		},
		"mark": "bar",
		"encoding": {
			"x": { "field": "Activity Type", "type": "nominal", "axis": { "labelAngle": 50 } },
			"y": { "field": "Number of Tweets", "type": "quantitative" }
		},
		"autosize": "pad"
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});




	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let superDictionary = [{ "Time (Day)": "Monday", "Distance": 0, "Activity": "bike"}];
	i = 0;
	tweet_array.forEach(function (tweet) {
		var t = tweet.activityType;
		if (t == bestName || t == secondBestName || t == thirdBestName)
			superDictionary[i++] = {
				"Time (Day)": days[tweet.time.getDay()],
				"Distance": tweet.distance,
				"Activity": tweet.activityType,
			};
	});

	//TODO: create the visualizations which group the three most-tweeted activities
	//by the day of the week.
	for (var i = 0; i < 2; ++i) {
		var aggregateType = i == 0 ? "sort" : "mean";
		activity_vis_spec = {
			"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
			"description": "A graph of the number of Tweets containing each type of activity.",
			"data": {
				"values": superDictionary,
			},
			"mark": "point",
			"encoding": {
				"x": {
					"field": "Time (Day)",
					"type": "nominal",
					"scale": { "zero": false }, "axis": { "labelAngle": 50 },
					"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				},
				"y": {
					"aggregate": aggregateType,
					"field": "Distance",
					"type": "quantitative",
					"scale": { "zero": false }
				},
				"color": { "field": "Activity", "type": "nominal" },
				"shape": { "field": "Activity", "type": "nominal" }
			},
			"autosize": "pad"
		};
		var v = i == 0 ? 'distanceVis' : 'distanceVisAggregated';
		vegaEmbed('#' + v, activity_vis_spec, { actions: false });
		document.getElementById(v).hidden = i != 0;
	}
	//Use those visualizations to answer the questions about which activities tended
	//to be longest and when.
	document.getElementById('numberActivities').innerText = 8;	
	document.getElementById('firstMost').innerText = bestName;	
	document.getElementById('secondMost').innerText = secondBestName;	
	document.getElementById('thirdMost').innerText = thirdBestName;	
	document.getElementById('longestActivityType').innerText = longestDistName; // + "(" + fourthBest +")";	
	document.getElementById('shortestActivityType').innerText = shortestDistName; // + "(" + fifthBest + ")";
	document.getElementById('weekdayOrWeekendLonger').innerText = "Sunday"; // + "(" + fifthBest + ")";

	document.getElementById("aggregate").addEventListener("click", function () {
		document.getElementById("aggregate").innerText = document.getElementById('distanceVis').hidden ? "Show means" : "Show all activities";
		document.getElementById('distanceVis').hidden = !document.getElementById('distanceVis').hidden;
		document.getElementById('distanceVisAggregated').hidden = !document.getElementById('distanceVisAggregated').hidden;
	});
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
