"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../..//lib/firebaseConfig";
import { Users, Mail, Phone, Home, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ViewUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("adminAuth");
    if (!admin) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        Loading users...
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <Users className="w-6 h-6 text-indigo-600" /> Registered Users
      </h1>

      {users.length === 0 ? (
        <div className="text-gray-500 text-center mt-10">
          No registered users found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Address</th>
                {/* <th className="p-3 text-left">Bookings</th> */}
                <th className="p-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
  {users.map((user) => (
    <tr
      key={user.id}
      className="border-t border-gray-100 hover:bg-gray-50 transition"
    >
      {/* Name */}
      <td className="p-3 font-medium text-gray-800">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          {user.name || "N/A"}
        </div>
      </td>

      {/* Phone */}
      <td className="p-3 text-gray-700">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-green-600" />
          {user.phone || "—"}
        </div>
      </td>

      {/* Email */}
      <td className="p-3 text-gray-700">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          {user.email || "—"}
        </div>
      </td>

      {/* Address */}
      <td className="p-3 text-gray-700">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-orange-500" />
          {user.address || "—"}
        </div>
      </td>

      {/* Created At */}
      <td className="p-3 text-gray-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          {user.createdAt?.toDate
            ? user.createdAt.toDate().toLocaleDateString()
            : "—"}
        </div>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
}
