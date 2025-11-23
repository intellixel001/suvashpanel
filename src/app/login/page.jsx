import React from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login - EduLearn",
  description: "Login to your EduLearn account to access courses and exams",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <LoginForm />
    </main>
  );
}
