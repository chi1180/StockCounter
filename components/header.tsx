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

  return (
    <header className="w-full h-28 py-4 px-8 flex items-center justify-around sticky top-0 z-50">
      <div className="h-full flex items-center gap-4">
        <div className="h-full aspect-square bg-[url('/logo.png')]  bg-cover bg-center rounded-md" />
        <h2 className="text-5xl">Stock counter</h2>
      </div>

      <nav>
        <ol className="flex items-center gap-8">
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
