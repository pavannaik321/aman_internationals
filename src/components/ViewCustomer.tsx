"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, DocumentReference, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

interface CustomerData {
  name: string;
  phone: string;
  idnumber?: string;
  idtype?: string;
  address?: string;
}


interface BookingData {
  user_id: DocumentReference;
  roomnumber: number;
  totalamount: number;
  amountpaid: number;
  checkintime: Timestamp;
  checkouttime: Timestamp;
  bookingstatus: string;
  checkinstatus: boolean;
  roomtype: DocumentReference;
}




export default function CustomerCard({
  customerId,
  roomNumber,
  date,
  roomType,
  onClose,
}: {
  customerId: string;
  roomNumber: number;
  date: string;
  roomType:string,
  onClose: () => void;
}) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);


  const handlePrint = (booking: BookingData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    function numberToWords(num: number): string {
      const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen',
      ];
      const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

      function inWords(n: number): string {
        if (n === 0) return 'Zero';
        if (n < 20) return a[n];
        if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
        if (n < 1000) return `${a[Math.floor(n / 100)]} Hundred ${inWords(n % 100)}`.trim();
        if (n < 100000) return `${inWords(Math.floor(n / 1000))} Thousand ${inWords(n % 1000)}`.trim();
        if (n < 10000000) return `${inWords(Math.floor(n / 100000))} Lakh ${inWords(n % 100000)}`.trim();
        return `${inWords(Math.floor(n / 10000000))} Crore ${inWords(n % 10000000)}`.trim();
      }

      return inWords(num);
    }




    // Discount
    const discount = 214.20;

    // Room Price Calculations
    const taxable_value = Math.round((booking.totalamount - discount) * 100) / 100;
    const cgst = Math.round((taxable_value * 6) / 100 * 100) / 100;
    const sgst = Math.round((taxable_value * 6) / 100 * 100) / 100;
    const total_room_price = Math.round((taxable_value + cgst + sgst) * 100) / 100;

    // Restaurant
    const resturnat_taxable_value = 190.48;
    const resturant_cgst = Math.round((resturnat_taxable_value * 2.5) / 100 * 100) / 100;
    const resturant_sgst = Math.round((resturnat_taxable_value * 2.5) / 100 * 100) / 100;
    const total_resturant_amount = Math.round((resturnat_taxable_value + resturant_cgst + resturant_sgst) * 100) / 100;

    // Laundry
    const laundry_taxable_value = 169.49;
    const laundry_cgst = Math.round((laundry_taxable_value * 8) / 100 * 100) / 100;
    const laundry_sgst = Math.round((laundry_taxable_value * 9) / 100 * 100) / 100;
    const total_laundry_amount = Math.round((laundry_taxable_value + laundry_cgst + laundry_sgst) * 100) / 100;

    // Grand Total Calculations
    const total_taxable_amount = Math.round((total_resturant_amount + total_laundry_amount) * 100) / 100;
    const total_cgst_amount = Math.round((resturant_cgst + laundry_cgst) * 100) / 100;
    const total_sgst_amount = Math.round((resturant_sgst + laundry_sgst) * 100) / 100;
    const total_bill_amount = Math.round((total_room_price + total_taxable_amount + total_cgst_amount + total_sgst_amount) * 100) / 100;

    // Convert to words
    const amountInWords = numberToWords(Math.round(total_bill_amount));

    const formattedDate = new Date().toLocaleDateString('en-IN');


