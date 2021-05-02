const profileEmbed = require('../embeds/eventReport');
const main = require("../index");
const timeUtil = require("../util/timeUtils");

const firestore = main.firestore;
const logger = main.logger;
const config = main.config;

let startTime = null;
let endTime = null;
let eventName = "an upcoming event";

module.exports = {
    "data": {
        "name": "trackevent",
        "description": "Used to gather the global sentiment of members over time",
        "default_permission": true,

        "type": 1,
        "options": [
            {
                "name": "name",
                "description": "The name of the event.",
                "type": 3,
                "required": false,
            }, 
        ],
    },

    execute: async (client, logger, interaction) => {
        if(startTime != null) {
            logger.info("Stopping global sentiment tracking!");
            endTime = new Date();
            
            let timeDifference = timeUtil.getDuration(startTime, endTime);
            let totalSentiment = await getTotalSentiment();
            let averageSentiment = getAverageSentiment(totalSentiment);

            let embed = profileEmbed;
            embed.embed.author.icon_url = client.user.displayAvatarURL({ format: "png" });
            embed.embed.fields = [
                { name: 'Event Name:', value: eventName, },
                { name: 'Time Period (HH:MM:SS)', value: timeDifference.toString(), },
                { name: 'Total Sentiment', value: totalSentiment + " Sentiment", },
                { name: 'Average Sentiment', value: averageSentiment + " Sentiment/Hour", },
            
            ],
            
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {
                    embeds: [embed.embed]
                
                } }
            });

            reset();

        } else {
            logger.info("Starting to track global sentiment!");
            startTime = new Date();
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data: {content: `Started tracking sentiment globally for ${eventName}!`} }
    
            });

            if(interaction.data.options.length > 0)
                eventName = interaction.data.options[0].value;

            resetSentiment();
        }
    }
}


/**
 * 
 * Returns all sentiment recorded from start to stop.
 * 
 */
async function getTotalSentiment() {
    let docRef = firestore.collection('global-sentiment').doc("value");
    let doc = await docRef.get();
    let value = doc.data().value;
    
    return value;

}

function getAverageSentiment(sentiment) {
    const hours = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60; //Get the time difference in hours
    return Math.round(sentiment / hours);

}

/**
 * 
 * Resets the sentiment stored in Firebase to 0.
 * 
 */
function resetSentiment() {
    try {
        let docRef = firestore.collection('global-sentiment').doc("value");
        docRef.set({value: 0});

    } catch (error) {
        logger.error("Could not reset sentiment", error);
    }
}

/**
 * 
 * Resets all global values to null.
 * 
 */
function reset() {
    startTime = null;
    endTime = null;
    eventName = "an upcoming event";

}