// components/Sidebar/Sidebar.tsx
"use client"; // Required for client-side interactivity

import { usePathname, useRouter } from "next/navigation";
import styles from "../../styles/sidebar.module.scss";
import { sidebarData } from "./data";
import Image from "next/image";
import Icon1 from "../../../assests/svg/icon1.svg";

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.orgSwitch}>
        {" "}
        <Image src={Icon1.src} alt="Logo" height={16} width={16} />
        <button
          onClick={() => navigateTo("/organization")}
          className={styles.navButton}
        >
          Switch Organization
        </button>
      </div>

      {sidebarData.map((section, index) => (
        <div key={index} className={styles.section}>
          {section.title && (
            <div className={styles.sectionTitle}>{section.title}</div>
          )}

          <div className={styles.menuItems}>
            {section.items.map((item, itemIndex) => (
              <button
                key={itemIndex}
                onClick={() => navigateTo(item.path)}
                className={`${styles.menuItem} ${styles.navButton} ${
                  pathname === item.path ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>
                  <Image src={item.icon} alt="Logo" height={16} width={16} />
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
