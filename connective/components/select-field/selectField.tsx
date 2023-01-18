import React from "react";
import Select from "react-select"

interface SelectFieldProps {
    options: {value: string, label: string}[],
    placeholder: string,
    title: string,
    onChange: any,
    errorText: string
} 

export const SelectField = ({options, placeholder, title, onChange, errorText}: SelectFieldProps) => {
    return (
        <div className="w-full">
            <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-1 1bp:text-[16.5px]">
                {title}
            </p>
            <Select
                className="w-full text-[12px] font-[Poppins]"
                onChange={onChange}
                options={options}
                placeholder={placeholder}
            ></Select>
            <p className="text-red-500 font-bold text-[12px]">
                {errorText}
            </p>
        </div>
    )
}