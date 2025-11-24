"use client";

import { FiHome, FiSettings, FiUser, FiFileText } from "react-icons/fi";
import Sidebar from "./components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../redux/features/userSlice";
import { fetchTasks } from "@/redux/features/taskSlice";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);

  const [menuItems, setMenuItems] = useState([]);

  // 🔹 1. Fetch user on first load
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // 🔹 2. Set menu dynamically based on role
  useEffect(() => {
    if (!currentUser) return;

    let items = [
      {
        name: "Home",
        icon: <FiHome />,
        href: "/dashboard",
      },
    ];

    // 🔸 Role: staff
    if (currentUser.role === "staff") {
      items.push(
        {
          name: "Course",
          icon: <FiUser />,
          href: "/dashboard/course",
        },
        {
          name: "Exam",
          icon: <FiFileText />,
          href: "/dashboard/exam",
        }
      );
    }

    // 🔸 Role: teacher
    if (currentUser.role === "teacher") {
      items.push(
        {
          name: "Exam",
          icon: <FiHome />,
          href: "/dashboard/exam",
        },
        {
          name: "Assignments",
          icon: <FiFileText />,
          href: "/dashboard/assignments",
        }
      );
    }

    setMenuItems(items);
  }, [currentUser]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar menuItems={menuItems} />
      <main className="flex-1 overflow-auto p-6">
        {loading && <p>Loading user...</p>}
        {children}
      </main>
    </div>
  );
}
