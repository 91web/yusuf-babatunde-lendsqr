// components/AppBar.tsx
"use client";
import { useState } from "react";
import styles from "../../styles/header.module.scss";
import Image from "next/image";
import User from "./user";
import Bell from "../../../assests/svg/notifcation.svg";
import Search from "../../../assests/svg/search.svg";
import Logo from "../../../assests/svg/logo.svg";
import { Sidebar } from "./side-bar";

export default function AppBar() {
  return (
    <div>
      <header className={styles.appBar}>
        <div className={styles.notificationIcon}>
          <Image src={Logo.src} alt="Logo" width={140} height={30} />
        </div>

        <div className={styles.searchContainer}>
          <input type="text" placeholder="Search for anything" />
          <button className={styles.searchButton}>
            <Image src={Search.src} alt="Search" width={16} height={16} />
          </button>
        </div>

        <div className={styles.rightSection}>
          <a href="#" className={styles.docsLink}>
            Docs
          </a>
          <div className={styles.notificationIcon}>
            <Image src={Bell.src} alt="Notifications" width={20} height={20} />
          </div>
          <User />
        </div>
      </header>
    </div>
  );
}
