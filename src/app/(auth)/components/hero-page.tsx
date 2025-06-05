import React from "react";
import Log1 from "../../../assests/svg/hero-logo.svg";
import Log2 from "../../../assests/img/hero-login.png";
import Image from "next/image";
import Box from "@mui/material/Box";



export default function HeroPage() {
  return (
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <div
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          zIndex: 10,
        }}
      >
        <Image
          src={Log1.src}
          alt="LendSqr Logo"
          height={36}
          width={175}
          priority
        />
      </div>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <Image
            src={Log2.src}
            alt="Illustration of people using LendSqr platform"
            height={340}
            width={600}
            priority
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </Box>
  );
}
