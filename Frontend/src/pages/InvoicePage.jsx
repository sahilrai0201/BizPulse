import React, { useState } from "react";
import Header from "../components/common/Header";
import InvoiceForm from "../components/Invoice/InvoiceForm";
import InvoiceTable from "../components/Invoice/InvoiceTable";

const InvoicePage = () => {
  const [activeTab, setActiveTab] = useState("history"); // 'history' or 'create'
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleInvoiceSaved = () => {
    setRefreshTrigger(prev => !prev);
    setActiveTab("history"); // Switch back to history view after saving
  };

  return (
    <div className='flex-1 relative z-10 overflow-auto bg-gray-900'>
      <Header title={"Invoices"} />
      <main className='max-w-10xl mx-auto py-6 px-4 lg:px-8'>
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-3">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "history"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Invoice History
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "create"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create New Invoice
          </button>
        </div>

        {activeTab === "history" ? (
          <InvoiceTable refreshTrigger={refreshTrigger} />
        ) : (
          <InvoiceForm onInvoiceSaved={handleInvoiceSaved} />
        )}
      </main>
    </div>
  );
};

export default InvoicePage;
