"use client";
import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Search, Plus, Upload, X, MoreHorizontal, Edit, CheckCircle } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export default function ProductsPage({ collection }) {
  const [rows, setRows] = useState(collection);
  const [searchText, setSearchText] = useState("");
  const t = useTranslations("Inventory");
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  
  // Modals state
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Sale Form
  const [formValues, setFormValues] = useState({
    carId: "",
    carTitle: "",
    salePrice: "",
    paymentMethod: "",
    downPayment: "",
    interestRate: "",
    buyer: {
      name: "",
      contactInfo: { email: "", phone: "", address: { street: "", city: "", state: "", postalCode: "" } },
    },
    adminNotes: "",
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredRows = collection.filter(
      (row) =>
        row.title?.toLowerCase().includes(value.toLowerCase()) ||
        row.carMake?.toLowerCase().includes(value.toLowerCase()) ||
        row.vinNumber?.toLowerCase().includes(value.toLowerCase())
    );
    setRows(filteredRows);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedRows = [...rows].sort((a, b) => {
      if (a[key] === b[key]) return 0;
      return a[key] < b[key] ? (direction === "ascending" ? -1 : 1) : (direction === "ascending" ? 1 : -1);
    });
    setRows(sortedRows);
  };

  const toggleSoldStatus = (car) => {
    setSelectedCar(car);
    setFormValues({
      ...formValues,
      carId: car._id,
      carTitle: car.title,
      salePrice: car.price,
    });
    setSaleModalOpen(true);
  };

  const closeSaleModal = () => {
    setSaleModalOpen(false);
    setSelectedCar(null);
  };

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("Title")}</h1>
          <p className="text-slate-500 text-sm mt-1">{t("Description")}</p>
        </div>
        <Link 
          href="/stock/post-product" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> {t("Add Vehicle")}
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t("Search Placeholder")}
              value={searchText}
              onChange={handleSearch}
              className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-4 rtl:pl-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("carMake")}>{t("Vehicle")}</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("title")}>{t("Name")}</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("price")}>{t("Price")}</th>
                <th className="hidden md:table-cell px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort("createdAt")}>{t("Time in Inventory")}</th>
                <th className="px-6 py-4 text-center">{t("Status")}</th>
                <th className="px-6 py-4 text-end">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedRows.length > 0 ? paginatedRows.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                    {row.images && row.images[0] ? (
                      <img src={row.images[0]} alt={row.title} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <span className="text-slate-400 text-xs">No img</span>
                      </div>
                    )}
                    <span className="font-medium text-slate-900">{row.carMake || t("Unknown")}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-600 hover:underline">
                    <Link href={`/stock/edit-product/${row._id}`}>
                      {row.title || t("Untitled")}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    ${row.price?.toLocaleString() || "0"}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-slate-500">
                    {row.createdAt ? formatDistanceToNow(new Date(row.createdAt), { addSuffix: true }) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.sold ? (
                       <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                         <CheckCircle className="w-3.5 h-3.5" /> {t("Sold")}
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                         {t("Active")}
                       </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-end flex items-center justify-end gap-2">
                    <Link 
                      href={`/stock/${row._id}/master`}
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors border bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    >
                      Master Page
                    </Link>
                    <button 
                      onClick={() => toggleSoldStatus(row)}
                      className={clsx(
                        "text-xs px-3 py-1.5 rounded-md font-medium transition-colors border",
                        row.sold 
                          ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
                      )}
                    >
                      {row.sold ? t("Mark Active") : t("Mark Sold")}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    {t("No Vehicles")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {t("Showing", { start: Math.min(page * rowsPerPage + 1, rows.length), end: Math.min((page + 1) * rowsPerPage, rows.length), total: rows.length })}
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded border border-slate-300 bg-white text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Previous")}
            </button>
            <button 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded border border-slate-300 bg-white text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      </div>

      {/* Sale Modal Overlay */}
      {saleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{t("Record Sale")}</h2>
              <button onClick={closeSaleModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-2 text-sm text-blue-800">
                {t("Marking Sold", { title: selectedCar?.title })}
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">{t("Sale Price")}</label>
                <input 
                  type="number" 
                  value={formValues.salePrice}
                  onChange={(e) => setFormValues({...formValues, salePrice: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">{t("Buyer Name")}</label>
                <input 
                  type="text" 
                  value={formValues.buyer.name}
                  onChange={(e) => setFormValues({...formValues, buyer: {...formValues.buyer, name: e.target.value}})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">{t("Admin Notes")}</label>
                <textarea 
                  rows={3}
                  value={formValues.adminNotes}
                  onChange={(e) => setFormValues({...formValues, adminNotes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
              <button onClick={closeSaleModal} className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                {t("Cancel")}
              </button>
              <button onClick={closeSaleModal} className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                {t("Confirm Sale")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
