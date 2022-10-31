import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ButtonDark from "../../button-dark";
import ListCard from "../../marketplace/ListCard";

export default function IndividualProfile({ user }) {
  const router = useRouter();

  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    getProfile();
  }, []);

  useEffect(() => {
    if (typeof window != "undefined" && typeof user == "undefined") {
      router.push("/auth/signin");
    }
  }, [user]);

  const getProfile = async () => {
    await axios.get("/api/profiles/individual").then((res) => {
      if (typeof res.data != "undefined") {
        setData(res.data);
        console.log(res.data);
        setLoaded(true);
      }
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      {loaded ? (
        <>
          <img
            className="h-[18vh] w-full object-cover relative shadow-md"
            src="/assets/banners/waves-min.jpeg"
          ></img>
          {data.profile_picture == "" ? (
            <img
              className="rounded-full w-32 h-32 -mt-16 z-10 ml-16 backdrop-blur-sm bg-white/20 shadow-md"
              src={`https://avatars.dicebear.com/api/micah/${user.id}.svg`}
            ></img>
          ) : (
            <img
              className="rounded-full w-32 h-32 -mt-16 z-10 ml-16 backdrop-blur-sm bg-white/20 shadow-md"
              src={data.profile_picture}
            ></img>
          )}
          <div className="mt-10 ml-16 text-black">
            <div className="flex flex-row">
              <p className="font-bold text-3xl 2xl:text-4xl mb-5">
                {data?.name}
              </p>
              <ButtonDark
                text="Edit Profile"
                className="hover:scale-105 hover:shadow-lg"
                onClick={() => router.push("/app/profile/edit-profile")}
              ></ButtonDark>
            </div>
            <div className="flex flex-row gap-10 text-lg 2xl:text-xl mr-16 pb-5 border-b border-black/20">
              <div className="flex flex-row gap-2">
                <img className="h-6 w-6" src="/assets/location-pin.png" />
                <p>{data?.location}</p>
              </div>
            </div>
            <p className="font-bold text-xl mt-20 mb-5">Bio:</p>
            <div className="rounded-xl bg-white shadow w-[40vw] p-5">
              <p>{data?.bio}</p>
            </div>
            <p className="font-bold text-xl mt-20 mb-5">Lists for sale:</p>
            {typeof data.lists != "undefined" && data.lists.length > 0 && (
              <div className="grid sm:grid-cols-3 2xl:grid-cols-4 auto-rows-[30vw] gap-10 pb-20">
                {data.lists.map((item, index) => {
                  return <ListCard item={item}></ListCard>;
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        "Loading"
      )}
    </div>
  );
}
