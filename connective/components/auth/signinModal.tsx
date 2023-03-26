import { Dispatch, useMemo, useState } from 'react'
import InputField from '../../components/input-field'
import { validateEmail } from '../../util/validation/onboarding'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  onClick: (email: string) => Promise<void>
  onClose: () => void
  isShow: boolean
  emailSet: Dispatch<string>
}

const SigninModal = ({ onClick, onClose, emailSet, isShow }: Props) => {
  const [email, setEmail] = useState<string>('')
  const disabled = useMemo(() => {
    return email === '' || !validateEmail(email) ? true : false
  }, [email])

  const handleContinue = async () => {
    emailSet(email)
    await onClick(email)
    onClose()
  }
  return (
    <>
      {isShow ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-[#0b0b0b]/[0.4] backdrop-blur-[8.5px]"
            onClick={onClose}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-3/4 w-[984px] max-w-3xl p-4 mx-auto bg-white rounded-xl overflow-x-hidden">
              <div className="mt-3">
                <div className="cursor-pointer text-center mt-[76px] mb-[100px]">
                  <Link href="https://www.connective-app.xyz" passHref>
                    <a>
                      <Image
                        src="/assets/logo.svg"
                        alt="Connective logo"
                        width="453.83px"
                        height="89.57px"
                      />
                    </a>
                  </Link>
                </div>
                <div className="mt-2 text-center sm:ml-4 sm:text-left">
                  <h1 className="text-[40px] font-bold font-[Poppins] leading-[60px] text-black">
                    Forgot Password?
                  </h1>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                    Please enter the email. We will send you the link<br/>
                    on your email to reset your password.
                  </p>
                  <div className="w-3/4 mx-auto text-left mt-5">
                    <InputField
                      placeholder={'Enter your email'}
                      updateValue={setEmail}
                    />
                  </div>
                  <div className="gap-2 my-10">
                    <button
                      className="w-3/4 mx-auto mt-2 p-2.5 flex-1 text-white bg-purple rounded-full"
                      disabled={disabled}
                      onClick={handleContinue}
                    >
                      Continue
                    </button>
                    <button
                      className="w-3/4 mx-auto mt-4 p-2.5 flex-1 text-purple bg-white border-2 border-solid border-purple rounded-full"
                      disabled={disabled}
                      onClick={handleContinue}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default SigninModal
