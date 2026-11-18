import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {

    return (
        <div className="h-screen overflow-hidden bg-slate-50">

            {/* Fixed Header */}
            <Header />

            {/* Body */}
            <div className="
                h-[calc(100vh-80px)]
                flex
                gap-6
                px-6
                py-6
                overflow-hidden
            ">

                {/* Sidebar */}
                <div className="shrink-0">
                    <Sidebar />
                </div>


                {/* ONLY CONTENT SCROLLS */}
                <main className="
                    flex-1
                    min-w-0
                    overflow-y-auto
                    pr-2
                ">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default AdminLayout;