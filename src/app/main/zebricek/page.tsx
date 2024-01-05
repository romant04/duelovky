"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const checkWord = async (word: string) => {
      const res = await fetch(`/api/slovni-fotbal/slovniFotbal?word=${word}`);
      const data = await res.json();
      console.log(data);
    };
    void checkWord("internet");
  }, []);

  return (
    <div>
      <h1>xd</h1>
    </div>
  );
}
