"use client";



export default function CheckInFilters() {
    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [bulkBooking, setBulkBooking] = useState(true);


    // const formatDate = (date: Date) =>
    //     date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // const changeDate = (days: number) => {
    //     const newDate = new Date(selectedDate);
    //     newDate.setDate(newDate.getDate() + days);
    //     setSelectedDate(newDate);
    // };



    return (
        <div className="flex flex-col flex-wrap gap-8 items-center justify-between p-4">
            {/* Section 1 */}
            <div className="flex flex-row items-center justify-between w-full">

                <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Buttons 1*/}
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800">
                    Search Rooms
                </button>
            </div>

        </div>
    );
}
