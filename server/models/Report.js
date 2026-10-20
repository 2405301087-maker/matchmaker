import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporterNickname: {
    type: String,
    default: 'Anonymous'
  },
  reportedNickname: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    default: 'Inappropriate behavior or violation of community standards'
  },
  details: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Report || mongoose.model('Report', reportSchema);