const formatDateTime = (timestamp: Timestamp) => {
  const date = timestamp.toDate(); // Convert Firebase Timestamp to JS Date

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString('en-IN', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-IN', optionsTime);

  return {
    formattedDate,
    formattedTime,
  };
};

// Example usage with Firebase Timestamp fields
const { formattedDate: checkinDate, formattedTime: checkinTime } = formatDateTime(booking.checkintime);
const { formattedDate: checkoutDate, formattedTime: checkoutTime } = formatDateTime(booking.checkouttime);



    //   const roomRows = booking.rooms.map((room, index) => `
    //     <tr>
    //       <td>${index + 1}</td>
    //       <td>Room ${room.number}</td>
    //       <td>996311</td>
    //       <td>--</td>
    //       <td>--</td>
    //       <td>--</td>
    //       <td>--</td>
    //       <td>--</td>
    //       <td>--</td>
    //       <td>--</td>
    //       <td>--</td>
    //     </tr>
    //   `).join('');

    printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Hotel Invoice</title>
      <style>
      @media print {
  @page {
    size: A5;
    margin: 0.5cm;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 12px;
    zoom: 0.90; /* Shrink content slightly */
  }

  table, .details, .room-info, .totals, .footer-container, .signature, .title_heading {
    page-break-inside: avoid;
  }

  .footer-container {
    font-size: 12px;
  }
}

        body {
            font-family: Arial, sans-serif;
          padding: 10px;
          max-width: 800px;
          margin: auto;
          // border: 1px solid #ccc;
        }

        h1, h2, h3 {
          text-align: center;
          margin: 10px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .details,
        .room-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          margin-top: 10px;
        }

        table, th, td {
          border: 1px solid black;
        }

        table{
        margin-top:40px;
        margin-botton:40px;
        
        }

        th, td {
          padding: 6px;
          text-align: center;
        }

        .totals {
          text-align: left;
          font-weight: bold;
          border: 1px solid black;
          border-top: 0.1px solid rgb(229, 229, 229);
          padding: 10px;
        }

        .signature {
          margin-top: 80px;
margin-bottom:80px;

          display: flex;
          justify-content: space-between;
        }

        .footer-container {
          border-top: 1px solid #000;
          padding-top: 10px;
          margin-top: 30px;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }

        .footer-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .footer-column {
          display: flex;
          align-items: center;
          flex-direction: column;
          flex: 1;
        }

        .footer-column.left {
          align-items: flex-start;
        }

        .footer-column.center {
          align-items: flex-start;
          padding-left: 20px;
        }

        .footer-column.right {
          align-items: flex-end;
        }

        .footer-item {
          display: flex;
          align-items: center;
          margin: 4px 0;
        }

        .footer-item img {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }

        .footer-text {
          color: #000;
        }

        .footer-email, .footer-website {
          margin-bottom: 4px;
        }

        .title_heading {
          display: flex;
          justify-content: space-between;
        }

        .heading_image {
          display: flex;
          flex-direction: row;
          padding-left: 30px;
        }

        .image {
          width: 80px;
          height: 80px;
        }
        .title_container {
            padding-left: 80px;
        }
        .subtitle_container{
            padding-left:80px;
        }
        .title{
            font-size: 48px;
        }
        .subtitle{
            font-size:20px;
            font-weight: bold;
        }
        .room-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
            p{
            font-size:17px;
       margin:10px;
            }

            .eo_heading{
            margin-top:10px;
            
            }
    </style>
</head>

<body>
    <div class="header">
        <div class="heading_image">
            <!-- Logo image -->
            <div class="image_container">
                <img class="image" src="/logo/aman_international_logo.png" alt="" srcset="">

            </div>

            <div>
                <h2 class="title title_container">AMAN INTERNATIONAL</h2>
                <p class="subtitle subtitle_container">| Asiya Hospitality & Tourism Private Limited |<br>Karwar</p>
            </div>
        </div>
        <hr>
        <div class="title_heading">
            <p><strong>GSTIN:</strong> 29AAVCA0591Q1ZO</p>
            <h3>TAX INVOICE</h3>
        </div>
    </div>

      <div class="details">
        <div>
          <p><strong>Invoice No:</strong> 553</p>
          <p><strong>Guest Name:</strong> ${customer?.name}</p>
          <p><strong>Address:</strong> ${customer?.address}</p>
          <p><strong>Mobile No:</strong> ${customer?.idnumber}</p>
        </div>
        <div>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Guest GSTIN:</strong> 0</p>
        </div>
      </div>
          <div class="room-info">
        <div>
            <p><strong>Room No:</strong> ${booking.roomnumber}</p>
            <p><strong>Arrival Date:</strong> ${checkinDate}</p>
            <p><strong>Check-in Time:</strong> ${checkinTime}</p>
        </div>
        <div>
            <p><strong>Room Type:</strong> ${roomType}</p>
            <p><strong>Departure Date:</strong> ${checkoutDate}</p>
            <p><strong>Checkout Time:</strong> ${checkoutTime}</p>
        </div>
    </div>

         <table>
        <thead>
            <tr>
                <th>SNo</th>
                <th>Description</th>
                <th>SAC</th>
                <th>Amount</th>
                <th>Disc</th>
                <th>Taxable Value</th>
                <th>CGST %</th>
                <th>Amt.</th>
                <th>SGST %</th>
                <th>Amt.</th>
                <th>Total Rs.</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Room Rent 2000 x 1 Days</td>
                <td>996311</td>
                <td>${booking.totalamount}</td>
                <td>${discount}</td>
                <td>${taxable_value}</td>
                <td>6.0</td>
                <td>1${cgst}</td>
                <td>6.0</td>
                <td>${sgst}</td>
                <td>${total_room_price}</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Extra Person</td>
                <td>996311</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Restaurant</td>
                <td>996311</td>
                <td>${resturnat_taxable_value}</td>
                <td>--</td>
                <td>${resturnat_taxable_value}8</td>
                <td>2.5</td>
                <td>${resturant_cgst}</td>
                <td>2.5</td>
                <td>${resturant_sgst}</td>
                <td>${total_resturant_amount}</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Laundry</td>
                <td>996311</td>
                <td>${laundry_taxable_value}</td>
                <td>--</td>
                <td>${laundry_taxable_value}</td>
                <td>9.0</td>
                <td>1${laundry_cgst}</td>
                <td>9.0</td>
                <td>${laundry_sgst}</td>
                <td>${total_laundry_amount}</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Other Expenses</td>
                <td>996311</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>

            </tr>
            <td colspan="2"><b>Total</b></td>
            <td colspan="3">--</td>

            <td>${total_taxable_amount}</td>
            <td colspan="2">${total_cgst_amount}</td>
            <td colspan="2">${total_sgst_amount}</td>
            <td>${total_bill_amount}</td>
            </tr>
        </tbody>
    </table>

      <div class="totals">
        <p>Total Invoice Value</p>
        <p>Rupees ${amountInWords} only</p>
        <hr>
        <div class="title_heading">
          <p>Less Advance:</p>
          <p>₹${total_bill_amount}</p>
        </div>
        <div class="title_heading">
          <p>Balance Payable:</p>
          <p>₹398.3</p>
        </div>
      </div>

      <div class="title_heading eo_heading">
        <p>E&O.E</p>
        <p>For Aman International</p>
      </div>

      <div class="signature">
        <p>Guest Signature</p>
        <p>THANK YOU VISIT AGAIN</p>
        <p>Manager/Cashier</p>
      </div>

      <div class="footer-container">
        <div class="footer-row">
          <div class="footer-column left">
            <div class="footer-item">
              <img src="https://img.icons8.com/ios-filled/50/fa314a/marker.png" alt="Location">
              <span class="footer-text">Asiya Business Park</span>
            </div>
            <div class="footer-text" style="margin-left: 26px;">Main Road, Karwar-581301</div>
          </div>
          <div class="footer-column center">
            <div class="footer-item">
              <img src="https://img.icons8.com/ios-filled/50/000000/phone.png" alt="Phone">
              <span class="footer-text">08382-225555</span>
            </div>
            <div class="footer-item">
              <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" alt="WhatsApp">
              <span class="footer-text">7795818873</span>
            </div>
          </div>
          <div class="footer-column right">
            <div class="footer-text footer-email">
              E-Mail <span>info@hotelamaninternational.com</span>
            </div>
            <div class="footer-text footer-website">
              Website <span>www.hotelamaninternational.com</span>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.print();
  };
  useEffect(() => {
    const fetchCustomerAndBooking = async () => {
      try {
        // Fetch user info
        const userDocRef = doc(db, "users", customerId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setCustomer(userSnap.data() as CustomerData);
        }

        // Fetch booking info from room_dates
        const dateKey = date;
        const roomDateRef = doc(db, "room_dates", dateKey);
        const roomDateSnap = await getDoc(roomDateRef);

        if (roomDateSnap.exists()) {
          const bookings: BookingData[] = roomDateSnap.data().bookings;

          const userBooking = bookings.find(
            (b) => b.user_id.id === customerId && b.roomnumber === roomNumber
          );

          if (userBooking) {
            setBooking(userBooking);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCustomerAndBooking();
  }, [customerId, roomNumber, date]);

  if (!customer || !booking) {
    return (
      <div className="text-white p-4 bg-black rounded-xl">
        Loading customer and room details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
        <h2 className="text-3xl font-bold tracking-wide">Customer Details</h2>
        <div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm mr-2"
            onClick={() => handlePrint(booking)}
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="text-sm font-medium text-red-400 border border-red-600 px-4 py-1.5 rounded-md hover:bg-red-800 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm sm:text-base">
        <p><span className="text-gray-400">Name:</span> {customer.name}</p>
        <p><span className="text-gray-400">Phone:</span> {customer.phone}</p>
        <p><span className="text-gray-400">ID Type:</span> {customer.idtype}</p>
        <p><span className="text-gray-400">ID Number:</span> {customer.idnumber}</p>
        <p><span className="text-gray-400">Booking Date:</span> {date}</p>
        <p><span className="text-gray-400">Check-In Time:</span> {booking.checkintime.toDate().toLocaleString()}</p>
        <p><span className="text-gray-400">Check-Out Time:</span> {booking.checkouttime.toDate().toLocaleString()}</p>
        <p><span className="text-gray-400">Room Number:</span> {booking.roomnumber}</p>
        <p><span className="text-gray-400">Address:</span> {customer.address || "-"}</p>
        <p><span className="text-gray-400">Total Amount:</span> ₹{booking.totalamount}</p>
        <p><span className="text-gray-400">Paid Amount:</span> ₹{booking.amountpaid}</p>
        <p><span className="text-gray-400">Due:</span> ₹{booking.totalamount - booking.amountpaid}</p>
      </div>

      {/* Footer */}
      {/* <div className="mt-8">
    <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition">
      Check-Out
    </button>
  </div> */}
    </div>

  );
}
