//const firebase = require("../../backend/functions/index");

// Stores the associated channel and role for each category.
let categoryData = {
    "anime": {
        "channel": "",
        "role": "",

    },

    "tech": {
        "channel": "",
        "role": "",

    },
};


module.exports = {
    name: "message",
    once: false,

    execute: (client, logger, message) => {
        let server = message.guild;
        let author = message.author.id;
        if(author.bot)
            return;

        let category = getCategory(message);
        let sentiment = getSentiment(message);
        

    }
}


/**
 * 
 * Looks at the message sent and updates the category for other functions to use.
 * 
 */
function getCategory(message) {
    return "Dog";

}

/**
 * 
 * Looks at the message sent and updates the sentiment for other functions to use.
 * 
 */
function getSentiment(message) {
    return 1.0;

}

/**
 * 
 * Looks at the channel the message was sent in and checks if the channel is the correct topic channel.
 * 
 */
function topicChannelTest(message, category, sentiment) {
    

}

/**
 * 
 * Grabs all users that talk about the topic and DMs them about it.
 * 
 */
function suggestTopic(message, category, sentiment) {


}