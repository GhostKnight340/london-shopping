export type GoalType = 'HAUL' | 'ITEM';
export type HaulStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';
export type ItemStatus = 'want' | 'found' | 'bought' | 'skipped';
export type GoalStatus = HaulStatus | ItemStatus;
export type ItemPriority = 'must-buy' | 'want' | 'maybe';

export interface Trip {
  id: string;
  name: string;
  location: string;
  departureDate: string; // ISO date string
  currency: string;
  overallBudget?: number;
}

export interface HaulCategory {
  id: string;
  title: string;
  completed: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  timestamp: number;
  notes?: string;
}

export interface ShoppingGoal {
  id: string;
  tripId: string;
  type: GoalType;
  title: string;
  description?: string;
  status: GoalStatus;
  estimatedCost?: number;
  actualCost: number;
  transactions: Transaction[];
  notes?: string;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;

  // Haul-specific
  categories?: HaulCategory[];
  places?: string[]; // placeIds

  // Item-specific
  priority?: ItemPriority;
  quantity?: number;
  image?: string;
  url?: string;
}

export interface Place {
  id: string;
  tripId: string;
  name: string;
  address?: string;
  area?: string;
  mapsUrl?: string;
  notes?: string;
  createdAt: number;
}
