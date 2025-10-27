// "use client"
// import RoomFilters from '@/components/RoomFilters'
// // import RoomGridDummy from '@/components/RoomGridDummy'
// import RoomGrid from '@/components/RoomGrid'
// import React from 'react'

// export default function page() {
//   return (
//     <div>
// <RoomFilters />
// <RoomGrid />
// {/* <RoomGridDummy /> */}
//     </div>
//   )
// }



"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { format } from "date-fns";
import { CalendarDays, Save, RefreshCcw } from "lucide-react";

import { useRouter } from "next/navigation";

export default function DaywiseAdmin() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomsMap, setRoomsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("adminAuth");
    if (!admin) {
      router.push("/login");
    }
  }, [router]);
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
      };
    });
    setRoomTypes(list);
  }

  async function loadDaywise(selectedDate) {
    setLoading(true);
    try {
      const docRef = doc(db, "daywise", selectedDate);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        const defaultMap = {};
        roomTypes.forEach((rt) => {
          defaultMap[rt.id] = { allowed: 2, booked: 0, available: true };
        });
        setRoomsMap(defaultMap);
        return;
      }
      const data = snap.data();
      const map = {};
      roomTypes.forEach((rt) => {
        const r = data?.rooms ? data.rooms[rt.id] : undefined;
        if (r) {
          map[rt.id] = {
            allowed: typeof r.allowed === "number" ? r.allowed : 0,
            booked: typeof r.booked === "number" ? r.booked : 0,
            available: typeof r.available === "boolean" ? r.available : false,
          };
        } else map[rt.id] = { allowed: 2, booked: 0, available: true };
      });
      setRoomsMap(map);
    } finally {
      setLoading(false);
    }
  }

  function updateRoomSetting(roomId, patch) {
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
      const existing = await getDoc(docRef);
      if (!existing.exists()) payload["createdAt"] = serverTimestamp();

      await setDoc(docRef, payload, { merge: true });
      alert("Saved for " + date);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-indigo-600" />
          Daywise Availability
        </h1>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <input
            className="border border-gray-300 bg-white rounded-lg p-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            onClick={() => loadDaywise(date)}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4" /> Load
          </button>
        </div>
      </div>

      {/* Calendar Cards */}
      {loading ? (
        <div className="text-center text-gray-600 text-lg mt-10 animate-pulse">
          Loading data...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map((rt) => {
            const meta = roomsMap[rt.id] || { allowed: 2, booked: 0, available: true };
            return (
              <div
                key={rt.id}
                className={`p-5 bg-white border rounded-2xl shadow hover:shadow-md transition relative ${
                  meta.available ? "border-green-200" : "border-gray-300 opacity-70"
                }`}
              >
                {/* Room Header */}
                <div className="flex items-center gap-4">
                  <img
                    src={rt.images?.[0] || "/placeholder.png"}
                    alt={rt.category}
                    className="w-20 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{rt.category}</div>
                    <div className="text-xs text-gray-500">ID: {rt.id}</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-4 flex flex-wrap justify-between items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={meta.available}
                      onChange={(e) => updateRoomSetting(rt.id, { available: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span>Show</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Allowed</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={meta.allowed}
                      onChange={(e) =>
                        updateRoomSetting(rt.id, { allowed: Number(e.target.value) })
                      }
                      className="w-16 border border-gray-300 rounded-md text-center p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div
                    className={`text-sm font-medium px-2 py-1 rounded-md ${
                      meta.booked > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    Booked: {meta.booked ?? 0}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Save Button */}
      <div className="mt-10 flex justify-end">
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition disabled:opacity-60"
          onClick={saveDaywise}
          disabled={loading}
        >
          <Save className="w-5 h-5" /> Save Changes
        </button>
      </div>
    </div>
  );
}
