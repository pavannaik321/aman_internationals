"use client"
import React, { useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import {
  MdAcUnit,
  MdTv,
  MdOutlineRoomService,
  MdOutlineLocalDrink,
  MdOutlineLocalCafe,
  MdWifi,
  MdLocalParking,
  MdPool,
  MdFitnessCenter,
  MdSpa,
  MdFreeBreakfast,
  MdOutlinePets,
} from "react-icons/md";

const allAmenities = [
  { name: "Parking", icon: <MdLocalParking /> },
  { name: "Swimming Pool", icon: <MdPool /> },
  { name: "Gym", icon: <MdFitnessCenter /> },
  { name: "Spa", icon: <MdSpa /> },
  { name: "Breakfast", icon: <MdFreeBreakfast /> },
  { name: "Pet Friendly", icon: <MdOutlinePets /> },
];

const allFacilities = [
  { name: "Air-Conditioning", icon: <MdAcUnit /> },
  { name: "Cable TV", icon: <MdTv /> },
  { name: "Room Service", icon: <MdOutlineRoomService /> },
  { name: "Water bottle", icon: <MdOutlineLocalDrink /> },
  { name: "Kettle", icon: <MdOutlineLocalCafe /> },
  { name: "Wi-Fi", icon: <MdWifi /> },
];
export default function EditRoomsDataSection() {
  const [selectedFacilities, setselectedFacilities] = useState<string[]>(["Wi-Fi", "Air-Conditioning"]);
  const [searchFacilities, setsearchFacilities] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState<string[]>(["Parking", "Swimming Pool"]);
  const [searchAmenity, setSearchAmenity] = useState("");


  const addFacility = (name: string) => {
    if (!selectedFacilities.includes(name)) {
      setselectedFacilities([...selectedFacilities, name]);
    }
    setsearchFacilities("");
  };

  const removeFacility = (name: string) => {
    setselectedFacilities(selectedFacilities.filter((item) => item !== name));
  };

  const filteredFacilities = allFacilities.filter(
    (f) =>
      f.name.toLowerCase().includes(searchFacilities.toLowerCase()) &&
      !selectedFacilities.includes(f.name)
  );

  const getFacilityIcon = (name: string) =>
    allFacilities.find((f) => f.name === name)?.icon;

  const [images, setImages] = useState([
    "rooms/img1.png",
    "rooms/img1.png",
    "rooms/img1.png",
    "rooms/img1.png",
  ]);
const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    fileInputRef.current?.click(); // Trigger the file input
  };
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };


  const addAmenity = (name: string) => {
    if (!selectedAmenity.includes(name)) {
      setSelectedAmenity([...selectedAmenity, name]);
    }
    setSearchAmenity("");
  };

  const removeAmenity = (name: string) => {
    setSelectedAmenity(selectedAmenity.filter((item) => item !== name));
  };

  const filteredAmenities = allAmenities.filter(
    (a) =>
      a.name.toLowerCase().includes(searchAmenity.toLowerCase()) &&
      !selectedAmenity.includes(a.name)
  );

  const getAmenityIcon = (name: string) =>
    allAmenities.find((a) => a.name === name)?.icon;

  return (
    <div className="pt-8">
      {/* Header */}
      <div className="bg-gray-500 text-white text-center py-2 rounded mb-6 font-semibold text-lg">
        Edit Section
      </div>

      {/* Form */}
      <div className="grid grid-cols-4 gap-4 text-sm">
        {/* Room Name */}
        <div>
          <label className="block mb-1 text-gray-500">Room Name</label>
          <input
            type="text"
            defaultValue="Standard Plus A/C"
            className="w-full border border-gray-400 text-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Room Size */}
        <div>
          <label className="block mb-1 text-gray-500">Room Size</label>
          <div className="flex">
            <input
              type="text"
              defaultValue="310"
              className="w-2/3 border border-gray-400 text-gray-600 rounded-l px-3 py-2"
            />
            <span className="w-1/3 border border-gray-400 text-gray-600 border-l-0 rounded-r px-3 py-2 flex items-center justify-center">
              Sq
            </span>
          </div>
        </div>

        {/* Tariff Include */}
        <div>
          <label className="block mb-1 text-gray-500">Tariff Include</label>
          <input
            type="text"
            defaultValue="12 %"
            className="w-full border border-gray-400 text-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* GST Include */}
        <div>
          <label className="block mb-1 text-gray-500">GST Include</label>
          <input
            type="text"
            defaultValue="18 %"
            className="w-full border border-gray-400 text-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Single Price */}
        <div>
          <label className="block mb-1 text-gray-500">Single Price</label>
          <input
            type="text"
            defaultValue="Rs 2,800"
            className="w-full border border-gray-400 text-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Double Price */}
        <div>
          <label className="block mb-1 text-gray-500">Double Price</label>
          <input
            type="text"
            defaultValue="Rs 3,600"
            className="w-full border border-gray-400 text-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Triple Price */}
        <div>
          <label className="block mb-1 text-gray-500">Triple Price</label>
          <input
            type="text"
            defaultValue="N/A"
            className="w-full border border-gray-400 text-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Quad Price */}
        <div>
          <label className="block mb-1 text-gray-500">Quad Price</label>
          <input
            type="text"
            defaultValue="N/A"
            className="w-full border border-gray-400 text-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Images Section */}
 <div className="">
      <p className="text-gray-500 mb-1">All Images</p>

      {/* Scrollable horizontal container */}
      <div className="overflow-x-auto border border-gray-300 rounded-md">
        <div className="flex flex-nowrap gap-4 p-4 w-max">
          {images.map((src, index) => (
            <div key={index} className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
              <img
                src={src}
                alt={`Room ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Add Images Button */}
      <div className="mt-4">
        <button
          onClick={handleAddImage}
          className="bg-gray-600 w-full text-white px-6 py-2 rounded font-semibold hover:bg-gray-700"
        >
          Add Images
        </button>
      </div>
    </div>

        {/* Facilities Section */}
        <div>
          <p className="mb-1 text-gray-500">All Facilities</p>
          <div className="max-w-md p-4 border border-gray-400 rounded-xl">

            {/* searchFacilities Bar */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchFacilities}
                onChange={(e) => setsearchFacilities(e.target.value)}
                placeholder="searchFacilities Facilities"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <FiSearch className="absolute right-3 top-2.5 text-gray-500" />
            </div>

            {/* selectedFacilities Facilities */}
            <div className="flex flex-wrap gap-2">
              {selectedFacilities.map((name) => (
                <div
                  key={name}
                  className="flex items-center px-3 py-1 bg-gray-100 rounded-full border border-gray-300"
                >
                  <span className="flex items-center text-sm gap-1">
                    {getFacilityIcon(name)}
                    {name}
                  </span>
                  <button
                    onClick={() => removeFacility(name)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>

            {/* Filtered Suggestions */}
            {searchFacilities && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => addFacility(f.name)}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-full bg-white hover:bg-gray-100 text-sm gap-1"
                    >
                      {f.icon}
                      {f.name}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No matches</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Amenities Section */}
        <div>
          <p className="mb-1 text-gray-500">All Facilities</p>
          <div className="max-w-md p-4 border border-gray-400 rounded-xl">

            {/* Search Bar */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchAmenity}
                onChange={(e) => setSearchAmenity(e.target.value)}
                placeholder="Search Amenities"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <FiSearch className="absolute right-3 top-2.5 text-gray-500" />
            </div>

            {/* Selected Amenities */}
            <div className="flex flex-wrap gap-2">
              {selectedAmenity.map((name) => (
                <div
                  key={name}
                  className="flex items-center px-3 py-1 bg-gray-100 rounded-full border border-gray-300"
                >
                  <span className="flex items-center text-sm gap-1">
                    {getAmenityIcon(name)}
                    {name}
                  </span>
                  <button
                    onClick={() => removeAmenity(name)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>

            {/* Filtered Suggestions */}
            {searchAmenity && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filteredAmenities.length > 0 ? (
                  filteredAmenities.map((a) => (
                    <button
                      key={a.name}
                      onClick={() => addAmenity(a.name)}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-full bg-white hover:bg-gray-100 text-sm gap-1"
                    >
                      {a.icon}
                      {a.name}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No matches</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



