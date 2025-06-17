"use client"
import EditRoomsDataSection from '@/components/EditRoomsDataSection';
import { Room } from '@/components/RoomCards';
import RoomView from "@/components/RoomView";
import { useEffect, useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";

export default function EditRooms() {

const [roomData, setRoomData] = useState<Room | undefined>();



useEffect(() => {
  const storedRoom = localStorage.getItem("selectedRoom");
  if (storedRoom) {
    const roomObj = JSON.parse(storedRoom);
    setRoomData(roomObj);

    // Load other states as needed
  }
}, []);

const handleSaveRoom = async (updatedRoom: Room) => {
  try {
    const roomRef = doc(db, "roomtypes", updatedRoom.id); // adjust collection name if needed

    await updateDoc(roomRef, {
      category: updatedRoom.category,
      room_size: updatedRoom.room_size,
      tariff: updatedRoom.tariff,
      gst: updatedRoom.gst,
      single_price: updatedRoom.single_price,
      double_price: updatedRoom.double_price,
      triple_price: updatedRoom.triple_price,
      quad_price: updatedRoom.quad_price,
      facilities: updatedRoom.facilities,
      amenities: updatedRoom.amenities,
      images: updatedRoom.images,
    });

    alert("Room updated successfully!");
  } catch (error) {
    console.error("Error updating room:", error);
    alert("Failed to update room.");
  }
};

  return (
    <div className="p-8">

        {roomData &&
        <div>
        <RoomView data={roomData} />
        <EditRoomsDataSection data={roomData} onSave={handleSaveRoom} />
        </div>
        
        }
    </div>
  );
}
