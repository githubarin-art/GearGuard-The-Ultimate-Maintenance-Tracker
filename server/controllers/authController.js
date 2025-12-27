const { User, TeamMember, MaintenanceTeam } = require('../models');

// Get user by Firebase UID
exports.getUserByFirebaseUid = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    
    const user = await User.findOne({ firebaseUid })
      .populate('team')
      .populate('member');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify team member exists before signup
exports.verifyMember = async (req, res) => {
  try {
    const { teamId, memberId, email } = req.body;
    
    // Check if team exists
    const team = await MaintenanceTeam.findById(teamId);
    if (!team) {
      return res.json({ valid: false, message: 'Team not found' });
    }
    
    if (!team.isActive) {
      return res.json({ valid: false, message: 'Team is not active' });
    }
    
    // Check if member exists in this team
    const member = await TeamMember.findOne({ _id: memberId, teamId });
    if (!member) {
      return res.json({ valid: false, message: 'Member not found in this team' });
    }
    
    if (!member.isActive) {
      return res.json({ valid: false, message: 'Member profile is not active' });
    }
    
    // Check if email matches member email
    if (member.email.toLowerCase() !== email.toLowerCase()) {
      return res.json({ valid: false, message: 'Email does not match member profile' });
    }
    
    // Check if user already exists with this member ID
    const existingUser = await User.findOne({ memberId });
    if (existingUser) {
      return res.json({ valid: false, message: 'This member profile is already linked to an account' });
    }
    
    res.json({ valid: true, memberName: member.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to generate unique manager ID
const generateManagerId = async () => {
  const prefix = 'MGR';
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Get count of admins to generate sequential number
  const count = await User.countDocuments({ role: 'admin' });
  const sequence = String(count + 1).padStart(4, '0');
  
  const managerId = `${prefix}-${year}${month}-${sequence}`;
  
  // Check if ID already exists (just in case)
  const existing = await User.findOne({ managerId });
  if (existing) {
    // If exists, add random suffix
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${managerId}-${randomSuffix}`;
  }
  
  return managerId;
};

// Signup admin
exports.signupAdmin = async (req, res) => {
  try {
    const { firebaseUid, email, name, department } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ firebaseUid }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Generate unique manager ID
    const managerId = await generateManagerId();
    
    const user = await User.create({
      firebaseUid,
      email,
      name,
      role: 'admin',
      managerId,
      department,
      isActive: true
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup team member
exports.signupMember = async (req, res) => {
  try {
    const { firebaseUid, email, name, teamId, memberId } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ firebaseUid }, { email }, { memberId }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists or member profile is already linked' });
    }
    
    // Verify team and member exist
    const team = await MaintenanceTeam.findById(teamId);
    if (!team || !team.isActive) {
      return res.status(400).json({ error: 'Invalid or inactive team' });
    }
    
    const member = await TeamMember.findOne({ _id: memberId, teamId });
    if (!member || !member.isActive) {
      return res.status(400).json({ error: 'Invalid or inactive member profile' });
    }
    
    // Verify email matches
    if (member.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({ error: 'Email does not match member profile' });
    }
    
    const user = await User.create({
      firebaseUid,
      email,
      name,
      role: 'member',
      teamId,
      memberId,
      isActive: true
    });
    
    // Populate team and member for response
    const populatedUser = await User.findById(user._id)
      .populate('team')
      .populate('member');
    
    res.status(201).json(populatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('team')
      .populate('member');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users (admin only endpoint)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('team')
      .populate('member')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deactivated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
