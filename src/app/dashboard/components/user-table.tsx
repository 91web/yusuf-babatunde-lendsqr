"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../../styles/users-table.module.scss";
import { UsersData, UserType } from "./data";
import Image from "next/image";
import ChevronLeft from "../../../assests/svg/chevronLeft.svg";
import ChevronRight from "../../../assests/svg/chevronRight.svg";
import Filter from "../../../assests/svg/filter.svg";
import Eye from "../../../assests/svg/eye.svg";
import UserX from "../../../assests/svg/userx.svg";
import User from "../../../assests/svg/users.svg";
import Savings from "../../../assests/svg/savings.svg";
import Loan from "../../../assests/svg/loan.svg";
import Active from "../../../assests/svg/active.svg";
import Dot from "../../../assests/svg/dot.svg";

const mockUsers: UserType[] = UsersData;

export default function UsersDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(mockUsers);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    userId: number;
    message: string;
  } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const filterUsers = (status: string) => {
    setActiveFilter(status);
    setCurrentPage(1); // Reset to first page when filtering

    if (status === "all") {
      setFilteredUsers(users);
    } else if (status === "withLoans") {
      setFilteredUsers(users.filter((user) => user.hasLoan));
    } else if (status === "withSavings") {
      setFilteredUsers(users.filter((user) => user.hasSavings));
    } else {
      setFilteredUsers(
        users.filter(
          (user) => user.status.toLowerCase() === status.toLowerCase()
        )
      );
    }
  };

  const getMetricCount = (type: string) => {
    switch (type) {
      case "users":
        return users.length;
      case "active":
        return users.filter((u) => u.status === "Active").length;
      case "loans":
        return users.filter((u) => u.hasLoan).length;
      case "savings":
        return users.filter((u) => u.hasSavings).length;
      default:
        return 0;
    }
  };

  const handleAction = (type: string, userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const messages = {
      blacklist: `Are you sure you want to blacklist ${user.username}?`,
      activate: `Are you sure you want to activate ${user.username}?`,
      deactivate: `Are you sure you want to deactivate ${user.username}?`,
    };

    setConfirmAction({
      type,
      userId,
      message: messages[type as keyof typeof messages],
    });
    setShowConfirmDialog(true);
    setActiveDropdown(null);
  };

  const confirmActionHandler = () => {
    if (!confirmAction) return;

    const { type, userId } = confirmAction;
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        switch (type) {
          case "blacklist":
            return { ...user, status: "Blacklisted" as const };
          case "activate":
            return { ...user, status: "Active" as const };
          case "deactivate":
            return { ...user, status: "Inactive" as const };
          default:
            return user;
        }
      }
      return user;
    });

    setUsers(updatedUsers);
    filterUsers(activeFilter);
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`${styles.paginationButton} ${
              currentPage === i ? styles.active : ""
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      buttons.push(
        <button
          key={1}
          className={`${styles.paginationButton} ${
            currentPage === 1 ? styles.active : ""
          }`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        buttons.push(<span className={styles.ellipsis}>...</span>);
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            className={`${styles.paginationButton} ${
              currentPage === i ? styles.active : ""
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        buttons.push(<span className={styles.ellipsis}>...</span>);
      }

      // Always show last page
      buttons.push(
        <button
          key={totalPages}
          className={`${styles.paginationButton} ${
            currentPage === totalPages ? styles.active : ""
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <div className={styles.notification}>
          <div className={styles.notificationBadge}>1</div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div
          className={`${styles.metricCard} ${
            activeFilter === "all" ? styles.active : ""
          }`}
          onClick={() => filterUsers("all")}
        >
          <div className={styles.metricIcon}>
            <Image src={User.src} alt="User" height={24} width={24} />
          </div>
          <div className={styles.metricLabel}>USERS</div>
          <div className={styles.metricValue}>
            {getMetricCount("users").toLocaleString()}
          </div>
        </div>

        <div
          className={`${styles.metricCard} ${
            activeFilter === "active" ? styles.active : ""
          }`}
          onClick={() => filterUsers("active")}
        >
          <div className={styles.metricIcon}>
            <Image src={Active.src} alt="User" height={24} width={24} />
          </div>
          <div className={styles.metricLabel}>ACTIVE USERS</div>
          <div className={styles.metricValue}>
            {getMetricCount("active").toLocaleString()}
          </div>
        </div>

        <div
          className={`${styles.metricCard} ${
            activeFilter === "withLoans" ? styles.active : ""
          }`}
          onClick={() => filterUsers("withLoans")}
        >
          <div className={styles.metricIcon}>
            <Image src={Loan.src} alt="User" height={34} width={34} />
          </div>
          <div className={styles.metricLabel}>USERS WITH LOANS</div>
          <div className={styles.metricValue}>
            {getMetricCount("loans").toLocaleString()}
          </div>
        </div>

        <div
          className={`${styles.metricCard} ${
            activeFilter === "withSavings" ? styles.active : ""
          }`}
          onClick={() => filterUsers("withSavings")}
        >
          <div className={styles.metricIcon}>
            <Image src={Savings.src} alt="User" height={34} width={34} />
          </div>
          <div className={styles.metricLabel}>USERS WITH SAVINGS</div>
          <div className={styles.metricValue}>
            {getMetricCount("savings").toLocaleString()}
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <div className={styles.tableHeader}>
                  ORGANIZATION
                  <Image src={Filter.src} alt="Filter" height={14} width={14} />
                </div>
              </th>
              <th>
                <div className={styles.tableHeader}>
                  USERNAME
                  <Image src={Filter.src} alt="Filter" height={14} width={14} />
                </div>
              </th>
              <th>
                <div className={styles.tableHeader}>
                  EMAIL
                  <Image src={Filter.src} alt="Filter" height={14} width={14} />
                </div>
              </th>
              <th>
                <div className={styles.tableHeader}>
                  PHONE NUMBER
                  <Image src={Filter.src} alt="Filter" height={14} width={14} />
                </div>
              </th>
              <th>
                <div className={styles.tableHeader}>
                  DATE JOINED
                  <Image src={Filter.src} alt="Filter" height={14} width={14} />
                </div>
              </th>
              <th>
                <div className={styles.tableHeader}>
                  STATUS
                  <Image src={Filter.src} alt="Filter" height={14} width={14} />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id}>
                <td>{user.organization}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.dateJoined}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      styles[user.status.toLowerCase()]
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className={styles.actionCell}>
                  <button
                    className={styles.moreButton}
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === user.id ? null : user.id
                      )
                    }
                  >
                    <Image src={Dot.src} alt="User" height={14} width={14} />
                  </button>
                  {activeDropdown === user.id && (
                    <div className={styles.dropdown} ref={dropdownRef}>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                          setActiveDropdown(null);
                        }}
                      >
                        <Image src={Eye.src} alt="Eye" height={14} width={14} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleAction("blacklist", user.id)}
                      >
                        <Image
                          src={UserX.src}
                          alt="User"
                          height={14}
                          width={14}
                        />
                        Blacklist User
                      </button>
                      <button onClick={() => handleAction("activate", user.id)}>
                        <Image
                          src={User.src}
                          alt="User"
                          height={14}
                          width={14}
                        />
                        Activate User
                      </button>
                      <button
                        onClick={() => handleAction("deactivate", user.id)}
                      >
                        <Image
                          src={UserX.src}
                          alt="User"
                          height={14}
                          width={14}
                        />
                        Deactivate User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          <span>Showing</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            className={styles.itemsSelect}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>out of {filteredUsers.length}</span>
        </div>

        <div className={styles.paginationControls}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <Image
              src={ChevronLeft.src}
              alt="ChevronLeft"
              height={14}
              width={14}
            />
          </button>

          {renderPaginationButtons()}

          <button
            className={styles.paginationButton}
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            <Image
              src={ChevronRight.src}
              alt="ChevronRight"
              height={14}
              width={14}
            />
          </button>
        </div>
      </div>

      {/* Rest of your dialog components remain the same */}
      {showConfirmDialog && (
        <div className={styles.overlay}>
          <div className={styles.confirmDialog}>
            <h3>Confirm Action</h3>
            <p>{confirmAction?.message}</p>
            <div className={styles.dialogActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={confirmActionHandler}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showUserDetails && selectedUser && (
        <div className={styles.overlay}>
          <div className={styles.userDetailsDialog}>
            <div className={styles.dialogHeader}>
              <h3>User Details</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowUserDetails(false)}
              >
                x
              </button>
            </div>
            <div className={styles.userDetailsContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Organization:</span>
                <span className={styles.detailValue}>
                  {selectedUser.organization}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Username:</span>
                <span className={styles.detailValue}>
                  {selectedUser.username}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{selectedUser.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Phone Number:</span>
                <span className={styles.detailValue}>
                  {selectedUser.phoneNumber}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Date Joined:</span>
                <span className={styles.detailValue}>
                  {selectedUser.dateJoined}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status:</span>
                <span
                  className={`${styles.status} ${
                    styles[selectedUser.status.toLowerCase()]
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>
            <div className={styles.dialogActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowUserDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
