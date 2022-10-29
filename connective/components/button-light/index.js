const ButtonLight = ({text, onClick, className}) => {
    return (
        <div onClick={onClick} className={`ml-auto cursor-pointer mr-10 font-bold bg-white border border-[#0F172A] h-fit text-black flex flex-row gap-5 px-10 py-2 w-fit rounded-lg transition-all hover:bg-black/5 ${className}`}>
            <p className="mx-auto">
                {text}
            </p>
        </div>
    )
}

export default ButtonLight