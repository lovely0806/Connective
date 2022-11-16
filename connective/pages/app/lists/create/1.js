import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Util from "../../../../util/";
import Layout from "../../../../components/layout";
import ButtonDark from "../../../../components/button-dark";
import FileUpload from "../../../../components/file-upload";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Steps from "components/list-steps";

export default function NewList({ user }) {
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState();
  const [fileError, setFileError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // redirectIfNotVerified()
  }, []);

  const redirectIfNotVerified = async () => {
    let verified = (await axios.get("/api/stripe/UserValidated")).data.verified;
    if (!verified) {
      router.push("/app/dashboard");
    }
  };

  const submit = async () => {
    if (processing) return;
    if (file == null) {
      setFileError("Please add a file");
      return;
    }
    setProcessing(true);
    let uploadUrl = await Util.uploadFile("list_" + uuidv4(), file);
    localStorage.setItem("uploadUrl", uploadUrl); //Store the upload url in s3
    router.push("/app/lists/create/2");
    setProcessing(false);
  };

  return (
    <Layout user={user} title="Create New List">
      <Steps />
      
      <div className="mx-20 ml-[64px] p-10 mt-[60px]">
        <p className="text-center font-bold text-xl mb-5">Upload your CSV</p>

        <div className="relative">
          <div className="mt-[40px] w-[700px] mx-auto">
            <FileUpload
              text="Upload CSV"
              file={file}
              setFile={setFile}
              id="CSV Upload"
              accept=".csv,.xls,.xlsx"
            />
          </div>
          <p className="text-red-500 text-center mt-[4px] font-bold text-[12px]">
            {fileError}
          </p>
        </div>

        <ButtonDark
          text="Next"
          className="mx-auto w-[162px] mt-10 font-[Poppins] bg-[#061A40] text-white"
          onClick={submit}
        ></ButtonDark>
      </div>
    </Layout>
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
