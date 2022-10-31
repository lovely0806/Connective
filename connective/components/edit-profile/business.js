import InputField from "../../components/input-field";
import Logo from "../../components/logo";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import OnboardingSidebar from "../../components/onboarding-sidebar";
import ProfileTypeSelector from "../../components/onboarding/profile-type-selector";
import FileUpload from "../../components/file-upload";
import Select from "react-select";
import Util from "../../util";

export default function EditProfile({ user }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [pfp, setPfp] = useState("");
  const [src, setSrc] = useState("");
  const [type, setType] = useState("business");
  const [industry, setIndustry] = useState("");
  const [industryError, setIndustryError] = useState("");
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLoaded(false);
    getProfile();
  }, []);

  const getProfile = async () => {
    await axios.get("/api/profiles/individual").then((res) => {
      if (typeof res.data != "undefined") {
        console.log(res.data);
        setName(res.data.name);
        setDescription(res.data.bio);
        setLocation(res.data.location);
        setLoaded(true);
      }
    });
  };

  //   const industryOptions = [
  //     { value: "Web3", label: "Web3" },
  //     { value: "Software Development", label: "Software Development" },
  //     { value: "Event Planning", label: "Event Planning" },
  //   ];

  //   const sizeOptions = [
  //     { value: "1-10", label: "1-10" },
  //     { value: "10-50", label: "10-50" },
  //     { value: "50-100", label: "50-100" },
  //     { value: "100-200", label: "100-200" },
  //     { value: "200-1000", label: "200-1000" },
  //     { value: "1000+", label: "1000+" },
  //   ];

  const router = useRouter();

  useEffect(() => {
    console.log(pfp);
    if (pfp == "" || typeof pfp == "undefined") return;

    setSrc(URL.createObjectURL(pfp));
  }, [pfp]);

  // async function forwardIfProfileSetup() {
  //     if(await Util.profileConfigured(user.id)) {
  //         console.log("Forwarding")
  //         router.push("/app/profile")
  //     }
  // }

  const submit = async () => {
    if (processing) return;
    setProcessing(true);

    if (name == "") {
      setNameError("You must enter a name.");
      return;
    }

    setNameError("");

    //   let hasPfp = false;
    //   if (pfp != "" && typeof pfp != "undefined") {
    //     hasPfp = true;
    //   }

    //   let uploadUrl;
    //   if (hasPfp) {
    //     uploadUrl = await Util.uploadFile(user.id + "-pfp", pfp);
    //     setSrc("");
    //     setPfp("");
    //   }

    await axios
      .put("/api/profiles/individual", {
        // pfp: hasPfp ? uploadUrl : "",
        pfp: "",
        name,
        bio: description,
        location,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log("success");
          router.push("/app/profile");
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

  return loaded ? (
    <main className="flex flex-row min-h-screen min-w-screen">
      <div className="flex flex-col w-[40vw] mx-auto font-[Montserrat] bg-[#F9F9F9] rounded-xl shadow-md p-5 my-20">
        <div className="flex flex-row gap-10 mb-10">
          <p className="text-3xl font-bold">Edit Profile</p>
        </div>

        <div className="flex flex-col gap-5 mt-10">
          <InputField
            name={"Name*"}
            placeholder={"Enter company name"}
            updateValue={setName}
            errorText={nameError}
          ></InputField>
          <InputField
            name={"Description"}
            placeholder={"Enter company description"}
            updateValue={setDescription}
            textarea={true}
          ></InputField>
          <div>
            <p className="text-sm mb-2">Logo</p>
            <FileUpload
              text="Upload company logo"
              file={pfp}
              setFile={setPfp}
              id={"Company pfp upload"}
            ></FileUpload>
          </div>
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
          <div className="flex flex-row justify-between gap-10">
            <div className="w-full">
              <p className="text-sm mb-2">Industry*</p>
              <Select
                className="w-full"
                onChange={(e) => {
                  setIndustry(e.value);
                }}
                options={industryOptions}
                placeholder="Choose your industry"
              ></Select>
              <p className="text-red-500 font-bold text-[12px]">
                {industryError}
              </p>
            </div>
            <div className="w-full">
              <p className="text-sm mb-2">Size*</p>
              <Select
                className="w-full"
                onChange={(e) => {
                  setSize(e.value);
                }}
                options={sizeOptions}
                placeholder="Choose your company size"
              ></Select>
              <p className="text-red-500 font-bold text-[12px]">{sizeError}</p>
            </div>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={processing}
          className={`w-full  font-bold text-white py-4 mt-20 rounded-md shadow-md transition-all ${
            !processing
              ? "hover:scale-105 hover:shadow-lg bg-[#0F172A]"
              : "bg-[#0F172A]/70"
          }`}
        >
          Save Profile
        </button>
      </div>
    </main>
  ) : (
    <>Loading...</>
  );
}
