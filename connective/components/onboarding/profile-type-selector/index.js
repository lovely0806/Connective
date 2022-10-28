import {useState} from "react"

const ProfileTypeSelector = ({type, setType}) => {
    let unselectedClass = "bg-white flex flex-row gap-5 px-10 py-2 w-fit border-2 border-black rounded-lg"
    let selectedClass = "bg-[#0F172A] text-white flex flex-row gap-5 px-10 py-2 w-fit border-2 border-black/50 rounded-lg"

    return (
        <div className="flex flex-row gap-5 mx-auto">
            <button onClick={()=>{setType("business")}} className={type == "business" ? selectedClass : unselectedClass}>
                <p>I am a business</p>
            </button>

            <button onClick={()=>{setType("individual")}} className={type == "individual" ? selectedClass : unselectedClass}>
                <p>I am an individual</p>
            </button>
        </div>
    )
}

export default ProfileTypeSelector