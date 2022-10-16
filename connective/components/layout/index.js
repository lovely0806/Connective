import Sidebar from "../sidebar"

const Layout = ({title, children}) => {
    return (
        <main className="flex flex-row min-h-screen min-w-screen text-[Montserrat] bg-[#F5F5F5]">
            <Sidebar></Sidebar>
            <div className="w-screen h-screen overflow-y-scroll flex flex-col">
                <p className="text-4xl font-bold mb-20 mt-10 ml-20">{title}</p>
                {children}
            </div>
        </main>
    )
}

export default Layout