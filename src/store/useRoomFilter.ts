// store/useRoomFilter.ts
import { create } from "zustand";

type RoomFilter = {
  date: Date;

  category: string;
  numberOfRooms: number;
  bulkBooking: boolean;
  setFilters: (filters: Partial<RoomFilter>) => void;
};

export const useRoomFilter = create<RoomFilter>((set) => ({
  date: new Date(),
  category: "All Category Rooms",
  numberOfRooms: 0,
  bulkBooking: true,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));
