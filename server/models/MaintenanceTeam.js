const { mongoose } = require('../config/database');
const { Schema } = mongoose;

const MaintenanceTeamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  specialization: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

MaintenanceTeamSchema.virtual('members', {
  ref: 'TeamMember',
  localField: '_id',
  foreignField: 'teamId'
});

MaintenanceTeamSchema.set('toObject', { virtuals: true });
MaintenanceTeamSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('MaintenanceTeam', MaintenanceTeamSchema);
