"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";


// components/Header.tsx
export default function Header() {
  // use current page to check active page
  const currentPath = usePathname();
  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
      <div className="text-2xl font-bold text-gray-800">Aman Internationals</div>
      <nav className="flex space-x-8 text-lg">
        <Link href="/" className={currentPath=='/'?`text-black`:`text-gray-500 font-medium`}>Dashborad</Link>
        <Link href="/bookings" className={currentPath=='/bookings'?`text-black`:`text-gray-500 font-medium`}>Bookings</Link>
        <Link href="/checkin" className={currentPath=='/checkin'?`text-black`:`text-gray-500 font-medium`}>Check-in</Link>
        <Link href="/bulkbooking" className={currentPath=='/bulkbooking'?`text-black`:`text-gray-500 font-medium`}>Bulk Booking</Link>
        <Link href="/rooms" className={(currentPath=='/rooms' || currentPath=='/editrooms')?`text-black`:`text-gray-500 font-medium`}>Rooms</Link>
      </nav>
    </header>
  );
}
