
"use client";

import { useState } from "react";
import { DocumentReference } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useEffect } from "react";
import {

  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { roomdatatype } from "./HomeRoomView";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  printId: string;
  roomnumber: number;
  roomtype: DocumentReference;
  totalamount: number;
  user_id: DocumentReference;
}

type RoomStatus = 'available' | 'booked' | 'booked_not_checked_in';
export default function BulkRoomBooking({
  room,
  date,
  onClose
}: {
  room: Room[];
  date: string;
  onClose: () => void;
}

) {
  // const [submited,setSubmitted] = useState(false);
  const [roomdata, setRoomdata] = useState<roomdatatype | null>(null);
  const [filteredRoom, setFilteredRoom] = useState<Room[] | null>(null);
  const [no_of_rooms_open, setNo_of_room_open] = useState(false);
  const [no_of_room, setNo_of_room] = useState(2);
  const [isAlreadyBulkBooked, setIsAlreadyBulkBooked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    people: "select",
    checkInDate: "",
    checkInTime: "",
    checkOutDate: "",
    checkOutTime: "",
    totalAmount: 0,
    paidAmount: 0,
    idtype: "",
    idnumber: "",
    address: "",
    bulkName: "",
    gst: "",
     state: "",
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
    if (!isAlreadyBulkBooked) {
      handleAddUser();
    } else {
      handleAddToExistingBulkBooking();
    }


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
      bulkName,
      state
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
      !totalAmount ||
      !bulkName ||
      !state
    ) {
      return alert("Please fill in all required fields.");
    }

    try {
           const mergedAddress = `${address}, ${state}`.trim();
      // 1. Create the user doc
      const userRef = doc(db, "users", phone);
      await setDoc(userRef, {
        name,
        phone,
        idtype,
        idnumber,
        gst: gst || null,
        mergedAddress,
        user_id: phone,
        createdAt: new Date(),
      });

      console.log("User added with phone ID:", phone);

      const checkinTimestamp = Timestamp.fromDate(new Date(`${checkInDate}T${checkInTime}`));
      const checkoutTimestamp = Timestamp.fromDate(new Date(`${checkOutDate}T${checkOutTime}`));

      // 2. Loop through all available rooms
      if (!filteredRoom) {
        alert("No rooms selected for booking.");
        return;
      }
      for (const r of filteredRoom) {
        const booking = {
          amountpaid: Number(paidAmount),
          bookingstatus: "booked",
          checkinstatus: false,
          checkintime: checkinTimestamp,
          printId: "",
          checkouttime: checkoutTimestamp,
          roomnumber: r.number,
          roomtype: doc(db, "roomtypes", r.roomCategoryId),
          totalamount: Number(totalAmount),
          user_id: userRef,
        };

        // 3. Book room for each day in the stay range
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);

        for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
          const bookingDateKey = d.toLocaleDateString("en-CA");
          await addBookingToDate(bookingDateKey, booking);

          // Add this at the end of try block in handleAddUser

          // 4. Add to bulkBooking
          if (!bulkName) {
            alert("Bulk booking name is required.");
            return;
          }

          const bulkBookingRef = doc(db, "bulkBooking", bulkName);
          const bulkSnap = await getDoc(bulkBookingRef);

          const roomEntries = filteredRoom.map((r) => ({
            number: r.number,
            type: r.type,
            roomCategoryId: r.roomCategoryId,
            checkinTime: checkinTimestamp,
            checkOutTime: checkoutTimestamp,
            date:checkInDate,
          }));

          if (bulkSnap.exists()) {
            // Add rooms to existing document
            await updateDoc(bulkBookingRef, {
              rooms: arrayUnion(...roomEntries),
            });
            console.log("Bulk booking updated with new rooms.");
          } else {
            // Create new bulk booking document
            await setDoc(bulkBookingRef, {
              user_id: userRef,
              amount: 0,
              amount_paid: 0,
              rooms: roomEntries,
            });
            console.log("New bulk booking created.");
          }

        }
      }

      alert("All rooms booked successfully for the user!");
      onClose()
    } catch (err) {
      console.error("Error during booking:", err);
      alert("Failed to complete booking.");
    }
  };

  const handleAddToExistingBulkBooking = async () => {
    const {
      phone,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      totalAmount,
      paidAmount,
      bulkName,
    } = formData;

    if (!phone || !checkInDate || !checkInTime || !checkOutDate || !checkOutTime || !totalAmount || !bulkName) {
      return alert("Please fill in all required fields.");
    }

    try {
      const userRef = doc(db, "users", phone);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        alert("User does not exist.");
        return;
      }

      const bulkBookingRef = doc(db, "bulkBooking", bulkName);
      const bulkSnap = await getDoc(bulkBookingRef);

      if (!bulkSnap.exists()) {
        alert("Bulk booking name does not exist.");
        return;
      }

      const checkinTimestamp = Timestamp.fromDate(new Date(`${checkInDate}T${checkInTime}`));
      const checkoutTimestamp = Timestamp.fromDate(new Date(`${checkOutDate}T${checkOutTime}`));

      if (!filteredRoom) {
        alert("No rooms selected.");
        return;
      }

      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      for (const r of filteredRoom) {
        const booking = {
          amountpaid: Number(paidAmount),
          bookingstatus: "booked",
          checkinstatus: false,
          checkintime: checkinTimestamp,
          checkouttime: checkoutTimestamp,
          roomnumber: r.number,
          roomtype: doc(db, "roomtypes", r.roomCategoryId),
          totalamount: Number(totalAmount),
          printId: "",
          user_id: userRef,
        };

        for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
          const bookingDateKey = d.toLocaleDateString("en-CA");
          await addBookingToDate(bookingDateKey, booking);
        }
      }

      const roomEntries = filteredRoom.map((r) => ({
            number: r.number,
            type: r.type,
            roomCategoryId: r.roomCategoryId,
            checkinTime: checkinTimestamp,
            checkOutTime: checkoutTimestamp,
            date:checkInDate,
      }));

      await updateDoc(bulkBookingRef, {
        rooms: arrayUnion(...roomEntries),
      });

      alert("Rooms added to existing bulk booking successfully!");
    } catch (err) {
      console.error("Error in existing bulk booking:", err);
      alert("Failed to add to bulk booking.");
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

      // alert("Booking added successfully!");
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("Failed to add booking.");
    }
  };
  useEffect(() => {
    setFilteredRoom(room);
    const fetchRoom = async () => {
      try {
        const roomRef = doc(db, "roomtypes", room[0].roomCategoryId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          setRoomdata(roomSnap.data() as roomdatatype);
        }
      } catch (err) {
        console.error("Failed to fetch room:", err);
      }
    };

    fetchRoom();
    setFormData((prev) => ({
      ...prev,
      checkInDate: date,
    }));
    setFormData((prev) => ({
      ...prev,
      checkInTime: "13:30",
    }));
    setFormData((prev) => ({
      ...prev,
      checkOutTime: "13:30",
    }));

    const dummydate = new Date(date);
    const nextDay = new Date(dummydate);
    nextDay.setDate(dummydate.getDate() + 1);
    setFormData((prev) => ({
      ...prev,
      checkOutTime: "13:30",
    }));
    setFormData((prev) => ({
      ...prev,
      checkOutDate: nextDay.toLocaleDateString("en-CA"),
    }));
    setNo_of_room(room.length)
  }, []);



  useEffect(() => {
    setFilteredRoom(room);
  }, [room])
  if (!roomdata) {
    return (
      <div className="flex justify-center items-center h-[300px] text-white text-lg">
        Loading room details...
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto mt-10 py-4 px-8 shadow-xl rounded-2xl space-y-4 bg-black">
      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl text-white font-semibold">Bulk Booking for Room {room[0].number}</h2>
        <button
          onClick={onClose}
          className="text-sm text-white border border-red-400 px-3 py-1 rounded hover:bg-red-950"
        >
          Close
        </button>
      </div>
      <div className="border border-white p-4 rounded-md">


        <div className="grid grid-cols-4 gap-4 mb-4 bg-gray-500 p-2 rounded-md">
          {filteredRoom?.map((room) => (
            <div
              key={room.number}
              className="flex flex-col items-center justify-center bg-gray-800 text-white p-2 rounded shadow-md"
            >
              <div className="text-sm">Room {room.number}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {/* Select number of rooms */}
          <div className="relative inline-block">
            <button
              onClick={() => setNo_of_room_open(!no_of_rooms_open)}
              className="border text-start w-s border-gray-300 bg-gray-800 text-white text-lg px-4 py-1 rounded focus:outline-none"
            >
              Select Number of Rooms  {no_of_room}
              <span className="ml-2 text-gray-400 inline-grid">
                {no_of_rooms_open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            </button>

            <div
              className={`absolute w-1/2 top-full right-0 bg-white rounded-lg p-4 mt-1 shadow-md transform origin-top transition-all duration-200 ${no_of_rooms_open ? 'scale-y-100' : 'scale-y-0'
                }`}
            >

              {Array.from({ length: room.length - 1 }, (_, i) => i + 2).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setNo_of_room(num);
                    setNo_of_room_open(false);
                  }}
                  className="block py-1 px-1 text-center w-full hover:bg-gray-100 rounded text-sm text-gray-800"
                >
                  {num}
                </button>
              ))}

            </div>
          </div>
          {/* Button */}
          <button className="bg-gray-800 border border-white text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 cursor-pointer" onClick={() => {

            setFilteredRoom(room.slice(0, no_of_room));
          }
          }>
            Filter Rooms
          </button>
        </div>

      </div>

      <div className="flex justify-between">
        <h2 className="text-xl text-white font-semibold">Enter users details</h2>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="userDetails"
            checked={isAlreadyBulkBooked}
            onChange={(e) => setIsAlreadyBulkBooked(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <label htmlFor="userDetails" className="text-white">
            Adding In Existing Bulk Room
          </label>
        </div>


      </div>
      <form onSubmit={handleSubmit} className="text-white grid gap-10 grid-cols-3">
        {/* Name */}
        {(!isAlreadyBulkBooked) &&
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
          </div>}

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
        {/* Number of People */}
        <div className="space-y-1">
          <label htmlFor="people" className="block text-sm font-medium">Number of People</label>
          <select
            id="people"
            value={formData.people}
            onChange={(e) => {
              const selected = e.target.value;

              // Get price from roomData using the selected key
              const price = roomdata[selected as keyof roomdatatype] as number;

              setFormData((prev) => ({
                ...prev,
                people: selected,
                totalAmount: price || 0, // fallback to 0 if not found
              }));
            }}
            className="w-full h-10 border px-4 py-2 rounded bg-black text-white"
          >
            <option value="select">Select</option>
            <option value="single_price">Single</option>
            <option value="double_price">Double</option>
            <option value="triple_price">Triple</option>
            <option value="quad_price">Quad</option>
          </select>
        </div>



        {/* Check-In Date */}
        <div className="space-y-1">
          <label htmlFor="checkInDate" className="block text-sm font-medium">Check-In Date</label>
          <input
            readOnly
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
            readOnly
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
            readOnly
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
            readOnly
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
        {(!isAlreadyBulkBooked) &&
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
        }
        {/* ID Number */}
        {(!isAlreadyBulkBooked) &&
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
        }

        {/* GST */}
        {(!isAlreadyBulkBooked) &&
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
        }
        {/* Address */}
        {(!isAlreadyBulkBooked) &&
        <>
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
<div className="space-y-1">
  <label htmlFor="state" className="block text-sm font-medium">State</label>
  <select
    id="state"
    value={formData.state}
    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
    className="w-full h-10 border px-4 py-2 rounded bg-black text-white"
  >
    <option value="">Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>
    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
    <option value="Delhi">Delhi</option>
    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    <option value="Ladakh">Ladakh</option>
    <option value="Lakshadweep">Lakshadweep</option>
    <option value="Puducherry">Puducherry</option>
  </select>
</div>
</>
        }
        {/* Bulk Name */}
        <div className="space-y-1">
          <label htmlFor="bulkName" className="block text-sm font-medium">Bulk Name</label>
          <input
            id="bulkName"
            value={formData.bulkName}
            onChange={(e) => setFormData({ ...formData, bulkName: e.target.value })}
            placeholder="Bulk Booking Name"
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
