"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

type Room = {
  name: string;
  available: number;
  total: number;
  price: number;
};

export default function RoomDetails() {
  const [rooms, setRooms] = useState<Room[]>([]);
    // const todaysdate = new Date();


  useEffect(() => {
    const fetchRooms = async () => {
      // const newDate = todaysdate.toLocaleDateString("en-CA")
      const roomSnap = await getDocs(collection(db, "room_dates")); // ✅ Correct collection
      const fetchedRooms = roomSnap.docs.map((doc) => doc.data() as Room);
      setRooms(fetchedRooms);
    };

    fetchRooms();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 m-4">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Rooms</h2>
      {JSON.stringify(rooms)}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-2">{room.name}</h3>
            <p className="text-lg font-bold text-gray-600">
              {room.available}
              <span className="text-m font-normal text-gray-500">/{room.total}</span>
            </p>
            <p className="text-blue-500 font-bold text-lg">
              ₹{room.price?.toLocaleString?.()}
              <span className="text-m text-gray-500 font-normal"> / day</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
