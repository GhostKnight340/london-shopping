import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Trip, ShoppingGoal, Place } from './types';

export class LondonDB extends Dexie {
  trips!: Table<Trip>;
  goals!: Table<ShoppingGoal>;
  places!: Table<Place>;

  constructor() {
    super('london-shopping');
    this.version(1).stores({
      trips: 'id',
      goals: 'id, tripId',
      places: 'id, tripId',
    });
  }
}

export const db = new LondonDB();

export async function initializeDB() {
  const existingTrip = await db.trips.toCollection().first();

  if (existingTrip) {
    return existingTrip.id;
  }

  const tripId = 'london-2026-10';
  const now = Date.now();

  const trip: Trip = {
    id: tripId,
    name: 'London Shopping',
    location: 'London',
    departureDate: '2026-10-14',
    currency: 'GBP',
  };

  await db.trips.add(trip);

  // Seed data
  const places: Place[] = [
    { id: 'p-japan-centre', tripId, name: 'Japan Centre', address: 'Piccadilly', area: 'West End', mapsUrl: 'https://maps.google.com/?q=Japan+Centre+London', notes: 'Japanese food and snacks', createdAt: now },
    { id: 'p-tesco', tripId, name: 'Tesco', area: 'Multiple locations', notes: 'UK supermarket chain', createdAt: now },
    { id: 'p-sainsburys', tripId, name: "Sainsbury's", area: 'Multiple locations', notes: 'UK supermarket chain', createdAt: now },
    { id: 'p-waitrose', tripId, name: 'Waitrose', area: 'Multiple locations', notes: 'Premium UK supermarket', createdAt: now },
    { id: 'p-ms', tripId, name: 'M&S', area: 'Multiple locations', notes: 'Marks & Spencer - food and clothing', createdAt: now },
    { id: 'p-asda', tripId, name: 'Asda', area: 'Multiple locations', notes: 'UK supermarket chain', createdAt: now },
    { id: 'p-morrisons', tripId, name: 'Morrisons', area: 'Multiple locations', notes: 'UK supermarket chain', createdAt: now },
    { id: 'p-korean', tripId, name: 'Korean Supermarket', area: 'To be confirmed', notes: 'Korean groceries and snacks', createdAt: now },
  ];

  await db.places.bulkAdd(places);

  const goals: ShoppingGoal[] = [
    {
      id: 'goal-japan-centre',
      tripId,
      type: 'HAUL',
      title: 'Japan Centre Haul',
      description: 'Build a large mixed Japanese food and snack haul from Japan Centre',
      status: 'not-started',
      estimatedCost: 50,
      actualCost: 0,
      transactions: [],
      places: ['p-japan-centre'],
      categories: [
        { id: 'cat-1', title: 'Sweet snacks', completed: false },
        { id: 'cat-2', title: 'Salty / savoury snacks', completed: false },
        { id: 'cat-3', title: 'Drinks', completed: false },
        { id: 'cat-4', title: 'Cooking / pantry items', completed: false },
      ],
      notes: 'Examples: Kewpie mayo, miso paste, unusual Kit Kats',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'goal-uk-snacks',
      tripId,
      type: 'HAUL',
      title: 'UK Snack Haul',
      description: 'Build a large mixed UK snack haul from various supermarkets',
      status: 'not-started',
      estimatedCost: 40,
      actualCost: 0,
      transactions: [],
      places: ['p-tesco', 'p-sainsburys', 'p-waitrose', 'p-ms', 'p-asda', 'p-morrisons'],
      categories: [
        { id: 'cat-5', title: 'Sweet snacks', completed: false },
        { id: 'cat-6', title: 'Salty snacks', completed: false },
        { id: 'cat-7', title: 'Biscuits', completed: false },
        { id: 'cat-8', title: 'Chocolate / confectionery', completed: false },
        { id: 'cat-9', title: 'Drinks', completed: false },
        { id: 'cat-10', title: 'Interesting UK-only products', completed: false },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'goal-korean-supermarket',
      tripId,
      type: 'HAUL',
      title: 'Korean Supermarket Haul',
      description: 'Build a mixed Korean snack and food haul',
      status: 'not-started',
      estimatedCost: 35,
      actualCost: 0,
      transactions: [],
      places: ['p-korean'],
      categories: [
        { id: 'cat-11', title: 'Sweet snacks', completed: false },
        { id: 'cat-12', title: 'Salty snacks', completed: false },
        { id: 'cat-13', title: 'Drinks', completed: false },
        { id: 'cat-14', title: 'Instant food (noodles, etc)', completed: false },
        { id: 'cat-15', title: 'Cooking / pantry items', completed: false },
        { id: 'cat-16', title: 'Interesting Korean products', completed: false },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.goals.bulkAdd(goals);

  return tripId;
}
