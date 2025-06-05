"use client";
import { useState, useRef } from "react";
import styles from "../../styles/login.module.scss";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      setMessage("No account found. Please register first.");
      return;
    }

    const user = JSON.parse(storedUser);

    // Basic validation
    if (user.email !== email) {
      setMessage("Invalid email address");
      return;
    }

    // In a real app, you would verify the hashed password here
    // For this example, we'll just check if password isn't empty
    if (!password) {
      setMessage("Please enter your password");
      return;
    }

    // Successful login
    sessionStorage.setItem("sessionId", crypto.randomUUID());
    dialogRef.current?.showModal();
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.header}>Welcome Back!</h1>
        <h5 className={styles.formDescription}>Enter details to login</h5>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <div className={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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
        <Link href="/forgot-password" className={styles.registerLinkText}>
          Forgot Password
        </Link>
        <button type="submit" className={styles.submitButton}>
          Log In
        </button>

        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.registerLink}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={styles.registerLinkText}>
            Register here
          </Link>
        </p>
      </form>

      <dialog ref={dialogRef} className={styles.dialog}>
        <h3>Login Successful</h3>
        <p>Welcome back, {email}!</p>
        <button
          onClick={() => dialogRef.current?.close()}
          className={styles.submitButton}
        >
          Continue
        </button>
      </dialog>
    </div>
  );
}
