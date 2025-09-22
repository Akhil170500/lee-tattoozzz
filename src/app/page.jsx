'use client';
import Image from "next/image";
import SignIn from "./login/signin/page";
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <BrowserRouter>
        <div className="">
          <SignIn />
        </div>
      </BrowserRouter>
    )
  );
}