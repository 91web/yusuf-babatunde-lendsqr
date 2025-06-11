"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/header.module.scss";
import Image from "next/image";
import Drop from "../../../assests/svg/drop.svg";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export default function UserMenu() {
  // Renamed from User to avoid confusion
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if window is defined (client-side) before accessing localStorage
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Handle error or redirect to login
          router.push("/login");
        }
      }
    }
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      // Clear any other user-related data
      localStorage.removeItem("authToken");
      // Redirect to login page
      router.push("/login");
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

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
          src={Drop.src}
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
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
