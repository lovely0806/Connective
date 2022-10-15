const FileUpload = ({text, file, setFile}) => {
    return (
        <div className="cursor-pointer w-full flex flex-col bg-[#D9D9D9]/30 p-5 border border-black/40 border-dashed rounded-md">
            <img className="mx-auto mt-auto" src="../assets/cloud.svg"/>
            <p className="mb-auto text-center text-black/50">{text}</p>
        </div>
    )
}

export default FileUpload