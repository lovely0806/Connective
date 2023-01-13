import InputField from "../../components/input-field";
import Logo from "../../components/logo";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import OnBoardingProfile from "../../components/onboarding-createProfile";
import ProfileTypeSelector from "../../components/onboarding/profile-type-selector";
import FileUpload from "../../components/file-upload";
import { SelectField } from "components/select-field/selectField";
import Util from "../../util";
import Link from "next/link";
import logo from "../../public/assets/logo.svg";
import Image from "next/image";
import {industries} from "common/selectOptions"
import Head from 'next/head'

export default function CreateProfile({ user }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [pfp, setPfp] = useState("");
  const [src, setSrc] = useState("");
  const [type, setType] = useState("business");
  const [industry, setIndustry] = useState();
  const [industryError, setIndustryError] = useState("");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [occupations, setOccupations] = useState()
  const [occupation, setOccupation] = useState("")
  const [occupationError, setOccupationError] = useState("");

  // useEffect(() => {
  //     forwardIfProfileSetup()
  // }, [])

  const sizeOptions = [
    { value: "1-10", label: "1-10" },
    { value: "10-50", label: "10-50" },
    { value: "50-100", label: "50-100" },
    { value: "100-200", label: "100-200" },
    { value: "200-1000", label: "200-1000" },
    { value: "1000+", label: "1000+" },
  ];

  const statusOptions = [
    {
      value: "Looking to give client for commission.",
      label: "Looking to give client for commission.",
    },
    {
      value: "Looking to get client for a commission.",
      label: "Looking to get client for a commission.",
    },
  ];

  function getIndustryOptions() {
    return industries.map((industry) => { 
      return {value: industry.id, label: industry.name}
    })
  }

  const router = useRouter();

  useEffect(() => {
    if (pfp == "" || typeof pfp == "undefined") return;

    setSrc(URL.createObjectURL(pfp));
  }, [pfp]);

  useEffect(() => {
    if(industry != null) {
      setOccupations(industries.filter(_industry => _industry.id == industry)[0]
        .occupations.map((occupation) => {
          return {value: occupation.id, label: occupation.name}
        })
      )
    }
  }, [industry])

  // async function forwardIfProfileSetup() {
  //     if(await Util.profileConfigured(user.id)) {
  //         console.log("Forwarding")
  //         router.push("/app/profile")
  //     }
  // }

  const submit = async () => {
    if (type == "business") submitBusiness();
    if (type == "individual") submitIndividual();
  };

  const submitBusiness = async () => {
    if (processing) return;
    setProcessing(true);

    if (name == "") {
      setNameError("You must enter a name.");
      setIndustryError("");
      setSizeError("");
      setDescriptionError("");
      setProcessing(false);
      return;
    }
    if (size == "") {
      setSizeError("You must select your company size.");
      setIndustryError("");
      setNameError("");
      setDescriptionError("");
      setProcessing(false);
      return;
    }
    if (industry == "") {
      setIndustryError("You must select your company size.");
      setSizeError("");
      setNameError("");
      setDescriptionError("");
      setProcessing(false);
      return;
    }
    if (description.length > 500) {
      setDescriptionError("Description must be less than 300 characters");
      setIndustryError("");
      setSizeError("");
      setNameError("");
      setProcessing(false);
      return;
    }
    if (description == "") {
      setDescriptionError("You must enter a description.");
      setIndustryError("");
      setSizeError("");
      setNameError("");
      setProcessing(false);
      return;
    }

    if (status == "") {
      setStatusError("You must select a status.");
      setIndustryError("");
      setSizeError("");
      setNameError("");
      setProcessing(false);
      return;
    }

    setNameError("");
    setSizeError("");
    setIndustryError("");
    setDescriptionError("");
    setIndustryError("");
    setSizeError("");
    setStatusError("");
    setNameError("");

    let hasPfp = false;
    if (pfp != "" && typeof pfp != "undefined") {
      hasPfp = true;
    }

    let uploadUrl;
    if (hasPfp) {
      uploadUrl = await Util.uploadFile(user.id + "-pfp", pfp);
      setSrc("");
      setPfp("");
    }

    await axios
      .post("/api/profiles/business", {
        pfp: hasPfp ? uploadUrl : "",
        name,
        description,
        location,
        url,
        industry,
        size,
        status,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log("success");
          router.push(`/app/profile/${user.id}`);
        }
      })
      .catch((e) => {
        if (
          e.response.status == 403 ||
          e.response.data.error == "Account does not exist"
        )
          setPasswordError("Incorrect email or password");
      });

    setProcessing(false);
  };

  const submitIndividual = async () => {
    if (processing) return;
    setProcessing(true);

    if (name == "") {
      setNameError("You must enter a name.");
      setDescriptionError("");
      setProcessing(false);
      return;
    }

    if (description.length > 500) {
      setDescriptionError("Bio must be less than 300 characters");
      setNameError("");
      setProcessing(false);
      return;
    }
    if (description == "") {
      setDescriptionError("You must enter a bio.");
      setNameError("");
      setProcessing(false);
      return;
    }

    if (status == "") {
      setStatusError("You must select a status.");
      setNameError("");
      setProcessing(false);
      return;
    }

    setNameError("");
    setDescriptionError("");

    let hasPfp = false;
    if (pfp != "" && typeof pfp != "undefined") {
      hasPfp = true;
    }

    let uploadUrl;
    if (hasPfp) {
      uploadUrl = await Util.uploadFile(user.id + "-pfp", pfp);
      setSrc("");
      setPfp("");
    }

    await axios
      .post("/api/profiles/individual", {
        pfp: hasPfp ? uploadUrl : "",
        name,
        bio: description,
        location,
        status,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log("success");
          router.push("/app/marketplace");
        }
      })
      .catch((e) => {
        if (
          e.response.status == 403 ||
          e.response.data.error == "Account does not exist"
        )
          setPasswordError("Incorrect email or password");
      });

    setProcessing(false);
  };

  return (
    <main className="flex flex-row min-h-screen min-w-screen gap-5">
      <Head>
        <title>Create Profile - Conenctive</title>
      </Head>
      <OnBoardingProfile />

      <div className="flex flex-col min-w-[740px] mx-auto font-[Montserrat] rounded-xl my-[40px]">
        <Link href="/">
          <div className="mb-[40px]">
            <Image
              src={logo}
              alt="Connective logo"
              width="205px"
              height="48px"
            />
          </div>
        </Link>

        <div className="mb-[40px]">
          <p className="text-[24px] font-bold leading-[29px] text-[#061A40]">
            Create {type == "business" ? "Company" : "Individual"} Profile
          </p>
        </div>

        <p className="font-[Poppins font-normal text-[16px] leading-[24px] text-[#0D1011] text-center mb-[20px]">
          Choose that best describes you
        </p>

        <ProfileTypeSelector
          type={type}
          setType={setType}
        ></ProfileTypeSelector>

        {type == "business" ? (
          <div className="flex flex-col gap-5 mt-10">
            <InputField
              name={"Name"}
              placeholder={"Enter company name"}
              updateValue={setName}
              errorText={nameError}
            ></InputField>
            <InputField
              name={"Description"}
              placeholder={"Enter company description"}
              updateValue={setDescription}
              errorText={descriptionError}
              textarea={true}
            ></InputField>
            <div className="relative">
              <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-3 1bp:text-[16.5px]">
                Logo
              </p>
              <FileUpload
                text="Upload company logo"
                file={pfp}
                setFile={setPfp}
                id={"Company pfp upload"}
                src={src}
                profilePicture={true}
              ></FileUpload>
            </div>

            <div className="flex flex-row gap-[24px]">
              <InputField
                name={"Website"}
                placeholder={"Enter company website URL"}
                updateValue={setUrl}
              ></InputField>
              <InputField
                name={"Location"}
                placeholder={"Enter where your company is located"}
                updateValue={setLocation}
              ></InputField>
            </div>

            <div className="flex flex-row justify-between gap-[24px]">
              <div className="flex flex-col w-full gap-3">
                <div className="flex flex-row w-full gap-10">
                    <SelectField title="Industry" 
                                 placeholder="Choose your industry"
                                 options={industries.map((industry) => { 
                                  return {value: industry.id, label: industry.name}
                                 })}
                                 onChange={(e) => {
                                  setIndustry(e.value);
                                 }}
                                 errorText={industryError}>
                    </SelectField>
                    <SelectField title="Occupation" 
                                 placeholder="Choose your occupation"
                                 options={occupations}
                                 onChange={(e) => {
                                  setOccupation(e.value);
                                 }}
                                 errorText={industryError}>
                    </SelectField>
                </div>
                <div className="flex flex-row w-full gap-10">
                  <SelectField title="Size" 
                                 placeholder="Choose your company size"
                                 options={sizeOptions}
                                 onChange={(e) => {
                                  setSize(e.value)
                                 }}
                                 errorText={sizeError}>
                  </SelectField>
                  <SelectField title="Status" 
                                 placeholder="Choose your status"
                                 options={statusOptions}
                                 onChange={(e) => {
                                  setStatus(e.value);
                                 }}
                                 errorText={statusError}>
                  </SelectField>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 mt-10">
            <InputField
              name={"Name"}
              placeholder={"Enter your name"}
              updateValue={setName}
              errorText={nameError}
            ></InputField>
            <InputField
              name={"Bio"}
              placeholder={"Enter your bio"}
              updateValue={setDescription}
              errorText={descriptionError}
              textarea={true}
            ></InputField>
            <div className="relative">
              <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-[10px] 1bp:text-[16.5px]">
                Profile picture
              </p>
              <FileUpload
                text="Upload profile picture"
                file={pfp}
                setFile={setPfp}
                id={"Individual pfp upload"}
                src={src}
                profilePicture={true}
              ></FileUpload>
            </div>
            <InputField
              name={"Location"}
              placeholder={"Enter your location"}
              updateValue={setLocation}
            ></InputField>
            <SelectField  title="Status" 
                          placeholder="Choose your status"
                          options={statusOptions}
                          onChange={(e) => {
                            setStatus(e.value);
                          }}
                          errorText={statusError}>
            </SelectField>
          </div>
        )}

        <button
          onClick={submit}
          disabled={processing}
          className={`w-full h-[47px] font-semibold font-[Poppins] text-[12px] leading-[18px] text-[#F2F4F5] mt-10 rounded-md shadow-md transition-all ${
            !processing
              ? "hover:scale-105 hover:shadow-lg bg-[#0F172A]"
              : "bg-[#0F172A]/70"
          }`}
        >
          Create Profile
        </button>
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