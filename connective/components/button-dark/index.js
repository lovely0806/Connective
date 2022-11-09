const ButtonDark = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`font-[Poppins] h-[42px] rounded-[8px] flex flex-row gap-5 py-2 transition-all font-semibold ${className} flex items-center justify-center`}
    >
      <p className="mx-auto">{text}</p>
    </button>
  );
};

export default ButtonDark;
