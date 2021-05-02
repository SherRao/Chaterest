const profileEmbed = require('../embeds/eventReport');

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
        if(startTime != -1) {
            endTime = new Date().getTime();
            
            let timeDifference = getTimeDifference();
            let totalSentiment = getTotalSentiment();
            let averageSentiment = getAverageSentiment();

            let embed = eventEmbed;
            embed.embed.fields = [
                { name: 'Time Period', value: timeDifference, },
                { name: 'Total Sentiment', value: totalSentiment, },
                { name: 'Average Sentiment', value: averageSentiment, },
            
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

        }
    }

}


/**
 * 
 * Returns a string representation of the time difference.
 * 
 */
function getTimeDifference() {
    //return endTime - startTime
    return "1 Hour";

}

function reset() {
    startTime = -1;
    endTime = -1;
    eventName = "an upcoming event";

}