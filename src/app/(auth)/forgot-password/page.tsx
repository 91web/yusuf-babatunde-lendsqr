"use client";
import { useState } from "react";
import bcrypt from "bcryptjs";
import styles from "../../styles/registration.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

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
  const [step, setStep] = useState<"email" | "reset">("email");
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    redirect: "",
  });
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user exists in localStorage users array
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      setDialog({
        open: true,
        title: "Account Not Found",
        message: "No user found with this email address",
        redirect: "",
      });
      return;
    }

    setStep("reset");
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setDialog({
        open: true,
        title: "Password Mismatch",
        message: "Passwords don't match",
        redirect: "",
      });
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user's password in localStorage users array
      const storedUsers = localStorage.getItem("users");
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const updatedUsers = users.map((user) => {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          return { ...user, password: hashedPassword };
        }
        return user;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Also update currentUser if it's the same user
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const parsedUser: User = JSON.parse(currentUser);
        if (parsedUser.email.toLowerCase() === email.toLowerCase()) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...parsedUser,
              password: hashedPassword,
            })
          );
        }
      }

      setDialog({
        open: true,
        title: "Success",
        message:
          "Password reset successfully! You will now be redirected to login.",
        redirect: "/login",
      });
    } catch (error) {
      setDialog({
        open: true,
        title: "Error",
        message: "Password reset failed. Please try again.",
        redirect: "",
      });
      console.error("Password reset error:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));
    if (dialog.redirect) {
      router.push(dialog.redirect);
      // Reset form if redirecting
      if (dialog.redirect === "/login") {
        setStep("email");
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
      }
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
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder="Email"
            required
          />

          <button type="submit" className={styles.submitButton}>
            Continue
          </button>

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

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setEmail("");
            }}
            className={styles.loginLinkText}
          >
            Back to email entry
          </button>
        </form>
      )}

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
