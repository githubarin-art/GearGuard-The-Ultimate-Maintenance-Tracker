const { mongoose } = require('../config/database');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], required: true },
  managerId: { type: String, unique: true, sparse: true }, // Unique ID for admins/managers
  department: { type: String }, // For admins
  teamId: { type: Schema.Types.ObjectId, ref: 'MaintenanceTeam' }, // For members
  memberId: { type: Schema.Types.ObjectId, ref: 'TeamMember' }, // Links to existing team member
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual to populate team
UserSchema.virtual('team', {
  ref: 'MaintenanceTeam',
  localField: 'teamId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate member
UserSchema.virtual('member', {
  ref: 'TeamMember',
  localField: 'memberId',
  foreignField: '_id',
  justOne: true
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
