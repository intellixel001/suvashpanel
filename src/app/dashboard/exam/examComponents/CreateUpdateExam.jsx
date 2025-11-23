"use client";

import apiClient from "@/api/apiClient";
import { useEffect, useMemo, useState } from "react";

export default function CreateUpdateExam({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  errorMsg,
}) {
  const initialFormData = {
    name: "",
    description: "",
    billingType: "",
    class: "",
    subject: "",
    position: "",
    duration: 0,
    cutmark: 0,
    nagetivemark: 0,
    isLive: false,
    status: true,
    startDate: "",
    resultPublishedDate: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [options, setOptions] = useState([]);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  // Fetch options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await apiClient.get("/staff/exam/option/get");
        if (data.data) setOptions(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const classesByPosition = useMemo(() => {
    if (!formData.position) return [];
    return options.filter(
      (opt) => opt.type === "class" && opt.position === formData.position
    );
  }, [formData.position, options]);

  const subjectsByClass = useMemo(() => {
    if (!formData.class || !formData.position) return [];
    const selectedClass = options.find(
      (opt) => opt.type === "class" && +opt.id === +formData.class
    );
    if (!selectedClass) return [];
    return options.filter(
      (opt) =>
        opt.type === "subject" &&
        opt.className === selectedClass.className &&
        opt.position === selectedClass.position &&
        opt.status === true
    );
  }, [formData.class, formData.position, options]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [key]: value };
      if (key === "position") updated = { ...updated, class: "", subject: "" };
      if (key === "class") updated = { ...updated, subject: "" };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialFormData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto w-full max-w-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 px-6 py-4 bg-white/5 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-100">
            {initialData ? "Update Exam" : "Create Exam"}
          </h2>
          <button
            onClick={() => {
              onClose();
              setFormData(initialFormData);
            }}
            className="text-gray-400 hover:text-white text-2xl transition"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Exam Name
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Billing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Billing Type
            </label>
            <select
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.billingType}
              onChange={(e) => handleChange("billingType", e.target.value)}
            >
              <option value="">Select billing type</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Position
            </label>
            <select
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
            >
              <option value="">Select position</option>
              <option value="Academic">Academic</option>
              <option value="Admission">Admission</option>
              <option value="Job">Job</option>
            </select>
          </div>

          {/* Class */}
          {classesByPosition.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Class
              </label>
              <select
                className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.class}
                onChange={(e) => handleChange("class", e.target.value)}
              >
                <option value="">Select class</option>
                {classesByPosition.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          {subjectsByClass.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Subject
              </label>
              <select
                className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              >
                <option value="">Select subject</option>
                {subjectsByClass.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.duration}
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {/* Cutmark */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Exam Cutmark (%)
            </label>
            <input
              type="number"
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.cutmark}
              onChange={(e) => handleChange("cutmark", Number(e.target.value))}
            />
          </div>

          {/* Negative Mark */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Exam Negative Mark
            </label>
            <input
              type="number"
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nagetivemark}
              onChange={(e) =>
                handleChange("nagetivemark", Number(e.target.value))
              }
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Exam Start Time
            </label>
            <input
              type="datetime-local"
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          {/* Result Publish */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Result Published Time
            </label>
            <input
              type="datetime-local"
              className="w-full bg-[#2a2a2a] border border-white/10 text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.resultPublishedDate}
              onChange={(e) =>
                handleChange("resultPublishedDate", e.target.value)
              }
            />
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={formData.isLive}
                onChange={(e) => handleChange("isLive", e.target.checked)}
                className="w-4 h-4 bg-gray-700 border border-white/10 rounded"
              />
              <span>Is Live</span>
            </label>

            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => handleChange("status", e.target.checked)}
                className="w-4 h-4 bg-gray-700 border border-white/10 rounded"
              />
              <span>Status</span>
            </label>
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-red-400 bg-red-950/30 border border-red-800 px-3 py-2 rounded-xl text-sm mt-4">
              {errorMsg.toString()}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onClose();
                setFormData(initialFormData);
              }}
              className="px-4 py-2 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
