"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/login.module.scss";
import Link from "next/link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import bcrypt from "bcryptjs";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    redirect: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Retrieve all users from localStorage
      const storedUsers = localStorage.getItem("users");
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (users.length === 0) {
        setDialog({
          open: true,
          title: "No Accounts Found",
          message: "No accounts found. Please register first.",
          redirect: "/register",
        });
        return;
      }

      // Find user by email (case-insensitive)
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        setDialog({
          open: true,
          title: "Account Not Found",
          message: "No account found with this email address",
          redirect: "",
        });
        return;
      }

      // Compare hashed passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        setDialog({
          open: true,
          title: "Login Failed",
          message: "Incorrect password",
          redirect: "",
        });
        return;
      }

      // Successful login
      sessionStorage.setItem("sessionId", crypto.randomUUID());
      localStorage.setItem("currentUser", JSON.stringify(user));

      setDialog({
        open: true,
        title: "Login Successful!",
        message: "Welcome back! You will now be redirected to your dashboard.",
        redirect: "/dashboard",
      });
    } catch (error) {
      setDialog({
        open: true,
        title: "Error",
        message: "An error occurred during login. Please try again.",
        redirect: "",
      });
      console.error("Login error:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    if (dialog.redirect) {
      router.push(dialog.redirect);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.header}>Welcome Back!</h1>
        <h5 className={styles.formDescription}>Enter details to login</h5>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
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

        <p className={styles.registerLink}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={styles.registerLinkText}>
            Register here
          </Link>
        </p>
      </form>

      {/* Unified Dialog for all notifications */}
      <Dialog
        open={dialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
