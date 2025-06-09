import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

import {
  SoapDispenserDroplet,
  LucideSoapDispenserDroplet,
  Brush,
  AirVentIcon,
  Tv,
  GlassWater,
  PillBottle,
  Bell,
  ParkingCircleIcon,
  ShowerHead,
  Dumbbell,
  BathIcon,
  Coffee,
  Dog,
  HelpCircle // fallback icon
} from "lucide-react";

import { Room } from "./RoomGrid";

// Icon maps
const amenityIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "Soap": SoapDispenserDroplet,
  "Shampoo": LucideSoapDispenserDroplet,
  "Dental Kit": Brush,
  "Parking": ParkingCircleIcon,
  "Swimming Pool": BathIcon,
  "Gym": Dumbbell,
  "Spa": ShowerHead,
  "Breakfast": Coffee,
  "Pet Friendly": Dog,
};

const facilitiesIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "Air-Conditioning": AirVentIcon,
  "Cable TV": Tv,
  "Kettle": PillBottle,
  "Water bottle": GlassWater,
  "Room Service": Bell,
};

export interface roomdatatype {
  category_id: string;
  category: string;
  single_price: number;
  double_price: number;
  triple_price: number;
  quad_price: number;
  pax: number;
  room_size: number;
  tariff: number;
  gst: number;
  people: number;
  days: number;
  images: string[];
  facilities: string[];
  amenities: string[];
}

export default function HomeRoomView({
  room,
  onClose,
}: {
  room: Room;
  onClose: () => void;
}) {
  const [roomdata, setRoomdata] = useState<roomdatatype | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomRef = doc(db, "roomtypes", room.roomCategoryId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          setRoomdata(roomSnap.data() as roomdatatype);
        }
      } catch (err) {
        console.error("Failed to fetch room:", err);
      }
    };

    fetchRoom();
  }, [room.roomCategoryId]);

  if (!roomdata) {
    return (
      <div className="flex justify-center items-center h-[300px] text-white text-lg">
        Loading room details...
      </div>
    );
  }

  return (
    <div className="bg-black rounded-2xl">
      <div className="w-full mx-auto p-4 shadow-2xl bg-black rounded-2xl border-2 border-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Room Image */}
          <div className="rounded-xl overflow-hidden">
            <Image
              src="/rooms/img1.png"
              alt="Room"
              width={500}
              height={300}
              className="object-cover w-full h-full"
            />
            <div className="flex justify-center mt-2 space-x-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === 0 ? "bg-white" : "bg-gray-700"}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Room Info */}
          <div className="space-y-4 text-white">
            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
              <div>
                <h2 className="text-xl font-semibold">{roomdata.category}</h2>
                <span className="text-lg text-gray-300">{roomdata.room_size} Sq</span>
              </div>
              <button
                onClick={onClose}
                className="text-sm text-red-300 border border-red-400 px-3 py-1 rounded hover:bg-red-950"
              >
                Close
              </button>
            </div>

            {/* Facilities and Amenities */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {(roomdata.facilities ?? []).map((item) => {
                    const Icon = facilitiesIcons[item] ?? HelpCircle;
                    return (
                      <span
                        key={item}
                        className="flex items-center gap-1 px-2 py-1 bg-black border border-white rounded text-sm"
                      >
                        <Icon className="h-4 w-4 text-white" />
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {(roomdata.amenities ?? []).map((item) => {
                    const Icon = amenityIcons[item] ?? HelpCircle;
                    return (
                      <span
                        key={item}
                        className="flex items-center gap-1 px-2 py-1 bg-black border border-white rounded text-sm"
                      >
                        <Icon className="h-4 w-4 text-white" />
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-2 border-white mt-4 text-sm text-center text-white">
                <thead className="bg-gray-800">
                  <tr>
                    {["Single", "Double", "Triple", "Quad", "Pax"].map((head) => (
                      <th key={head} className="px-4 border border-white py-2 font-medium">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border border-white">Rs {roomdata.single_price}</td>
                    <td className="px-4 py-2 border border-white">Rs {roomdata.double_price}</td>
                    <td className="px-4 py-2 border border-white">{roomdata.triple_price ? `Rs ${roomdata.triple_price}` : "N/A"}</td>
                    <td className="px-4 py-2 border border-white">{roomdata.quad_price ? `Rs ${roomdata.quad_price}` : "N/A"}</td>
                    <td className="px-4 py-2 border border-white">Rs {roomdata.pax}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Extras */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Extras</h3>
              <div className="flex flex-wrap gap-2 bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 px-2 py-1 bg-black border border-white rounded text-sm">
                  <span>Tariff Include</span>
                  <div className="w-px h-4 bg-white" />
                  <span>{roomdata.tariff}%</span>
                </div>

                <div className="flex items-center gap-2 px-2 py-1 bg-black border border-white rounded text-sm">
                  <span>GST Include</span>
                  <div className="w-px h-4 bg-white" />
                  <span>{roomdata.gst}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
