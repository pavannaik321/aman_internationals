'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

type User = {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: any;
  idnumber: string;
  idtype: string;
};

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList: User[] = snapshot.docs
        .map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name ?? '',
            phone: data.phone ?? '',
            address: data.address ?? '',
            createdAt: data.createdAt ?? null,
            idnumber: data.idnumber ?? '',
            idtype: data.idtype ?? '',
          };
        })
        .sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
        });

      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  if (loading) return <p className="p-4 text-center">Loading users...</p>;

  return (
    <div className="p-6 bg-white max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">ID Type</th>
              <th className="p-2 border">ID Number</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="p-2 border">
                  {user.createdAt?.toDate
                    ? user.createdAt.toDate().toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.phone}</td>
                <td className="p-2 border">{user.address}</td>
                <td className="p-2 border">{user.idtype}</td>
                <td className="p-2 border">{user.idnumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
