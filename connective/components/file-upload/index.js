import Avatar from "components/avatar";
import { useEffect } from "react";

const FileUpload = ({
  text,
  profilePicture = false,
  file,
  setFile,
  id,
  accept = "*",
  src,
  user,
  editProfile = false,
}) => {
  return (
    <>
      <input
        type="file"
        accept={accept}
        id={id}
        hidden
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
        className=""
      />
      <label htmlFor={id} className="">
        <div className="cursor-pointer min-h-[131px] mx-auto flex flex-col bg-transparent p-5 border border-black/40 border-dashed rounded-md transition-all hover:bg-[#D9D9D9]/10 pt-[86px]">
          <div className="flex justify-center">
            {src != "" && !(file == "" || typeof file == "undefined") ? (
              <img
                className="mx-auto mt-auto h-40 w-40 rounded-full object-cover"
                src={src}
              />
            ) : editProfile ? (
              <Avatar
                className="rounded-full"
                width="150px"
                height="150px"
                title={user}
              />
            ) : null}
          </div>

          {!editProfile && (file == "" || typeof file == "undefined") ? (
            <img
              className="relative  w-[44px] h-[35]"
              src="/assets/cloud.svg"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity:'0.6'
              }}
            />
          ) : null}

          <p className="mb-auto text-center text-black/50">
            {console.log(file)}
            {file == "" || typeof file == "undefined" ? text : file.name}
            
          </p>
          
        </div>
        
      </label>
      
    </>
  );
};

export default FileUpload;
