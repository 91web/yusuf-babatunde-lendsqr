import HeroPage from "../components/hero-page";
import LoginForm from "../components/login-form";
import Container from "@mui/material/Container";

export default function RowComponent() {
  return (
    <Container maxWidth="lg">
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            //  padding: "16px",
            //   borderRadius: "8px",
          }}
        >
          <HeroPage />
        </div>
        <div
          style={{
            flex: 1,
            background: "#e0e0e0",
            //   padding: "16px",
            //   borderRadius: "8px",
          }}
        >
          <LoginForm />
        </div>
      </div>
    </Container>
  );
}
