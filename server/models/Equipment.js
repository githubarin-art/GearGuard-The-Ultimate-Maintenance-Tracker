const { mongoose } = require('../config/database');
const { Schema } = mongoose;

const EquipmentSchema = new Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  department: { type: String },
  assignedTo: { type: String },
  location: { type: String, required: true },
  purchaseDate: { type: Date },
  warrantyExpiry: { type: Date },
  manufacturer: { type: String },
  model: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'scrapped', 'under-maintenance'], default: 'active' },
  notes: { type: String },
  maintenanceTeamId: { type: Schema.Types.ObjectId, ref: 'MaintenanceTeam' },
  defaultTechnicianId: { type: Schema.Types.ObjectId, ref: 'TeamMember' }
}, { timestamps: true });

EquipmentSchema.virtual('maintenanceTeam', {
  ref: 'MaintenanceTeam',
  localField: 'maintenanceTeamId',
  foreignField: '_id',
  justOne: true
});

EquipmentSchema.virtual('defaultTechnician', {
  ref: 'TeamMember',
  localField: 'defaultTechnicianId',
  foreignField: '_id',
  justOne: true
});

EquipmentSchema.set('toObject', { virtuals: true });
EquipmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);
