"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import apiClient from "@/api/apiClient";

export default function MyTaskComponent() {
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const [dateFilter, setDateFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [note, setNote] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // FILTER SYSTEM
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (dateFilter) {
          const taskDate = new Date(task.createdAt).toISOString().split("T")[0];
          if (taskDate !== dateFilter) return false;
        }

        if (priorityFilter && task.priority !== priorityFilter) return false;

        if (statusFilter && task.status !== statusFilter) return false;

        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tasks, dateFilter, priorityFilter, statusFilter]);

  if (loading) return <p className="text-gray-300">Loading...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;

  // API CALL FOR SUBMITTING TASK
  const submitTask = async () => {
    if (!activeTask) return;

    setSubmitLoading(true);

    try {
      await apiClient.put("/staff/task/submit/" + activeTask._id);

      alert("Task submitted successfully!");

      setNote("");
      setOpenModal(false);
    } catch (err) {
      console.log(err);
      alert("Failed to submit task");
    }

    setSubmitLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 bg-[#111827] p-4 rounded-xl shadow-lg border border-gray-800">
        {/* Date Filter */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-400">Filter by Date</label>
          <input
            type="date"
            className="bg-[#1f2937] p-2 rounded-md text-gray-100 outline-none"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-400">Priority</label>
          <select
            className="bg-[#1f2937] p-2 rounded-md text-gray-100 outline-none"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-400">Status</label>
          <select
            className="bg-[#1f2937] p-2 rounded-md text-gray-100 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="declined">Declined</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {dateFilter || priorityFilter || statusFilter ? (
          <button
            onClick={() => {
              setDateFilter("");
              setPriorityFilter("");
              setStatusFilter("");
            }}
            className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      {/* TASK CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400">No tasks found...</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-[#111827] p-5 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-700"
            >
              {/* Priority + Date */}
              <div className="flex justify-between items-center mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs uppercase ${
                    task.priority === "high"
                      ? "bg-red-600"
                      : task.priority === "medium"
                      ? "bg-yellow-600"
                      : "bg-green-600"
                  }`}
                >
                  {task.priority}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Message */}
              <h2 className="text-lg font-semibold mb-2">{task.message}</h2>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-3 mt-4">
                {/* Go to Task Page */}
                <Link
                  href={
                    task.tasktype === "exam"
                      ? "/dashboard/exam/" + task.item_id
                      : "#"
                  }
                  className="px-4 w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
                >
                  View Task
                </Link>

                {/* Submit Task Button */}
                <button
                  onClick={() => {
                    setActiveTask(task);
                    setOpenModal(true);
                  }}
                  className="px-4 w-full py-2 bg-green-600 rounded-lg hover:bg-green-700 text-white"
                >
                  Submit Task
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111827] w-full max-w-md p-6 rounded-xl border border-gray-700 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Submit Task</h2>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-3">
              Task: {activeTask?.message}
            </p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 bg-[#1f2937] text-gray-100 rounded-lg outline-none"
              rows="4"
              placeholder="Write note or attach links..."
            />

            <button
              onClick={submitTask}
              disabled={submitLoading}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {submitLoading ? "Submitting..." : "Submit Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
