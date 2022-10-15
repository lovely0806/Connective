const InputField = ({name, placeholder, password}) => {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-[Montserrat]">{name}</p>
            <input className="outline-none w-full px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300" type={password ? "password" : ""} placeholder={placeholder}></input>
        </div>
    )
}

export default InputField