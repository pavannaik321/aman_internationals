import React from 'react'
const CheckInRoomData : {
    number: number;
    type: string;
    status: RoomStatus;
}[] = [
    
        { number: 305, type: "STANDARD A/C", status: "booked" },
      { number: 306, type: "STANDARD A/C", status: "booked_not_checked_in" },
    
]
    type RoomStatus = 'available' | 'booked' | 'booked_not_checked_in';
const statusColor: Record<RoomStatus, string> = {
  available: "bg-green-400",
  booked: "bg-red-400",
  booked_not_checked_in: "bg-cyan-400",
};

export default function CheckInRooms() {
  return (
    <div className="grid grid-cols-4 gap-6 p-6">
        {CheckInRoomData.map((room) => (
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
                    <button className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
                      View Room
                    </button>
                    {room.status === "available" && (
                      <button className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
                        Book Room
                      </button>
                    )}
                    {room.status === "booked" && (
                      <button className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
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
  )
}
