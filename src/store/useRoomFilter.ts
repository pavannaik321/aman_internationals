// store/useRoomFilter.ts
import { create } from "zustand";

type RoomFilter = {
  date: Date;
  category: string;
  numberOfRooms: number;
  bulkBooking: boolean;
  shouldFetch: boolean;
  setFilters: (filters: Partial<RoomFilter>) => void;
  triggerFetch: () => void;
};

export const useRoomFilter = create<RoomFilter>((set) => ({
  date: new Date(),
  category: "All Category Rooms",
  numberOfRooms: 0,
  bulkBooking: true,
  shouldFetch: false,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  triggerFetch: () => set((state) => ({ shouldFetch: !state.shouldFetch })),
}));
