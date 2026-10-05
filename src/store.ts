import { create } from 'zustand';
import type { Trip, ShoppingGoal, Place, Transaction } from './types';
import { db } from './db';

interface Store {
  trip: Trip | null;
  goals: ShoppingGoal[];
  places: Place[];

  // Actions
  initTrip: (tripId: string) => Promise<void>;
  updateGoal: (goal: ShoppingGoal) => Promise<void>;
  addTransaction: (goalId: string, amount: number, notes?: string) => Promise<void>;
  removeTransaction: (goalId: string, transactionId: string) => Promise<void>;
  toggleCategory: (goalId: string, categoryId: string) => Promise<void>;
  updateGoalStatus: (goalId: string, status: ShoppingGoal['status']) => Promise<void>;
  addPlace: (place: Place) => Promise<void>;
  updatePlace: (place: Place) => Promise<void>;
  deletePlace: (placeId: string) => Promise<void>;
  createGoal: (goal: ShoppingGoal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateGoalPlaces: (goalId: string, placeIds: string[]) => Promise<void>;

  // Data export/import
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  trip: null,
  goals: [],
  places: [],

  initTrip: async (tripId: string) => {
    const trip = await db.trips.get(tripId);
    const goals = await db.goals.where('tripId').equals(tripId).toArray();
    const places = await db.places.where('tripId').equals(tripId).toArray();

    set({ trip, goals, places });
  },

  updateGoal: async (goal: ShoppingGoal) => {
    await db.goals.put({ ...goal, updatedAt: Date.now() });
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  addTransaction: async (goalId: string, amount: number, notes?: string) => {
    const goal = await db.goals.get(goalId);
    if (!goal) return;

    const transaction: Transaction = {
      id: `t-${Date.now()}`,
      amount,
      timestamp: Date.now(),
      notes,
    };

    const updatedGoal = {
      ...goal,
      actualCost: goal.actualCost + amount,
      transactions: [...goal.transactions, transaction],
      updatedAt: Date.now(),
    };

    await db.goals.put(updatedGoal);
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  removeTransaction: async (goalId: string, transactionId: string) => {
    const goal = await db.goals.get(goalId);
    if (!goal) return;

    const transaction = goal.transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const updatedGoal = {
      ...goal,
      actualCost: goal.actualCost - transaction.amount,
      transactions: goal.transactions.filter(t => t.id !== transactionId),
      updatedAt: Date.now(),
    };

    await db.goals.put(updatedGoal);
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  toggleCategory: async (goalId: string, categoryId: string) => {
    const goal = await db.goals.get(goalId);
    if (!goal || !goal.categories) return;

    const updatedGoal = {
      ...goal,
      categories: goal.categories.map(cat =>
        cat.id === categoryId ? { ...cat, completed: !cat.completed } : cat
      ),
      updatedAt: Date.now(),
    };

    await db.goals.put(updatedGoal);
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  updateGoalStatus: async (goalId: string, status: ShoppingGoal['status']) => {
    const goal = await db.goals.get(goalId);
    if (!goal) return;

    const updatedGoal = {
      ...goal,
      status,
      completedAt: status === 'completed' ? Date.now() : undefined,
      updatedAt: Date.now(),
    };

    await db.goals.put(updatedGoal);
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  addPlace: async (place: Place) => {
    await db.places.add(place);
    const places = await db.places.where('tripId').equals(place.tripId).toArray();
    set({ places });
  },

  updatePlace: async (place: Place) => {
    await db.places.put(place);
    const places = await db.places.where('tripId').equals(place.tripId).toArray();
    set({ places });
  },

  deletePlace: async (placeId: string) => {
    const place = await db.places.get(placeId);
    if (!place) return;

    await db.places.delete(placeId);

    // Remove from all goals
    const goals = await db.goals.where('tripId').equals(place.tripId).toArray();
    for (const goal of goals) {
      if (goal.places?.includes(placeId)) {
        goal.places = goal.places.filter(p => p !== placeId);
        await db.goals.put(goal);
      }
    }

    const updatedPlaces = await db.places.where('tripId').equals(place.tripId).toArray();
    const updatedGoals = await db.goals.where('tripId').equals(place.tripId).toArray();
    set({ places: updatedPlaces, goals: updatedGoals });
  },

  createGoal: async (goal: ShoppingGoal) => {
    await db.goals.add(goal);
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  deleteGoal: async (goalId: string) => {
    const goal = await db.goals.get(goalId);
    if (!goal) return;

    await db.goals.delete(goalId);
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  updateGoalPlaces: async (goalId: string, placeIds: string[]) => {
    const goal = await db.goals.get(goalId);
    if (!goal) return;

    const updatedGoal = { ...goal, places: placeIds, updatedAt: Date.now() };
    await db.goals.put(updatedGoal);
    const goals = await db.goals.where('tripId').equals(goal.tripId).toArray();
    set({ goals });
  },

  exportData: async () => {
    const trip = get().trip;
    if (!trip) return '';

    const goals = await db.goals.where('tripId').equals(trip.id).toArray();
    const places = await db.places.where('tripId').equals(trip.id).toArray();

    const data = { trip, goals, places };
    return JSON.stringify(data, null, 2);
  },

  importData: async (json: string) => {
    try {
      const data = JSON.parse(json);

      // Clear existing data
      const existingTrip = get().trip;
      if (existingTrip) {
        await db.goals.where('tripId').equals(existingTrip.id).delete();
        await db.places.where('tripId').equals(existingTrip.id).delete();
      }

      // Import new data
      if (data.trip) await db.trips.put(data.trip);
      if (data.goals) await db.goals.bulkAdd(data.goals);
      if (data.places) await db.places.bulkAdd(data.places);

      // Reload
      if (data.trip) {
        const trip = await db.trips.get(data.trip.id);
        const goals = await db.goals.where('tripId').equals(data.trip.id).toArray();
        const places = await db.places.where('tripId').equals(data.trip.id).toArray();
        set({ trip, goals, places });
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  },
}));
