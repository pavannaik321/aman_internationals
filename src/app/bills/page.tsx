'use client'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../lib/firebaseConfig'
import * as XLSX from 'xlsx'

type Bill = {
  id: string
  address: string
  amountPaid: number
  checkin: Date
  checkout: Date
  customerId: string
  customerName: string
  datePrinted: Date
  invoiceNumber: number
  roomNumber: number
  roomType: string
  state: string
  totalAmount: number
}

const businessState = 'Karnataka'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Page() {
  const [bills, setBills] = useState<Bill[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    const fetchBills = async () => {
      const querySnapshot = await getDocs(collection(db, 'prints'))
      const data = querySnapshot.docs.map(doc => {
        const billData = doc.data()
        return {
          id: doc.id,
          address: billData.address || '',
          amountPaid: billData.amountPaid || 0,
          checkin: billData.checkin ? new Date(billData.checkin.seconds * 1000) : new Date(),
          checkout: billData.checkout ? new Date(billData.checkout.seconds * 1000) : new Date(),
          customerId: billData.customerId || '',
          customerName: billData.customerName || '',
          datePrinted: billData.datePrinted ? new Date(billData.datePrinted.seconds * 1000) : new Date(),
          invoiceNumber: billData.invoiceNumber || 0,
          roomNumber: billData.roomNumber || 0,
          roomType: billData.roomType || '',
          state: billData.state || '',
          totalAmount: billData.totalAmount || 0,
        }
      })

      data.sort((a, b) => a.invoiceNumber - b.invoiceNumber)
      setBills(data)
    }

    fetchBills()
  }, [])

  const filteredBills = bills.filter(bill =>
    bill.datePrinted.getFullYear() === selectedYear &&
    bill.datePrinted.getMonth() === selectedMonth
  )

  const downloadExcel = () => {
    const rows = filteredBills.map((bill, index) => {
      const isIntraState = bill.state === businessState
      const cgst = isIntraState ? (bill.totalAmount * 0.06).toFixed(2) : ''
      const sgst = isIntraState ? (bill.totalAmount * 0.06).toFixed(2) : ''
      const igst = isIntraState ? '' : (bill.totalAmount * 0.12).toFixed(2)

      return {
        "S.No": index + 1,
        "Date": bill.datePrinted.toLocaleDateString(),
        "Invoice No": bill.invoiceNumber,
        "Company Name": bill.customerName,
        "GST No": '-',
        "5% GST": '-',
        "2.5% CGST": '-',
        "2.5% SGST": '-',
        "12% GST": '-',
        "6% CGST": cgst || '-',
        "6% SGST": sgst || '-',
        "18% GST": '-',
        "9% CGST": '-',
        "9% SGST": '-',
        "5% IGST": '-',
        "5% IGST 2": '-',
        "12% IGST": igst || '-',
        "12% IGST 2": '-',
        "18% IGST": '-',
        "18% IGST 2": '-',
        "Total (amount)": bill.totalAmount.toFixed(2)
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills')
    XLSX.writeFile(workbook, `Bills-${selectedYear}-${selectedMonth + 1}.xlsx`)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">All Bill Details</h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Month Dropdown */}
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

        {/* Year Dropdown */}
        <div>
          <label className="mr-2 font-semibold text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Download Excel Button - Always visible */}
        <div className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow min-w-max" >
          <button
            onClick={downloadExcel}>
            Download Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                'S.No', 'Date', 'Invoice No', 'Company Name', 'GST No', '5% GST', '2.5% CGST', '2.5% SGST',
                '12% GST', '6% CGST','6% SGST', '18% GST', '9% CGST', '9% SGST', '5% IGST','5% IGST 2', '12% IGST',
                '12% IGST 2', '18% IGST', '18% IGST 2', 'Total (amount)'
              ].map((col, i) => (
                <th key={i} className="border px-2 py-1 whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, index) => {
              const isIntraState = bill.state === businessState
              const cgst = isIntraState ? (bill.totalAmount * 0.06).toFixed(2) : '-'
              const sgst = isIntraState ? (bill.totalAmount * 0.06).toFixed(2) : '-'
              const igst = isIntraState ? '-' : (bill.totalAmount * 0.12).toFixed(2)

              return (
                <tr key={bill.id || index} className="text-center hover:bg-gray-50">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{bill.datePrinted.toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{bill.invoiceNumber}</td>
                  <td className="border px-2 py-1">{bill.customerName}</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">{cgst}</td>
                  <td className="border px-2 py-1">{sgst}</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">{igst}</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">-</td>
                  <td className="border px-2 py-1">₹{bill.totalAmount.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
