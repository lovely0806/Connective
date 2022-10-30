import InputField from "../../components/input-field";
import Logo from "../../components/logo";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import OnboardingSidebar from "../../components/onboarding-sidebar";
import Link from "next/link";

export default function SignIn({ user }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof user != "undefined") {
      //router.push("/onboarding/create-profile")
    }
  }, [user]);

  const submitAccount = async () => {
    if (email == "") {
      setEmailError("You must enter an email.");
      setPasswordError("");
      return;
    }
    if (password == "") {
      setPasswordError("You must enter a password.");
      setEmailError("");
      return;
    }

    setPasswordError("");
    setEmailError("");

    await axios({
      method: "post",
      url: "/api/auth/sessions",
      data: { email, password },
    })
      .then((res) => {
        if (res.status == 201) {
          res.data
            ? router.push("/app/profile")
            : router.push("/onboarding/create-profile");
        }
      })
      .catch((e) => {
        if (
          e.response.status == 403 ||
          e.response.data.error == "Account does not exist"
        )
          setPasswordError("Incorrect email or password");
      });
  };

  return (
    <main className="flex flex-row min-h-screen min-w-screen">
      <OnboardingSidebar></OnboardingSidebar>

      <div className="flex flex-col my-auto w-[40vw] mx-auto font-[Montserrat]">
        <p className="font-bold text-3xl">Sign in</p>
        <p className="text-black/50 mt-3">
          Welcome back! Sign in to access your account.
        </p>
        <div className="flex flex-col gap-5 mt-10">
          <InputField
            name={"Email"}
            placeholder={"Enter your email"}
            updateValue={setEmail}
            errorText={emailError}
          ></InputField>
          <InputField
            name={"Password"}
            placeholder={"Enter password"}
            password={true}
            updateValue={setPassword}
            errorText={passwordError}
          ></InputField>
        </div>
        <button
          onClick={submitAccount}
          className="w-full bg-[#0F172A] font-bold text-white py-4 mt-20 rounded-md shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          Sign in
        </button>
        <p className="mt-2">
          Dont have an account?{" "}
          <Link href="/auth/signup">
            <span className="underline cursor-pointer text-blue-400">
              Sign up here
            </span>
          </Link>
        </p>
      </div>
    </main>
  );
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      return { props: {} };
    }

    return {
      props: { user },
    };
  },
  {
    cookieName: "Connective",
    cookieOptions: {
      secure: process.env.NODE_ENV == "production" ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  }
);
