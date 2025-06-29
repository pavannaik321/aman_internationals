"use client";
import { useRoomFilter } from "@/store/useRoomFilter";
import { useEffect, useState } from "react";

import HomeRoomView from "./HomeRoomView";
import BookingConfirmation from "./BookUsers";
// import CustomerCard from "./ViewCustomer";
import { BookingData } from "@/app/checkdata/page";
import { collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

import ViewCheckInCustomer from "./ViewCheckInCustomer";
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
  checkintime?: string;
  checkouttime?: string;
}


function convertToIST(dateInput: Date | Timestamp): string {
  // Convert Firebase Timestamp to JS Date if needed
  const utcDate = dateInput instanceof Timestamp ? dateInput.toDate() : dateInput;

  // Format date using Asia/Kolkata timezone
  return utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true, // Use false if you prefer 24-hour format
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


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
          checkintime: match.checkintime,
          checkouttime: match.checkouttime
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

export default function CheckinRoomGrid() {

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookRoom, setBookRoom] = useState<Room | null>(null);
  const [selectedUser, setSelectedUser] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<CleanBookingData[] | null>(null);
  const todaysdate = new Date();
  const [phoneInput, setPhoneInput] = useState("");
const [searchedUserId, setSearchedUserId] = useState<string | null>(null);

  const [currentDate, setCurrentDate] = useState<string>(todaysdate.toLocaleDateString("en-CA"));
  const [updatedbookings, setUpdatedBookings] = useState<{
    date: Date;
    rooms: {
      category: string;
      rooms: Room[];
    }[];
  } | null>(null);
  const { date, category } = useRoomFilter();


const filteredRooms = updatedbookings?.rooms
  .filter((group) => {
    const categoryMatch =
      category.toLowerCase() === "all category rooms" ||
      group.category.toLowerCase() === category.toLowerCase();

    return categoryMatch;
  })
  .map((group) => {
    const filteredRoomList = group.rooms.filter((room) => {
      // Only apply phone filter if search is active
      if (searchedUserId) {
        return room?.customerData === searchedUserId;
      }
      return true; // No search → include all
    });

    return {
      ...group,
      rooms: filteredRoomList,
    };
  })
  .filter((group) => group.rooms.length > 0); // remove empty groups


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
          checkintime: convertToIST(b.checkintime),
          checkouttime: convertToIST(b.checkouttime),
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
const handlePhoneSearch = async () => {
  if (!phoneInput) return;

  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const matchingUser = usersSnapshot.docs.find(
      (doc) => doc.data().phone === phoneInput
    );

    if (matchingUser) {
      setSearchedUserId(matchingUser.id);
    } else {
      alert("No user found with this phone number.");
      setSearchedUserId(null);
    }
  } catch (error) {
    console.error("Error searching user by phone:", error);
    setSearchedUserId(null);
  }
};



  useEffect(() => {
  const now = new Date();
  // Create a Date object for today at 1:30 PM
  const todayAtOneThirty = new Date(now);
  todayAtOneThirty.setHours(13, 30, 0, 0);

  // Determine the target date for booking fetch
  const effectiveDate = now >= todayAtOneThirty ? date : new Date(date.getTime() - 24 * 60 * 60 * 1000); // If before 1:30 PM, use previous day

  const formattedDate = effectiveDate.toLocaleDateString("en-CA");
  setCurrentDate(formattedDate);

  const fetchData = async () => {
    const bookingsData = await getBookingsByDate(formattedDate);
    setBookings(bookingsData);

    if (bookings) {
      const updatedRoomData = mergeRoomDataWithBookings(roomData, bookings);
      setUpdatedBookings(updatedRoomData);
    } else {
      setUpdatedBookings(OriginalRoomData);
    }
  };

  fetchData();
}, [date,bookings,updatedbookings]);

  if (filteredRooms?.length === 0) {
    return <div className="p-6 text-red-600">No rooms found for the selected filters.</div>;
  }
  return (
    <div>
      {/* Filters */}
       <div className="flex flex-col flex-wrap gap-8 items-center justify-between p-4">
  <div className="flex flex-row items-center justify-between w-full gap-4">
    <input
      type="tel"
      value={phoneInput}
      onChange={(e) => setPhoneInput(e.target.value)}
      placeholder="Enter Phone Number"
      className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
<div>
{!searchedUserId && (
    <button
      className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
      onClick={handlePhoneSearch}
    >
      Search Rooms
    </button>
)}
    {searchedUserId && (
  <button
    className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
    onClick={() => {
      setSearchedUserId(null);
      setPhoneInput("");
    }}
  >
    Clear Filter
  </button>
)}
</div>

  </div>
</div>

    <div className="grid grid-cols-4 gap-6 p-6">
      {filteredRooms?.map((group, idx) => (
        <div key={idx}>
          <h2 className="text-center font-bold text-gray-800 mb-4">{group.category}</h2>
          <div className="flex flex-col gap-4">
            {group.rooms.map((room) => (
              <div
                key={room.number}
                className="border-1 rounded-md shadow-sm flex-col gap-4"
              >
                <div className="flex items-center gap-4 p-2">

                  <div
                    className={`w-12 h-12 rounded text-white font-bold flex items-center justify-center ${room.checkedin?statusColor["booked_not_checked_in"]:statusColor[room.status]}`}
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
                {
                  (room.status == "booked") ? (
                    <div className={`border-t border-black rounded-b-md text-center text-sm py-1 flex justify-evenly text-white ${room.checkedin?statusColor["booked_not_checked_in"]:statusColor[room.status]}`}>
                      <div>{room.checkintime}</div>
                      <h2 className="text-black">|</h2>
                      <div>{room.checkouttime}</div>
                    </div>
                  ) : (
                    <div></div>
                  )
                }
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
      {/* View Customer View Below */}
      {selectedUser?.customerData && (
        <div
          className="absolute pr-6 left-1/2 transform -translate-x-1/2"
        // style={{ boxShadow: '0 0 100px 30px rgba(0, 0, 0, 0.5)' }}
        >

          <ViewCheckInCustomer customerId={
            selectedUser.customerData
          }  roomNumber={selectedUser.number} checkinStatus={selectedUser?.checkedin ?? false} date={currentDate} onClose={() => setSelectedUser(null)}  />
        </div>
      )}
    </div>
    </div>
  );
}
