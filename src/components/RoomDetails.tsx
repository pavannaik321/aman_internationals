// components/Rooms.tsx

type Room = {
  name: string;
  available: number;
  total: number;
  price: number;
};

const rooms: Room[] = [
  { name: "STANDARD PLUS", available: 2, total: 30, price: 568 },
  { name: "STANDARD A/C", available: 2, total: 35, price: 1068 },
  { name: "SUITE A/C", available: 2, total: 25, price: 1568 },
  { name: "CLUB A/C", available: 4, total: 10, price: 2568 },
  { name: "STANDARD NON  A/C", available: 4, total: 10, price: 2568 },
];

export default function RoomDetails() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 m-4">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {room.name}
            </h3>
            <p className="text-lg font-bold text-gray-600">
              {room.available}
              <span className="text-m font-normal text-gray-500">/{room.total}</span>
            </p>
            <p className="text-blue-500 font-bold text-lg">
              Rs {room.price.toLocaleString()}
              <span className="text-m text-gray-500 font-normal">/ day</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
