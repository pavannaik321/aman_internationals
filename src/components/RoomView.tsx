// RoomCard.tsx


import {
    SoapDispenserDroplet,
    LucideSoapDispenserDroplet,
    Brush,
    // AirVentIcon,
    // Tv,
    // GlassWater,
    // PillBottle,
    // Bell,
    // Additional icons for new amenities
    // ParkingCircleIcon,
    // ShowerHead,
    // Dumbbell,
    // BathIcon,
    // Coffee,
    // Dog,
} from "lucide-react";
import {
  MdAcUnit,
  MdTv,
  MdOutlineRoomService,
  MdOutlineLocalDrink,
  MdOutlineLocalCafe,
  MdWifi,
  MdLocalParking,
  MdPool,
  MdFitnessCenter,
  MdSpa,
  MdFreeBreakfast,
  MdOutlinePets,
} from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


const amenityIcons: {
    [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} = {
    "Soap": SoapDispenserDroplet,
    "Shampoo": LucideSoapDispenserDroplet,
    "Dental Kit": Brush,

    // Added amenities
    "Parking": MdLocalParking,
    "Swimming Pool": MdPool,
    "Gym": MdFitnessCenter,
    "Spa": MdSpa,
    "Breakfast": MdFreeBreakfast,
    "Pet Friendly": MdOutlinePets,
};


// List of facilities
const facilitiesIcons: {
    [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
} = {
    "Air-Conditioning": MdAcUnit,
    "Cable TV": MdTv,
    "Kettle": MdOutlineLocalCafe,
    "Water bottle": MdOutlineLocalDrink,
    "Room Service": MdOutlineRoomService,
    "Wi-Fi":MdWifi,
};

interface Room {
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
interface roomdata {
    data : Room
}
// const amineties: string[] = ["Soap", "Shampoo", "Dental Kit"]
// const facilities: string[] = ["Air-Conditioning", "Cable TV", "Kettle", "Water bottle", "Room Service"];


export default function RoomView({data}:roomdata) {

    return (
        <div className="w-full mx-auto p-4 shadow-md rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Room Image */}
                 <div className="rounded-xl overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full h-116"
      >
        {data.images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Room ${idx + 1}`}
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

                {/* Right: Room Info */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold">{data.category}</h2>
                        <span className="text-lg font-medium text-gray-600">{data.room_size} Sq</span>
                    </div>

                    {/* Facilities and Amenities */}
                    <div className="grid grid-cols-2 gap-4 ">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Facilities</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.facilities.map((item) => {
                                    const Icon = facilitiesIcons[item];
                                    return (
                                        <span
                                            key={item}
                                            className="flex items-center gap-1 px-2 py-1 bg-white rounded text-sm"
                                        >
                                            <Icon className="h-4 w-4 text-gray-500" />
                                            {item}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.amenities.map((item) => {
                                    const Icon = amenityIcons[item];
                                    return (
                                        <span
                                            key={item}
                                            className="flex items-center gap-1 px-2 py-1 bg-white rounded text-sm"
                                        >
                                            <Icon className="h-4 w-4 text-gray-500" />
                                            {item}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Pricing Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-2 border-gray-200 mt-4 text-sm text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    {["Single", "Double", "Triple", "Quad", "Pax"].map((head) => (
                                        <th key={head} className="px-4 border border-gray-300 py-2 font-medium">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2 border border-gray-300">Rs {data.single_price==0?"NA":data.single_price}</td>
                                    <td className="px-4 py-2 border border-gray-300">Rs {data.double_price==0?"NA":data.double_price}</td>
                                    <td className="px-4 py-2 border border-gray-300">Rs {data.triple_price==0?"NA":data.triple_price}</td>
                                    <td className="px-4 py-2 border border-gray-300">Rs {data.quad_price==0?"NA":data.quad_price}</td>
                                    <td className="px-4 py-2 border border-gray-300">Rs {data.pax}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Extras */}
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Extras</h3>
                        <div className="flex flex-wrap gap-2 bg-gray-100 p-4 rounded-lg">
                            <div className="flex items-center gap-2 px-2 py-1 bg-white rounded text-sm">
                                <span>Tariff Include</span>

                                {/* Vertical Line */}
                                <div className="w-px h-4 bg-gray-300" />

                                <span>{data.tariff}%</span>
                            </div>

                            <div className="flex items-center gap-2 px-2 py-1 bg-white rounded text-sm">
                                <span>GST Include</span>

                                {/* Vertical Line */}
                                <div className="w-px h-4 bg-gray-300" />

                                <span>{data.gst}%</span>
                            </div>

                            <div className="flex items-center gap-2 px-2 py-1 bg-white rounded text-sm">
                                <span>Tariff Include</span>

                                {/* Vertical Line */}
                                <div className="w-px h-4 bg-gray-300" />

                                <span>{data.tariff}%</span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
