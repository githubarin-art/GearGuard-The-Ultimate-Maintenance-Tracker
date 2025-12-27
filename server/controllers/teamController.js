const { MaintenanceTeam, TeamMember } = require('../models');

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find()
      .populate('members')
      .sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single team
exports.getTeamById = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id).populate('members');
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
