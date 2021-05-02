//const firebase = require("../../backend/functions/index");

const { TeamMember } = require("discord.js");
// const { auth } = require("firebase-admin");
const main = require("../index");
const language = main.language;
const firestore = main.firestore;
const logger = main.logger;
const config = main.config;

/**
 * 
 * Executes on message sent in the discord
 * 
 */
module.exports = {

    name: "message",

    once: false,

    execute: async (client, logger, message) => {
        try {
            const server = message.guild;
            const author = message.author
            const authorId = author.id;
            const member = message.guild.members.cache.get(authorId);
            if (author.bot)//|| typeof(author.bot) == "undefined")
                return;

            const docRef = firestore.collection('users').doc(authorId);
            let category = await getCategory(message);

            if (category && category.categories) {
                const mainCategory = category.categories[0]
                const mainCategoryName = filterSubCategories(category.categories[0]);
                let sentiment = await getSentiment(message);

                if (sentiment && sentiment.score > 0) {
                    logger.info("Updating sentiment for user", authorId, "in category ", mainCategoryName)
                    let userDoc = await docRef.get();
                    let user = userDoc.data();

                    //creates the user if it does not already exist and sets its data to empty
                    if (!user) {
                        docRef.set({})
                        userDoc = await docRef.get();
                        user = userDoc.data()
                    }

                    const categorySentiment = user ? user[mainCategoryName] : null;
                    await docRef.set({
                        ...user,
                        [mainCategoryName]: categorySentiment ? categorySentiment + 1 : 1
                    });
                    //must happen after just in case the category isn't created till later
                    setUserRoleForPassion(member, mainCategory, server)
                    suggestTopicChannel(message, mainCategory)
                    notifyPassionateUsers(mainCategory, server)

                } else {
                    logger.warn("Not high enough sentiment", sentiment);
                }
            } else {
                logger.warn("No categories found for message: ", message)
            }

        } catch (error) {
            console.error(error);
        }
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
    const [classification] = await language.classifyText({ document });
    // console.log('Categories:');
    classification.categories.forEach(category => {
        // console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);

    });

    return classification;
}


/**
 * 
 * Looks at the message sent and updates the sentiment for other functions to use.
 * 
 */
async function getSentiment(message) {
    const document = {
        content: message.content,
        type: 'PLAIN_TEXT',
    };

    const [result] = await language.analyzeSentiment({ document: document });
    const sentiment = result.documentSentiment;

    // console.log(`Text: ${message}`);
    // console.log(`Sentiment score: ${sentiment.score}`);
    // console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

    return sentiment;
}


/**
 * 
 * Returns the Firebase user associated with the given Discord UID.
 * 
 */
async function getUser(uid) {
    const docRef = firestore.collection('users').doc(uid);
    const userDocument = await docRef.get();
    const user = userDocument.data();
    // console.log("Retrieved user:", user)
    return user ? user : null;
}


/**
 * 
 * Returns the sentiment for a specified user and a specific category.
 * 
 */
async function getUserSentiment(uid, category) {
    const user = await getUser(uid);
    if (user[filterSubCategories(category)])
        return user[filterSubCategories(category)];

    return null;
}


/**
 * 
 * Looks at the channel the message was sent in and checks if the channel is the correct topic channel.
 * Takes a single category
 * Consider changing this so several messages in a row must be sent pertaining to the same 
 * topic before sending the "consider changing channels" message
 * 
 */
function suggestTopicChannel(message, category) {
    const categoryName = category.name;
    const channel = message.channel;
    const destinationChannel = config.CategoriesChannelMap[filterSubCategories(category)]

    if (channel.name != destinationChannel.name) {
        channel.send(destinationChannel.suggestionMessage)
    }
}


/**
 * maps subcategories to the larger category
 * example: /Computers & Electronics/Hardware/etc -> /Computers & Electronics
 * example: /Science/Computer Science -> /Science/Computer Science
 * if it is not a subcategory, returns itself
 * @param {*} category 
 * @returns a string that is the key to a CategoriesChannelMap
 * 
 */
function filterSubCategories(category) {
    const ChannelMap = config.CategoriesChannelMap;
    return Object.keys(ChannelMap).filter((name) => { return category.name.includes(name) })[0]
}


/**
 * 
 * Notifies discord users with the role associated with the category
 * 
 */
function notifyPassionateUsers(category, server) {
    const channelMap = config.CategoriesChannelMap;
    const topic = channelMap[filterSubCategories(category)]
    const channelId = topic.channel

    const channel = server.channels.cache.get(channelId)
    const lastMessage = channel.messages.cache.get(1);   //Since the message that we just received is the 0'th message, we gotta get the message before it, which is the 1'th message
    const thisMessage = channel.lastMessage;            //Gets the message that was just sent

    console.log(lastMessage.content);
    console.log(thisMessage.content);
    const timeDifference = thisMessage.createdTimestamp - lastMessage.createdTimestamp;

    if (timeDifference >= config.notification_cooldown)
        channel.send(topic.notifyDiscussionMessage)
}


/**
 * 
 * Set role based on user sentiment
 * on message, when sentiment exceeds threshold, automatically set role
 * 
 */
async function setUserRoleForPassion(user, category, server) {
    const sentiment = await getUserSentiment(user.id, category)
    if (sentiment >= config.thresholds.passionate) {
        const topic = config.CategoriesChannelMap[filterSubCategories(category)]
        const role = server.roles.cache.get(topic.role)
        user.roles.add(role)
        logger.info(`user: ${user.id} was given the role: ${role}`)
    }
}