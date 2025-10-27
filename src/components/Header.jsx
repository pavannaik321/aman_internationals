// "use client";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function Header() {
//   const currentPath = usePathname();
//   const router = useRouter();
//   const [admin, setAdmin] = useState(null);

//   // Load admin once initially
//   useEffect(() => {
//     const storedAdmin = localStorage.getItem("adminAuth");
//     if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

//     // Listen for login/logout events
//     const handleLogin = () => {
//       const updated = localStorage.getItem("adminAuth");
//       setAdmin(updated ? JSON.parse(updated) : null);
//     };

//     window.addEventListener("admin-login", handleLogin);
//     window.addEventListener("admin-logout", handleLogin);

//     return () => {
//       window.removeEventListener("admin-login", handleLogin);
//       window.removeEventListener("admin-logout", handleLogin);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("adminAuth");
//     window.dispatchEvent(new Event("admin-logout")); // 🔥 notify Header instantly
//     setAdmin(null);
//     router.push("/login");
//   };

//   const handleLogin = () => router.push("/login");

//   return (
//     <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white border-b border-gray-100">
//       <div
//         onClick={() => router.push("/")}
//         className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition"
//       >
//         Aman Internationals
//       </div>

//       <nav className="flex space-x-8 text-lg">
//         <Link href="/" className={currentPath === "/" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
//           Calendar
//         </Link>
//         <Link href="/bookings" className={currentPath === "/bookings" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
//           Bookings
//         </Link>
//         <Link href="/check-in" className={currentPath === "/check-in" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
//           Check-In
//         </Link>
//         <Link href="/rooms" className={currentPath === "/rooms" || currentPath === "/editrooms" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
//           Rooms
//         </Link>
//         <Link href="/view-users" className={currentPath === "/view-users" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
//           Users
//         </Link>
//       </nav>

//       <div className="flex items-center gap-4">
//         {admin ? (
//           <>
//             <span className="text-gray-700 text-sm bg-gray-100 px-3 py-1 rounded-full">{admin.email}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={handleLogin}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </header>
//   );
// }


"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export default function Header() {
  const currentPath = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const audioRef = useRef(null);
  const lastBookingRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔊 Play sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("🔊 Notification sound played successfully");
            setIsPlaying(true);
            setTimeout(() => setIsPlaying(false), 1000);
          })
          .catch((err) => {
            console.log("⚠️ Sound blocked or failed:", err.message);
          });
      } else {
        console.log("⚠️ Audio element not ready or browser blocked autoplay.");
      }
    }
  };

  // 🎹 Keyboard shortcut to test sound
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "t" || e.key === "T") {
        console.log("🧩 Test key pressed — playing sound");
        playNotificationSound();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // 🧩 Load admin session
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminAuth");
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

    const handleLoginChange = () => {
      const updated = localStorage.getItem("adminAuth");
      setAdmin(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("admin-login", handleLoginChange);
    window.addEventListener("admin-logout", handleLoginChange);

    return () => {
      window.removeEventListener("admin-login", handleLoginChange);
      window.removeEventListener("admin-logout", handleLoginChange);
    };
  }, []);

  // 🔁 Realtime Firestore booking listener
  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Detect if new booking arrived
      if (lastBookingRef.current && newBookings.length > 0) {
        if (newBookings[0].id !== lastBookingRef.current.id) {
          playNotificationSound();
          setNewCount((prev) => prev + 1);
        }
      }

      if (newBookings.length > 0) lastBookingRef.current = newBookings[0];
      setBookings(newBookings);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    window.dispatchEvent(new Event("admin-logout"));
    setAdmin(null);
    router.push("/login");
  };

  const handleLogin = () => router.push("/login");

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setNewCount(0);
  };

  const clearNotifications = () => {
    setBookings([]);
    setShowDropdown(false);
    setNewCount(0);
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white border-b border-gray-100 relative">
      {/* Notification sound */}
      <audio ref={audioRef} src="/iphone_remix.mp3" preload="auto" />

      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition"
      >
        Aman Internationals
      </div>

      {/* Navigation */}
      <nav className="flex space-x-8 text-lg">
        <Link href="/" className={currentPath === "/" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
          Calendar
        </Link>
        <Link href="/bookings" className={currentPath === "/bookings" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
          Bookings
        </Link>
        <Link href="/check-in" className={currentPath === "/check-in" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
          Check-In
        </Link>
        <Link href="/rooms" className={(currentPath === "/rooms" || currentPath === "/editrooms") ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
          Rooms
        </Link>
        <Link href="/view-users" className={currentPath === "/view-users" ? "text-black font-semibold" : "text-gray-500 hover:text-black"}>
          Users
        </Link>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-6 relative">
        {/* 🔔 Notification Bell */}
        <div className="relative cursor-pointer" onClick={toggleDropdown}>
          <Bell className="w-6 h-6 text-gray-700 hover:text-indigo-600 transition" />
          {newCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {newCount}
            </span>
          )}
        </div>

        {/* 🧾 Dropdown Notification Box */}
        {showDropdown && (
          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg w-96 z-50">
            <div className="flex justify-between items-center p-3 border-b bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">Recent Bookings</h3>
              <button
                onClick={clearNotifications}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {bookings.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm text-center">No bookings yet</div>
              ) : (
                bookings.slice(0, 10).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <div className="text-sm font-semibold text-gray-900">
                      {b.name || "Guest"} booked a {b.roomType || "room"}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      📞 {b.phone || "No contact"} | 📍 {b.address || "No address"}
                    </div>
                    {b.user_id && (
                      <div className="text-xs text-gray-500 mt-1">
                        User ID: {b.user_id}
                      </div>
                    )}
                    <div className="text-[11px] text-gray-400 mt-1">
                      {b.createdAt?.toDate
                        ? b.createdAt.toDate().toLocaleString()
                        : "Time unavailable"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 🧠 Admin Info */}
        {admin ? (
          <>
            <span className="text-gray-700 text-sm bg-gray-100 px-3 py-1 rounded-full">
              {admin.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        )}

      </div>
    </header>
  );
}
