
"use client";

import { useState } from "react";

// import BookingConfirmation from "@/components/BookingConfirmation";
interface Room {
  number: number;
  type: string;
  status: RoomStatus;
}
type RoomStatus = 'available' | 'booked' | 'booked_not_checked_in';
export default function BookUser({

  room,
  onClose
}: {
  room: Room;
  onClose: () => void;
}

) {
  // const [setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    idProof: "",
    checkInTime: "",
    checkOutTime: "",
    totalAmount: 2000,
    paidAmount: 0,
    bookingDate: new Date(),
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "totalAmount" || name === "paidAmount" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setSubmitted(true);

  };


  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-xl rounded-2xl space-y-4 bg-black">
      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl text-white font-semibold">Booking for Room {room.number}</h2>
        <button
          onClick={onClose}
          className="text-sm text-white border border-red-400 px-3 py-1 rounded hover:bg-red-950"
        >
          Close
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="idProof"
          type="text"
          placeholder="ID Proof Number"
          value={formData.idProof}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="checkInTime"
          type="time"
          placeholder="Check-In Time"
          value={formData.checkInTime}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="checkOutTime"
          type="time"
          placeholder="Check-Out Time"
          value={formData.checkOutTime}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="totalAmount"
          type="number"
          placeholder="Total Amount"
          value={formData.totalAmount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="paidAmount"
          type="number"
          placeholder="Amount Paid"
          value={formData.paidAmount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirm Booking
        </button>
        <button
          type="submit"
          className="w-full border border-red-600 text-white py-2 rounded"
        >
          Check-In
        </button>
      </form>
    </div>
  );
}
