export interface NavItem {
    name: string;
    icon: string;
    id: string;
  }
  
  export interface PhishingAlert {
    id: string;
    url: string;
    timestamp: string;
    threatLevel: 'high' | 'medium' | 'low' | 'safe';
    status: 'blocked' | 'warned' | 'allowed' | 'pending';
  }
  
  export interface SecurityStatus {
    level: 'secure' | 'warning' | 'danger';
    lastScan: string;
    threatsBlocked: number;
    protectionActive: boolean;
  }