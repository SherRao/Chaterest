//const firebase = require("../../backend/functions/index");
const language = require('@google-cloud/language');
const admin = require('firebase-admin');


const serviceAccount = require('');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
// Instantiates a language service client
const client = new language.LanguageServiceClient();

// Instantiates firestore connection
const firestore = admin.firestore();

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

        // let category = getCategory(message);
        let sentiment = await getSentiment(message);
        

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
async function getSentiment(message) {
    const document = {
        content: message,
        type: 'PLAIN_TEXT',
      };

      const [result] = await client.analyzeSentiment({document: document});
      const sentiment = result.documentSentiment;
    
      console.log(`Text: ${text}`);
      console.log(`Sentiment score: ${sentiment.score}`);
      console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    
    return sentiment;
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