export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  department?: string;
  assignedTo?: string;
  location: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  manufacturer?: string;
  model?: string;
  status: 'active' | 'inactive' | 'scrapped' | 'under-maintenance';
  notes?: string;
  maintenanceTeamId?: string;
  maintenanceTeam?: MaintenanceTeam;
  defaultTechnicianId?: string;
  defaultTechnician?: TeamMember;
  openRequestsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description?: string;
  specialization?: string;
  isActive: boolean;
  members?: TeamMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  isActive: boolean;
  teamId?: string;
  team?: MaintenanceTeam;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceRequest {
  id: string;
  requestNumber: string;
  subject: string;
  description?: string;
  type: 'corrective' | 'preventive';
  stage: 'new' | 'in-progress' | 'repaired' | 'scrap';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  completedDate?: string;
  duration?: number;
  cost?: number;
  notes?: string;
  equipmentId?: string;
  equipment?: Equipment;
  teamId?: string;
  team?: MaintenanceTeam;
  assignedToId?: string;
  assignedTo?: TeamMember;
  createdById?: string;
  createdBy?: TeamMember;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEquipmentDto {
  name: string;
  serialNumber: string;
  category: string;
  department?: string;
  assignedTo?: string;
  location: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  manufacturer?: string;
  model?: string;
  status?: string;
  notes?: string;
  maintenanceTeamId?: string;
  defaultTechnicianId?: string;
}

export interface CreateMaintenanceRequestDto {
  subject: string;
  description?: string;
  type: 'corrective' | 'preventive';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  equipmentId?: string;
  teamId?: string;
  assignedToId?: string;
  createdById?: string;
}

// User roles
export type UserRole = 'admin' | 'member';

// User interface for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  managerId?: string; // Unique ID for admin/manager
  department?: string;
  teamId?: string;
  team?: MaintenanceTeam;
  memberId?: string; // Links to TeamMember for team members
  member?: TeamMember;
  firebaseUid: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Login/Signup DTOs
export interface AdminSignupDto {
  email: string;
  password: string;
  name: string;
  department: string;
}

export interface MemberSignupDto {
  email: string;
  password: string;
  name: string;
  teamId: string;
  memberId: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export * from './activity';
