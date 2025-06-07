"use client";
import { useState } from "react";
import bcrypt from "bcryptjs";
import styles from "../../styles/registration.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
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

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      // Check if email already exists
      const storedUsers = localStorage.getItem("users");
      const existingUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      const emailExists = existingUsers.some(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (emailExists) {
        setMessage("Email already registered");
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        gender: formData.gender,
        password: hashedPassword,
      };

      // Update users array in localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Set current session
      sessionStorage.setItem("sessionId", crypto.randomUUID());
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      setOpenSuccessDialog(true);
    } catch (error) {
      setMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenSuccessDialog(false);
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.color}>Create Account</h1>

        <div className={styles.nameFields}>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          value={formData.email.toLocaleLowerCase()}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <Box sx={{ width: { xs: "fit-content", md: "auto" } }}>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="select">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Box>

        <div className={styles.passwordField}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
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
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />

        <button type="submit" className={styles.submitButton}>
          Register
        </button>

        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.loginLink}>
          Already have an account?{" "}
          <Link href="/login" className={styles.loginLinkText}>
            Login here
          </Link>
        </p>
      </form>

      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Registration Successful!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your account has been created successfully. You will now be
            redirected to the login page.
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
