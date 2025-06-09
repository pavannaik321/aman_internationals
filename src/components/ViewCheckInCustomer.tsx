"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, DocumentReference, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { updateDoc } from "firebase/firestore";




interface CustomerData {
  name: string;
  phone: string;
  idnumber?: string;
  idtype?: string;
  address?: string;
}

interface BookingData {
  user_id: DocumentReference;
  roomnumber: number;
  totalamount: number;
  amountpaid: number;
  checkintime: Timestamp;
  checkouttime: Timestamp;
  bookingstatus: string;
  checkinstatus: boolean;
  roomtype: DocumentReference;
}

export default function ViewCheckInCustomer({
  customerId,
  roomNumber,
  date,
  checkinStatus,
  onClose,
}: {
  customerId: string;
  roomNumber: number;
  date: string;
  checkinStatus:boolean
  onClose: () => void;
}) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);

const handleCheckIn = async () => {
  try {
    const roomDateRef = doc(db, "room_dates", date);
    const roomDateSnap = await getDoc(roomDateRef);

    if (!roomDateSnap.exists()) {
      console.error("Room date not found");
      return;
    }

    const data = roomDateSnap.data();
    const bookings: BookingData[] = data.bookings;

    // Find the index of the matching booking
    const bookingIndex = bookings.findIndex(
      (b) => b.user_id.id === customerId && b.roomnumber === roomNumber
    );

    if (bookingIndex === -1) {
      console.error("Booking not found");
      return;
    }

    // Update the checkinstatus to true
    bookings[bookingIndex].checkinstatus = true;

    // Write the updated bookings back to Firestore
    await updateDoc(roomDateRef, {
      bookings: bookings,
    });

    // Update the local state
    setBooking({ ...bookings[bookingIndex] });

    alert("Check-in successful!");
    onClose()
  } catch (error) {
    console.error("Error updating check-in status:", error);
  }
};

  useEffect(() => {
    const fetchCustomerAndBooking = async () => {
      try {
        // Fetch user info
        const userDocRef = doc(db, "users", customerId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setCustomer(userSnap.data() as CustomerData);
        }

        // Fetch booking info from room_dates
        const dateKey = date;
        const roomDateRef = doc(db, "room_dates", dateKey);
        const roomDateSnap = await getDoc(roomDateRef);

        if (roomDateSnap.exists()) {
          const bookings: BookingData[] = roomDateSnap.data().bookings;

          const userBooking = bookings.find(
            (b) => b.user_id.id === customerId && b.roomnumber === roomNumber
          );

          if (userBooking) {
            setBooking(userBooking);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCustomerAndBooking();
  }, [customerId, roomNumber, date]);

  if (!customer || !booking) {
    return (
      <div className="text-white p-4 bg-black rounded-xl">
        Loading customer and room details...
      </div>
    );
  }

  return (
<div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl text-white">
  {/* Header */}
  <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
    <h2 className="text-3xl font-bold tracking-wide">Customer Details</h2>
    <button
      onClick={onClose}
      className="text-sm font-medium text-red-400 border border-red-600 px-4 py-1.5 rounded-md hover:bg-red-800 transition"
    >
      Close
    </button>
  </div>

  {/* Content */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm sm:text-base">
    <p><span className="text-gray-400">Name:</span> {customer.name}</p>
    <p><span className="text-gray-400">Phone:</span> {customer.phone}</p>
    <p><span className="text-gray-400">ID Type:</span> {customer.idtype}</p>
    <p><span className="text-gray-400">ID Number:</span> {customer.idnumber}</p>
    <p><span className="text-gray-400">Booking Date:</span> {date}</p>
    <p><span className="text-gray-400">Check-In Time:</span> {booking.checkintime.toDate().toLocaleString()}</p>
    <p><span className="text-gray-400">Check-Out Time:</span> {booking.checkouttime.toDate().toLocaleString()}</p>
    <p><span className="text-gray-400">Room Number:</span> {booking.roomnumber}</p>
    <p><span className="text-gray-400">Address:</span> {customer.address || "-"}</p>
    <p><span className="text-gray-400">Total Amount:</span> ₹{booking.totalamount}</p>
    <p><span className="text-gray-400">Paid Amount:</span> ₹{booking.amountpaid}</p>
    <p><span className="text-gray-400">Due:</span> ₹{booking.totalamount - booking.amountpaid}</p>
  </div>

  {/* Footer */}
{
  !checkinStatus && (
    <div className="mt-8">
      <button
        className="w-full py-3 border border-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition"
        onClick={()=>{
          handleCheckIn()

        }}
      >
        Check-In
      </button>
    </div>
  )
}

</div>

  );
}
