"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../assests/img/logo.png";
import styles from "./styles/page.module.scss";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/login"), 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <Image
        src={Logo.src}
        alt="Logo"
        width={200}
        height={100}
        className={styles.logo}
      />
    </div>
  );
}
