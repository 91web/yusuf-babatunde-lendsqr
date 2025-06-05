import HeroPage from "../components/hero-page";
import RegistrationForm from "../components/registration";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

export default function Registration() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <HeroPage />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <RegistrationForm />
        </Grid>
      </Grid>
    </Container>
  );
}
