import axios from "axios";
import { useState, useEffect } from "react";
import { withIronSession } from "next-iron-session";
import Util from "../../../../util/";
import Layout from "../../../../components/layout";
import ButtonDark from "../../../../components/button-dark";
import { useRouter } from "next/router";
import InputField from "../../../../components/input-field";
import Select from "react-select";
import ConfigurableTable from "../../../../components/lists/configurable-table";
import { categoryOptions } from "../../../../common/selectOptions";
import Steps from "components/list-steps";

export default function NewList({ user }) {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  const [category, setCategory] = useState(0);

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [geo, setGeo] = useState("");
  const [geoError, setGeoError] = useState("");

  const [obtain, setObtain] = useState("");
  const [obtainError, setObtainError] = useState("");

  const [fields, setFields] = useState([]);

  const router = useRouter();

  const submit = async () => {
    setTitleError("");
    setDescriptionError("");
    setGeoError("");
    setObtainError("");

    if (description.length > 500) {
      setDescriptionError("Description must be less than 500 characters.");
      return;
    }

    if (obtain.length > 500) {
      setObtainError("Must be less than 500 characters.");
      return;
    }

    if (
      !Util.verifyField(title, setTitleError, "Please enter a title.") ||
      !Util.verifyField(
        description,
        setDescriptionError,
        "Please enter a description."
      ) ||
      !Util.verifyField(geo, setGeoError, "Please enter a value.") ||
      !Util.verifyField(obtain, setObtainError, "Please enter a value.")
    )
      return;

    localStorage.setItem(
      "newListValues",
      JSON.stringify({
        title,
        description,
        geo,
        obtain,
        category,
        fieldDescription: fields,
      })
    );
    router.push("/app/lists/create/3");
  };

  const backPage = () => {
    router.push("/app/lists/create/1");
  }

  return (
    <Layout user={user} title="Create New List">
          <Steps />
          
      <div className="bg-white w-[637px] rounded-xl shadow-lg mx-auto px-[80px] py-[40px] mt-[65px] mb-[94px]">
        <p className="text-center font-bold text-xl mb-[32px]">
          Create Details
        </p>

        <div className="flex flex-col gap-10">
          <InputField
            name="Title"
            placeholder="Name your list"
            updateValue={setTitle}
            errorText={titleError}
          ></InputField>
          <div>
            <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-3 1bp:text-[16.5px]">
              Category
            </p>
            <Select
              options={categoryOptions}
              defaultValue={categoryOptions[0]}
              onChange={(e) => {
                setCategory(e.value);
              }}
              className="text-[14px]"
            ></Select>
          </div>
          <InputField
            name="Description"
            textarea={true}
            placeholder="Enter a description"
            updateValue={setDescription}
            errorText={descriptionError}
          ></InputField>
          <InputField
            name="Geographical area of resources"
            placeholder="Where are the resources on your list located?"
            updateValue={setGeo}
            errorText={geoError}
          ></InputField>
          <InputField
            name="How did you obtain this list?"
            textarea={true}
            placeholder="Describe how you compiled this list"
            updateValue={setObtain}
            errorText={obtainError}
          ></InputField>
          <ConfigurableTable
            data={fields}
            setData={setFields}
            column1Name="Name"
            column2Name="Description"
            title="Enter your fields:"
          ></ConfigurableTable>
        </div>

        <div className="flex flex-row items-center gap-[24px] mt-[46px]">
          <div className="w-full border-[1px] border-[#061A40] rounded-lg">
            <ButtonDark
              text="Back"
              className="text-[14px] font-[Poppins] bg-white text-[#061A40] "
              onClick={backPage}
            />
          </div>
          <ButtonDark
            text="Next"
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
