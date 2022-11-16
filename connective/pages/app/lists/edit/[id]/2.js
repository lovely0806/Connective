import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Util from "util/index";
import Layout from "components/layout";
import ButtonDark from "components/button-dark";
import { useRouter } from "next/router";
import InputField from "components/input-field";
import FileUpload from "components/file-upload";
import { v4 as uuidv4 } from "uuid";

export default function NewList({ user }) {
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [file, setFile] = useState();
  const [cover, setCover] = useState();
  const [fileError, setFileError] = useState("");

  const [fileSrc, setFileSrc] = useState("");
  const [coverSrc, setCoverSrc] = useState("");
  const [fileChanged, setFileChanged] = useState(false);
  const [coverChanged, setCoverChanged] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setFileSrc(localStorage.getItem("previewUrl"));
    setCoverSrc(localStorage.getItem("coverUrl"));
    setPrice(localStorage.getItem("newListPrice"));
  }, []);

  useEffect(() => {
    if (file == "" || typeof file == "undefined") return;
    setFileChanged(true);
    setFileSrc(URL.createObjectURL(file));
  }, [file]);

  useEffect(() => {
    if (cover == "" || typeof cover == "undefined") return;
    setCoverChanged(true);
    setCoverSrc(URL.createObjectURL(cover));
  }, [cover]);

  const submit = async () => {
    setPriceError("");
    if (file == "undefined") {
      setFileError("Please upload a screenshot of a few rows of your list.");
      return;
    }

    setFileError("");

    let uploadUrl = fileSrc,
      coverUrl = coverSrc;
    if (coverChanged && cover) {
      if (cover != null) {
        coverUrl = await Util.uploadFile("cover_" + uuidv4(), cover, true);
      }
    }
    if (fileChanged) {
      if (file != null) {
        uploadUrl = await Util.uploadFile("preview_" + uuidv4(), file, true);
      }
    }

    localStorage.setItem("previewUrl", uploadUrl);
    localStorage.setItem("fileChanged", fileChanged);
    localStorage.setItem("coverUrl", coverUrl);
    localStorage.setItem("coverChanged", coverChanged);
    localStorage.setItem("newListPrice", price);
    router.push(`/app/lists/edit/${id}/3`);
  };

  return (
    <Layout user={user} title="Lists">
      <div className="bg-white rounded-xl shadow-lg mx-[20vw] p-10">
        <p className="text-center font-bold text-xl mb-5">Edit the list</p>
        <p className="text-center mb-10">Step 2 of 3</p>
        <p className="font-bold mb-10 text-xl">Price and preview:</p>
        <InputField
          name="Price"
          placeholder="Enter a price for this list"
          price={true}
          errorText={priceError}
          value={price}
          disabled
        ></InputField>

        <p className="text-sm mb-2 mt-10">Upload a cover image (optional)</p>
        <FileUpload
          text="Upload cover image"
          file={cover}
          setFile={setCover}
          id="cover upload"
          accept=".jpg,.jpeg,.svg,.png,.JPG,.JPEG,.PNG,.SVG"
          src={coverSrc}
        ></FileUpload>

        <p className="text-sm mb-2 mt-10">Upload your CSV preview image</p>
        <FileUpload
          text="Upload Image"
          file={file}
          setFile={setFile}
          id="preview upload"
          accept=".jpg,.jpeg,.svg,.png,.JPG,.JPEG,.PNG,.SVG"
          src={fileSrc}
        ></FileUpload>
        <p className="text-red-500 font-bold text-[12px]">{fileError}</p>
        <ButtonDark
          text="Next"
          className="mr-0 mt-10"
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
