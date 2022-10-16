const ButtonDark = ({text, onClick, className}) => {
    return (
        <button onClick={onClick} className={`ml-auto mr-10 bg-[#0F172A] h-fit text-white flex flex-row gap-5 px-10 py-2 w-fit border-2 border-black/50 rounded-lg transition-all hover:bg-[#1f2b45] ${className}`}>{text}</button>
    )
}

export default ButtonDark