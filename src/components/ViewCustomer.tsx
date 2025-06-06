"use client";

interface CustomerInfoData {
    name: string;
    phone: string;
    idProof: string;
    checkInTime: string;
    checkOutTime: string;
    totalAmount: number;
    paidAmount: number;
}

export default function CustomerCard({ customer, date, onClose }: { customer: CustomerInfoData, date: Date, onClose: () => void; }) {
    return (
        <div className="w-2xl mx-auto mt-6 p-6 rounded-2xl shadow-lg bg-black space-y-4">
            <div className="flex items-center justify-between mb-4">

                <h2 className="text-2xl font-semibold text-white">
                    Customer Details
                </h2>
                <button
                    onClick={onClose}
                    className="text-sm text-white border border-red-600 px-3 py-1 rounded hover:bg-red-950"
                >
                    Close
                </button>
            </div>
            <div className="space-y-2 text-white">
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Phone:</strong> {customer.phone}</p>
                <p><strong>ID Proof:</strong> {customer.idProof}</p>
                <p><strong>Check-In Time:</strong> {customer.checkInTime}</p>
                <p><strong>Check-Out Time:</strong> {customer.checkOutTime}</p>
                <p><strong>Booking Date:</strong> {date.toDateString()}</p>
                <p><strong>Total Amount:</strong> ₹{customer.totalAmount}</p>
                <p><strong>Paid Amount:</strong> ₹{customer.paidAmount}</p>
                <p><strong>Due:</strong> ₹{(customer.totalAmount ?? 0) - (customer.paidAmount ?? 0)}</p>
            </div>
                    <button
        //   type="submit"
          className="w-full border border-red-600 text-white py-2 rounded"
        >
          Check-Out
        </button>
        </div>
    );
}
