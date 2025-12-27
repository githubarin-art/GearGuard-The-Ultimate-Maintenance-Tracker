const { MaintenanceRequest, Equipment, MaintenanceTeam, TeamMember } = require('../models');

// Generate request number
const generateRequestNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const regex = new RegExp(`^REQ-${year}${month}-`);
  const lastRequest = await MaintenanceRequest.findOne({ requestNumber: { $regex: regex } }).sort({ requestNumber: -1 });

  let sequence = 1;
  if (lastRequest && lastRequest.requestNumber) {
    const parts = lastRequest.requestNumber.split('-');
    const lastSequence = parseInt(parts[2] || '0', 10);
    if (!isNaN(lastSequence)) sequence = lastSequence + 1;
  }

  return `REQ-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const { stage, type, teamId } = req.query;
    const where = {};

    if (stage) where.stage = stage;
    if (type) where.type = type;
    if (teamId) where.teamId = teamId;

    const requests = await MaintenanceRequest.find(where)
      .populate('equipment')
      .populate('team')
      .populate('assignedTo')
      .populate('createdBy')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single request
exports.getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment')
      .populate('team')
      .populate('assignedTo')
      .populate('createdBy');

    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create request with auto-fill logic
exports.createRequest = async (req, res) => {
  try {
    const requestNumber = await generateRequestNumber();

    if (req.body.equipmentId) {
      const equipment = await Equipment.findById(req.body.equipmentId)
        .populate('maintenanceTeam')
        .populate('defaultTechnician');

      if (equipment) {
        if (!req.body.teamId && equipment.maintenanceTeamId) req.body.teamId = equipment.maintenanceTeamId;
        if (!req.body.assignedToId && equipment.defaultTechnicianId) req.body.assignedToId = equipment.defaultTechnicianId;

        await Equipment.findByIdAndUpdate(equipment._id, { status: 'under-maintenance' });
      }
    }

    const request = await MaintenanceRequest.create({ ...req.body, requestNumber });

    const requestWithRelations = await MaintenanceRequest.findById(request._id)
      .populate('equipment')
      .populate('team')
      .populate('assignedTo')
      .populate('createdBy');

    res.status(201).json(requestWithRelations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (req.body.stage) {
      if (req.body.stage === 'repaired') {
        req.body.completedDate = new Date();
        if (request.equipmentId) await Equipment.findByIdAndUpdate(request.equipmentId, { status: 'active' });
      }
      if (req.body.stage === 'scrap') {
        req.body.completedDate = new Date();
        if (request.equipmentId) await Equipment.findByIdAndUpdate(request.equipmentId, { status: 'scrapped' });
      }
    }

    await MaintenanceRequest.findByIdAndUpdate(req.params.id, req.body);

    const updatedRequest = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment')
      .populate('team')
      .populate('assignedTo')
      .populate('createdBy');

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update request stage (for Kanban drag-and-drop)
exports.updateRequestStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    await MaintenanceRequest.findByIdAndUpdate(req.params.id, { stage });

    if (stage === 'repaired' || stage === 'scrap') {
      await MaintenanceRequest.findByIdAndUpdate(req.params.id, { completedDate: new Date() });
      if (request.equipmentId) {
        const newStatus = stage === 'scrap' ? 'scrapped' : 'active';
        await Equipment.findByIdAndUpdate(request.equipmentId, { status: newStatus });
      }
    }

    const updatedRequest = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment')
      .populate('team')
      .populate('assignedTo');

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get calendar events (preventive maintenance)
exports.getCalendarEvents = async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = { type: 'preventive' };

    if (start && end) {
      where.scheduledDate = { $gte: new Date(start), $lte: new Date(end) };
    }

    const requests = await MaintenanceRequest.find(where)
      .populate('equipment')
      .populate('assignedTo');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
