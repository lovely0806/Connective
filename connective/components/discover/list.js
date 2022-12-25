import Image from "next/image";
import { useRouter } from "next/router";
import Avatar from "components/avatar/index";

const DiscoverList = ({ id, title, description, imgURL, status }) => {
  const router = useRouter();

  let statusStyle;
  if (status) {
    statusStyle = {
      marginTop: description.length > 195 ? "10px" : "30px",
      backgroundColor:
        status === "Looking to give client for commission."
          ? "#4b5e6d"
          : "#c2cfd8",
      textColor:
        status === "Looking to give client for commission." ? "white" : "black",
    };
  }

  return (
    <div className="flex flex-row w-full h-44 shadow-lg bg-white rounded justify-between gap-2">
      <div className="w-60 relative m-3 rounded-sm shrink-0">
        {imgURL ? (
          <Image
            layout="fill"
            objectFit="cover"
            className="rounded"
            src={imgURL}
          />
        ) : (
          <Avatar title={title} />
        )}
      </div>
      <div className="w-full h-36 my-8 overflow-y-clip">
        <p className="text-xl font-bold my-1">{title}</p>
        <p className="text-sm h-full">
          {description.length > 195
            ? description.slice(0, 195) + "..."
            : description}
          {status ? (
            <div
              style={{
                width: "50%",
                height: "30%",
                backgroundColor: statusStyle.backgroundColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: statusStyle.marginTop,
              }}
            >
              <p
                style={{
                  color: statusStyle.textColor,
                }}
              >{`Status: ${status}`}</p>
            </div>
          ) : null}
        </p>
      </div>
      <div className="w-60 shrink-0 flex flex-col justify-center items-center gap-3 m-5">
        <button
          className="text-sm font-normal bg-[#006494] font-[Poppins]"
          onClick={() => router.push(`/app/profile/${id}`)}
        >
          View Profile
        </button>

        <button
          className="text-sm font-normal bg-[#061A40] font-[Poppins]"
          onClick={() => router.push(`/app/messages?newUser=${id}`)}
        >
          Start a chat
        </button>
      </div>
    </div>
  );
};

export default DiscoverList;
