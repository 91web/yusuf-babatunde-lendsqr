// components/AppBar.tsx
"use client";
import { useState } from "react";
import styles from "../../styles/header.module.scss";
import Image from "next/image";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export default function AppBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user: User = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className={styles.appBar}>
      <div className={styles.logo}>lendsqr</div>

      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search for anything" />
        <button className={styles.searchButton}>
          <Image src="/search-icon.svg" alt="Search" width={16} height={16} />
        </button>
      </div>

      <div className={styles.rightSection}>
        <a href="#" className={styles.docsLink}>
          Docs
        </a>
        <div className={styles.notificationIcon}>
          <Image
            src="/bell-icon.svg"
            alt="Notifications"
            width={20}
            height={20}
          />
        </div>
        <div className={styles.userMenu} onClick={toggleDropdown}>
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="User"
              width={40}
              height={40}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>
          )}
          <span className={styles.userName}>{user.firstName}</span>
          <Image
            src={showDropdown ? "/chevron-up.svg" : "/chevron-down.svg"}
            alt="Dropdown"
            width={16}
            height={16}
            className={styles.dropdownIcon}
          />

          {showDropdown && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownAvatar}>
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User"
                      width={48}
                      height={48}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.dropdownUserInfo}>
                  <div className={styles.dropdownName}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div className={styles.dropdownEmail}>{user.email}</div>
                </div>
              </div>
              <button className={styles.logoutButton}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
