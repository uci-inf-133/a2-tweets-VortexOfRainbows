class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed a ") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        if (this.text.includes("right now")) {
            return "live_event";
        }
        if (this.text.startsWith("Achieved")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return !this.text.includes("with @Runkeeper. Check it out!");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        var endOfWrittenSection = this.text.indexOf("https://t.co");
        var startOfWrittenSection = this.text.indexOf(" - ");
        if (startOfWrittenSection < 0)
            startOfWrittenSection = 0;
        if (endOfWrittenSection < 0)
            endOfWrittenSection = 0;
        return this.text.substring(startOfWrittenSection, endOfWrittenSection);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        if (this.text.includes(" walk "))
            return "walk";
        if (this.text.includes(" run "))
            return "run";
        if (this.text.includes(" bike "))
            return "bike";
        if (this.text.includes(" row "))
            return "row";
        if (this.text.includes(" workout "))
            return "workout";
        //if (this.text.includes(" elliptical workout "))
        //    return "elliptical";
        if (this.text.includes(" skate "))
            return "skate";
        if (this.text.includes(" swim "))
            return "swim";
        return "other";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        var isKM = true;
        var start = "Just posted a ".length;
        if (this.text.startsWith("Just completed a ")) {
            start = "Just completed a ".length;
        }
        var end = this.text.indexOf(" km ");
        if (end < 0) {
            isKM = false;
            end = this.text.indexOf(" mi ");
        }
        var sub = this.text.substring(start, end);
        var dist = parseInt(sub);
        if (isKM)
            dist /= 1.609;
        if (isNaN(dist))
            return NaN;
        return dist;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}