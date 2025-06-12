"use client";
import { useRoomFilter } from "@/store/useRoomFilter";
import { useEffect, useState } from "react";

import HomeRoomView from "./HomeRoomView";
import BookingConfirmation from "./BookUsers";
// import CustomerCard from "./ViewCustomer";
import { BookingData } from "@/app/checkdata/page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import CustomerCard from "./ViewCustomer";
import BulkRoomBooking from "./BulkBooking";
const OriginalRoomData: {
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
        { number: 301, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 302, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 303, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 304, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 305, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 306, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 307, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 308, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 416, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
      ]
    },
    {
      category: "SUITE/ CLUB A/C",
      rooms: [
        { number: 309, type: "SUITE A/C", status: "available", roomCategoryId: "tZE0r4G76cgZ24LPczRT" },
        { number: 311, type: "SUITE A/C", status: "available", roomCategoryId: "tZE0r4G76cgZ24LPczRT" },
        { number: 409, type: "SUITE A/C", status: "available", roomCategoryId: "tZE0r4G76cgZ24LPczRT" },
        { number: 310, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 312, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 318, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 319, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 407, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 410, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
      ]
    },
    {
      category: "STANDARD PLUS",
      rooms: [
        { number: 314, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 315, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 316, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 411, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 412, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 413, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
      ]
    },
    {
      category: "STANDARD NON A/C",
      rooms: [
        { number: 401, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 402, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 403, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 404, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 405, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 406, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
      ]
    }
  ]
};

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
        { number: 301, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 302, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 303, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 304, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 305, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 306, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 307, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 308, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
        { number: 416, type: "STANDARD A/C", status: "available", roomCategoryId: "fL8QCDVrBRt7b1lIEqkb" },
      ]
    },
    {
      category: "SUITE/ CLUB A/C",
      rooms: [
        { number: 309, type: "SUITE A/C", status: "available", roomCategoryId: "tZE0r4G76cgZ24LPczRT" },
        { number: 311, type: "SUITE A/C", status: "available", roomCategoryId: "tZE0r4G76cgZ24LPczRT" },
        { number: 409, type: "SUITE A/C", status: "available", roomCategoryId: "tZE0r4G76cgZ24LPczRT" },
        { number: 310, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 312, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 318, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 319, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 407, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
        { number: 410, type: "CLUB A/C", status: "available", roomCategoryId: "JmwmwZl10rkvGToDezdJ" },
      ]
    },
    {
      category: "STANDARD PLUS",
      rooms: [
        { number: 314, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 315, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 316, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 411, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 412, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
        { number: 413, type: "STANDARD PLUS", status: "available", roomCategoryId: "K9b73tlYUTJIAgf72oxH" },
      ]
    },
    {
      category: "STANDARD NON A/C",
      rooms: [
        { number: 401, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 402, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 403, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 404, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 405, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
        { number: 406, type: "STANDARD NON A/C", status: "available", roomCategoryId: "IEEUNkZU0Q0K8OLlyysC" },
      ]
    }
  ]
};


type CleanBookingData = {
  amountpaid: number;
  bookingstatus: string;
  checkinstatus: boolean;
  checkintime: string;
  checkouttime: string;
  roomnumber: number;
  roomtype: string;
  totalamount: number;
  user_id: string;
};

type RoomStatus = 'available' | 'booked' | 'booked_not_checked_in';
const statusColor: Record<RoomStatus, string> = {
  available: "bg-green-400",
  booked: "bg-red-400",
  booked_not_checked_in: "bg-cyan-400",
};

export interface Room {
  number: number;
  type: string;
  roomCategoryId: string;
  status: RoomStatus;
  customerData?: string;
  checkedin?: boolean;
}

// interface CustomerInfo {
//   name: string;
//   phone: string;
//   idProof: string;
//   checkInTime: string;
//   checkOutTime: string;
//   totalAmount: number;
//   paidAmount: number;
//   bookingDate: Date;
// }


// Function to update static roomData with booking info
function mergeRoomDataWithBookings(
  roomData: {
    date: Date;
    rooms: {
      category: string;
      rooms: Room[];
    }[];
  },
  bookings: CleanBookingData[]
): typeof roomData {
  // Create a map for quick lookup
  const bookingMap = new Map<number, CleanBookingData>();

  bookings.forEach((booking) => {
    bookingMap.set(booking.roomnumber, booking);
  });

  const updatedRooms = roomData.rooms.map((category) => ({
    ...category,
    rooms: category.rooms.map((room) => {
      const match = bookingMap.get(room.number);
      if (match) {
        return {
          ...room,
          status: "booked" as RoomStatus,
          customerData: match.user_id,
          checkedin: match.checkinstatus,
        };
      }
      return { ...room };
    }),
  }));

  return {
    ...roomData,
    rooms: updatedRooms,
  };
}

export default function RoomGrid() {
  //  const [triggerEffect, setTriggerEffect] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookRoom, setBookRoom] = useState<Room | null>(null);
  const [bulkBookingRoom, setBulkBookingRoom] = useState<{

    rooms: Room[];
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<CleanBookingData[] | null>(null);
  const todaysdate = new Date();
  const [currentDate, setCurrentDate] = useState<string>(todaysdate.toLocaleDateString("en-CA"));
  const [updatedbookings, setUpdatedBookings] = useState<{
    date: Date;
    rooms: {
      category: string;
      rooms: Room[];
    }[];
  } | null>(null);
  const { date, category, bulkBooking } = useRoomFilter();
  // from where filter data is called
  const filteredRooms = updatedbookings?.rooms
    .filter((group) => {
      const categoryMatch =
        category.toLowerCase() === "all category rooms" ||
        group.category.toLowerCase() === category.toLowerCase();

      return categoryMatch;
    })
    .map((group) => {
      const allRooms = group.rooms;
      const availableRooms = group.rooms.filter((room) => room.status === "available");

      return {
        ...group,
        rooms: bulkBooking ? availableRooms : allRooms, // key condition
      };
    })
    .filter((group) => group.rooms.length > 0); // only keep groups with at least 1 room






  const getBookingsByDate = async (
    date: string
  ): Promise<CleanBookingData[] | null> => {
    try {
      const roomDateRef = doc(db, "room_dates", date);
      const roomDateSnap = await getDoc(roomDateRef);

      if (roomDateSnap.exists()) {
        const data = roomDateSnap.data();
        const rawBookings = data.bookings as BookingData[];

        const cleanedBookings: CleanBookingData[] = rawBookings.map((b) => ({
          amountpaid: b.amountpaid,
          bookingstatus: b.bookingstatus,
          checkinstatus: b.checkinstatus,
          checkintime: b.checkintime.toDate().toISOString(),
          checkouttime: b.checkouttime.toDate().toISOString(),
          roomnumber: b.roomnumber,
          totalamount: b.totalamount,
          roomtype: b.roomtype?.id || b.roomtype?.path || "unknown",
          user_id: b.user_id?.id || b.user_id?.path || "unknown",
        }));

        return cleanedBookings;
      } else {
        console.log("No bookings found for this date.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return null;
    }
  };


  useEffect(() => {
    const newdate = date.toLocaleDateString("en-CA");
    setCurrentDate(newdate)
    const fetchData = async () => {
      const formattedDate = date.toLocaleDateString("en-CA");
      const bookingsData = await getBookingsByDate(formattedDate);
      setBookings(bookingsData);
      if (bookings) {
        const updatedRoomData = mergeRoomDataWithBookings(roomData, bookings);
        setUpdatedBookings(updatedRoomData)
      } else {
        setUpdatedBookings(OriginalRoomData)
      }
    };

    fetchData();
    console.log(bookings)
    console.log(updatedbookings)
  }, [bookings, date, updatedbookings]);



  if (filteredRooms?.length === 0) {
    return <div className="p-6 text-red-600">No rooms found for the selected filters.</div>;
  }
  return (
    <>
      <div className="flex justify-end p-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          onClick={() => {
            if (!bulkBooking || category === "All Category Rooms") {
              alert("Please select a specific room category before booking.");
              return;
            }
            //  setTriggerEffect((prev) => !prev);
            setBulkBookingRoom({
              rooms: filteredRooms ? filteredRooms.flatMap(group => group.rooms) : []
            });
          }}
        >
          Book Rooms
        </button>
      </div>
      <div className="grid grid-cols-4 gap-6 p-6">

        {filteredRooms?.map((group, idx) => (
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
            } date={currentDate} onClose={() => setBookRoom(null)} />
          </div>
        )}
        {/* Bulk Book Room View Below */}
        {bulkBookingRoom && (
          <div
            className="absolute pr-6 left-1/2 transform -translate-x-1/2"
          // style={{ boxShadow: '0 0 100px 30px rgba(0, 0, 0, 0.5)' }}
          >

            <BulkRoomBooking room={
              bulkBookingRoom.rooms
            } date={currentDate} onClose={() => setBulkBookingRoom(null)} />
          </div>
        )}
        {/* View Customer View Below */}
        {selectedUser?.customerData && (
          <div
            className="absolute pr-6 left-1/2 transform -translate-x-1/2"
          // style={{ boxShadow: '0 0 100px 30px rgba(0, 0, 0, 0.5)' }}
          >

            <CustomerCard customerId={
              selectedUser.customerData
            } roomNumber={selectedUser.number} roomType = {selectedUser.type} date={currentDate} onClose={() => setSelectedUser(null)} />
          </div>
        )}
      </div>
    </>
  );
}
