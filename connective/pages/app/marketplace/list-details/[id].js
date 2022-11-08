import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Layout from "../../../../components/layout";
import Util from "../../../../util";
import { useRouter } from "next/router";
import ButtonDark from "../../../../components/button-dark";
import Authors from "components/authors";

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
      <div>
        <h1 className="ml-[64px] font-[Montserrat] font-bold text-[26px] text-[#0D1011] mb-[40px]">
          {!loading ? data?.title : "..."}
        </h1>
      </div>

      <div className="flex flex-row">
        {/* Left side */}
        <div className="flex flex-col mb-20">
          <div className="mx-10 ml-[64px] rounded-xl pt-0 mb-[40px]">
            <div className="flex flex-row justify-between gap-20 pt-[40px]">
              <div>
                <p className="text-lg font-bold mb-2 text-[#0D1011]">About</p>
                <p className="font-[Poppins] text-[#0D1011] mb-7">
                  {!loading ? data?.description : "..."}
                </p>

                <div className="flex flex-row mb-2 gap-3">
                  <p className="text-lg font-bold">
                    How did the seller obtain this list?
                  </p>
                </div>

                <p className="font-[Poppins] text-[#0D1011] mb-7">
                  {!loading ? data?.list_obtained : "..."}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-10 ml-[64px] rounded-xl mb-[40px]">
            <div className="mb-1">
              <p className="font-bold text-xl my-auto">List Preview</p>
            </div>

            <img src={data.preview_url} />
          </div>

          <div className="mx-10 ml-[64px] rounded-lg mb-[40px]">
            <div className="mb-[12px]">
              <p className="font-bold text-xl my-auto">Fields Description</p>
            </div>

            <table className="w-[100%] border-[1px] border-[#0D1011]/[.10] p-[12px] rounded-lg mb-[40px]">
              <tr>
                <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px] rounded-lg">
                  Field
                </th>
                <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px] rounded-lg">
                  Description
                </th>
              </tr>
              {data?.fields?.fieldResults.map((item, index) => {
                return (
                  <tr>
                    <td className="w-[200px] font-[Montserrat] font-bold text-[16px] text-[#0D1011]">
                      {item.name}
                    </td>
                    <td className="text-[#0d101180] font-[Poppins]">
                      {item.description}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>

          {/* ---------Authors--------- */}
          <div className="mx-10 ml-[64px] rounded-xl mb-[40px]">
            <div className="mb-[12px]">
              <p className="font-bold text-xl my-auto">Authors</p>
            </div>

            <div className="border-[1px] border-[#0D1011]/[.10] p-[12px] rounded-lg flex flex-col">
              {/* .map() authors here */}
              <Authors />
            </div>
          </div>
        </div>

        {/* Right side (Details...) */}
        <div className="flex flex-col">
          <div className="w-[380px] h-fit border-[1px] border-[#0D1011]/[.10] p-[20px] rounded-lg mr-[64px] mb-5">
            <p className="text-lg font-bold mb-[16px] text-[#0D1011]">
              Details
            </p>
            <div className="flex flex-row gap-5 items-start mb-4">
              <div className="flex flex-row items-center gap-[12px]">
                <img className="w-5 h-5" src="/assets/location-pin.png" />
                <div className="max-w-[110px] flex flex-col">
                  <p className="text-md font-bold">Location</p>
                  <p className="font-[Poppins] text-[#0D1011] text-[12px]">
                    {!loading ? data?.location : "..."}
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center gap-[12px]">
                <img
                  className="h-[15px] w-[20px]"
                  src="/assets/navbar/dark-lists.svg"
                />
                <div className="flex flex-col">
                  <p className="text-md font-bold">Listed by</p>
                  <p className="font-[Poppins] text-[#0D1011] text-[12px]">
                    {!loading
                      ? typeof data.name == "undefined"
                        ? data.company_name
                        : data.name
                      : "..."}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center mb-[20px]">
              <div className="flex flex-row gap-[12px] items-center">
                <img
                  className="w-[21px] h-[21px]"
                  src="/assets/dashboard/dollar-dark.svg"
                />
                <p className="text-md font-bold">List Price</p>
              </div>
              <p className="font-[Poppins] text-[#0D1011] font-bold text-[24px]">
                ${!loading ? data?.price.toFixed(2) : "..."}
              </p>
            </div>

            <div>
              {accountVerified && !data.purchased && (
                <ButtonDark
                  text="Buy Now"
                  className="w-[100%] bg-[#061A40]"
                  onClick={() => {
                    router.push({ pathname: `/app/checkout/${id}` });
                  }}
                ></ButtonDark>
              )}
            </div>
          </div>

          <div className="w-[380px] h-fit border-[1px] border-[#0D1011]/[.10] p-[20px] rounded-lg mr-[64px]">
            <p className="text-lg font-bold mb-[16px] text-[#0D1011]">
              Reviews
            </p>
            <div className="flex flex-col gap-4">
              {/* Review 1 */}
              <div className="pb-[16px] border-b-[1px] border-b-[#0D1011]/[.10]">
                  <p className="font-[Poppins] font-normal text-sm text-[#0D1011] mb-2">“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.”</p>
                  <div className="text-[#0D1011] font-bold">
                    <div className="flex flex-row gap-2">
                      <img className="rounded-full w-10 h-10 object-cover" src="https://avatars.dicebear.com/api/micah/micah.svg"/>
                    <div className="flex flex-col">
                      <p className="font-[Montserrat] font-bold text-[16px] text-[#0D1011]">
                        John Micheal
                      </p>
                      <p className="font-[Poppins] font-normal text-[12px]">
                      Cheif Marketing Officer
                      </p>
                    </div>
                    </div>
                  </div>
              </div>
              {/* Review 2 */}
              {/* Review 3 */}
              {/* More Reviews ... */}
            </div>
          </div>
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
