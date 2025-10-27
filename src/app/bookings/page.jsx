"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import {
  CalendarDays,
  IndianRupee,
  User,
  Phone,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [roomCache, setRoomCache] = useState({}); // cache for roomId -> roomTypeName
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("adminAuth");
    if (!admin) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), async (snapshot) => {
      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const booking = { id: docSnap.id, ...docSnap.data() };

          // Fetch user details
          if (booking.userId) {
            const userRef = doc(db, "users", booking.userId);
            const userSnap = await getDoc(userRef);
            booking.user = userSnap.exists() ? userSnap.data() : { name: "Unknown User" };
          }

          // Fetch readable room type names
          const readableRooms = {};
          if (booking.selectedRooms) {
            for (const [roomId, qty] of Object.entries(booking.selectedRooms)) {
              // Use cached name if available
              if (roomCache[roomId]) {
                readableRooms[roomCache[roomId]] = qty;
              } else {
                const roomRef = doc(db, "roomtypes", roomId);
                const roomSnap = await getDoc(roomRef);
                if (roomSnap.exists()) {
                  const roomData = roomSnap.data();
                  const roomTypeName = roomData.category || "Unknown Type";
                  readableRooms[roomTypeName] = qty;
                  // Update cache
                  setRoomCache((prev) => ({ ...prev, [roomId]: roomTypeName }));
                } else {
                  readableRooms["Unknown Type"] = qty;
                }
              }
            }
          }
          booking.selectedRoomsReadable = readableRooms;

          return booking;
        })
      );

      setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomCache]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Checked-In":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status: newStatus });
    setUpdating(null);
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 animate-pulse">
        Loading all bookings...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Bookings</h1>
        <input
          type="text"
          placeholder="Search by user, ID, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No bookings found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-100">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800 text-left">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Check-in</th>
                <th className="py-3 px-4">Check-out</th>
                {/* <th className="py-3 px-4">Total</th> */}
                <th className="py-3 px-4">Status</th>
                {/* <th className="py-3 px-4 text-center">Action</th> */}
                <th className="py-3 px-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <React.Fragment key={b.id}>
                  <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-indigo-600">{b.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2 font-semibold text-gray-800">
                          <User className="w-4 h-4 text-indigo-500" />
                          {b.user?.name || "Guest"}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />
                          {b.userId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-indigo-500" />
                      {new Date(b.checkIn).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-indigo-500" />{" "}
                      {b.totalPrice?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {updating === b.id ? (
                        <div className="text-indigo-500 animate-pulse">Updating...</div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          {b.status === "Booked" && (
                            <button
                              onClick={() => handleStatusUpdate(b.id, "Checked-In")}
                              className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" /> Check-In
                            </button>
                          )}
                          {b.status === "Checked-In" && (
                            <button
                              onClick={() => handleStatusUpdate(b.id, "Completed")}
                              className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" /> Complete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleExpand(b.id)}
                        className="text-indigo-600 hover:text-indigo-800 transition"
                      >
                        {expandedRows[b.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {expandedRows[b.id] && (
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td colSpan="8" className="p-4">
                        <div className="text-sm text-gray-700 space-y-2">
                          <h3 className="font-semibold text-gray-800 mb-2">Room Details:</h3>
                          {b.roomConfigs ? (
                            Object.entries(b.roomConfigs).map(([roomId, details]) => {
                              const roomTypeName =
                                roomCache[roomId] || "Loading type...";
                              return (
                                <div
                                  key={roomId}
                                  className="flex justify-between bg-white rounded-md border p-3 mb-2 shadow-sm"
                                >
                                  <div>
                                    <p>
                                      <strong>Room Type:</strong> {roomTypeName}
                                    </p>
                                    <p>
                                      <strong>Rooms Booked:</strong>{" "}
                                      {Array.isArray(details)
                                        ? details.length
                                        : details}
                                    </p>
                                    <p className="flex items-center gap-1">
                                      <Users className="w-4 h-4 text-indigo-500" />
                                      <strong>Guests per Room:</strong>{" "}
                                      {Array.isArray(details)
                                        ? details
                                            .map(
                                              (d) =>
                                                `${d.adults} Adults, ${d.children} Children`
                                            )
                                            .join("; ")
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-gray-500">No room details found.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
