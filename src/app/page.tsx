"use client";
import { useEffect } from "react";
import HomeComponent from "components/HomeComponent/HomeComponent";

export default function Home() {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <HomeComponent />
    </div>
  );
}