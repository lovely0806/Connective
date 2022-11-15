import Sidebar from "../sidebar";

const Layout = ({ title, children }) => {
  return (
    <main className="flex flex-row min-h-screen min-w-screen font-[Montserrat]">
      <Sidebar />
      <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-[#F5F5F5] relative">
        <p className="font-bold text-3xl leading-[29px] text-[#0D1011] mt-[65px] ml-[64px]">
          {title}
        </p>
        {children}
      </div>
    </main>
  );
};

export default Layout;
