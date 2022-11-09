import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Util from "../../../../util/";
import Layout from "../../../../components/layout";
import ButtonDark from "../../../../components/button-dark";
import { useRouter } from "next/router";
import InputField from "../../../../components/input-field";
import FileUpload from "../../../../components/file-upload";
import { v4 as uuidv4 } from "uuid";
import ListCard from "../../../../components/marketplace/ListCard";
import ListMarketplace from "components/marketplace/ListMarketplace";
import Steps from "components/list-steps";

export default function NewList({ user }) {
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState();
  const [category, setCategory] = useState();
  const [description, setDescription] = useState();
  const [geo, setGeo] = useState();
  const [obtain, setObtain] = useState();
  const [fields, setFields] = useState();
  const [uploadUrl, setUploadUrl] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [coverUrl, setCoverUrl] = useState();
  const [processing, setProcessing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let newListvalues = JSON.parse(localStorage.getItem("newListValues"));
    let uploadUrl = localStorage.getItem("uploadUrl");
    let previewUrl = localStorage.getItem("previewUrl");
    let coverUrlStr = localStorage.getItem("coverUrl");
    let newListPrice = localStorage.getItem("newListPrice");

    setPrice(newListPrice);
    setTitle(newListvalues.title);
    setCategory(newListvalues.category);
    setDescription(newListvalues.description);
    setGeo(newListvalues.geo);
    setObtain(newListvalues.obtain);
    setFields(newListvalues.fieldDescription);
    setUploadUrl(uploadUrl);
    setPreviewUrl(previewUrl);
    setCoverUrl(coverUrlStr);
  }, []);

  const submit = async () => {
    if (processing) return;
    setProcessing(true);
    await axios.post("/api/lists", {
      title,
      category,
      description,
      geo,
      obtain,
      uploadUrl,
      previewUrl,
      coverUrl,
      price,
      fields,
    });
    setProcessing(false);
    router.push("/app/marketplace");
  };

  const backPage = () => {
    router.push("/app/lists/create/3");
  };

  return (
    <Layout title="Create New List">
      <Steps />

      <div className="w-[637px] px-[80px] mx-auto mt-[64px] py-10 flex flex-col items-center bg-white/70 mb-[94px] shadow-lg rounded-xl">

        <p className="font-bold mb-[12px] text-xl text-center text-[#0D1011]">
          Preview
        </p>

        <div className="flex flex-col items-center">
          <div className="sm:w-[30vw] 2xl:w-[20vw] mb-[40px]">
            {typeof title != "undefined" && (
              <ListMarketplace
                preview={true}
                user={user}
                item={{
                  cover_url: coverUrl,
                  title,
                  description,
                  price: price,
                }}
              />
            )}
          </div>

          <div className="w-[30vw] flex flex-col items-center">
            <p className="font-bold mb-[12px] text-xl text-center text-[#0D1011]">
              Your List
            </p>
            <img src={previewUrl} className="object-cover w-[217px] h-[120px]" />
          </div>
        </div>

        <div className="w-full flex flex-row items-center gap-[24px] mt-[46px]">
          <div className="w-full border-[1px] border-[#061A40] rounded-lg">
            <ButtonDark
              text="Back"
              className="text-[14px] w-full font-[Poppins] bg-white text-[#061A40] "
              onClick={backPage}
            />
          </div>
          <ButtonDark
            text="Publish"
            className="text-[14px] w-full font-[Poppins] bg-[#061A40] text-white"
            onClick={submit}
          />
        </div>
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
