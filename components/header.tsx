"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const SectionData = [
    {
      title: "ダッシュボード",
      path: "/",
    },
    {
      title: "商品管理",
      path: "/stocks_management",
    },
    {
      title: "カウンター",
      path: "/counter",
    },
  ];

  const [selected, setSelected] = useState("/");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSelected(window.location.pathname);
    }
  }, []);

  const [expandNav, setExpandNav] = useState(false);

  return (
    <header className="w-full h-16 sm:h-28 py-2 sm:py-4 px-4 sm:px-8 flex items-center justify-around sticky top-0 z-50">
      <div className="h-full flex items-center gap-2 sm:gap-4">
        <div className="h-full aspect-square bg-[url('/logo.png')]  bg-cover bg-center rounded-md" />
        <h2 className="text-2xl sm:text-5xl">Stock counter</h2>
      </div>

      <nav className="h-full aspect-square sm:aspect-auto sm:h-auto sm:overflow-auto">
        {/* Humberger */}
        <div
          className="h-full aspect-square relative sm:hidden"
          onClick={() => setExpandNav((prev) => !prev)}
          onKeyUp={() => {}}
        >
          <span
            className={`w-full h-1 bg-(--base) absolute top-1/4 ${expandNav ? "rotate-45 top-4/9" : ""}`}
          />
          <span
            className={`w-full h-1 bg-(--base) absolute bottom-1/4 ${expandNav ? "-rotate-45 bottom-4/9" : ""}`}
          />
        </div>

        {/* Link list */}
        <ol
          className={`flex items-center gap-8 ${expandNav ? "block w-40 flex-col  gap-4 py-4 mt-4 px-2 rounded-md bg-white" : "hidden sm:inline-flex"}`}
        >
          {SectionData.map((section) => {
            return (
              <li key={section.title}>
                <Link
                  href={section.path}
                  className={`text-xl ${selected === section.path ? "text-(--accent-normal) font-semibold" : ""}`}
                >
                  {section.title}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
