const { connectDatabase } = require('../config/database');
const Equipment = require('./Equipment');
const MaintenanceTeam = require('./MaintenanceTeam');
const TeamMember = require('./TeamMember');
const MaintenanceRequest = require('./MaintenanceRequest');
const User = require('./User');

const syncDatabase = async () => {
  try {
    await connectDatabase();

    // Ensure indexes (best-effort)
    try {
      await Promise.all([
        Equipment.createIndexes ? Equipment.createIndexes() : Promise.resolve(),
        MaintenanceTeam.createIndexes ? MaintenanceTeam.createIndexes() : Promise.resolve(),
        TeamMember.createIndexes ? TeamMember.createIndexes() : Promise.resolve(),
        MaintenanceRequest.createIndexes ? MaintenanceRequest.createIndexes() : Promise.resolve(),
        User.createIndexes ? User.createIndexes() : Promise.resolve()
      ]);
    } catch (idxErr) {
      // ignore index creation errors
    }

    console.log('✓ MongoDB connected and models are ready.');
  } catch (error) {
    console.error('✗ Unable to initialize MongoDB:', error);
    throw error;
  }
};

module.exports = {
  syncDatabase,
  Equipment,
  MaintenanceTeam,
  TeamMember,
  MaintenanceRequest,
  User
};
