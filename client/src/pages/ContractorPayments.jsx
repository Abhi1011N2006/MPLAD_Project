import React from 'react';
import { IndianRupee, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function ContractorPayments() {
  const bills = [
    {
      billId: "BILL-2026-901",
      projectId: "MPLAD-2026-MH-001",
      projectName: "Multipurpose Community Hall at Dindori",
      billNumber: "INV-2026/01",
      billAmount: 550000,
      submittedDate: "2026-08-10",
      status: "Approved",
      approvedAmount: 550000,
      paymentReference: "UTR-992102198",
      paidDate: "2026-08-15"
    },
    {
      billId: "BILL-2026-902",
      projectId: "MPLAD-2026-MH-001",
      projectName: "Multipurpose Community Hall at Dindori",
      billNumber: "INV-2026/02",
      billAmount: 480000,
      submittedDate: "2026-09-01",
      status: "Paid",
      approvedAmount: 480000,
      paymentReference: "UTR-992104512",
      paidDate: "2026-09-05"
    },
    {
      billId: "BILL-2026-903",
      projectId: "MPLAD-2026-MH-002",
      projectName: "Mountain Road Construction (Trimbak)",
      billNumber: "INV-2026/03",
      billAmount: 820000,
      submittedDate: "2026-09-12",
      status: "Submitted",
      approvedAmount: 0,
      paymentReference: null,
      paidDate: null
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-600" /> Contractor Bills & Payments Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Financial ledger tracking submitted bills, approved disbursements, and payment references.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Total Submitted Bills</span>
          <strong className="text-2xl font-black text-slate-900">₹18.50 Lakhs</strong>
        </div>
        <div className="p-4 bg-white rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-emerald-800 font-medium block">Approved & Disbursed</span>
          <strong className="text-2xl font-black text-emerald-600">₹10.30 Lakhs</strong>
        </div>
        <div className="p-4 bg-white rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <span className="text-amber-800 font-medium block">Under Review / Inspection</span>
          <strong className="text-2xl font-black text-amber-600">₹8.20 Lakhs</strong>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-900 text-white font-bold text-sm">
          Submitted Bills & Disbursement History
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase border-b">
              <tr>
                <th className="px-4 py-3">Bill ID & Invoice No</th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Claimed Amount</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment Ref</th>
                <th className="px-4 py-3 text-right">Paid Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.map((b) => (
                <tr key={b.billId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono">
                    <div className="font-bold text-blue-600">{b.billId}</div>
                    <div className="text-[11px] text-slate-500">{b.billNumber}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{b.projectName}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">₹{(b.billAmount/100000).toFixed(2)}L</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{b.submittedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      b.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{b.paymentReference || '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">{b.paidDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
