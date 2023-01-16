import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import InputField from "../../../../components/input-field";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const [linkNotVerified, setLinkNotVerified] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const { email, token } = router.query;

  useEffect(() => {
    async function verifyLink() {
      if (email && token) {
        const verifiedLink = await axios({
          method: "post",
          url: "/api/auth/verifyLink",
          data: { email, token },
        });
        if (!verifiedLink.data.success && verifiedLink?.data?.error) {
          setLinkNotVerified(true);
        } else {
          setLinkNotVerified(false);
        }
      }
    }
    verifyLink();
  }, [email, token]);

  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState);
  };

  const showPasswordConfirmHandler = () => {
    setShowPasswordConfirm((prevState) => !prevState);
  };

  return (
    <main>
      <Head>
        <title>Reset Password - Connective</title>
      </Head>
      <div id="content" role="main" className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Reset your password
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Choose your new password
              </p>
            </div>

            <div className="relative flex flex-col items-center gap-4 mt-4">
              <InputField
                name={"Password"}
                placeholder={"Enter new password"}
                password={!showPassword ? true : false}
                updateValue={setPassword}
                errorText={passwordError}
              ></InputField>
              <div
                className="absolute right-[14px] bottom-[107px] cursor-pointer"
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
              <InputField
                name={"Confirm Password"}
                placeholder={"Confirm new password"}
                password={!showPasswordConfirm ? true : false}
                updateValue={setPasswordConfirm}
                errorText={passwordConfirmError}
              ></InputField>
              <div
                className="absolute right-[14px] bottom-[5px] cursor-pointer"
                onClick={showPasswordConfirmHandler}
              >
                {!showPasswordConfirm && (
                  <Image
                    src="/assets/eye-slash.svg"
                    alt="eye slash"
                    width="24px"
                    height="24px"
                  />
                )}
                {showPasswordConfirm && (
                  <Image
                    src="/assets/eye.svg"
                    alt="eye"
                    width="24px"
                    height="24px"
                  />
                )}
              </div>
            </div>
            <button
              // onClick={submitAccount}
              className="w-[100%] h-[47px] bg-[#061A40] font-semibold font-[Poppins] text-[#F2F4F5] text-[12px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px] mb-2 mt-4"
            >
              Submit
            </button>

            {/* <div className="mt-2">
              <div className="grid gap-y-4">
                <div>
                  {otpError ? (
                    <p className="text-center text-xs text-red-600 mt-2">
                      {otpError}
                    </p>
                  ) : null}
                  <p
                    className="text-center text-xs text-red-600 mt-2"
                    id="email-error"
                    // onClick={handleResendEmail}
                  >
                    Didn't get an email?{" "}
                    <span className=" cursor-pointer">Click to resend</span>
                  </p>
                </div>
                <div className="w-full text-center">
                  <div className="w-7/12 inline-block mt-2">
                    <button
                      type="button"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                      // onClick={toSignInPage}
                    >
                      Enter new password
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
};