"use client";

import { useState } from "react";

export default function ManageNotice({ examObj }) {
  const [notice, setNotice] = useState(examObj?.notice || ""); // Single string
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!notice.trim()) return alert("Please enter notice!");

    setLoading(true);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/update/notice/${examObj._id}`;
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice }), // send single string
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save");

      setNotice(data.data.notice);
      setShowModal(false);
      alert("✅ Notice saved successfully!");
    } catch (error) {
      console.error("❌ notice save error:", error);
      alert("Failed to save notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Exam Notice</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Update Notice
        </button>
      </div>

      {/* Current Notice */}
      {notice ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 whitespace-pre-line text-gray-700">
          {notice}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No notice set yet.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Update Exam Notice
            </h3>

            <textarea
              rows={7}
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="Write notice..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Notice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
