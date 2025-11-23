"use client";

import { useState } from "react";

export default function UpdateAnswerCom({ setUpdayeAnswer, updayeAnswer }) {
  const [answers, setAnswers] = useState({});

  // 🟢 When all questions are answered
  const allAnswered =
    updayeAnswer.length > 0 && updayeAnswer.every((q) => !!answers[q._id]);

  // 🧩 Handle select change
  const handleSelect = (questionId: string, selectedIndex: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedIndex,
    }));
  };

  // 🟢 Handle Save
  const handleSave = async () => {
    // Example payload for backend
    const payload = Object.entries(answers).map(([id, answer]) => ({
      questionId: id,
      selectedAnswer: answer,
    }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/update-result`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update result");

      alert("✅ Result updated successfully!");
      setUpdayeAnswer(null); // close component if needed
    } catch (err) {
      console.error("❌ Update result error:", err);
      alert("Failed to update result");
    }
  };

  return (
    <div className="bg-black/50 z-[999] flex items-center justify-center fixed top-0 left-0 h-screen w-screen">
      <div className="p-6 bg-white h-[90vh] w-[60%] overflow-hidden overflow-y-auto rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Update Answers
          </h2>
          {/* Save Button */}
          {allAnswered && (
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Answers
            </button>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {updayeAnswer.map((q, i) => (
            <div
              key={q._id}
              className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-medium text-gray-800 text-[20px] mb-3">
                {i + 1}. {q.body}
              </p>
              <div className="space-x-7 flex items-center">
                {q.fields.map((option, idx) => (
                  <label
                    key={idx}
                    className="flex text-[17px] items-center gap-2 text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={idx + 1}
                      checked={answers[q._id] === idx + 1}
                      onChange={() => handleSelect(q._id, idx + 1)}
                      className="text-blue-600 scale-150 focus:ring-black"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
