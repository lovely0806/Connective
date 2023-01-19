import axios from "axios";
import Compress from "compress.js";

const profileConfigured = async (id: any) => {
  let configured = false;
  await axios.get(`/api/profiles/business/${id}`).then((res) => {
    if (typeof res.data != "undefined" && res.data != "") {
      configured = true;
    }
  });

  await axios.get(`/api/profiles/individual/${id}`).then((res) => {
    if (typeof res.data != "undefined" && res.data != "") {
      configured = true;
    }
  });

  return configured;
};

const accountType = async (id: any) => {
  let type = "none";
  await axios
    .get(`/api/profiles/business/${id}`)
    .then((res) => {
      if (res.data != "") type = "Business";
    })
    .catch((e) => console.log(e));
  await axios
    .get(`/api/profiles/individual/${id}`)
    .then((res) => {
      if (res.data != "") type = "Individual";
    })
    .catch((e) => console.log(e));
  return type;
};

const uploadFile = async (name: any, file: { type: any }, image = false) => {
  if (image) {
    const compress = new Compress();
    let temp = await compress.compress(
      [file],
      {
        resize: true,
        rotate: false,
      },
      false
    );
    file = Compress.convertBase64ToFile(temp[0].data, temp[0].ext);
  }
  let response = await axios
    .post("/api/upload-file", {
      name: name,
      type: file.type,
    })
    .catch((e) => {
      console.log(e);
    });

  // @ts-ignore
  await axios.put(response.data.url, file, {
    headers: {
      "Content-type": file.type,
      "Access-Control-Allow-Origin": "*",
    },
  });

  // @ts-ignore
  return response.data.url.split("?")[0];
};

const verifyField = (
  value: string,
  setErrorText: (arg0: any) => void,
  errorTextValue: any
) => {
  if (value == "") {
    setErrorText(errorTextValue);
    return false;
  }
  return true;
};

export default {
  profileConfigured,
  accountType,
  uploadFile,
  verifyField,
};
