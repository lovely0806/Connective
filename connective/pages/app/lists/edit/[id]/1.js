import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { withIronSession } from "next-iron-session";
import Select from "react-select";
import Util from "util/index";
import Layout from "components/layout";
import ButtonDark from "components/button-dark";
import InputField from "components/input-field";
import ConfigurableTable from "components/lists/configurable-table";
import { categoryOptions } from "common/selectOptions";

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
  const { id } = router.query;
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let { data } = await axios.get(`/api/lists/${id}`);
    console.log(data);
    setTitle(data.title);
    setFields(data.fields.fieldResults);
    setCategory(data.category);
    setGeo(data.location);
    setDescription(data.description);
    setObtain(data.list_obtained);
    localStorage.setItem("previewUrl", data.preview_url);
    localStorage.setItem("coverUrl", data.cover_url);
    localStorage.setItem("newListPrice", data.price);
  };

  const submit = async () => {
    setTitleError("");
    setDescriptionError("");
    setGeoError("");
    setObtainError("");

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
    router.push(`/app/lists/edit/${id}/2`);
  };

  return (
    <Layout user={user} title="Lists">
      <div className="bg-white rounded-xl shadow-lg mx-[20vw] p-10">
        <p className="text-center font-bold text-xl mb-5">Edit the list</p>
        <p className="text-center mb-10">Step 1 of 3</p>
        <p className="font-bold mb-10 text-xl">List details:</p>
        <div className="flex flex-col gap-10">
          <InputField
            name="Title"
            placeholder="Name your list"
            updateValue={setTitle}
            value={title}
            errorText={titleError}
          ></InputField>
          <div>
            <p className="text-sm font-[Montserrat] mb-2">Category</p>
            <Select
              options={categoryOptions}
              defaultValue={categoryOptions[0]}
              value={categoryOptions[category]}
              onChange={(e) => {
                setCategory(e.value);
              }}
            ></Select>
          </div>
          <InputField
            name="Description"
            textarea={true}
            placeholder="Enter a description"
            updateValue={setDescription}
            value={description}
            errorText={descriptionError}
          ></InputField>
          <InputField
            name="Geographical area of resources"
            placeholder="Where are the resources on your list located?"
            updateValue={setGeo}
            value={geo}
            errorText={geoError}
          ></InputField>
          <InputField
            name="How did you obtain this list?"
            textarea={true}
            placeholder="Describe how you compiled this list"
            updateValue={setObtain}
            value={obtain}
            errorText={obtainError}
          ></InputField>
          <ConfigurableTable
            data={fields}
            setData={setFields}
            column1Name="Field name"
            column2Name="Field description"
            title="Enter your fields:"
          ></ConfigurableTable>
        </div>

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
