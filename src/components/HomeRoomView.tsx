// RoomCard.tsx
import Image from "next/image";

import {
  SoapDispenserDroplet,
  LucideSoapDispenserDroplet,
  Brush,
  AirVentIcon,
  Tv,
  GlassWater,
  PillBottle,
  Bell
} from "lucide-react"; // You can add more from https://lucide.dev/icons

// amenities icons
const amenityIcons: {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} = {
  "Soap": SoapDispenserDroplet,
  "Shampoo": LucideSoapDispenserDroplet,
  "Dental Kit": Brush,
};

// List of facilities
const facilitiesIcons: {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} = {
  "Air-Conditioning": AirVentIcon,
  "Cable TV": Tv,
  "Kettle": PillBottle,
  "Water bottle": GlassWater,
  "Room Service": Bell,
};

const amineties: string[] = ["Soap", "Shampoo", "Dental Kit"]
const facilities: string[] = ["Air-Conditioning", "Cable TV", "Kettle", "Water bottle", "Room Service"];



 interface Room {
  number: number;
  type: string;
  status: RoomStatus;
}
type RoomStatus = 'available' | 'booked' | 'booked_not_checked_in';
export default function HomeRoomView({
  room,
  onClose,
}: {
  room: Room;
  onClose: () => void;
}) {
  // use `room` to customize the UI dynamically
  return (
    <div className="">

      {/* rest of your RoomView component content stays here */}
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
                  <h2 className="text-xl font-semibold">{room.type} {room.number}</h2>
                  <span className="text-lg font-medium text-gray-300">310 Sq</span>
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
                    {facilities.map((item) => {
                      const Icon = facilitiesIcons[item];
                      return (
                        <span
                          key={item}
                          className="flex items-center gap-1 px-2 py-1 bg-black border border-white rounded text-sm text-white"
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
                    {amineties.map((item) => {
                      const Icon = amenityIcons[item];
                      return (
                        <span
                          key={item}
                          className="flex items-center gap-1 px-2 py-1 bg-black border border-white rounded text-sm text-white"
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
                      <td className="px-4 py-2 border border-white">Rs 2,800</td>
                      <td className="px-4 py-2 border border-white">Rs 3,360</td>
                      <td className="px-4 py-2 border border-white text-gray-500">N/A</td>
                      <td className="px-4 py-2 border border-white text-gray-500">N/A</td>
                      <td className="px-4 py-2 border border-white">Rs 500</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Extras */}
              <div className="mt-4">
                <h3 className="font-medium mb-2">Extras</h3>
                <div className="flex flex-wrap gap-2 bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 px-2 py-1 bg-black border border-white rounded text-sm text-white">
                    <span>Tariff Include</span>
                    <div className="w-px h-4 bg-white" />
                    <span>12%</span>
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1 bg-black border border-white rounded text-sm text-white">
                    <span>GST Include</span>
                    <div className="w-px h-4 bg-white" />
                    <span>18%</span>
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1 bg-black border border-white rounded text-sm text-white">
                    <span>Tariff Include</span>
                    <div className="w-px h-4 bg-white" />
                    <span>12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
