const profileEmbed = require('../embeds/eventReport');
const main = require("../index");
const firestore = main.firestore;
const logger = main.logger;
const config = main.config;

let startTime = -1;
let endTime = -1;
let eventName = "an upcoming event";

module.exports = {
    "data": {
        "name": "trackEvent",
        "description": "Used to gather the global sentiment of members over time",
        "default_permission": true,

        "type": 1,
        "options": [
            {
                "name": "name",
                "description": "The name of the event.",
                "type": 1,
                "required": false,
            }, 
        ],
    },

    execute: (client, logger, interaction) => {
        console.log("hey");
        if(startTime != -1) {
            endTime = new Date().getTime();
            
            let timeDifference = getTimeDifference();
            let totalSentiment = getTotalSentiment();
            let averageSentiment = getAverageSentiment(totalSentiment);

            let embed = eventEmbed;
            embed.embed.fields = [
                { name: 'Time Period', value: timeDifference, },
                { name: 'Total Sentiment', value: totalSentiment + " Sentiment", },
                { name: 'Average Sentiment', value: averageSentiment + "Sentiment/Hour", },
            
            ],
            
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {
                    embeds: [embed.embed]
                
                } }
            });

            reset();

        } else {
            startTime = new Date().getTime();
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {content: `Started tracking sentiment globally for ${eventName}!`} }
    
            });

            resetSentiment();
        }
    }
}


/**
 * 
 * Returns a string representation of the time difference.
 * 
 */
function getStringTimeDifference() {
    return "1 Hour";

}

/**
 * 
 * Returns all sentiment recorded from start to stop.
 * 
 */
function getTotalSentiment() {
    let sentiment = firestore.collection('global-sentiment').doc("value");
    return sentiment;

}

function getAverageSentiment(sentiment) {
    const difference = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60; //Get the time difference in hours
    return difference / sentiment;

}

/**
 * 
 * Resets the sentiment stored in Firebase to 0.
 * 
 */
function resetSentiment() {
    try {
        let docRef = firestore.collection('global-sentiment').doc("value");
        docRef.set({value: 0})    
    } catch (error) {
        logger.error("Could not reset sentiment", error)
    }
}

/**
 * 
 * Resets all global values to null.
 * 
 */
function reset() {
    startTime = -1;
    endTime = -1;
    eventName = "an upcoming event";

}