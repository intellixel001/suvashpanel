"use client";

import { useEffect, useMemo, useState } from "react";
import PackageCreateUpdateModal from "./OptionCreateUpdateModal";

export default function Page() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    classId: "",
    subjectId: "",
    duration: 0,
    price: 0,
    status: true,
  });

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Fetch data from backend
  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterClass) params.append("classId", filterClass);
      if (filterSubject) params.append("subjectId", filterSubject);
      if (filterPosition) params.append("position", filterPosition);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/admin/exam/package/getall?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch packages");

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error("❌ fetchPackages error:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch on mount or filter change
  useEffect(() => {
    fetchPackages();
  }, [filterClass, filterSubject, filterPosition]);

  // 🔹 Unique values for filter dropdowns
  const uniqueClasses = Array.from(new Set(data.map((t) => t.classId))).filter(
    Boolean
  );
  const uniqueSubjects = Array.from(
    new Set(data.map((t) => t.subjectId))
  ).filter(Boolean);
  const uniquePositions = Array.from(
    new Set(data.map((t) => t.position))
  ).filter(Boolean);

  // 🔹 Filtered & searched data
  const filteredData = useMemo(() => {
    return data.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesClass = filterClass ? t.classId === filterClass : true;
      const matchesSubject = filterSubject
        ? t.subjectId === filterSubject
        : true;
      const matchesPosition = filterPosition
        ? t.position === filterPosition
        : true;
      return matchesSearch && matchesClass && matchesSubject && matchesPosition;
    });
  }, [data, search, filterClass, filterSubject, filterPosition]);

  // 🔹 Modal handlers
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        position: item.position,
        classId: item.classId,
        subjectId: item.subjectId,
        duration: item.duration,
        price: item.price,
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        position: "",
        classId: "",
        subjectId: "",
        duration: 0,
        price: 0,
        status: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // 🔹 Submit handler (create/update)
  const handleSubmit = async () => {
    try {
      setErrorMsg("");
      const endpoint = editingItem
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/package/update/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/package/create`;

      const res = await fetch(endpoint, {
        method: editingItem ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message =
          errorData?.message ||
          `Failed to ${editingItem ? "update" : "create"} package`;
        setErrorMsg(message);
        throw new Error(message);
      }

      await res.json();
      await fetchPackages();
      closeModal();
    } catch (err) {
      console.error("❌ handleSubmit error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">Packages List</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Package
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 flex-1"
        />

        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Positions</option>
          {uniquePositions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>

        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Classes</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Subjects</option>
          {uniqueSubjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Class ID</th>
              <th className="px-4 py-2">Subject ID</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((pkg) => (
                <tr key={pkg._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{pkg._id}</td>
                  <td className="px-4 py-2">{pkg.position}</td>
                  <td className="px-4 py-2">{pkg.name}</td>
                  <td className="px-4 py-2">{pkg.classId || "-"}</td>
                  <td className="px-4 py-2">{pkg.subjectId || "-"}</td>
                  <td className="px-4 py-2">{pkg.duration}</td>
                  <td className="px-4 py-2">{pkg.price}</td>
                  <td className="px-4 py-2">
                    {pkg.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => openModal(pkg)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <PackageCreateUpdateModal
          closeModal={closeModal}
          setFormData={setFormData}
          formData={formData}
          onSubmit={handleSubmit}
          editingItem={editingItem}
          errorMsg={errorMsg}
        />
      )}
    </div>
  );
}
