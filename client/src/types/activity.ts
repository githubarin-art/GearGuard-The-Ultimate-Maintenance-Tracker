export interface Activity {
  id: string;
  type: 'request_created' | 'request_updated' | 'request_completed' | 'equipment_updated' | 'team_assigned' | 'member_added';
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  metadata?: {
    requestId?: string;
    equipmentId?: string;
    teamId?: string;
    memberId?: string;
    status?: string;
    priority?: string;
  };
}

export interface CreateActivityDto {
  type: Activity['type'];
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  metadata?: Activity['metadata'];
}
