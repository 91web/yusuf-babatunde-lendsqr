import HeroPage from "../components/hero-page";
import LoginForm from "../components/login-form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

export default function RowComponent() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <HeroPage />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LoginForm />
        </Grid>
      </Grid>
    </Container>
  );
}
