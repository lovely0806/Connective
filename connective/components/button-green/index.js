const ButtonGreen = ({text, onClick, className}) => {
    return (
        <div onClick={onClick} className={`ml-auto cursor-pointer mr-10 font-bold bg-[#67C66F] h-fit text-white flex flex-row gap-5 px-10 py-2 w-fit rounded-lg transition-all hover:bg-[#67C66F]/70 ${className}`}>
            <p className="mx-auto">
                {text}
            </p>
        </div>
    )
}

export default ButtonGreen