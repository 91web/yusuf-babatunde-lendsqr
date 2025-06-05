"use client";
import { useState } from "react";
import bcrypt from "bcryptjs";
import styles from "../../styles/registration.module.scss";
import Link from "next/link";
import Box from "@mui/material/Box";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      const user: User = {
        id: crypto.randomUUID(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        password: hashedPassword,
      };

      localStorage.setItem("currentUser", JSON.stringify(user));
      sessionStorage.setItem("sessionId", crypto.randomUUID());
      setMessage("Registration successful!");
    } catch (error) {
      setMessage("Registration failed");
      console.error(error);
    }
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
          value={formData.email}
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
    </div>
  );
}
