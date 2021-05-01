//const firebase = require("../../backend/functions/index");
const language = require('@google-cloud/language');
const admin = require('firebase-admin');


const serviceAccount = require('../keys/ruhacks-2021-312420-d51b97cbf0b9.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
// Instantiates a language service client
const client = new language.LanguageServiceClient();

// Instantiates firestore connection
const firestore = admin.firestore();

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
    execute: async (client, logger, message) => {

        let server = message.guild;
        let author = message.author.id;
        const docRef = firestore.collection('users').doc(author);

        if (author.bot)
            return;

        // let category = getCategory(message);
        let sentiment = await getSentiment(message);
        let category = await getCategory(message);

        await docRef.set({
            sentimentTest: 5
          });
    },
}


/**
 * 
 * Looks at the message sent and updates the category for other functions to use.
 * 
 */
async function getCategory(message) {
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
async function getSentiment(message) {
    const document = {
        content: message,
        type: 'PLAIN_TEXT',
      };

      const [result] = await client.analyzeSentiment({document: document});
      const sentiment = result.documentSentiment;
    
      console.log(`Text: ${message}`);
      console.log(`Sentiment score: ${sentiment.score}`);
      console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    
    return sentiment;
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