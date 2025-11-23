"use client";
import { useEffect, useState } from "react";

export default function PackageCreateUpdateModal({
  closeModal,
  editingItem,
  onSubmit,
  formData: form,
  setFormData: setForm,
  errorMsg,
}) {
  //   setForm({
  //   name: editingItem?.name || "",
  //   position: editingItem?.position || "",
  //   classId: editingItem?.classId || "",
  //   subjectId: editingItem?.subjectId || "",
  //   duration: editingItem?.duration || "",
  //   price: editingItem?.price || "",
  //   status: editingItem?.status ?? true,
  // });

  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  // ✅ Load Class List when position = academic
  useEffect(() => {
    const loadClasses = async () => {
      if (form.position) {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL +
            `/api/admin/exam/package/getclass/` +
            form?.position,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        setClassList(data.data || []);
      } else {
        setClassList([]);
        setForm((prev) => ({ ...prev, classId: "" }));
      }
    };
    loadClasses();
  }, [form.position]);

  // ✅ Load Subject List based on logic
  useEffect(() => {
    const loadSubjects = async () => {
      if (!form.position) return;

      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL +
          `/api/admin/exam/package/getsubject/` +
          form?.position +
          "/" +
          classList?.find((s_class) => s_class?._id === form?.classId)?.name,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      setSubjectList(data.data || []);
    };

    // Academic: wait for classId
    if (form.position === "academic" && !form.classId) return;

    loadSubjects();
  }, [form.classId]);

  const handleChange = (key, val) => setForm({ ...form, [key]: val });

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md w-96 space-y-3">
        <h2 className="text-lg font-semibold">
          {editingItem ? "Update Package" : "Create Package"}
        </h2>

        <input
          type="text"
          placeholder="Package Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={form.position}
          onChange={(e) => handleChange("position", e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Position</option>
          <option value="academic">Academic</option>
          <option value="admission">Admission</option>
          <option value="job">Job</option>
        </select>

        {form.position && (
          <select
            value={form.classId}
            onChange={(e) => handleChange("classId", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Class</option>
            {classList.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {subjectList.length > 0 && (
          <select
            value={form.subjectId}
            onChange={(e) => handleChange("subjectId", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Subject</option>
            {subjectList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Duration (Days)"
          value={form.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          className="w-full border p-2 rounded"
        />

        {errorMsg && <p>{errorMsg}</p>}

        <button
          onClick={() => onSubmit(form)}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Save
        </button>
        <button onClick={closeModal} className="w-full text-gray-600 p-2">
          Cancel
        </button>
      </div>
    </div>
  );
}
