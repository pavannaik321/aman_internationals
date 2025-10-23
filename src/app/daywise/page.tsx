"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
//   updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig"; // your firebase init
import { format } from "date-fns";

type RoomType = {
  id: string;
  category: string;
  images?: string[];
};

type DaywiseRoomsMap = Record<
  string,
  {
    allowed: number;
    booked?: number;
    available: boolean;
  }
>;

export default function DaywiseAdmin() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState<string>(today);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomsMap, setRoomsMap] = useState<DaywiseRoomsMap>({}); // roomTypeId -> meta
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (roomTypes.length) loadDaywise(date);
  }, [roomTypes, date]);

  async function fetchRoomTypes() {
    const q = await getDocs(collection(db, "roomtypes"));
    const list = q.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        category: data.category,
        images: data.images,
      } as RoomType;
    });
    setRoomTypes(list);
  }

  async function loadDaywise(selectedDate: string) {
    setLoading(true);
    try {
      const docRef = doc(db, "daywise", selectedDate);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        // default: show all room types available with allowed = 2
        const defaultMap: DaywiseRoomsMap = {};
        roomTypes.forEach((rt) => {
          defaultMap[rt.id] = { allowed: 2, booked: 0, available: true };
        });
        setRoomsMap(defaultMap);
        return;
      }
      const data = snap.data() as { rooms?: Record<string, { allowed?: number; booked?: number; available?: boolean }> } | undefined;
      const map: DaywiseRoomsMap = {};
      roomTypes.forEach((rt) => {
        const r = data && data.rooms ? data.rooms[rt.id] : undefined;
        if (r) {
          map[rt.id] = {
            allowed: typeof r.allowed === "number" ? r.allowed : 0,
            booked: typeof r.booked === "number" ? r.booked : 0,
            available: typeof r.available === "boolean" ? r.available : false,
          };
        }
        else map[rt.id] = { allowed: 2, booked: 0, available: true };
      });
      setRoomsMap(map);
    } finally {
      setLoading(false);
    }
  }

  function updateRoomSetting(roomId: string, patch: Partial<{ allowed: number; available: boolean }>) {
    setRoomsMap((prev) => ({ ...prev, [roomId]: { ...prev[roomId], ...patch } }));
  }

  async function saveDaywise() {
    setLoading(true);
    try {
      const docRef = doc(db, "daywise", date);
      const payload = {
        rooms: roomsMap,
        updatedAt: serverTimestamp(),
      };
      // If not exists we add createdAt too
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        (payload as Record<string, unknown>)["createdAt"] = serverTimestamp();
      }

      await setDoc(docRef, payload, { merge: true });
      alert("Saved for " + date);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Daywise Availability Manager</h1>

      <div className="flex items-center gap-3 mb-4">
        <label className="font-medium">Date:</label>
        <input
          className="border rounded p-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="ml-4 bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={() => loadDaywise(date)}
          disabled={loading}
        >
          Load
        </button>
      </div>

      <div className="grid gap-4">
        {roomTypes.map((rt) => {
          const meta = roomsMap[rt.id] || { allowed: 2, booked: 0, available: true };
          return (
            <div key={rt.id} className="p-4 border rounded flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={rt.images?.[0] || "/placeholder.png"} alt={rt.category} className="w-20 h-14 object-cover rounded" />
                <div>
                  <div className="font-medium">{rt.category}</div>
                  <div className="text-sm text-muted-foreground">{rt.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm">Show</label>
                <input
                  type="checkbox"
                  checked={meta.available}
                  onChange={(e) => updateRoomSetting(rt.id, { available: e.target.checked })}
                />

                <div className="flex items-center gap-2">
                  <label className="text-sm">Allowed</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={meta.allowed}
                    onChange={(e) => updateRoomSetting(rt.id, { allowed: Number(e.target.value) })}
                    className="w-16 p-1 border rounded text-center"
                  />
                </div>

                <div className="text-sm text-gray-600">Booked: {meta.booked ?? 0}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={saveDaywise}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
}
