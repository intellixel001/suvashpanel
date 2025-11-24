"use client";

import { useEffect, useState } from "react";
import CreateUpdateExam from "./examComponents/CreateUpdateExam";
import ExamTable from "./examComponents/ExamTable";
import apiClient from "@/api/apiClient";

export default function Page() {
  const [createExamModal, setCreateExamModal] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [exams, setExams] = useState([]);

  // Fetch exams from server
  const fetchExams = async () => {
    try {
      const data = await apiClient.get("/staff/exam/get");

      setExams(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const createExamHandler = async (payload) => {
    try {
      const endpoint = currentExam
        ? `/staff/exam/update/${currentExam?._id}`
        : `/staff/exam/create`;

      const res = currentExam
        ? await apiClient.put(endpoint, payload)
        : await apiClient.post(endpoint, payload);

      // Close modal and reset current exam
      // setCreateExamModal(false);
      // setCurrentExam(null);

      // Refresh exams
      fetchExams();
    } catch (error) {
      console.error("❌ Exam save failed:", error);
    }
  };

  return (
    <>
      <ExamTable
        onCreate={() => {
          setCurrentExam(null);
          setCreateExamModal(true);
        }}
        exams={exams}
        onEdit={(exam) => {
          setCurrentExam(exam);
          setCreateExamModal(true);
        }}
        onDelete={async (id) => {
          if (confirm("Are you sure you want to delete this exam?")) {
            await apiClient.delete(`/staff/delete-exam/${id}`);
            // Refresh exams after delete
            fetchExams();
          }
        }}
      />

      <CreateUpdateExam
        isOpen={createExamModal}
        onClose={() => {
          setCreateExamModal(false);
          setCurrentExam(null);
        }}
        onSubmit={createExamHandler}
        initialData={currentExam}
        errorMsg={errorMsg}
      />
    </>
  );
}
