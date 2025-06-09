// store/useRoomFilter.ts
import { create } from "zustand";

type RoomFilter = {
  date: Date;
  category: string;
  numberOfRooms: number;
  bulkBooking: boolean;
  shouldFetch: boolean;
  bulkbookingfetch: boolean;
  setFilters: (filters: Partial<RoomFilter>) => void;
  triggerFetch: () => void;
  triggerBulkBooking: () => void;
};

export const useRoomFilter = create<RoomFilter>((set) => ({
  date: new Date(),
  category: "All Category Rooms",
  numberOfRooms: 0,
  bulkBooking: false,
  shouldFetch: false,
  bulkbookingfetch: false,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  triggerFetch: () => set((state) => ({ shouldFetch: !state.shouldFetch })),
  triggerBulkBooking: () => set((state) => ({ bulkbookingfetch: !state.bulkbookingfetch })),
}));
