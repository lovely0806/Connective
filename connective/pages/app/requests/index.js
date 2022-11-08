import { TemporaryCredentials } from "aws-sdk";
import Layout from "components/layout";

const RequestList = () => {
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

        {/* .map() this one bellow */}
        <tr className="px-[24px] border-b-[1px] border-b-[#9F9F9F]/[.10]">
          <td className="px-[24px]">Buyer Name</td>
          <td className="px-[24px]">02/08/2022</td>
          <td className="px-[24px]">Lorem Ipsum</td>
          <td className="px-[24px]">Lorem Ipsum</td>
        </tr>

        {/* Examples (to delete...) */}
        <tr className="border-b-[1px] border-b-[#9F9F9F]/[.10]">
          <td className="px-[24px]">Buyer Name</td>
          <td className="px-[24px]">02/08/2022</td>
          <td className="px-[24px]">Lorem Ipsum</td>
          <td className="px-[24px]">Lorem Ipsum</td>
        </tr>

        <tr className="border-b-[1px] border-b-[#9F9F9F]/[.10]">
          <td className="px-[24px]">Buyer Name</td>
          <td className="px-[24px]">02/08/2022</td>
          <td className="px-[24px]">Lorem Ipsum</td>
          <td className="px-[24px]">Lorem Ipsum</td>
        </tr>
      </table>
    </Layout>
  );
};

export default RequestList;
