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

const handlePrint = (booking: BulkBooking) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const formattedDate = new Date().toLocaleDateString('en-IN');

//   const roomRows = booking.rooms.map((room, index) => `
//     <tr>
//       <td>${index + 1}</td>
//       <td>Room ${room.number}</td>
//       <td>996311</td>
//       <td>--</td>
//       <td>--</td>
//       <td>--</td>
//       <td>--</td>
//       <td>--</td>
//       <td>--</td>
//       <td>--</td>
//       <td>--</td>
//     </tr>
//   `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Hotel Invoice</title>
      <style>
      @media print {
  @page {
    size: A4;
    margin: 0.5cm;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 12px;
    zoom: 0.85; /* Shrink content slightly */
  }

  table, .details, .room-info, .totals, .footer-container, .signature, .title_heading {
    page-break-inside: avoid;
  }

  .footer-container {
    font-size: 12px;
  }
}

        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: auto;
          border: 1px solid #ccc;
        }

        h1, h2, h3 {
          text-align: center;
          margin: 0;
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .details,
        .room-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          margin-top: 10px;
        }

        table, th, td {
          border: 1px solid black;
        }

        th, td {
          padding: 6px;
          text-align: center;
        }

        .totals {
          text-align: left;
          font-weight: bold;
          border: 1px solid black;
          border-top: 0.1px solid rgb(229, 229, 229);
          padding: 10px;
        }

        .signature {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }

        .footer-container {
          border-top: 1px solid #000;
          padding-top: 10px;
          margin-top: 30px;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }

        .footer-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .footer-column {
          display: flex;
          align-items: center;
          flex-direction: column;
          flex: 1;
        }

        .footer-column.left {
          align-items: flex-start;
        }

        .footer-column.center {
          align-items: flex-start;
          padding-left: 20px;
        }

        .footer-column.right {
          align-items: flex-end;
        }

        .footer-item {
          display: flex;
          align-items: center;
          margin: 4px 0;
        }

        .footer-item img {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }

        .footer-text {
          color: #000;
        }

        .footer-email, .footer-website {
          margin-bottom: 4px;
        }

        .title_heading {
          display: flex;
          justify-content: space-between;
        }

        .heading_image {
          display: flex;
          flex-direction: row;
          padding-left: 30px;
        }

        .image {
          width: 80px;
          height: 80px;
        }

        .header_container {
          padding-left: 130px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="heading_image">
          <div class="image_container">
            <img class="image" src="/logo/aman_international_logo.png" alt="Logo" />
          </div>
          <div class="header_container">
            <h2>AMAN INTERNATIONAL</h2>
            <p>| Asiya Hospitality & Tourism Private Limited |<br>Karwar</p>
          </div>
        </div>
        <hr>
        <div class="title_heading">
          <p><strong>GSTIN:</strong> 29AAVCA0591Q1ZO</p>
          <h3>TAX INVOICE</h3>
        </div>
      </div>

      <div class="details">
        <div>
          <p><strong>Invoice No:</strong> ${booking.id}</p>
          <p><strong>Guest Name:</strong>Ram</p>
          <p><strong>Address:</strong> Karwar</p>
          <p><strong>Mobile No:</strong> 9113909285</p>
        </div>
        <div>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Guest GSTIN:</strong> 0</p>
        </div>
      </div>

         <table>
        <thead>
            <tr>
                <th>SNo</th>
                <th>Description</th>
                <th>SAC</th>
                <th>Amount</th>
                <th>Disc</th>
                <th>Taxable Value</th>
                <th>CGST %</th>
                <th>Amt.</th>
                <th>SGST %</th>
                <th>Amt.</th>
                <th>Total Rs.</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Room Rent 2000 x 1 Days</td>
                <td>996311</td>
                <td>2,000.00</td>
                <td>214.20</td>
                <td>1,785.80</td>
                <td>6.0</td>
                <td>107.15</td>
                <td>6.0</td>
                <td>107.15</td>
                <td>2,000.10</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Extra Person</td>
                <td>996311</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Restaurant</td>
                <td>996311</td>
                <td>190.48</td>
                <td>--</td>
                <td>190.48</td>
                <td>2.5</td>
                <td>4.76</td>
                <td>2.5</td>
                <td>4.76</td>
                <td>200.00</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Laundry</td>
                <td>996311</td>
                <td>169.49</td>
                <td>--</td>
                <td>169.49</td>
                <td>9.0</td>
                <td>15.25</td>
                <td>9.0</td>
                <td>15.25</td>
                <td>200.00</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Other Expenses</td>
                <td>996311</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>

            </tr>
            <td colspan="2"><b>Total</b></td>
            <td colspan="3">--</td>

            <td>2,145.77</td>
            <td colspan="2">127.6</td>
            <td colspan="2">127.6</td>
            <td>2,400.10</td>
            </tr>
        </tbody>
    </table>

      <div class="totals">
        <p>Total Invoice Value</p>
        <p>Rupees ${booking.amount} only</p>
        <p>(Rounding off)</p>
        <hr>
        <div class="title_heading">
          <p>Less Advance:</p>
          <p>₹${booking.amount_paid}</p>
        </div>
        <div class="title_heading">
          <p>Balance Payable:</p>
          <p>₹${booking.amount - booking.amount_paid}</p>
        </div>
      </div>

      <div class="title_heading">
        <p>E&O.E</p>
        <p>For Aman International</p>
      </div>

      <div class="signature">
        <p>Guest Signature</p>
        <p>THANK YOU VISIT AGAIN</p>
        <p>Manager/Cashier</p>
      </div>

      <div class="footer-container">
        <div class="footer-row">
          <div class="footer-column left">
            <div class="footer-item">
              <img src="https://img.icons8.com/ios-filled/50/fa314a/marker.png" alt="Location">
              <span class="footer-text">Asiya Business Park</span>
            </div>
            <div class="footer-text" style="margin-left: 26px;">Main Road, Karwar-581301</div>
          </div>
          <div class="footer-column center">
            <div class="footer-item">
              <img src="https://img.icons8.com/ios-filled/50/000000/phone.png" alt="Phone">
              <span class="footer-text">08382-225555</span>
            </div>
            <div class="footer-item">
              <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" alt="WhatsApp">
              <span class="footer-text">7795818873</span>
            </div>
          </div>
          <div class="footer-column right">
            <div class="footer-text footer-email">
              E-Mail <span>info@hotelamaninternational.com</span>
            </div>
            <div class="footer-text footer-website">
              Website <span>www.hotelamaninternational.com</span>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};


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
  {!isEditing ? (
    <>
      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
        onClick={() => setEditingBookingId(booking.id)}
      >
        Edit
      </button>
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        onClick={() => handlePrint(booking)}
      >
        Print
      </button>
    </>
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
