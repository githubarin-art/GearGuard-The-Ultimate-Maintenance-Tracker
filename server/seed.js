const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { connectDatabase, mongoose } = require('./config/database');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const TeamMember = require('./models/TeamMember');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDatabase();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Equipment.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    await TeamMember.deleteMany({});
    await MaintenanceTeam.deleteMany({});
    
    // Create Maintenance Teams
    console.log('👥 Creating maintenance teams...');
    const teams = await MaintenanceTeam.insertMany([
      {
        name: 'Electrical Team',
        description: 'Handles all electrical equipment and systems',
        specialization: 'Electrical Systems',
        isActive: true
      },
      {
        name: 'Mechanical Team',
        description: 'Maintains mechanical equipment and machinery',
        specialization: 'Mechanical Engineering',
        isActive: true
      },
      {
        name: 'HVAC Team',
        description: 'Heating, ventilation, and air conditioning specialists',
        specialization: 'Climate Control',
        isActive: true
      },
      {
        name: 'IT Support',
        description: 'Computer and network equipment maintenance',
        specialization: 'Information Technology',
        isActive: true
      }
    ]);
    console.log(`✓ Created ${teams.length} teams`);

    // Create Team Members
    console.log('👤 Creating team members...');
    const members = await TeamMember.insertMany([
      // Electrical Team
      {
        name: 'John Smith',
        email: 'john.smith@gearguard.com',
        phone: '+1-555-0101',
        role: 'Senior Electrician',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isActive: true,
        teamId: teams[0]._id
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gearguard.com',
        phone: '+1-555-0102',
        role: 'Electrical Engineer',
        avatar: 'https://i.pravatar.cc/150?img=5',
        isActive: true,
        teamId: teams[0]._id
      },
      // Mechanical Team
      {
        name: 'Michael Brown',
        email: 'michael.brown@gearguard.com',
        phone: '+1-555-0103',
        role: 'Lead Mechanic',
        avatar: 'https://i.pravatar.cc/150?img=33',
        isActive: true,
        teamId: teams[1]._id
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@gearguard.com',
        phone: '+1-555-0104',
        role: 'Mechanical Technician',
        avatar: 'https://i.pravatar.cc/150?img=47',
        isActive: true,
        teamId: teams[1]._id
      },
      // HVAC Team
      {
        name: 'David Wilson',
        email: 'david.wilson@gearguard.com',
        phone: '+1-555-0105',
        role: 'HVAC Specialist',
        avatar: 'https://i.pravatar.cc/150?img=15',
        isActive: true,
        teamId: teams[2]._id
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@gearguard.com',
        phone: '+1-555-0106',
        role: 'HVAC Technician',
        avatar: 'https://i.pravatar.cc/150?img=20',
        isActive: true,
        teamId: teams[2]._id
      },
      // IT Support
      {
        name: 'Robert Martinez',
        email: 'robert.martinez@gearguard.com',
        phone: '+1-555-0107',
        role: 'IT Manager',
        avatar: 'https://i.pravatar.cc/150?img=60',
        isActive: true,
        teamId: teams[3]._id
      },
      {
        name: 'Jennifer Taylor',
        email: 'jennifer.taylor@gearguard.com',
        phone: '+1-555-0108',
        role: 'Network Technician',
        avatar: 'https://i.pravatar.cc/150?img=45',
        isActive: true,
        teamId: teams[3]._id
      }
    ]);
    console.log(`✓ Created ${members.length} team members`);

    // Create Equipment
    console.log('🔧 Creating equipment...');
    const equipment = await Equipment.insertMany([
      {
        name: 'Industrial Air Compressor',
        serialNumber: 'AC-2024-001',
        category: 'Mechanical',
        department: 'Production',
        assignedTo: 'Manufacturing Floor A',
        location: 'Building 1, Floor 2',
        purchaseDate: new Date('2023-03-15'),
        warrantyExpiry: new Date('2026-03-15'),
        manufacturer: 'Atlas Copco',
        model: 'GA 75 VSD+',
        status: 'active',
        notes: 'High-efficiency variable speed drive compressor',
        maintenanceTeamId: teams[1]._id,
        defaultTechnicianId: members[2]._id
      },
      {
        name: 'Electrical Generator',
        serialNumber: 'GEN-2024-002',
        category: 'Electrical',
        department: 'Facilities',
        assignedTo: 'Emergency Power',
        location: 'Building 1, Basement',
        purchaseDate: new Date('2022-11-20'),
        warrantyExpiry: new Date('2025-11-20'),
        manufacturer: 'Caterpillar',
        model: 'C15 ACERT',
        status: 'active',
        notes: 'Backup generator for critical systems',
        maintenanceTeamId: teams[0]._id,
        defaultTechnicianId: members[0]._id
      },
      {
        name: 'Central HVAC Unit',
        serialNumber: 'HVAC-2024-003',
        category: 'HVAC',
        department: 'Facilities',
        assignedTo: 'Building Climate Control',
        location: 'Building 1, Roof',
        purchaseDate: new Date('2023-06-10'),
        warrantyExpiry: new Date('2028-06-10'),
        manufacturer: 'Carrier',
        model: 'AquaEdge 23XRV',
        status: 'active',
        notes: 'Water-cooled chiller with magnetic bearings',
        maintenanceTeamId: teams[2]._id,
        defaultTechnicianId: members[4]._id
      },
      {
        name: 'CNC Milling Machine',
        serialNumber: 'CNC-2024-004',
        category: 'Mechanical',
        department: 'Production',
        assignedTo: 'Machining Department',
        location: 'Building 2, Floor 1',
        purchaseDate: new Date('2024-01-15'),
        warrantyExpiry: new Date('2027-01-15'),
        manufacturer: 'Haas',
        model: 'VF-4SS',
        status: 'active',
        notes: 'Super-speed vertical machining center',
        maintenanceTeamId: teams[1]._id,
        defaultTechnicianId: members[3]._id
      },
      {
        name: 'Server Rack System',
        serialNumber: 'SRV-2024-005',
        category: 'IT Equipment',
        department: 'IT',
        assignedTo: 'Data Center',
        location: 'Building 1, Server Room',
        purchaseDate: new Date('2023-09-01'),
        warrantyExpiry: new Date('2026-09-01'),
        manufacturer: 'Dell',
        model: 'PowerEdge R750',
        status: 'active',
        notes: 'Main application server with redundant power',
        maintenanceTeamId: teams[3]._id,
        defaultTechnicianId: members[6]._id
      },
      {
        name: 'Hydraulic Press',
        serialNumber: 'HP-2024-006',
        category: 'Mechanical',
        department: 'Production',
        assignedTo: 'Stamping Department',
        location: 'Building 2, Floor 2',
        purchaseDate: new Date('2022-05-20'),
        warrantyExpiry: new Date('2025-05-20'),
        manufacturer: 'Schuler',
        model: 'SMG 800',
        status: 'under-maintenance',
        notes: 'Servo mechanical press - currently undergoing preventive maintenance',
        maintenanceTeamId: teams[1]._id,
        defaultTechnicianId: members[2]._id
      },
      {
        name: 'Overhead Crane',
        serialNumber: 'CRN-2024-007',
        category: 'Mechanical',
        department: 'Warehouse',
        assignedTo: 'Loading Bay',
        location: 'Building 3, Main Bay',
        purchaseDate: new Date('2021-08-10'),
        warrantyExpiry: new Date('2024-08-10'),
        manufacturer: 'Konecranes',
        model: 'CXT NEO',
        status: 'active',
        notes: 'Electric overhead traveling crane, 20-ton capacity',
        maintenanceTeamId: teams[1]._id,
        defaultTechnicianId: members[3]._id
      },
      {
        name: 'Network Switch',
        serialNumber: 'NSW-2024-008',
        category: 'IT Equipment',
        department: 'IT',
        assignedTo: 'Main Network',
        location: 'Building 1, Network Closet',
        purchaseDate: new Date('2024-02-01'),
        warrantyExpiry: new Date('2029-02-01'),
        manufacturer: 'Cisco',
        model: 'Catalyst 9300',
        status: 'active',
        notes: '48-port gigabit switch with PoE+',
        maintenanceTeamId: teams[3]._id,
        defaultTechnicianId: members[7]._id
      }
    ]);
    console.log(`✓ Created ${equipment.length} equipment items`);

    // Create Maintenance Requests
    console.log('📋 Creating maintenance requests...');
    const requests = await MaintenanceRequest.insertMany([
      {
        requestNumber: 'REQ-2024-001',
        subject: 'Hydraulic Press Preventive Maintenance',
        description: 'Scheduled quarterly maintenance: oil change, filter replacement, pressure testing, and safety system check',
        type: 'preventive',
        stage: 'in-progress',
        priority: 'high',
        scheduledDate: new Date('2024-12-28'),
        duration: 8,
        cost: 1500,
        notes: 'All parts ordered and received. Maintenance started on schedule.',
        equipmentId: equipment[5]._id,
        teamId: teams[1]._id,
        assignedToId: members[2]._id,
        createdById: members[3]._id
      },
      {
        requestNumber: 'REQ-2024-002',
        subject: 'Generator Cooling System Leak',
        description: 'Coolant leak detected in the radiator. Requires immediate inspection and repair to prevent overheating.',
        type: 'corrective',
        stage: 'new',
        priority: 'urgent',
        scheduledDate: new Date('2024-12-27'),
        notes: 'Emergency repair needed. Generator on standby mode.',
        equipmentId: equipment[1]._id,
        teamId: teams[0]._id,
        assignedToId: members[0]._id,
        createdById: members[1]._id
      },
      {
        requestNumber: 'REQ-2024-003',
        subject: 'HVAC Annual Inspection',
        description: 'Annual preventive maintenance: filter replacement, refrigerant check, coil cleaning, and control system calibration',
        type: 'preventive',
        stage: 'repaired',
        priority: 'medium',
        scheduledDate: new Date('2024-12-15'),
        completedDate: new Date('2024-12-16'),
        duration: 6,
        cost: 2200,
        notes: 'All systems checked and functioning optimally. Replaced air filters and recalibrated sensors.',
        equipmentId: equipment[2]._id,
        teamId: teams[2]._id,
        assignedToId: members[4]._id,
        createdById: members[5]._id
      },
      {
        requestNumber: 'REQ-2024-004',
        subject: 'CNC Machine Spindle Noise',
        description: 'Unusual noise from spindle during high-speed operation. Possible bearing wear.',
        type: 'corrective',
        stage: 'in-progress',
        priority: 'high',
        scheduledDate: new Date('2024-12-29'),
        duration: 12,
        cost: 3500,
        notes: 'Spindle bearings ordered. Will require machine downtime for replacement.',
        equipmentId: equipment[3]._id,
        teamId: teams[1]._id,
        assignedToId: members[3]._id,
        createdById: members[2]._id
      },
      {
        requestNumber: 'REQ-2024-005',
        subject: 'Server Cooling Fan Failure',
        description: 'One of the redundant cooling fans failed. System still operational but needs replacement ASAP.',
        type: 'corrective',
        stage: 'new',
        priority: 'high',
        scheduledDate: new Date('2024-12-28'),
        notes: 'Replacement fan in stock. Scheduled for evening maintenance window.',
        equipmentId: equipment[4]._id,
        teamId: teams[3]._id,
        assignedToId: members[6]._id,
        createdById: members[7]._id
      },
      {
        requestNumber: 'REQ-2024-006',
        subject: 'Air Compressor Routine Service',
        description: 'Monthly preventive maintenance: check oil level, drain moisture, inspect belts, and test safety valves',
        type: 'preventive',
        stage: 'repaired',
        priority: 'low',
        scheduledDate: new Date('2024-12-10'),
        completedDate: new Date('2024-12-10'),
        duration: 2,
        cost: 450,
        notes: 'Routine maintenance completed. All systems normal.',
        equipmentId: equipment[0]._id,
        teamId: teams[1]._id,
        assignedToId: members[2]._id,
        createdById: members[2]._id
      },
      {
        requestNumber: 'REQ-2024-007',
        subject: 'Crane Limit Switch Calibration',
        description: 'Safety limit switches need recalibration as per annual safety inspection requirements',
        type: 'preventive',
        stage: 'new',
        priority: 'medium',
        scheduledDate: new Date('2024-12-30'),
        notes: 'Coordinating with production schedule to minimize downtime',
        equipmentId: equipment[6]._id,
        teamId: teams[1]._id,
        assignedToId: members[3]._id,
        createdById: members[2]._id
      },
      {
        requestNumber: 'REQ-2024-008',
        subject: 'Network Switch Port Failure',
        description: 'Ports 12-15 not responding. May require firmware update or hardware replacement.',
        type: 'corrective',
        stage: 'in-progress',
        priority: 'medium',
        scheduledDate: new Date('2024-12-27'),
        duration: 3,
        cost: 800,
        notes: 'Firmware update attempted, issue persists. Investigating hardware fault.',
        equipmentId: equipment[7]._id,
        teamId: teams[3]._id,
        assignedToId: members[7]._id,
        createdById: members[6]._id
      },
      {
        requestNumber: 'REQ-2024-009',
        subject: 'Generator Battery Replacement',
        description: 'Backup batteries showing reduced capacity. Replacement recommended before failure.',
        type: 'preventive',
        stage: 'new',
        priority: 'medium',
        scheduledDate: new Date('2024-12-31'),
        cost: 1200,
        notes: 'Batteries ordered. Waiting for delivery.',
        equipmentId: equipment[1]._id,
        teamId: teams[0]._id,
        assignedToId: members[1]._id,
        createdById: members[0]._id
      },
      {
        requestNumber: 'REQ-2024-010',
        subject: 'HVAC Thermostat Malfunction',
        description: 'Temperature sensor giving incorrect readings causing inefficient cooling cycles',
        type: 'corrective',
        stage: 'repaired',
        priority: 'low',
        scheduledDate: new Date('2024-12-20'),
        completedDate: new Date('2024-12-21'),
        duration: 1,
        cost: 250,
        notes: 'Thermostat sensor replaced and recalibrated. System operating normally.',
        equipmentId: equipment[2]._id,
        teamId: teams[2]._id,
        assignedToId: members[5]._id,
        createdById: members[4]._id
      }
    ]);
    console.log(`✓ Created ${requests.length} maintenance requests`);

    // Summary
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Teams: ${teams.length}`);
    console.log(`   Members: ${members.length}`);
    console.log(`   Equipment: ${equipment.length}`);
    console.log(`   Maintenance Requests: ${requests.length}`);
    console.log('\n🎉 Your database is now populated with comprehensive sample data!');
    console.log('   You can now test the application and verify data storage.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed script
seedDatabase();
