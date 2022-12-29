import Layout from "components/layout";
import { useEffect, useState } from "react";
import axios from "axios";

const RequestList = () => {
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    let { data } = await axios.get("/api/lists/requests-list");
    setRequests(data);
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <Layout title="Requests List">
      <h1 className="font-[Montserrat] font-bold text-xl text-[#0D1011] ml-[64px] mt-10 mb-4">
        Requests submitted by buyers
      </h1>

      <table className="w-auto mx-20 ml-[64px] bg-white shadow-md rounded-lg">
        <tr>
          <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px] pt-[24px] px-[24px]">
            Buyer or Individual Name
          </th>
          <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px] pt-[24px] px-[24px]">
            Date
          </th>
          <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px] pt-[24px] px-[24px]">
            List Topic
          </th>
          <th className="uppercase font-bold text-[14px] text-black/50 mb-[16px] pt-[24px] px-[24px]">
            List Description
          </th>
        </tr>

        {requests.map((item, index) => {
          return (
            <tr className="px-[24px] border-b-[1px] border-b-[#9F9F9F]/[.10]">
              <td className="px-[24px]">{item.username}</td>
              <td className="px-[24px]">
                {new Date(item.timestamp).toDateString()}
              </td>
              <td className="px-[24px]">{item.topic}</td>
              <td className="px-[24px]">{item.description}</td>
            </tr>
          );
        })}
      </table>
    </Layout>
  );
};

export default RequestList;
