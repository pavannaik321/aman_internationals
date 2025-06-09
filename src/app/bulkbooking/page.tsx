"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    Timestamp,
    //   DocumentReference,
} from "firebase/firestore";

interface Room {
    number: number;
    type: string;
    roomCategoryId: string;
    date: string;
    checkinTime: Timestamp,
    checkOutTime: Timestamp,
}

interface BulkBooking {
    user_id: string;
    amount: number;
    amount_paid: number;
    rooms: Room[];
    id: string;
}

export default function BulkBookingPage() {
    const [bulkBookings, setBulkBookings] = useState<BulkBooking[]>([]);
    const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
    const [editedBookings, setEditedBookings] = useState<{ [id: string]: { amount: number, amount_paid: number } }>({});

    const handleEditField = (id: string, field: "amount" | "amount_paid", value: number) => {
        setEditedBookings((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleSaveEdit = async (id: string) => {
        const updated = editedBookings[id];
        if (!updated) return;

        try {
            const docRef = doc(db, "bulkBooking", id);
            await updateDoc(docRef, {
                amount: updated.amount,
                amount_paid: updated.amount_paid,
            });
            alert("Booking updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update booking.");
        }
    };

    const fetchBulkBookings = async () => {
        const querySnapshot = await getDocs(collection(db, "bulkBooking"));
        const data: BulkBooking[] = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        })) as BulkBooking[];
        setBulkBookings(data);
    };

    useEffect(() => {
        fetchBulkBookings();
    }, []);

    return (
        <div className="p-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 Bulk Bookings</h1>

            {bulkBookings.map((booking, idx) => {
                const isEditing = editingBookingId === booking.id;

                return (
                    <div
                        key={idx}
                        className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-md"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                🆔 Booking ID: <span className="text-blue-600">{booking.id}</span>
                            </h2>

                            <div className="flex gap-2">
                                {/* <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                  onClick={() => handleViewUser(booking.user_id)}
                                >
                                    View User
                                </button> */}
                                {!isEditing ? (
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                                        onClick={() => setEditingBookingId(booking.id)}
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                        onClick={() => {
                                            handleSaveEdit(booking.id);
                                            setEditingBookingId(null);
                                        }}
                                    >
                                        Save
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Amount</label>
                                <input
                                    type="number"
                                    disabled={!isEditing}
                                    value={editedBookings[booking.id]?.amount ?? booking.amount}
                                    onChange={(e) =>
                                        handleEditField(booking.id, "amount", Number(e.target.value))
                                    }
                                    className={`border px-3 py-2 rounded w-full ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Amount Paid</label>
                                <input
                                    type="number"
                                    disabled={!isEditing}
                                    value={editedBookings[booking.id]?.amount_paid ?? booking.amount_paid}
                                    onChange={(e) =>
                                        handleEditField(booking.id, "amount_paid", Number(e.target.value))
                                    }
                                    className={`border px-3 py-2 rounded w-full ${isEditing ? "bg-white" : "bg-gray-100 text-gray-500"
                                        }`}
                                />
                            </div>
                        </div>

                        {/* 🏨 Grouped Rooms by Date */}
                        {/* <h3 className="font-medium text-gray-700 mb-2">🏨 Rooms</h3> */}

                        {(() => {
                            // Group rooms by date
                            const groupedRooms = booking.rooms.reduce((acc: { [key: string]: Room[] }, room: Room) => {
                                if (!acc[room.date]) {
                                    acc[room.date] = [];
                                }
                                acc[room.date].push(room);
                                return acc;
                            }, {});

                            // Sort dates ascending
                            const sortedDates = Object.keys(groupedRooms).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

                            return (
                                <div className="grid grid-cols-4" >
                                    {
                                        sortedDates.map((date) => (
                                            <div key={date} className="mb-4">

                                                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                                                    📅 Date:{" "}
                                                    {new Date(date).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </h4>
                                                <ul className="list-disc pl-6 text-sm text-gray-800 space-y-1">
                                                    {groupedRooms[date].map((room, index) => (
                                                        <li key={index}>
                                                            Room {room.number} - {room.type}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                        ))
                                    }
                                </div>

                            )
                        })()}

                    </div>
                );
            })}
        </div>

    );
}
