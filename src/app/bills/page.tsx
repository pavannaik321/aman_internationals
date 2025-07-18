"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebaseConfig";
import * as XLSX from "xlsx";

type Bill = {
  id: string;
  address: string;
  amountPaid: number;
  checkin: Date;
  checkout: Date;
  customerId: string;
  customerName: string;
  datePrinted: Date;
  invoiceNumber: number;
  roomNumber: number;
  roomType: string;
  state: string;
  totalAmount: number;
};

const businessState = "Karnataka";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Page() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    const fetchBills = async () => {
      const querySnapshot = await getDocs(collection(db, "prints"));
      const data = querySnapshot.docs.map((doc) => {
        const billData = doc.data();
        return {
          id: doc.id,
          address: billData.address || "",
          amountPaid: billData.amountPaid || 0,
          checkin: billData.checkin
            ? new Date(billData.checkin.seconds * 1000)
            : new Date(),
          checkout: billData.checkout
            ? new Date(billData.checkout.seconds * 1000)
            : new Date(),
          customerId: billData.customerId || "",
          customerName: billData.customerName || "",
          datePrinted: billData.datePrinted
            ? new Date(billData.datePrinted.seconds * 1000)
            : new Date(),
          invoiceNumber: billData.invoiceNumber || 0,
          roomNumber: billData.roomNumber || 0,
          roomType: billData.roomType || "",
          state: billData.state || "",
          totalAmount: billData.totalAmount || 0,
        };
      });

      data.sort((a, b) => a.invoiceNumber - b.invoiceNumber);
      setBills(data);
    };

    fetchBills();
  }, []);

  const filteredBills = bills.filter(
    (bill) =>
      bill.datePrinted.getFullYear() === selectedYear &&
      bill.datePrinted.getMonth() === selectedMonth
  );

  const downloadExcel = () => {
    const rows = filteredBills.map((bill, index) => {
      const isIntraState = bill.state === businessState;

      // 👇 You can change this to real data field like bill.gstRate
      const gstRate =
        bill.totalAmount >= 5000
          ? 0.18
          : bill.totalAmount >= 2500
          ? 0.12
          : 0.05;
      const taxableValue = bill.totalAmount / (1 + gstRate);
      const taxAmount = bill.totalAmount - taxableValue;

      let cgst = "",
        sgst = "",
        igst = "";
      let col5val = "",
        col12val = "",
        col18val = "";

      if (isIntraState) {
        const halfTax = taxAmount / 2;
        cgst = halfTax.toFixed(2);
        sgst = halfTax.toFixed(2);
        if (gstRate === 0.05) col5val = taxableValue.toFixed(2);
        if (gstRate === 0.12) col12val = taxableValue.toFixed(2);
        if (gstRate === 0.18) col18val = taxableValue.toFixed(2);
      } else {
        igst = taxAmount.toFixed(2);
        if (gstRate === 0.05) col5val = taxableValue.toFixed(2);
        if (gstRate === 0.12) col12val = taxableValue.toFixed(2);
        if (gstRate === 0.18) col18val = taxableValue.toFixed(2);
      }

      return {
        "S.No": index + 1,
        Date: bill.datePrinted.toLocaleDateString(),
        "Invoice No": bill.invoiceNumber,
        "Company Name": bill.customerName,
        State: bill.state,
        "5% VALUE": col5val,
        "CGST 2.5%": gstRate === 0.05 && isIntraState ? cgst : "",
        "SGST 2.5%": gstRate === 0.05 && isIntraState ? sgst : "",
        "12% VALUE": col12val,
        "CGST 6%": gstRate === 0.12 && isIntraState ? cgst : "",
        "SGST 6%": gstRate === 0.12 && isIntraState ? sgst : "",
        "18% VALUE": col18val,
        "CGST 9%": gstRate === 0.18 && isIntraState ? cgst : "",
        "SGST 9%": gstRate === 0.18 && isIntraState ? sgst : "",
        "5% IGST VALUE": gstRate === 0.05 && !isIntraState ? col5val : "",
        "5% IGST": gstRate === 0.05 && !isIntraState ? igst : "",
        "12% IGST VALUE2": gstRate === 0.12 && !isIntraState ? col12val : "",
        "12% IGST": gstRate === 0.12 && !isIntraState ? igst : "",
        "18% IGST VALUE": gstRate === 0.18 && !isIntraState ? col18val : "",
        "18% IGST": gstRate === 0.18 && !isIntraState ? igst : "",
        Total: bill.totalAmount.toFixed(2),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");
    XLSX.writeFile(workbook, `Bills-${selectedYear}-${selectedMonth + 1}.xlsx`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        All Bill Details
      </h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label className="mr-2 font-semibold text-gray-700">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {[2023, 2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow">
          <button onClick={downloadExcel}>Download Excel</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "S.No",
                "Date",
                "Invoice No",
                "Company Name",
                "State",
                "5% VALUE",
                "CGST 2.5%",
                "SGST 2.5%",
                "12% VALUE",
                "CGST 6%",
                "SGST 6%",
                "18% VALUE",
                "CGST 9%",
                "SGST 9%",
                "5% IGST VALUE",
                "5% IGST",
                "12% IGST VALUE2",
                "12% IGST",
                "18% IGST VALUE",
                "18% IGST",
                "Total",
              ].map((head, i) => (
                <th key={i} className="border px-2 py-1 whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, index) => {
              const isIntraState = bill.state === businessState;
              const gstRate =
                bill.totalAmount >= 5000
                  ? 0.18
                  : bill.totalAmount >= 2500
                  ? 0.12
                  : 0.05;
              const taxableValue = bill.totalAmount / (1 + gstRate);
              const taxAmount = bill.totalAmount - taxableValue;
              const halfTax = (taxAmount / 2).toFixed(2);
              const igst = taxAmount.toFixed(2);

              return (
                <tr key={bill.id} className="text-center hover:bg-gray-50">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">
                    {bill.datePrinted.toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1">{bill.invoiceNumber}</td>
                  <td className="border px-2 py-1">{bill.customerName}</td>
                  <td className="border px-2 py-1">{bill.state}</td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.05 ? taxableValue.toFixed(2) : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.05 && isIntraState ? halfTax : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.05 && isIntraState ? halfTax : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.12 ? taxableValue.toFixed(2) : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.12 && isIntraState ? halfTax : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.12 && isIntraState ? halfTax : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.18 ? taxableValue.toFixed(2) : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.18 && isIntraState ? halfTax : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.18 && isIntraState ? halfTax : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.05 && !isIntraState
                      ? taxableValue.toFixed(2)
                      : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.05 && !isIntraState ? igst : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.12 && !isIntraState
                      ? taxableValue.toFixed(2)
                      : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.12 && !isIntraState ? igst : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.18 && !isIntraState
                      ? taxableValue.toFixed(2)
                      : ""}
                  </td>
                  <td className="border px-2 py-1">
                    {gstRate === 0.18 && !isIntraState ? igst : ""}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{bill.totalAmount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
