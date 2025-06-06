"use client";
import { useRoomFilter } from "@/store/useRoomFilter";
import { useState } from "react";

import HomeRoomView from "./HomeRoomView";
import BookingConfirmation from "./BookUsers";
import CustomerCard from "./ViewCustomer";

const roomData: {
  date: Date;
  rooms: {
    category: string;
    rooms: Room[];
  }[];
} = {
  date: new Date(),
  rooms: [
    {
      category: "STANDARD A/C",
      rooms: [
        {
          number: 301,
          type: "STANDARD A/C",
          status: "booked",
          customerData: {
            name: "Arjun Rao",
            phone: "9876543210",
            idProof: "ID12345",
            checkInTime: "14:00",
            checkOutTime: "12:00",
            totalAmount: 2000,
            paidAmount: 2000,
            bookingDate: new Date(),
          },
        },
        { number: 302, type: "STANDARD A/C", status: "available" },
        {
          number: 303,
          type: "STANDARD A/C",
          status: "booked",
          customerData: {
            name: "Neha Singh",
            phone: "9988776655",
            idProof: "ID23456",
            checkInTime: "13:30",
            checkOutTime: "11:00",
            totalAmount: 2200,
            paidAmount: 1200,
            bookingDate: new Date(),
          },
        },
        { number: 304, type: "STANDARD A/C", status: "available" },
        {
          number: 305,
          type: "STANDARD A/C",
          status: "booked",
          customerData: {
            name: "Ravi Kumar",
            phone: "9123456789",
            idProof: "ID34567",
            checkInTime: "15:00",
            checkOutTime: "11:30",
            totalAmount: 2500,
            paidAmount: 2500,
            bookingDate: new Date(),
          },
        },
        {
          number: 306,
          type: "STANDARD A/C",
          status: "booked_not_checked_in",
          customerData: {
            name: "Aditi Verma",
            phone: "9090909090",
            idProof: "ID45678",
            checkInTime: "12:30",
            checkOutTime: "10:30",
            totalAmount: 2100,
            paidAmount: 1000,
            bookingDate: new Date(),
          },
        },
        { number: 307, type: "STANDARD A/C", status: "available" },
        { number: 308, type: "STANDARD A/C", status: "available" },
        {
          number: 416,
          type: "STANDARD A/C",
          status: "booked",
          customerData: {
            name: "Sahil Khan",
            phone: "9009009001",
            idProof: "ID56789",
            checkInTime: "16:00",
            checkOutTime: "10:00",
            totalAmount: 1800,
            paidAmount: 1800,
            bookingDate: new Date(),
          },
        },
      ],
    },
    {
      category: "SUITE/ CLUB A/C",
      rooms: [
        { number: 309, type: "SUITE A/C", status: "available" },
        {
          number: 311,
          type: "SUITE A/C",
          status: "booked",
          customerData: {
            name: "Priya Das",
            phone: "8888777766",
            idProof: "ID67890",
            checkInTime: "14:30",
            checkOutTime: "12:00",
            totalAmount: 3000,
            paidAmount: 1500,
            bookingDate: new Date(),
          },
        },
        {
          number: 409,
          type: "SUITE A/C",
          status: "booked",
          customerData: {
            name: "Manish Patel",
            phone: "9111222333",
            idProof: "ID78901",
            checkInTime: "13:00",
            checkOutTime: "11:00",
            totalAmount: 3200,
            paidAmount: 3200,
            bookingDate: new Date(),
          },
        },
        { number: 310, type: "CLUB A/C", status: "available" },
        { number: 312, type: "CLUB A/C", status: "available" },
        { number: 318, type: "CLUB A/C", status: "available" },
        {
          number: 319,
          type: "CLUB A/C",
          status: "booked",
          customerData: {
            name: "Karan Mehta",
            phone: "9303030303",
            idProof: "ID89012",
            checkInTime: "17:00",
            checkOutTime: "10:00",
            totalAmount: 2800,
            paidAmount: 1800,
            bookingDate: new Date(),
          },
        },
        {
          number: 407,
          type: "CLUB A/C",
          status: "booked",
          customerData: {
            name: "Nikita Sharma",
            phone: "9505050505",
            idProof: "ID90123",
            checkInTime: "12:00",
            checkOutTime: "11:00",
            totalAmount: 2700,
            paidAmount: 2700,
            bookingDate: new Date(),
          },
        },
        { number: 410, type: "CLUB A/C", status: "available" },
      ],
    },
    {
      category: "STANDARD PLUS",
      rooms: [
        {
          number: 314,
          type: "STANDARD PLUS",
          status: "booked",
          customerData: {
            name: "Shreya Jain",
            phone: "9333333333",
            idProof: "ID11223",
            checkInTime: "15:00",
            checkOutTime: "12:00",
            totalAmount: 5000,
            paidAmount: 4000,
            bookingDate: new Date(),
          },
        },
        { number: 315, type: "STANDARD PLUS", status: "available" },
         {
          number: 316,
          type: "STANDARD PLUS",
          status: "booked",
          customerData: {
            name: "Shreya Jain",
            phone: "9333333333",
            idProof: "ID11223",
            checkInTime: "15:00",
            checkOutTime: "12:00",
            totalAmount: 5000,
            paidAmount: 4000,
            bookingDate: new Date(),
          },
        },
                {
          number: 411,
          type: "STANDARD PLUS",
          status: "booked",
          customerData: {
            name: "Deepak Joshi",
            phone: "9444444444",
            idProof: "ID33445",
            checkInTime: "13:00",
            checkOutTime: "10:00",
            totalAmount: 1500,
            paidAmount: 1000,
            bookingDate: new Date(),
          },
        },
                {
          number: 412,
          type: "STANDARD PLUS",
          status: "booked",
          customerData: {
            name: "Deepak Joshi",
            phone: "9444444444",
            idProof: "ID33445",
            checkInTime: "13:00",
            checkOutTime: "10:00",
            totalAmount: 1500,
            paidAmount: 1000,
            bookingDate: new Date(),
          },
        },
                {
          number: 413,
          type: "STANDARD PLUS",
          status: "booked",
          customerData: {
            name: "Deepak Joshi",
            phone: "9444444444",
            idProof: "ID33445",
            checkInTime: "13:00",
            checkOutTime: "10:00",
            totalAmount: 1500,
            paidAmount: 1000,
            bookingDate: new Date(),
          },
        },
      ],
    },
    {
      category: "STANDARD NON A/C",
      rooms: [
        {
          number: 401,
          type: "STANDARD NON A/C",
          status: "booked",
          customerData: {
            name: "Deepak Joshi",
            phone: "9444444444",
            idProof: "ID33445",
            checkInTime: "13:00",
            checkOutTime: "10:00",
            totalAmount: 1500,
            paidAmount: 1000,
            bookingDate: new Date(),
          },
        },
        { number: 402, type: "STANDARD NON A/C", status: "available" },
        {
          number: 403,
          type: "STANDARD NON A/C",
          status: "booked",
          customerData: {
            name: "Rashmi Rao",
            phone: "9666666666",
            idProof: "ID44556",
            checkInTime: "14:00",
            checkOutTime: "10:30",
            totalAmount: 1700,
            paidAmount: 1700,
            bookingDate: new Date(),
          },
        },
        { number: 404, type: "STANDARD NON A/C", status: "available" },
        {
          number: 405,
          type: "STANDARD NON A/C",
          status: "booked",
          customerData: {
            name: "Aman Kapoor",
            phone: "9777777777",
            idProof: "ID55667",
            checkInTime: "15:00",
            checkOutTime: "11:00",
            totalAmount: 1600,
            paidAmount: 1600,
            bookingDate: new Date(),
          },
        },
        {
          number: 406,
          type: "STANDARD NON A/C",
          status: "booked",
          customerData: {
            name: "Ishita Roy",
            phone: "9888888888",
            idProof: "ID66778",
            checkInTime: "12:30",
            checkOutTime: "11:00",
            totalAmount: 1800,
            paidAmount: 800,
            bookingDate: new Date(),
          },
        },
      ],
    },
  ],
};

