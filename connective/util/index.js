import axios from "axios"
import Compress from "compress.js"
const Util = {}

Util.profileConfigured = async (id) => {
    let configured = false
    await axios.get(`/api/profiles/business/${id}`)
    .then(res => {
        if(typeof(res.data) != "undefined" && res.data != "") {
            configured = true
        }
    })
    
    await axios.get(`/api/profiles/individual/${id}`)
    .then(res => {
        if(typeof(res.data) != "undefined" && res.data != "") {
            configured = true
        }
    })
    
    return configured
}

Util.accountType = async (id) => {
    let type = "none"
    await axios.get(`/api/profiles/business/${id}`)
        .then(res => {
            if(res.data != "") type = "Business"
        })
    await axios.get(`/api/profiles/individual/${id}`)
        .then(res => {
            if(res.data != "") type = "Individual"
        })
    return type
}

Util.uploadFile = async (name, file, image=false) => {
    if(image) {
        const compress = new Compress()
        let temp = await compress.compress([file], {
            resize: true,
            rotate: false
        }, false)
        file = Compress.convertBase64ToFile(temp[0].data, temp[0].ext)
    } 
    let {data} = await axios.post(
        "/api/upload-file",
        {
            name: name,
            type: file.type
        }
    )
    .catch((e) => {
        console.log(e)
    })

    await axios.put(data.url, file, {
        headers: {
            "Content-type": file.type,
            "Access-Control-Allow-Origin": "*"
        }
    })

    return data.url.split("?")[0]

}

Util.verifyField = (value, setErrorText, errorTextValue) => {
    if(value == "") {
        setErrorText(errorTextValue)
        return false
    }
    return true
}

export default Util