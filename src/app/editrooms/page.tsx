"use client"
import EditRoomsDataSection from '@/components/EditRoomsDataSection';
import RoomView from '@/components/RoomView';
// import { useSearchParams } from 'next/navigation';

export default function EditRooms(

) {
    // const searchParams = useSearchParams();
//   const category = searchParams.get('category');
//   const price = searchParams.get('price');
  return (
    <div className="p-8">
        <RoomView />
        <EditRoomsDataSection />
    </div>
  );
}
