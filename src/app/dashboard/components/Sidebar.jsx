"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiMenu,
  FiHome,
  FiSettings,
  FiUser,
  FiMoreHorizontal,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

export default function Sidebar({ menuItems }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [showMore, setShowMore] = useState(false);

  const toggleSubMenu = (index) => {
    setOpenSubMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Split menu for mobile bottom nav
  const mainMenu = menuItems.slice(0, 3);
  const extraMenu = menuItems.slice(3);

  // Render nested menu
  const renderMenuItem = (item, index) => (
    <div key={item.name}>
      <Link
        href={item?.href || ""}
        className="flex justify-between items-center w-full px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <div className="flex items-center gap-3">
          {item.icon}
          {sidebarOpen && <span>{item.name}</span>}
        </div>
        {item.subMenu && sidebarOpen && (
          <span>
            {openSubMenus[index] ? <FiChevronDown /> : <FiChevronRight />}
          </span>
        )}
      </Link>

      {/* Submenu */}
      {item.subMenu && openSubMenus[index] && sidebarOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {item.subMenu.map((sub) => (
            <Link
              key={sub.name}
              href={sub.href}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors text-sm"
            >
              {sub.icon}
              <span>{sub.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FiMenu size={20} />
          </button>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 shadow-inner z-40">
        {mainMenu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-200"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        {extraMenu.length > 0 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center text-sm text-gray-700 dark:text-gray-200"
          >
            <FiMoreHorizontal />
            <span>More</span>
          </button>
        )}
      </nav>

      {/* Mobile More Overlay */}
      {showMore && (
        <div
          onClick={() => setShowMore(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 w-64 space-y-2 min-h-screen overflow-auto"
          >
            {extraMenu.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  onClick={() => setShowMore(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>

                {item.subMenu &&
                  item.subMenu.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="flex items-center gap-2 ml-6 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      onClick={() => setShowMore(false)}
                    >
                      {sub.icon}
                      <span>{sub.name}</span>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
