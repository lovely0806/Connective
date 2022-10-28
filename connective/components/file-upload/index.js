import {useEffect} from "react"

const FileUpload = ({text, file, setFile, id, accept="*"}) => {
    return (
        <>
            <input type="file" accept={accept} id={id} hidden onChange={(e)=>{setFile(e.target.files[0])}}/>
            <label htmlFor={id}>
                <div className="cursor-pointer w-full flex flex-col bg-[#D9D9D9]/30 p-5 border border-black/40 border-dashed rounded-md transition-all hover:bg-[#D9D9D9]/10">
                    <img className="mx-auto mt-auto" src="/assets/cloud.svg"/>
                    <p className="mb-auto text-center text-black/50">
                        {file == "" || typeof(file) == "undefined" ? (
                            text
                        ) : (
                            file.name
                        )}
                    </p>
                </div>
            </label>
        </>
        
    )
}

export default FileUpload