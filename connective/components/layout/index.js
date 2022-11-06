import Sidebar from "../sidebar";


const Layout = ({ title, children }) => {
  

  return (
    <main className="flex flex-row min-h-screen min-w-screen font-[Montserrat]">
      <Sidebar></Sidebar>
      <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-[#FCFCFC]">
        <p className="font-bold text-[24px] leading-[29px] text-[#0D1011] mt-[65px] ml-[64px] mb-[40px]">
          {title}
        </p>
        {children}
      </div>
    </main>
  );
};

export default Layout;
