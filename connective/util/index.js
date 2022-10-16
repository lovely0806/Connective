import axios from "axios"
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
            console.log(res.data)
            if(res.data != "") type = "Business"
        })
    await axios.get(`/api/profiles/individual/${id}`)
        .then(res => {
            console.log(res.data)
            if(res.data != "") type = "Individual"
        })
    return type
}

export default Util