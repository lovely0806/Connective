import InputField from "../../components/input-field";
import Logo from "../../components/logo";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import OnboardingSidebar from "../../components/onboarding-sidebar";
import Link from "next/link";
import Image from "next/image";
import googleIcon from "../../public/assets/google-icon.svg";
import logo from "../../public/assets/logo.svg";
import LoginSidebar from "components/login-sidebar";
import Head from "next/head";
import EmailVerification from "components/dailog/EmailVerification";
import { GoogleLogin } from "react-google-login";
import nextConfig from "../../next.config";

export default function SignIn({ user }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(null);
  const [otpCode, setOtpCode] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [rememberme, setRememberMe] = useState(false);

  const router = useRouter();
  const clientId = "106261913144-qa5mgoaoi0v40eigop73gnqglmnkj7sp.apps.googleusercontent.com";

  useEffect(() => {
    if (typeof user != "undefined") {
      //router.push("/onboarding/create-profile")
    }
    if(user && user.rememberme){
      setEmail(user.email);
      setPassword('********');
      setRememberMe(user.rememberme)
    }
  }, [user]);

  useEffect(() => {
    async function verifyEmail() {
      if (otpCode && emailNotVerified) {
        const verifiedEmail = await axios({
          method: "post",
          url: "/api/auth/verifyEmail",
          data: { code: otpCode, email },
        });
        if (!verifiedEmail.data.success && verifiedEmail?.data?.error) {
          if (verifiedEmail.data.error === "Incorrect verification code") {
            setOtpError("Incorrect verification code");
          } else {
            setOtpError(verifiedEmail.data.error);
          }
        } else {
          setOtpError(null);
          setEmailError(null);
          setEmailNotVerified(null);
          verifiedEmail.data.success
            ? router.push("/app/discover")
            : router.push("/onboarding/create-profile");
        }
      }
    }
    verifyEmail();
  }, [otpCode, emailNotVerified]);

  const submitAccount = async () => {
    if(user && user.rememberme){
      router.push("/app/discover");
      return
    }
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
      data: { email, password, rememberme },
    })
      .then((res) => {
        if (res.status == 201) {
          res.data
            ? router.push("/app/discover")
            : router.push("/onboarding/create-profile");
        }
      })
      .catch(async (e) => {
        if (e.response.data.error == "Email not verified") {
          setEmailError("Email not verified");
          setEmailNotVerified(true);

          await axios({
            method: "post",
            url: "/api/auth/sendVerificationCode",
            data: { email },
          });
        }
        if (
          e.response.status == 403 ||
          e.response.data.error == "Account does not exist"
        )
          setPasswordError("Incorrect email or password");
      });
  };

  const onGoogleSuccess = (res) => {
    console.log("[Login Success] currentUser:", res.profileObj);
  };
  const onGoogleFailure = (res) => {
    console.log("[login failed] res:", res);
  };

  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <main className="flex flex-row-reverse gap-[80px] 2bp:gap-[40px] justify-center">
      <Head>
        <title>Signin - Conenctive</title>
      </Head>
      <LoginSidebar />

      <div className="flex flex-col max-w-[704px] w-[100%] font-[Montserrat] my-[32px] ml-[64px]">
        <div className="cursor-pointer">
          <Link href="https://www.connective-app.xyz">
            <div className="mb-[60px]">
              <Image
                src={logo}
                alt="Connective logo"
                width="205px"
                height="48px"
              />
            </div>
          </Link>
        </div>

        <div>
          <div>
            <p className="font-bold text-[32px] leading-[39px] text-[#0D1011]">
              Sign in
            </p>

            <p className="text-[#414141] mt-[12px] font-normal text-[16px] leading-[24px] font-[Poppins] 1bp:text-[18px] mb-20">
              Welcome back! Please enter your details
            </p>

            {/* <div
               className="h–[47px] flex flex-row items-center w-[100%] bg-[#EFEFEF] mt-[40px] justify-center rounded-[8px] gap-[11.67px] py-[14.47px] cursor-pointer"
              onClick=""
            >
              <Image
                 className="w-[16.67px] h-[16.67px] 1bp:w-[20px] 1bp:h-[20px]"
                src={googleIcon}
                alt="Google"
                width="16.67px"
                height="16.67px"
              />
              <p  className="font-normal text-[12px] leading-[18px] text-[#0D1011] font-[Poppins] 1bp:text-[14px]">
                Login with with Google
              </p>
            </div>
            <div  className="flex flex-row items-center gap-[12px] mt-[24px]">
              <div  className="w-[100%] h-[1px] bg-[#D9D9D9]" />
              <div>
                <p  className="font-normal text-[12px] leading-[18px] text-[#414141] font-[Poppins] 1bp:text-[14px]">
                  or
                </p>
              </div>
              <div  className="w-[100%] h-[1px] bg-[#D9D9D9]" />
            </div> */}
          </div>

          <div className="relative flex flex-col items-center gap-5 mt-10">
            <InputField
              name={"E-mail"}
              placeholder={"Enter your email"}
              updateValue={setEmail}
              errorText={emailError}
              value={email}
            ></InputField>

            <InputField
              name={"Password"}
              placeholder={"Enter password"}
              password={!showPassword ? true : false}
              updateValue={setPassword}
              errorText={passwordError}
              value={password}
            ></InputField>
            <div
              className="absolute right-[14px] bottom-[5px] cursor-pointer"
              onClick={showPasswordHandler}
            >
              {!showPassword && (
                <Image
                  src="/assets/eye-slash.svg"
                  alt="eye slash"
                  width="24px"
                  height="24px"
                />
              )}
              {showPassword && (
                <Image
                  src="/assets/eye.svg"
                  alt="eye"
                  width="24px"
                  height="24px"
                />
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-[8px] my-[24px] 1bp:gap-[14px] items-center">
              <input
                className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
                type="checkbox"
                id="checkbox"
                value={rememberme}
                onChange={(e) => setRememberMe(e.target.checked)}
              ></input>
              <p className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0D1011] 1bp:text-[16px]">
                Remember my information
              </p>
            </div>
            <Link href=".">
              <p className="font-Poppins font-normal text-[12px] leading-[18px] text-[#061A40] cursor-pointer 1bp:text-[16px]">
                Forgot your password?
              </p>
            </Link>
          </div>

          <button
            onClick={submitAccount}
            className="w-[100%] h-[47px] bg-[#061A40] font-semibold font-[Poppins] text-[#F2F4F5] text-[12px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px] mb-2"
          >
            Log in
          </button>
          <GoogleLogin
            clientId={clientId}
            buttonText="Log in with Google"
            onSuccess={onGoogleSuccess}
            onFailure={onGoogleFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-[100%] h-[47px] bg-[#061A40] font-semibold font-[Poppins] text-[#F2F4F5] text-[12px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px] mb-2"
              >
                Log in with Google
              </button>
            )}
          />

          <p className="mt-[24px] font-[Poppins] font-normal text-[12px] leading-[18px] text-center text-[#414141] 1bp:text-[16px]">
            Dont have an account?{" "}
            <Link href="/auth/signup">
              <span className="font-bold cursor-pointer">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
      {emailNotVerified ? (
        <>
          <div className="fixed z-10 flex items-center w-full h-full shadow-black backdrop-blur-sm backdrop-brightness-90">
            <EmailVerification
              code={setOtpCode}
              email={email}
              otpNotMatchError={otpError}
              setOtpNotMatchError={setOtpError}
            />
          </div>
        </>
      ) : null}
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
