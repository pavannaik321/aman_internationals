"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export default function OverviewStats() {
  const [stats, setStats] = useState([
    { label: "Today's", value: 0, subLabel: "Check-in" },
    { label: "Today's", value: 0, subLabel: "Check-out" },
    { label: "Total", value: 0, subLabel: "In hotel" },
    { label: "Total", value: 0, subLabel: "Available room" },
    { label: "Total", value: 0, subLabel: "Occupied room" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date();
      const yyyyMMdd = today.toISOString().split("T")[0]; // e.g., 2025-06-09

      let todayCheckIn = 0;
      let todayCheckOut = 0;
      let currentlyInHotel = 0;

      try {
        // Step 1: Read today's bookings from room_dates collection
        const todayDoc = await getDoc(doc(db, "room_dates", yyyyMMdd));
        if (todayDoc.exists()) {
          const data = todayDoc.data();
          const bookings = data.bookings || [];

          for (const b of bookings) {
            const checkinDate = b.checkintime?.toDate?.();
            const checkoutDate = b.checkouttime?.toDate?.();
            const checkinstatus = b.checkinstatus;

            if (checkinDate?.toDateString() === today.toDateString()) todayCheckIn++;
            if (checkoutDate?.toDateString() === today.toDateString()) todayCheckOut++;
            if (checkinstatus) currentlyInHotel++;
          }
        }

        // Step 2: Read available and total rooms
        let totalRooms = 0;
        let availableRooms = 0;

        const roomsSnap = await getDocs(collection(db, "roomtypes"));
        roomsSnap.forEach((doc) => {
          const room = doc.data();
          totalRooms += room.total || 0;
          availableRooms += room.available || 0;
        });

        setStats([
          { label: "Today's", value: todayCheckIn, subLabel: "Check-in" },
          { label: "Today's", value: todayCheckOut, subLabel: "Check-out" },
          { label: "Total", value: currentlyInHotel, subLabel: "In hotel" },
          { label: "Total", value: availableRooms, subLabel: "Available room" },
          { label: "Total", value: totalRooms - availableRooms, subLabel: "Occupied room" },
        ]);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 m-4">
      
      <h2 className="text-lg font-medium text-gray-800 mb-4">Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
        {stats.map((item, index) => (
          <div key={index} className="flex flex-row justify-start items-end gap-4">
            <div className="text-start">
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-m text-gray-600">{item.subLabel}</p>
            </div>
            <p className="text-2xl font-semibold text-blue-500 mb-0">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
