"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  phone: string;
  idtype:string;
  idnumber:string;
  address: string;
  gst?: string;
}


const roomData: {
  category_id: string;
  category: string;
  single_price: number;
  double_price: number;
  triple_price: number;
  quad_price: number;
  pax: number;
  tariff: number;
  gst: number;
  people: number;
  days: number;
  images: string[];
  facilities: string[];
  amenities: string[];
}[] = [
  {
    category_id: "suite-roomtype-001",
    category: "SUITE",
    single_price: 7200,
    double_price: 8000,
    triple_price: 8700,
    quad_price: 9400,
    pax: 2,
    tariff: 7500,
    gst: 1350,
    people: 2,
    days: 1,
    images: ["/rooms/img1.png"],
    facilities: [
      "Air-Conditioning",
      "Cable TV",
      "Kettle",
      "Water bottle",
      "Room Service",
      "Mini Bar",
      "Bathtub",
      "Private Balcony"
    ],
    amenities: ["Parking", "Swimming Pool", "Gym", "Spa", "Breakfast", "Pet Friendly"]
  },
  {
    category_id: "club-roomtype-002",
    category: "CLUB",
    single_price: 5800,
    double_price: 6600,
    triple_price: 7200,
    quad_price: 7900,
    pax: 2,
    tariff: 6200,
    gst: 1116,
    people: 2,
    days: 1,
    images: ["/rooms/img1.png"],
    facilities: [
      "Air-Conditioning",
      "Cable TV",
      "Kettle",
      "Water bottle",
      "Room Service",
      "Work Desk"
    ],
    amenities: ["Parking", "Swimming Pool", "Gym", "Spa", "Breakfast", "Pet Friendly"]
  },
  {
    category_id: "std-plus-ac-roomtype-003",
    category: "Standard Plus A/C",
    single_price: 4000,
    double_price: 4500,
    triple_price: 5000,
    quad_price: 5500,
    pax: 2,
    tariff: 4300,
    gst: 774,
    people: 2,
    days: 1,
    images: ["/rooms/img1.png"],
    facilities: [
      "Air-Conditioning",
      "Cable TV",
      "Kettle",
      "Water bottle",
      "Room Service"
    ],
    amenities: ["Parking", "Swimming Pool", "Gym", "Spa", "Breakfast", "Pet Friendly"]
  },
  {
    category_id: "std-ac-roomtype-004",
    category: "Standard A/C",
    single_price: 3360,
    double_price: 3900,
    triple_price: 4500,
    quad_price: 5100,
    pax: 2,
    tariff: 3600,
    gst: 648,
    people: 2,
    days: 1,
    images: ["/rooms/img1.png"],
    facilities: [
      "Air-Conditioning",
      "Cable TV",
      "Kettle",
      "Water bottle",
      "Room Service"
    ],
    amenities: ["Parking", "Swimming Pool", "Gym", "Spa", "Breakfast", "Pet Friendly"]
  },
  {
    category_id: "std-nonac-roomtype-005",
    category: "Standard Non A/C",
    single_price: 2800,
    double_price: 3200,
    triple_price: 3700,
    quad_price: 4200,
    pax: 2,
    tariff: 3000,
    gst: 540,
    people: 2,
    days: 1,
    images: ["/rooms/img1.png"],
    facilities: [
      "Cable TV",
      "Kettle",
      "Water bottle",
      "Room Service"
    ],
    amenities: ["Parking", "Swimming Pool", "Gym", "Spa", "Breakfast", "Pet Friendly"]
  }
];


export default function UsersPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    idtype:"",
    idnumber: "",
    address:"",
    gst: "",
  });

  const [users, setUsers] = useState<User[]>([]);

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data: User[] = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name: docData.name ?? "",
          phone: docData.phone ?? "",
          idtype: docData.idtype ?? "",
          idnumber: docData.idnumber ?? "",
          address: docData.address ?? "",
          gst: docData.gst ?? "",
        };
      });
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users: ", err);
    }
  };

  // ✅ Add User
  const handleAddUser = async () => {
    const { name, phone,idtype,idnumber,address, gst } = formData;
    if (!name || !phone || !idnumber || !idtype || !address) return;

    try {
      await addDoc(collection(db, "users"), {
        name,
        phone,
        idtype,
        idnumber,
        gst: gst || null,
        address,
        createdAt: new Date(),
      });
      setFormData({ name: "", phone: "", idtype:"", idnumber:"",address:"",gst: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error adding user: ", err);
    }
  };
const addRoomTypesToFirestore = async () => {
  try {
    const roomCollection = collection(db, "roomtypes");

    for (const room of roomData) {
      await addDoc(roomCollection, {
        ...room,
        createdAt: new Date()
      });
    }

    console.log("✅ All room types added to Firestore");
  } catch (error) {
    console.error("🔥 Error adding room types: ", error);
  }
};
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Add User to Firestore</h1>

      <div className="mb-6 space-y-2">
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border px-3 py-2 mr-2 w-full md:w-1/2"
          placeholder="Name"
        />
        <input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border px-3 py-2 mr-2 w-full md:w-1/2"
          placeholder="Phone"
        />
        <input
          value={formData.idtype}
          onChange={(e) => setFormData({ ...formData, idtype: e.target.value })}
          className="border px-3 py-2 mr-2 w-full md:w-1/2"
          placeholder="Id type (Aadhaar, PAN, etc.)"
        />
        <input
          value={formData.idnumber}
          onChange={(e) => setFormData({ ...formData, idnumber: e.target.value })}
          className="border px-3 py-2 mr-2 w-full md:w-1/2"
          placeholder="Id proof"
        />
        <input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="border px-3 py-2 mr-2 w-full md:w-1/2"
          placeholder="Address"
        />
        <input
          value={formData.gst}
          onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
          className="border px-3 py-2 mr-2 w-full md:w-1/2"
          placeholder="GST (optional)"
        />
        <br />
        <button
          onClick={handleAddUser}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add User
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">User List:</h2>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul className="list-disc ml-5">
            {users.map((user) => (
              <li key={user.id}>
                <span className="font-semibold">{user.name}</span> — {user.phone}
                {user.idtype && <span className="text-sm text-gray-600"> ({user.idtype})</span>}
                {user.idnumber && <span className="text-sm text-gray-600"> (ID: {user.idnumber})</span>}

                <div className="text-sm text-gray-600">Address: {user.address}</div>


                {user.gst && <span className="text-sm text-gray-600"> (GST: {user.gst})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
              <button
          onClick={addRoomTypesToFirestore}
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add User
        </button>
    </div>
  );
}
