const InputField = ({name, placeholder, password, textarea, updateValue, errorText}) => {
    return (
        <div className="flex flex-col">
            <p className="text-sm font-[Montserrat] mb-2">{name}</p>
            {!textarea ? (
                <input onChange={(e) => {updateValue(e.target.value)}} className="outline-none w-full px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300" type={password ? "password" : ""} placeholder={placeholder}></input>
            ) : (
                <textarea onChange={(e) => {updateValue(e.target.value)}} className="outline-none w-full h-36 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300" type={password ? "password" : ""} placeholder={placeholder}></textarea>
            )}
            <p className="text-red-500 font-bold text-[12px]">{errorText}</p>
        </div>
    )
}

export default InputField