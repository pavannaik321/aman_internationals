"use client"
import Image from "next/image";
import { useRouter } from 'next/navigation';
const roomData: {
    category_id: string;
    category: string;
    price: number;
    people: number;
    days: number;
    images: string[];
    filters: string[];
}[] = [

        {
            category_id: "ofnotiinsonannv",
            category: "SUITE",
            price: 7200,
            people: 2,
            days: 1,
            images: ["/rooms/img1.png"],
            filters: [
                "Air-Conditioning",
                "Cable TV",
                "Kettle",
                "Water bottle",
                "Room Service",
                "Mini Bar",
                "Bathtub",
                "Private Balcony"
            ]
        },
        {
            category_id: "ofnotiinsonannv",
            category: "CLUB",
            price: 5800,
            people: 2,
            days: 1,
            images: ["/rooms/img1.png"],
            filters: [
                "Air-Conditioning",
                "Cable TV",
                "Kettle",
                "Water bottle",
                "Room Service",
                "Work Desk"
            ]
        },
        {
            category_id: "ofnotiinsonannv",
            category: "Standard Plus A/C",
            price: 4000,
            people: 2,
            days: 1,
            images: ["/rooms/img1.png"],
            filters: [
                "Air-Conditioning",
                "Cable TV",
                "Kettle",
                "Water bottle",
                "Room Service"
            ]
        },
        {
            category_id: "ofnotiinsonannv",
            category: "Standard A/C",
            price: 3360,
            people: 2,
            days: 1,
            images: ["/rooms/img1.png"],
            filters: [
                "Air-Conditioning",
                "Cable TV",
                "Kettle",
                "Water bottle",
                "Room Service"
            ]
        },
        {
            category_id: "ofnotiinsonannv",
            category: "Standard Non A/C",
            price: 2800,
            people: 2,
            days: 1,
            images: ["/rooms/img1.png"],
            filters: [
                "Cable TV",
                "Kettle",
                "Water bottle",
                "Room Service"
            ]
        }
    ];

export default function RoomCards() {
      const router = useRouter();


    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
            {roomData.map((rooms, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden"
                >
                    {/* Image */}
                    <Image
                        width={300}
                        height={200}
                        src={rooms.images[0]}
                        alt="Room"
                        className="w-full md:w-72 h-48 md:h-auto object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none p-4"
                    />

                    {/* Details */}
                    <div className="flex flex-col justify-between flex-1 p-4">
                        {/* Title and Features */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                {rooms.category}
                            </h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {rooms.filters.map((feature, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded-lg text-gray-700"
                                    >
                                        {/* Optional: Replace with icons */}
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price + Button */}
                    <div className="flex flex-col justify-between items-start p-4 min-w-[180px] text-left bg-gray-100">
                        <div>
                            <p className="text-lg font-bold text-black">Rs {rooms.price}</p>
                            <p className="text-sm text-gray-700">for {rooms.people} adults | {rooms.days} night</p>
                            <p className="text-sm text-gray-500">
                                + Rs 500 is taxes and charges
                            </p>
                        </div>
                        <button
                        onClick={()=> router.push(`/editrooms?category=${encodeURIComponent(rooms.category_id)}&price=${rooms.price}`)}
                         className="mt-4 bg-gray-800 text-white py-2 px-6 rounded-md font-semibold">
                            Edit Room
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
