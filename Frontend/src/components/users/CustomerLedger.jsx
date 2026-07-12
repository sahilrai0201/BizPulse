import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, FileText, Calendar, DollarSign } from "lucide-react";
import axios from "axios";

const CustomerLedger = ({ customer, onClose }) => {
  const [customerInvoices, setCustomerInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/invoice`);
        if (response.status === 200) {
          // Filter invoices associated with this customer
          const filtered = response.data.filter(
            (inv) => inv.customerDetails && inv.customerDetails._id === customer._id
          );
          setCustomerInvoices(filtered);
        }
      } catch (err) {
        console.error("Error fetching ledger invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    if (customer) {
      fetchLedger();
    }
  }, [customer]);

  const totalBilled = customerInvoices.reduce((sum, inv) => sum + (inv.InvoiceAmount || 0), 0);
  const averageInvoice = customerInvoices.length > 0 ? (totalBilled / customerInvoices.length) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <motion.div
        className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl max-w-4xl w-full text-white overflow-hidden flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-900 bg-opacity-50 p-4 border-b border-gray-700 text-left">
          <div>
            <h3 className="text-lg font-bold text-gray-100">{customer.BusinessName}</h3>
            <p className="text-xs text-gray-400">Client Ledger Account</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg border border-gray-600 flex items-center space-x-3 text-left">
              <div className="p-2 bg-indigo-900 bg-opacity-50 text-indigo-400 rounded-lg">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Total Revenue</p>
                <p className="text-xl font-bold">${totalBilled.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg border border-gray-600 flex items-center space-x-3 text-left">
              <div className="p-2 bg-green-900 bg-opacity-50 text-green-400 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Invoices Raised</p>
                <p className="text-xl font-bold">{customerInvoices.length}</p>
              </div>
            </div>

            <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg border border-gray-600 flex items-center space-x-3 text-left">
              <div className="p-2 bg-purple-900 bg-opacity-50 text-purple-400 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Avg Order Value</p>
                <p className="text-xl font-bold">${averageInvoice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-gray-700 bg-opacity-20 p-4 rounded-lg border border-gray-600 mb-6 text-left text-sm">
            <h4 className="font-semibold mb-2 text-indigo-400 uppercase text-xs tracking-wider">Contact & billing profile</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300">
              <div>
                <span className="block text-gray-400 text-xs">Email</span>
                {customer.email}
              </div>
              <div>
                <span className="block text-gray-400 text-xs">Mobile</span>
                {customer.mobileNumber}
              </div>
              <div>
                <span className="block text-gray-400 text-xs">GSTIN</span>
                {customer.gstNumber || "N/A"}
              </div>
              <div>
                <span className="block text-gray-400 text-xs">Billing Address</span>
                {customer.BillingAddress}
              </div>
            </div>
          </div>

          {/* Invoices List */}
          <h4 className="font-semibold mb-3 text-indigo-400 uppercase text-xs tracking-wider text-left">Invoice Statement</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Invoice #</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Issue Date</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-400 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-gray-400">
                      Loading invoice records...
                    </td>
                  </tr>
                ) : customerInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-gray-400">
                      No transactions registered for this client.
                    </td>
                  </tr>
                ) : (
                  customerInvoices.map((inv, idx) => (
                    <tr key={inv._id || idx} className="text-gray-300 hover:bg-gray-700 hover:bg-opacity-30">
                      <td className="px-4 py-3 font-semibold text-gray-100">#{inv.InvoiceNumber}</td>
                      <td className="px-4 py-3">{inv.DateofIssue || "N/A"}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-100">
                        ${(inv.InvoiceAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 bg-opacity-50 p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Close Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLedger;
