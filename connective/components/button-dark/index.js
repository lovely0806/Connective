const ButtonDark = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`font-[Poppins] mr-10 bg-[#0F172A] h-[42px] text-white text-[12px] flex flex-row gap-5 px-10 py-2 border-2 border-black/50 rounded-lg transition-all font-semibold hover:bg-[#1f2b45] ${className} flex items-center justify-center`}
    >
      <p className="mx-auto">{text}</p>
    </button>
  );
};

export default ButtonDark;
