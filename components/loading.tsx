"use client";

import { setInterval } from "node:timers";
import { useEffect, useState } from "react";

export default function Loading() {
  const [text, setText] = useState("");
  const loadingMessage = "Now, loading data.     ";

  useEffect(() => {
    setText((prevText) =>
      prevText !== loadingMessage
        ? loadingMessage.slice(0, prevText.length + 1)
        : "",
    );

    const intervalFunc = setInterval(() => {
      setText((prevText) =>
        prevText !== loadingMessage
          ? loadingMessage.slice(0, prevText.length + 1)
          : "",
      );
    }, 100);

    return () => clearInterval(intervalFunc);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <h1 className="text-3xl">{text}</h1>
    </div>
  );
}
