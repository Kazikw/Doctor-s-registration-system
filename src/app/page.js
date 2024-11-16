'use client'

import "./globals.css";
import { useRouter } from "next/navigation";
import Login from "./login/page.js";
import Home from "./index.js";

export default function Page() {
  return (
    <div>
      <Home />
    </div>
  );
}
