import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Layout from "../../../../components/layout";
import Util from "../../../../util";
import { useRouter } from "next/router";
import ButtonDark from "../../../../components/button-dark";

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [accountVerified, setAccountVerified] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const getData = async () => {
    let { data } = await axios.get(`/api/lists/${id}`);
    setData(data);

    //Increment list viewed for user
    let type = await Util.accountType(user.id);
    if (type == "Business") {
      await axios.post("/api/profiles/viewList", {
        id: user.id,
        type: "business",
      });
    } else {
      await axios.post("/api/profiles/viewList", {
        id: user.id,
        type: "individual",
      });
    }

    let verified = (
      await axios.get(`/api/stripe/UserValidated?id=${data.creator}`)
    ).data.verified;
    setAccountVerified(verified);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout title="">
      <div className="flex flex-col mb-20">
        <div className="mx-20 bg-white shadow-lg rounded-xl p-10 mb-10">
          <div className="flex flex-row h-fit gap-5 mb-10">
            <img src="/assets/listdetails.svg"></img>
            <p className="font-bold text-xl my-auto">List Details</p>
          </div>

          <div className="flex flex-row justify-between gap-20">
            <div>
              <p className="text-lg font-bold mb-2">List Name</p>
              <p className="text-[#8A8888] mb-7">
                {!loading ? data?.title : "..."}
              </p>
              <p className="text-lg font-bold mb-2">Description</p>
              <p className="text-[#8A8888] mb-7">
                {!loading ? data?.description : "..."}
              </p>

              <div className="flex flex-row mb-2 gap-3">
                <img src="/assets/question.svg"></img>
                <p className="text-lg font-bold">
                  How did the seller obtain this list?
                </p>
              </div>

              <p className="text-[#8A8888] mb-7">
                {!loading ? data?.list_obtained : "..."}
              </p>
            </div>
            <div className="w-[30rem]">
              <p className="text-lg font-bold mb-2">Location</p>
              <div className="flex flex-row mb-7 gap-3">
                <img
                  className="h-5 my-auto"
                  src="/assets/location-pin.png"
                ></img>
                <p className="text-[#8A8888]">
                  {!loading ? data?.location : "..."}
                </p>
              </div>
              <p className="text-lg font-bold mb-2">Listed By</p>
              <div className="flex flex-row gap-3">
                <img
                  className="h-8 w-8 rounded-full object-fit"
                  src={
                    (typeof data.logo == "undefined" || data.logo == "") &&
                    (typeof data.profile_picture == "undefined" ||
                      data.profile_picture == "")
                      ? `https://avatars.dicebear.com/api/micah/${data.creator}.svg`
                      : typeof data.logo == "undefined"
                      ? data.profile_picture
                      : data.logo
                  }
                />
                <p className="text-[#8A8888] mb-7 my-auto">
                  {!loading
                    ? typeof data.name == "undefined"
                      ? data.company_name
                      : data.name
                    : "..."}
                </p>
              </div>
              <p className="text-lg font-bold mb-2">List Price</p>
              <p className="text-[#8A8888] mb-7">
                ${!loading ? data?.price.toFixed(2) : "..."}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-20 bg-white shadow-lg rounded-xl p-10 mb-10">
          <div className="flex flex-row h-fit gap-5 mb-10">
            <img src="/assets/listdetails.svg"></img>
            <p className="font-bold text-xl my-auto">List Preview</p>
          </div>

          <img src={data.preview_url} />
        </div>

        <div className="mx-20 bg-white shadow-lg rounded-xl p-10 mb-5">
          <div className="flex flex-row gap-5 mb-10">
            <img src="/assets/fieldsdescription.svg"></img>
            <p className="font-bold text-xl my-auto">Fields Description</p>
          </div>
          <div className="grid grid-cols-2 text-lg font-medium text-black/50 border-b border-black/20">
            <p>Field</p>
            <p>Description</p>
          </div>
          {data?.fields?.fieldResults.map((item, index) => {
            return (
              <div className="grid grid-cols-2 border-b border-black/20 py-5 text-sm">
                <p>{item.name}</p>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>
        {accountVerified && !data.purchased && (
          <ButtonDark
            text="Buy Now"
            className="w-auto mx-20 mt-0 bg-[#061A40]"
            onClick={() => {
              router.push({ pathname: `/app/checkout/${id}` });
            }}
          ></ButtonDark>
        )}
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
