
"use client";

import { useState } from "react";
import {  DocumentReference } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import {

  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

// import BookingConfirmation from "@/components/BookingConfirmation";
export interface Room {
  number: number;
  type: string;
  roomCategoryId: string;
  status: RoomStatus;
  customerData?: string;
  checkedin?: boolean;
}
export interface BookingData {
  amountpaid: number;
  bookingstatus: string;
  checkinstatus: boolean;
  checkintime: Timestamp;
  checkouttime: Timestamp;
  roomnumber: number;
  roomtype: DocumentReference;
  totalamount: number;
  user_id: DocumentReference;
}

type RoomStatus = 'available' | 'booked' | 'booked_not_checked_in';
export default function BulkBooking({
  room,
  // date,
  onClose
}: {
  room: Room;
  date: string;
  onClose: () => void;
}

) {
  // const [submited,setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    checkInDate: "",
    checkInTime: "",
    checkOutDate: "",
    checkOutTime: "",
    totalAmount: 0,
    paidAmount: 0,
    idtype: "",
    idnumber: "",
    address: "",
    gst: "",
    bookingDate: new Date()
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
    handleAddUser();
    // setSubmitted(true);
    onClose()
  };

const handleAddUser = async () => {
  const {
    name,
    phone,
    idtype,
    idnumber,
    address,
    gst,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    totalAmount,
    paidAmount,
  } = formData;

  if (
    !name ||
    !phone ||
    !idnumber ||
    !idtype ||
    !address ||
    !checkInDate ||
    !checkInTime ||
    !checkOutDate ||
    !checkOutTime ||
    !totalAmount
  ) {
    return alert("Please fill in all required fields.");
  }

  try {
    // Step 1: Create user with phone number as document ID
    const userRef = doc(db, "users", phone); // phone as document ID
    await setDoc(userRef, {
      name,
      phone,
      idtype,
      idnumber,
      gst: gst || null,
      address,
      user_id: phone, // Save document ID inside as well
      createdAt: new Date(),
    });

    console.log("User added with phone ID:", phone);

const checkinTimestamp = Timestamp.fromDate(new Date(`${checkInDate}T${checkInTime}`));
const checkoutTimestamp = Timestamp.fromDate(new Date(`${checkOutDate}T${checkOutTime}`));

const booking = {
  amountpaid: Number(paidAmount),
  bookingstatus: "booked",
  checkinstatus: false,
  checkintime: checkinTimestamp,
  checkouttime: checkoutTimestamp,
  roomnumber: room.number,
  roomtype: doc(db, "roomtypes", room.roomCategoryId),
  totalamount: Number(totalAmount),
  user_id: userRef,
};

// Add booking to every date from check-in to day before check-out
const startDate = new Date(checkInDate);
const endDate = new Date(checkOutDate);

for (
  let d = new Date(startDate);
  d < endDate;
  d.setDate(d.getDate() + 1)
) {
  const bookingDateKey = d.toISOString().split("T")[0];
  await addBookingToDate(bookingDateKey, booking);
}


    alert("User and booking added successfully!");
  } catch (err) {
    console.error("Error during user/booking creation:", err);
    alert("Failed to create user or booking.");
  }
};

  const addBookingToDate = async (
    date: string, // format: "YYYY-MM-DD"
    booking: BookingData
  ) => {
    try {
      const dateDocRef = doc(db, "room_dates", date);
      const docSnap = await getDoc(dateDocRef);

      if (docSnap.exists()) {
        await updateDoc(dateDocRef, {
          bookings: arrayUnion(booking),
        });
      } else {
        await setDoc(dateDocRef, {
          bookings: [booking],
        });
      }

      alert("Booking added successfully!");
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("Failed to add booking.");
    }
  };


  return (
    <div className="max-w-full mx-auto mt-10 py-4 px-8 shadow-xl rounded-2xl space-y-4 bg-black">
      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl text-white font-semibold">Bulk Booking for Room {room.number}</h2>
        <button
          onClick={onClose}
          className="text-sm text-white border border-red-400 px-3 py-1 rounded hover:bg-red-950"
        >
          Close
        </button>
      </div>
      <form onSubmit={handleSubmit} className="text-white grid gap-10 grid-cols-3">
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>
        {/* Address */}
        <div className="space-y-1">
          <label htmlFor="address" className="block text-sm font-medium">Address</label>
          <input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Address"
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>


        {/* Check-In Date */}
        <div className="space-y-1">
          <label htmlFor="checkInDate" className="block text-sm font-medium">Check-In Date</label>
          <input
            id="checkInDate"
            name="checkInDate"
            type="date"
            value={formData.checkInDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>

        {/* Check-In Time */}
        <div className="space-y-1">
          <label htmlFor="checkInTime" className="block text-sm font-medium">Check-In Time</label>
          <input
            id="checkInTime"
            name="checkInTime"
            type="time"
            value={formData.checkInTime}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>
        {/* Total Amount */}
        <div className="space-y-1">
          <label htmlFor="totalAmount" className="block text-sm font-medium">Total Amount</label>
          <input
            id="totalAmount"
            name="totalAmount"
            type="number"
            placeholder="Total Amount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>

        {/* Check-Out Date */}
        <div className="space-y-1">
          <label htmlFor="checkOutDate" className="block text-sm font-medium">Check-Out Date</label>
          <input
            id="checkOutDate"
            name="checkOutDate"
            type="date"
            value={formData.checkOutDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>

        {/* Check-Out Time */}
        <div className="space-y-1">
          <label htmlFor="checkOutTime" className="block text-sm font-medium">Check-Out Time</label>
          <input
            id="checkOutTime"
            name="checkOutTime"
            type="time"
            value={formData.checkOutTime}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>




        {/* Paid Amount */}
        <div className="space-y-1">
          <label htmlFor="paidAmount" className="block text-sm font-medium">Amount Paid</label>
          <input
            id="paidAmount"
            name="paidAmount"
            type="number"
            placeholder="Amount Paid"
            value={formData.paidAmount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>

        {/* ID Type */}
        <div className="space-y-1">
          <label htmlFor="idtype" className="block text-sm font-medium">ID Type</label>
          <input
            id="idtype"
            value={formData.idtype}
            onChange={(e) => setFormData({ ...formData, idtype: e.target.value })}
            placeholder="Aadhaar, PAN, etc."
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>

        {/* ID Number */}
        <div className="space-y-1">
          <label htmlFor="idnumber" className="block text-sm font-medium">ID Number</label>
          <input
            id="idnumber"
            value={formData.idnumber}
            onChange={(e) => setFormData({ ...formData, idnumber: e.target.value })}
            placeholder="ID Proof"
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>


        {/* GST */}
        <div className="space-y-1">
          <label htmlFor="gst" className="block text-sm font-medium">GST (Optional)</label>
          <input
            id="gst"
            value={formData.gst}
            onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
            placeholder="GST Number"
            className="w-full border px-3 py-2 rounded bg-black text-white"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-3 gap-4 flex">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-2 rounded hover:bg-blue-700"
          >
            Confirm Booking
          </button>
          {/* <button
      type="button"
      // onClick={handleCheckIn} 
      className="w-full border border-red-600 text-white py-2 rounded hover:bg-red-800"
    >
      Check-In
    </button> */}
        </div>
      </form>

    </div>
  );
}
