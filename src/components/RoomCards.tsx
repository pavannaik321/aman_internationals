"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export interface Room {
  id: string;
  category_id: string;
  room_size:string;
  category: string;
  single_price: number;
  double_price:number;
  triple_price:number;
  quad_price:number;
  pax:number;
  tariff:number;
  gst:number;
  people: number;
  days: number;
  images: string[];
  facilities: string[];
  amenities:string[];
}

export default function RoomCards() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  // ✅ Fetch rooms from Firestore
  const fetchRooms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "roomtypes"));
      const roomList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          category_id: data.category_id ?? "",
          room_size:data.room_size??0,
          category: data.category ?? "",
          single_price: data.single_price ?? 0,
          double_price: data.double_price ?? 0,
          triple_price: data.triple_price ?? 0,
          quad_price: data.quad_price ?? 0,
          pax:data.pax??500,
          tariff:data.tariff??12,
          gst:data.gst??18,
          people: data.people ?? 2,
          days: data.days ?? 1,
          images: data.images ?? [],
          facilities: data.facilities ?? [],
          amenities:data.amenities??[]
        };
      });
      setRooms(roomList);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      {rooms.map((room, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Image */}
          <Image
            width={300}
            height={200}
            src={"/rooms/img1.png"}
            alt={room.category}
            className="w-full md:w-72 h-48 md:h-auto object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none p-4"
          />

          {/* Details */}
          <div className="flex flex-col justify-between flex-1 p-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{room.category}</h2>
              <div className="flex flex-wrap gap-2 text-sm">
                {room.facilities.map((feature, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded-lg text-gray-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price + Button */}
          <div className="flex flex-col justify-between items-start p-4 min-w-[180px] text-left bg-gray-100">
            <div>
              <p className="text-lg font-bold text-black">Rs {room.single_price}</p>
              <p className="text-sm text-gray-700">
                for {room.people} adults | {room.days} night
              </p>
              <p className="text-sm text-gray-500">+ Rs 500 taxes and charges</p>
            </div>
 <button
  onClick={() => {
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    router.push(`/editrooms`);
  }}
  className="mt-4 bg-gray-800 text-white py-2 px-6 rounded-md font-semibold cursor-pointer"
>
  Edit Room
</button>

          </div>
        </div>
      ))}
    </div>
  );
}
