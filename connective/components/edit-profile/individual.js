import InputField from "../../components/input-field";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FileUpload from "../../components/file-upload";
import Util from "../../util";
import Select from "react-select";

export default function EditProfile({ user }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [pfp, setPfp] = useState("");
  const [src, setSrc] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pfpChanged, setPfpChanged] = useState(false);
  useEffect(() => {
    setLoaded(false);
    getProfile();
  }, []);

  const getProfile = async () => {
    await axios.get("/api/profiles/individual").then((res) => {
      if (typeof res.data != "undefined") {
        console.log(res.data);
        setSrc(res.data.profile_picture);
        setName(res.data.name);
        setDescription(res.data.bio);
        setLocation(res.data.location);
        setStatus(res.data.status);
        setLoaded(true);
      }
    });
  };

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

  const router = useRouter();

  useEffect(() => {
    if (pfp == "" || typeof pfp == "undefined") return;
    setPfpChanged(true);
    setSrc(URL.createObjectURL(pfp));
  }, [pfp]);

  const submit = async () => {
    if (processing) return;
    setProcessing(true);

    if (name == "") {
      setNameError("You must enter a name.");
      return;
    }

    setNameError("");

    let hasPfp = false;
    if (pfp != "" && typeof pfp != "undefined") {
      hasPfp = true;
    }

    let uploadUrl;
    if (hasPfp) {
      uploadUrl = await Util.uploadFile(user.id + "-pfp", pfp);
      // setSrc("");
      // setPfp("");
    }

    await axios
      .put("/api/profiles/individual", {
        pfp: hasPfp ? uploadUrl : "",
        pfpChanged,
        name,
        bio: description,
        location,
        status,
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

        <div className="flex flex-col gap-5 mt-0">
          <InputField
            name={"Name*"}
            placeholder={"Enter your name"}
            updateValue={setName}
            errorText={nameError}
            value={name}
          />
          <InputField
            name={"Bio"}
            placeholder={"Enter your bio"}
            updateValue={setDescription}
            textarea={true}
            value={description}
          ></InputField>
          <div>
            <p className="text-sm mb-2">Profile picture</p>
            <FileUpload
              text="Upload profile picture"
              file={pfp}
              setFile={setPfp}
              id={"Individual pfp upload"}
              src={src}
              profilePicture={true}
              user={name}
            ></FileUpload>
          </div>
          <InputField
            name={"Location"}
            placeholder={"Enter your location"}
            updateValue={setLocation}
            value={location}
          ></InputField>
          <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] 1bp:text-[16.5px]">
            Status
          </p>
          <Select
            className="w-full text-[12px] font-[Poppins]"
            onChange={(e) => {
              setStatus(e.value);
            }}
            options={statusOptions}
            placeholder="Choose your Status"
            value={{ value: status, label: status }}
          ></Select>
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
