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

export default function Page() {
  const [bills, setBills] = useState<Bill[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')

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

  const filteredBills = selectedMonth
    ? bills.filter(bill => {
        const billMonth = bill.datePrinted.getMonth() + 1
        const billYear = bill.datePrinted.getFullYear()
        const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number)
        return billYear === selectedYear && billMonth === selectedMonthNum
      })
    : bills

  const downloadExcel = () => {
    const rows = filteredBills.map(bill => {
      const isIntraState = bill.state === businessState
         const cgst = isIntraState ? (bill.totalAmount * 0.06).toFixed(2) : '0.00'
              const sgst = isIntraState ? (bill.totalAmount * 0.06).toFixed(2) : '0.00'
              const igst = isIntraState ? '0.00' : (bill.totalAmount * 0.12).toFixed(2)


      return {
        Date: bill.datePrinted.toLocaleDateString(),
        Invoice: bill.invoiceNumber,
        Party: bill.customerName,
        State: bill.state,
        CGST: cgst,
        SGST: sgst,
        IGST: igst,
        Total: bill.totalAmount.toFixed(2),
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills')
    XLSX.writeFile(workbook, `Bills-${selectedMonth}.xlsx`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Bill Details</h1>

      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label className="mr-2 font-semibold">Filter by Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>

        {selectedMonth && (
          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Excel
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Invoice</th>
              <th className="border px-4 py-2">Party</th>
              <th className="border px-4 py-2">State</th>
              <th className="border px-4 py-2">CGST</th>
              <th className="border px-4 py-2">SGST</th>
              <th className="border px-4 py-2">IGST</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, index) => {
              const isIntraState = bill.state === businessState
              const cgst = isIntraState ? '0.00' : (bill.totalAmount * 0.06).toFixed(2)
              const sgst = isIntraState ? '0.00' : (bill.totalAmount * 0.06).toFixed(2)
              const igst = isIntraState ? (bill.totalAmount * 0.12).toFixed(2) : '0.00'

              return (
                <tr key={bill.id || index} className="text-center">
                  <td className="border px-4 py-2">{bill.datePrinted.toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{bill.invoiceNumber}</td>
                  <td className="border px-4 py-2">{bill.customerName}</td>
                  <td className="border px-4 py-2">{bill.state}</td>
                  <td className="border px-4 py-2">₹{cgst}</td>
                  <td className="border px-4 py-2">₹{sgst}</td>
                  <td className="border px-4 py-2">₹{igst}</td>
                  <td className="border px-4 py-2">₹{bill.totalAmount.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
