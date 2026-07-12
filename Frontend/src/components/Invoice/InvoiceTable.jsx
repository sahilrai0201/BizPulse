import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Trash2, X, Download, Mail, Loader2 } from "lucide-react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvoiceTable = ({ refreshTrigger }) => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [emailingInvoiceId, setEmailingInvoiceId] = useState(null);
  const [emailResult, setEmailResult] = useState(null);

  const handleSendEmail = async (invoiceId) => {
    try {
      setEmailingInvoiceId(invoiceId);
      setEmailResult(null);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/email/${invoiceId}/email`);
      if (response.status === 200) {
        setEmailResult({
          success: true,
          previewUrl: response.data.previewUrl,
          message: response.data.message
        });
      }
    } catch (err) {
      console.error("Error sending email:", err);
      alert(err.response?.data?.message || "Failed to compile or dispatch email.");
    } finally {
      setEmailingInvoiceId(null);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/invoice`);
      if (response.status === 200) {
        setInvoices(response.data);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [refreshTrigger]);

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/v1/invoice/${invoiceId}`
        );
        if (response.status === 200) {
          fetchInvoices();
        }
      } catch (err) {
        console.error("Error deleting invoice:", err);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const openPreview = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedInvoice(null);
  };

  const downloadPdf = () => {
    if (!selectedInvoice) return;
    const capture = document.querySelector("#invoicePreviewCapture");
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [612, 792],
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${selectedInvoice.InvoiceNumber}.pdf`);
    });
  };

  const filteredInvoices = invoices.filter((inv) => {
    const invNumberStr = String(inv.InvoiceNumber).toLowerCase();
    const customerName = (inv.customerDetails?.BusinessName || "Walk-in Customer").toLowerCase();
    return invNumberStr.includes(searchTerm) || customerName.includes(searchTerm);
  });

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {emailResult && (
        <div className="mb-4 p-3 bg-indigo-950 bg-opacity-80 border border-indigo-700 text-indigo-200 rounded-lg flex justify-between items-center text-sm">
          <span>
            🎉 <strong>Invoice Email Compiled & Sent!</strong> You can preview the sent layout here:{" "}
            <a
              href={emailResult.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Open Ethereal Mailbox
            </a>
          </span>
          <button
            onClick={() => setEmailResult(null)}
            className="text-indigo-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Saved Invoices</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search invoices..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date of Issue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv, index) => (
                <motion.tr
                  key={inv._id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    #{inv.InvoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {inv.customerDetails?.BusinessName || "Walk-in Customer"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {inv.DateofIssue || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-semibold">
                    ${(inv.InvoiceAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-3"
                      onClick={() => openPreview(inv)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-emerald-400 hover:text-emerald-300 mr-3"
                      onClick={() => handleSendEmail(inv._id)}
                      disabled={emailingInvoiceId === inv._id}
                      title="Send Invoice Email"
                    >
                      {emailingInvoiceId === inv._id ? (
                        <Loader2 size={18} className="animate-spin text-gray-400" />
                      ) : (
                        <Mail size={18} />
                      )}
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(inv._id)}
                      title="Delete Invoice"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Detail Modal Overlay */}
      <AnimatePresence>
        {isPreviewOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70 backdrop-blur-sm p-4">
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full text-black overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center bg-gray-100 p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">
                  Invoice Detail #{selectedInvoice.InvoiceNumber}
                </h3>
                <button
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-800 rounded-full p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Printable Invoice Container */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div id="invoicePreviewCapture" className="p-4 border border-gray-200 bg-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-indigo-700">BIZZ INC.</h2>
                      <p className="text-sm text-gray-500">Amazing Billing Solutions</p>
                    </div>
                    <div className="text-right">
                      <h4 className="text-lg font-bold">INVOICE</h4>
                      <p className="text-sm text-gray-600">Number: #{selectedInvoice.InvoiceNumber}</p>
                      <p className="text-sm text-gray-600">Date: {selectedInvoice.DateofIssue}</p>
                    </div>
                  </div>

                  <hr className="mb-6 border-gray-200" />

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h5 className="font-semibold text-gray-700 uppercase tracking-wider text-xs mb-2">
                        Billed To
                      </h5>
                      <p className="font-bold text-gray-900">
                        {selectedInvoice.customerDetails?.BusinessName || "Walk-in Customer"}
                      </p>
                      <p className="text-gray-600 text-sm">{selectedInvoice.customerDetails?.BillingAddress || ""}</p>
                      <p className="text-gray-600 text-sm">Email: {selectedInvoice.customerDetails?.email || ""}</p>
                      <p className="text-gray-600 text-sm">Mobile: {selectedInvoice.customerDetails?.mobileNumber || ""}</p>
                      {selectedInvoice.customerDetails?.gstNumber && (
                        <p className="text-gray-600 text-sm">GSTIN: {selectedInvoice.customerDetails?.gstNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <h5 className="font-semibold text-gray-700 uppercase tracking-wider text-xs mb-2">
                        Payment Summary
                      </h5>
                      <div className="inline-block bg-gray-50 p-3 rounded-lg border border-gray-100 text-left">
                        <p className="text-sm text-gray-600">
                          Total Due:{" "}
                          <span className="font-bold text-lg text-gray-900">
                            ${(selectedInvoice.InvoiceAmount || 0).toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <table className="min-w-full divide-y divide-gray-200 mb-6">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase">
                        <th className="px-4 py-2 text-left">Item / Description</th>
                        <th className="px-4 py-2 text-center">Quantity</th>
                        <th className="px-4 py-2 text-right">Unit Price</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {selectedInvoice.productDetails?.map((item, idx) => (
                        <tr key={idx} className="text-gray-700">
                          <td className="px-4 py-3">
                            <p className="font-semibold">{item.product?.ProductName || "Item Detail"}</p>
                            <p className="text-xs text-gray-500">Unit: {item.product?.unitOfMeasurement || "pcs"}</p>
                          </td>
                          <td className="px-4 py-3 text-center">{item.ProductQuantity}</td>
                          <td className="px-4 py-3 text-right">
                            ${(item.product?.cost || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${(item.ProductQuantity * (item.product?.cost || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end mb-6">
                    <div className="w-64">
                      <div className="flex justify-between py-1 text-sm text-gray-600">
                        <span>Subtotal:</span>
                        <span>${(selectedInvoice.subTotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-sm font-bold text-gray-900 border-t border-gray-200 mt-1">
                        <span>Total Due:</span>
                        <span>${(selectedInvoice.InvoiceAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex justify-end space-x-3 bg-gray-100 p-4 border-t border-gray-200">
                <button
                  onClick={downloadPdf}
                  className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  <Download size={18} className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={closePreview}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InvoiceTable;
