// components/AppBar.tsx
"use client";
import { useState } from "react";
import styles from "../../styles/header.module.scss";
import Image from "next/image";
import Drop from "../../../assests/svg/drop.svg";    

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export default function User() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user: User = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
  
     
    <div className={styles.rightSection}>
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
            src= {Drop.src}
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
  );
}
