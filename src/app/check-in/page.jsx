"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import {
  User,
  BedDouble,
  CalendarDays,
  MessageSquare,
  Clock,
  IndianRupee,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckedInGuestsPage() {
  const [checkedInBookings, setCheckedInBookings] = useState([]);
  const [roomCache, setRoomCache] = useState({}); // Store room type info for faster lookups
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("adminAuth");
    if (!admin) {
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    const q = query(collection(db, "bookings"), where("status", "==", "Checked-In"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const booking = { id: docSnap.id, ...docSnap.data() };

          // Fetch user info
          if (booking.userId) {
            const userRef = doc(db, "users", booking.userId);
            const userSnap = await getDoc(userRef);
            booking.user = userSnap.exists() ? userSnap.data() : { name: "Unknown" };
          }

          // Convert selectedRooms with type name instead of ID
          const selectedRooms = {};
          if (booking.selectedRooms) {
            for (const [roomId, qty] of Object.entries(booking.selectedRooms)) {
              // Use cache first
              if (!roomCache[roomId]) {
                const roomRef = doc(db, "roomtypes", roomId);
                const roomSnap = await getDoc(roomRef);
                if (roomSnap.exists()) {
                  const roomData = roomSnap.data();
                  selectedRooms[roomData.category || "Unknown Type"] = qty;
                  setRoomCache((prev) => ({
                    ...prev,
                    [roomId]: roomData.category || "Unknown Type",
                  }));
                } else {
                  selectedRooms["Unknown Type"] = qty;
                }
              } else {
                selectedRooms[roomCache[roomId]] = qty;
              }
            }
          }
          booking.selectedRooms = selectedRooms;

          return booking;
        })
      );

      setCheckedInBookings(data.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomCache]);

  
  const markAsCompleted = async (bookingId) => {
    await updateDoc(doc(db, "bookings", bookingId), { status: "Completed" });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 animate-pulse">
        Loading checked-in guests...
      </div>
    );

  if (checkedInBookings.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        No checked-in guests right now.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checked-In Guests</h1>

      <div className="grid gap-6">
        {checkedInBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-500" />
                  {b.user?.name || "Guest"}
                </h2>
                <p className="text-sm text-gray-500">{b.userId}</p>
              </div>

              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                Checked In
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-500" />
                  <strong>Check-in:</strong> {new Date(b.checkIn).toDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <strong>Check-out:</strong> {new Date(b.checkOut).toDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-indigo-500" />
                  <strong>Rooms:</strong> {b.totalRooms}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-indigo-500" />
                  <strong>Total Amount:</strong> ₹{b.totalPrice?.toLocaleString()}
                </p>
                <p>
                  <strong>Nights:</strong> {b.nights}
                </p>
                <p>
                  <strong>Booking ID:</strong> {b.id}
                </p>
              </div>
            </div>

            {b.requests && (
              <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3 text-gray-600 text-sm">
                <p className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500 mt-1" />
                  <span>
                    <strong>Special Requests:</strong> {b.requests}
                  </span>
                </p>
              </div>
            )}

            {/* Room Type Display */}
            {b.selectedRooms && (
              <div className="mt-4 border-t border-gray-200 pt-3">
                <h3 className="font-medium text-gray-800 mb-2">Selected Room Types</h3>
                {Object.entries(b.selectedRooms).map(([type, qty]) => (
                  <div
                    key={type}
                    className="flex justify-between text-sm text-gray-600 mb-1"
                  >
                    <span>{type}</span>
                    <span>Quantity: {qty}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => markAsCompleted(b.id)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
