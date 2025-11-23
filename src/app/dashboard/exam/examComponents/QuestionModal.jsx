"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function QuestionModal({ onClose, onSave, initialData }) {
  const [type, setType] = useState(initialData?.type || "mcq");
  const [topic, setTopic] = useState(initialData?.topic || "");
  const [customTopic, setCustomTopic] = useState(""); // for new custom topic
  const [body, setBody] = useState(initialData?.body || "");
  const [fields, setFields] = useState(initialData?.fields || ["", "", "", ""]);
  const [answer, setAnswer] = useState(initialData?.answer || 0);
  const [explanation, setExplanation] = useState(
    initialData?.explanation || ""
  );

  const { currentUser, loading } = useSelector((state) => state.user);

  const [topicOptions, setTopicOptions] = useState([]);

  useEffect(() => {
    if (!currentUser?.topics) return;

    const arr = currentUser.topics
      ?.replace(/"/g, "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setTopicOptions(arr);
  }, [currentUser]);

  const handleSubmit = () => {
    if (!topic.trim()) return alert("Please select or add a topic");
    if (!body.trim()) return alert("Please enter the main question body");
    if (fields.some((f) => !f.trim()))
      return alert("Please fill all 4 answer fields before saving");
    if (!answer) return alert("Please select the correct answer");

    onSave({
      id: initialData?._id,
      type,
      topic,
      body,
      fields,
      answer,
      explanation,
    });
  };

  const handleFieldChange = (index, value) => {
    const updated = [...fields];
    updated[index] = value;
    setFields(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full h-[90vh] overflow-y-auto max-w-lg rounded-xl p-6 shadow-lg text-gray-800 dark:text-gray-100 transition-colors duration-300">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Question" : "Create Question"}
        </h2>

        <div className="space-y-4">
          {/* Topic Select with Custom Option */}
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <div className="flex gap-2">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select a topic</option>
                {topicOptions.map((t) => (
                  <option key={t} value={t?.trim()}>
                    {t?.trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Question */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Question Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={3}
              placeholder="Enter the main question..."
            />
          </div>

          {/* Answer Fields */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {type === "mcq"
                ? "Answer Options (4)"
                : "Sub Questions for Paragraph (4)"}
            </label>

            {fields.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mb-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <input
                  type="radio"
                  name="correct-answer"
                  value={i + 1}
                  checked={answer === i + 1}
                  onChange={() => setAnswer(i + 1)}
                  className="text-blue-600 transform scale-125 cursor-pointer focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={f}
                  onChange={(e) => handleFieldChange(i, e.target.value)}
                  placeholder={`Answer ${i + 1}`}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Explanation (optional)
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              placeholder="Enter explanation for the correct answer..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
