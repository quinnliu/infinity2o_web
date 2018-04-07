const mongoose = require('mongoose');
const { Schema } = mongoose; // = const Schema = mongoose.Schema;

const userConversationSchema = new Schema({
	conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
	matchName: String,
	matchId: { type: Schema.Types.ObjectId, ref: 'User' },
	isOnline: Boolean,
	socketId: String
});

module.exports = userConversationSchema;