type RoomStatus = 'available' | 'booked' | 'booked_not_checked_in';
const statusColor: Record<RoomStatus, string> = {
  available: "bg-green-400",
  booked: "bg-red-400",
  booked_not_checked_in: "bg-cyan-400",
};

interface Room {
  number: number;
  type: string;
  status: RoomStatus;
  customerData? : CustomerInfo
}

interface CustomerInfo {
  name: string;
  phone: string;
  idProof: string;
  checkInTime: string;
  checkOutTime: string;
  totalAmount: number;
  paidAmount: number;
  bookingDate: Date;
}


export default function RoomGrid() {
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookRoom, setBookRoom] = useState<Room | null>(null);
  const [selectedUser,setSelectedUser] = useState<Room | null>(null);

  const { category } = useRoomFilter();
const filteredRooms = roomData.rooms.filter((group) => {
  const categoryMatch =
    category.toLowerCase() === "all category rooms" || // fix here
    group.category.toLowerCase() === category.toLowerCase();

  return categoryMatch;
});

    if (filteredRooms.length === 0) {
  return <div className="p-6 text-red-600">No rooms found for the selected filters.</div>;
}
  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {filteredRooms.map((group, idx) => (
        <div key={idx}>
          <h2 className="text-center font-bold text-gray-800 mb-4">{group.category}</h2>
          <div className="flex flex-col gap-4">
            {group.rooms.map((room) => (
              <div
                key={room.number}
                className="border rounded-md p-2 shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded text-white font-bold flex items-center justify-center ${statusColor[room.status]}`}
                >
                  {room.number}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{room.type}</p>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setSelectedRoom(room)} className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
                      View Room
                    </button>
                    {room.status === "available" && (
                      <button onClick={() => setBookRoom(room)} className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
                        Book Room
                      </button>
                    )}
                    {room.status === "booked" && (
                      <button onClick={() => setSelectedUser(room)} className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
                        View Customer
                      </button>
                    )}
                    {room.status === "booked_not_checked_in" && (
                      <button className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
                        Check-in
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Room Details View Below */}
      {selectedRoom && (
        <div
          className="mt-14 absolute pr-6"
        // style={{ boxShadow: '0 0 100px 30px rgba(0, 0, 0, 0.5)' }}
        >

          <HomeRoomView room={selectedRoom} onClose={() => setSelectedRoom(null)} />
        </div>
      )}
      {/* Book Room View Below */}
      {bookRoom && (
        <div
          className="absolute pr-6 left-1/2 transform -translate-x-1/2"
        // style={{ boxShadow: '0 0 100px 30px rgba(0, 0, 0, 0.5)' }}
        >

          <BookingConfirmation room={
            bookRoom
          } onClose={() => setBookRoom(null)} />
        </div>
      )}
      {/* View Customer View Below */}
      {selectedUser?.customerData && (
        <div
          className="absolute pr-6 left-1/2 transform -translate-x-1/2"
        // style={{ boxShadow: '0 0 100px 30px rgba(0, 0, 0, 0.5)' }}
        >

          <CustomerCard customer={
            selectedUser.customerData
          } date={new Date()} onClose={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  );
}
