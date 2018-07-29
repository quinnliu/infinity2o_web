const requireLogin = require("../middlewares/requireLogin");
const mongoose = require("mongoose");
const ConversationCollection = mongoose.model("conversations");
const UserCollection = mongoose.model("users");
const amqp = require("amqplib/callback_api");
const keys = require("../config/keys");

const getMatchesInfo = async mongoDBUserIds => {
	let matchesInfo = [];
	for (let mongoDBUserId of mongoDBUserIds) {
		const user = await UserCollection.findById(mongoDBUserId);

		if (user !== null) {
			matchesInfo.push({
				name: user.profile.name,
				age: user.profile.age,
				linkedInPublicProfileUrl: user.profile.linkedInPublicProfileUrl,
				githubPublicProfileUrl: user.profile.githubPublicProfileUrl,
				interests: user.profile.interests,
				timeZone: user.profile.timeZone,
				totalUserVotes: user.profile.asks.totalUserVotes,
				availability: user.profile.availability,
				asks: user.profile.asks,
				id: user._id,
				imageUrl: user.profile.imageUrl
			});
		}
	}
	return matchesInfo;
};

const generateUniqueUID = () => {
	return (
		Math.random().toString() +
		Math.random().toString() +
		Math.random().toString()
	);
};

module.exports = app => {
	app.get("/api/matches", requireLogin, async (request, response) => {
		// formats the request string into an array
		const mongoDBUserId = request.query.mongoDBUserId;
		// get user's Match Ids
		const userInDB = await UserCollection.findOne({ _id: mongoDBUserId });
		const userMatches = userInDB.matches;
		let mongoDBMatchIds = [];
		for (let i = 0; i < userMatches.length; i++) {
			mongoDBMatchIds.push(userMatches[i]["id"]);
		}
		let matchesInfo = await getMatchesInfo(mongoDBMatchIds);
		response.send(matchesInfo);
	});

	app.post(
		"/api/matches/start_conversation",
		requireLogin,
		async (request, response) => {
			const { matchId, matchName } = request.body;

			const userId = request.user._id;
			const userName = request.user.profile.name;
			// sets new conversation document to conversation variable
			const conversation = new ConversationCollection({
				user1: { name: userName, id: userId },
				user2: { name: matchName, id: matchId },
				last50Messages: []
			});

			// finds userConversationList && matchConversationList
			const userInDB = await UserCollection.findOne({ _id: userId });
			let userConversationList = userInDB.conversations.userConversations;
			// console.log('userConversationList = ', userConversationList);
			const matchInDB = await UserCollection.findOne({ _id: matchId });
			let matchConversationList = matchInDB.conversations.userConversations;
			// console.log('matchConversationList = ', matchConversationList);

			try {
				const conversationInDB = await conversation.save();
				// console.log('conversationInDB = ', conversationInDB);
				userConversationList.push({
					conversationId: conversationInDB._id,
					matchName: matchName,
					matchId: matchId,
					isOnline: false,
					socketId: null
				});
				await UserCollection.updateOne(
					{ _id: userId },
					{ $set: { "conversations.userConversations": userConversationList } },
					{ upsert: true }
				);
				matchConversationList.push({
					conversationId: conversationInDB._id,
					matchName: userName,
					matchId: userId,
					isOnline: false,
					socketId: null
				});

				await UserCollection.updateOne(
					{ _id: matchId },
					{
						$set: { "conversations.userConversations": matchConversationList }
					},
					{ upsert: true }
				);
				response.send("done");
			} catch (error) {
				response.status(422).send(error);
			}
		}
	);

	app.put("/api/matches/seen", requireLogin, async (request, response) => {
		const { userId, matchId } = request.body;
		const userInDB = await UserCollection.findOne({ _id: userId });
		let userInDBMatches = userInDB.matches;
		for (let i = 0; i < userInDBMatches.length; i++) {
			if (String(userInDBMatches[i]["id"]) === matchId) {
				userInDBMatches[i]["seen"] = true;
			}
		}

		await UserCollection.updateOne(
			{ _id: userId },
			{ $set: { matches: userInDBMatches } }
		);

		response.send("done");
	});

	app.delete(
		"/api/matches/delete_match",
		requireLogin,
		async (request, response) => {
			const { matchId } = request.body;
			const userId = mongoose.Types.ObjectId(request.user._id);
			const matchMongoDBUserId = mongoose.Types.ObjectId(matchId);
			try {
				// https://stackoverflow.com/questions/16959099/how-to-remove-array-element-in-mongodb
				// deletes match from user's matches
				await UserCollection.update(
					{ _id: userId },
					{ $pull: { matches: { id: matchMongoDBUserId } } }
				);
				// deletes user from match's matches
				await UserCollection.findOneAndUpdate(
					{ _id: matchId },
					{ $pull: { matches: { id: userId } } }
				);
				response.send("successful");
			} catch (error) {
				response.status(422).send(error);
			}
		}
	);

	app.post("/api/matches/initial", requireLogin, async (request, response) => {
		// send message to Athena server to run Athena
		// for a specific user
		const { mongoDBUserId } = request.body;
		const URL = "amqp://infinity2o:2134711@52.4.101.52:5672";
		await amqp.connect(URL, function(error, connection) {
			connection.createChannel(function(error, channel) {
				let sendToQueueName = "run_athena_for_new_user_queue";
				channel.assertQueue("", { exclusive: true }, function(
					error,
					replyToQueueObject
				) {
					const correlationId = generateUniqueUID();

					console.log(
						" [x] Requesting Athena matches for mongoDBUserId=%s",
						mongoDBUserId
					);

					channel.consume(
						replyToQueueObject.queue,
						function(messageFromServer) {
							if (messageFromServer.properties.correlationId == correlationId) {
								const mongoDBUserIdFromAthenaServer = messageFromServer.content.toString();
								console.log(
									" [.] Got messageFromServer=%s",
									mongoDBUserIdFromAthenaServer
								);

								if (mongoDBUserIdFromAthenaServer !== null) {
									response.send(mongoDBUserIdFromAthenaServer);
								} else {
									response.status(422).send("ERROR: Athena ran unsuccessfully");
								}
								setTimeout(function() {
									connection.close();
								}, 500);
							}
						},
						{ noAck: true }
					);

					const mongoDBUserId_serverEnvironment =
						mongoDBUserId + " " + keys.serverEnvironment;
					channel.sendToQueue(
						sendToQueueName,
						new Buffer(mongoDBUserId_serverEnvironment),
						{
							correlationId: correlationId,
							replyTo: replyToQueueObject.queue
						}
					);
				});
			});
		});
	});
};
