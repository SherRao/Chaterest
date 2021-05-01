//const firebase = require("../../backend/functions/index");

// Mapping from google cloud category to channel and role in the discord server
let categoryData = {
    "Arts & Entertainment": {
        "channel": "movies",
        "role": "cinephile",

    },

    "tech": {
        "channel": "projects n tech help",
        "role": "techie",

    },
};

/**
 * Executes on message sent in the discord
 */
module.exports = {
    name: "message",
    once: false,

    execute: (client, logger, message) => {
        let server = message.guild;
        let author = message.author.id;
        if (author.bot)
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
    const document = {
        content: message.content,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [classification] = await client.classifyText({ document });
    console.log('Categories:');
    classification.categories.forEach(category => {
        console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
    });
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
function suggestTopicChannel(message, category, sentiment) {


}

/**
 * 
 * Notifies discord users with the role associated with the category
 * 
 */
function notifyPassionateUsers(message, category, sentiment) {


}