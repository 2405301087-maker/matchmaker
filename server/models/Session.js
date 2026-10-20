import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  participants: [{
    socketId: String,
    nickname: String,
    identity: String,
    joinedAt: { type: Date, default: Date.now }
  }],
  preference: {
    type: String,
    default: 'everyone'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  messageCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'skipped'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);
