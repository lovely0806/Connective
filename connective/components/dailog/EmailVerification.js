import React, { useEffect, useState } from "react";
import axios from "axios";

const EmailVerification = ({
  code,
  email,
  otpNotMatchError,
  setOtpNotMatchError,
}) => {
  const [inputValue, setInputValue] = useState(1);
  const [otpError, setOtpError] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const otpInitialValue = {
    0: "",
    1: "",
    2: "",
    3: "",
  };
  const [otp, setOtp] = useState(otpInitialValue);

  const numbersArray = [1, 2, 3, 4];

  useEffect(() => {
    if (otpNotMatchError) {
      setButtonDisabled(false);
    }
  }, [otpNotMatchError]);

  useEffect(() => {
    document.querySelector(`input[id=code_1]`)?.focus();
  }, []);

  const handleOnChangeNumber = (e, index) => {
    setButtonDisabled(false);
    const value = e.target.value;
    let updateOtp = otp;
    updateOtp[index] = value;
    setOtp(updateOtp);
    document.querySelector(`input[id=code_${inputValue + 1}]`)?.focus();
    setInputValue(inputValue + 1);
  };

  const handleResendCode = async () => {
    setOtpError(null);
    setOtpNotMatchError(null);
    setButtonDisabled(true);
    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    const verifiedEmail = await axios({
      method: "post",
      url: "/api/auth/resendCode",
      data: { code: randomOtp, email },
    });
    if (
      verifiedEmail?.data?.error === "You can send another code in 15 minutes"
    ) {
      setOtpNotMatchError(null);
      setButtonDisabled(false);
      setOtpError("You can send another code in 15 minutes");
    } else {
      setOtpError(null);
      setButtonDisabled(false);
    }
    return;
  };

  const handleOnVerify = () => {
    setOtpNotMatchError(null);
    setButtonDisabled(false);
    const isEmpty = Object.values(otp).map((number) => number == "");
    if (isEmpty.includes(true)) {
      setOtpError("Please enter 4 digits code");
    } else {
      setOtpError(null);
      setButtonDisabled(true);
      const updatedOtp = Object.values(otp)
        .map((number) => number)
        .join("");
      code(updatedOtp);
      return;
    }
  };

  return (
    <>
      <div id="content" role="main" className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7" style={{ height: "318px" }}>
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Please check your email
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We've sent a code to {email}
              </p>
            </div>
            <div className="mt-5">
              <div className="grid gap-y-4">
                <div>
                  <div className="">
                    <div className="w-full flex text-center">
                      {numbersArray.map((number, index) => {
                        return (
                          <input
                            key={number}
                            type="text"
                            id={`code_${number}`}
                            name={`code${number}`}
                            className="w-1/5 inline-block mr-4 py-3 px-4 block border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm text-center"
                            required
                            maxLength={1}
                            onChange={(e) => handleOnChangeNumber(e, index)}
                            pattern="\d*"
                          />
                        );
                      })}
                    </div>
                  </div>
                  {otpNotMatchError && !otpError ? (
                    <p className="text-center text-xs text-red-600 mt-2">
                      Incorrect verification code
                    </p>
                  ) : null}
                  {otpError ? (
                    <p className="text-center text-xs text-red-600 mt-2">
                      {otpError}
                    </p>
                  ) : null}

                  <p
                    className="text-center text-xs text-red-600 mt-2"
                    id="email-error"
                    onClick={handleResendCode}
                  >
                    Didn't get a code?{" "}
                    <span className=" cursor-pointer">Click to resend</span>
                  </p>
                </div>

                <div className="w-full text-center">
                  <div className="w-5/12 inline-block mt-2">
                    <button
                      type="button"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                      onClick={handleOnVerify}
                      disabled={buttonDisabled}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
