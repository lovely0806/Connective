import {
  Container,
  Typography,
} from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <Container
      sx={{
        textAlign: "center",
        minHeight: "100vh",
        padding: 0
      }}
      fluid
    >
      <Typography> Connective auth </Typography>
      <Link href="/auth/signin">SignIn</Link> <br/>
      <Link href="/auth/signup">SignUp</Link>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default Home;
