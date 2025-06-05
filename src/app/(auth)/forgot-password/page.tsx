"use client";
import { useState } from "react";
import bcrypt from "bcryptjs";
import styles from "../../styles/registration.module.scss";
import Link from "next/link";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"email" | "reset">("email");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user exists in localStorage (simulating database check)
    const usersJson = localStorage.getItem("currentUser");
    if (!usersJson) {
      setMessage("No user found with this email");
      return;
    }

    const user: User = JSON.parse(usersJson);
    if (user.email === email) {
      setStep("reset");
      setMessage("");
    } else {
      setMessage("No user found with this email");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user's password in localStorage
      const usersJson = localStorage.getItem("currentUser");
      if (usersJson) {
        const user: User = JSON.parse(usersJson);
        user.password = hashedPassword;
        localStorage.setItem("currentUser", JSON.stringify(user));
        setMessage("Password reset successfully!");
        setStep("email");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMessage("Password reset failed");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className={styles.form}>
          <h1 className={styles.color}>Reset Password</h1>

          <p>Enter your email to reset your password</p>

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <button type="submit" className={styles.submitButton}>
            Continue
          </button>

          {message && <p className={styles.message}>{message}</p>}

          <p className={styles.loginLink}>
            Remember your password?{" "}
            <Link href="/login" className={styles.loginLinkText}>
              Login here
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className={styles.form}>
          <h1 className={styles.color}>Set New Password</h1>

          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />

          <button type="submit" className={styles.submitButton}>
            Reset Password
          </button>

          {message && <p className={styles.message}>{message}</p>}

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setMessage("");
            }}
            className={styles.loginLinkText}
          >
            Back to email entry
          </button>
        </form>
      )}
    </div>
  );
}
