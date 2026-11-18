import {
    Search,
    Bell,
    ChevronDown
} from "lucide-react";

const Header = () => {

    return (
        <header className="
            h-20
            bg-white
            border-b
            border-slate-200
            px-8
            flex
            items-center
            justify-between
            shrink-0
        ">

            {/* Logo */}
            <div className="flex items-center gap-3">

                <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-emerald-600
                    flex
                    items-center
                    justify-center
                ">
                    <span className="text-white font-bold text-lg">
                        Y
                    </span>
                </div>

                <div>
                    <h1 className="font-bold text-slate-900">
                        YogaConnect
                    </h1>

                    <p className="text-[11px] text-slate-400">
                        Administration
                    </p>
                </div>

            </div>


            {/* Navigation */}
            <nav className="
                hidden
                lg:flex
                items-center
                gap-7
                text-sm
                font-medium
                text-slate-500
            ">

                <span className="text-emerald-600">
                    Overview
                </span>

                <span className="hover:text-slate-900 cursor-pointer">
                    Analytics
                </span>

                <span className="hover:text-slate-900 cursor-pointer">
                    Reports
                </span>

            </nav>


            {/* Right */}
            <div className="flex items-center gap-5">

                {/* Search */}
                <div className="relative hidden md:block">

                    <Search
                        size={17}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        type="text"
                        placeholder="Search"
                        className="
                            w-48
                            h-9
                            pl-9
                            pr-3
                            rounded-xl
                            bg-slate-100
                            outline-none
                            text-sm
                            focus:ring-2
                            focus:ring-emerald-100
                        "
                    />

                </div>


                {/* Notification */}
                <button className="
                    relative
                    w-9
                    h-9
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    hover:bg-slate-100
                ">

                    <Bell
                        size={19}
                        className="text-slate-600"
                    />

                    <span className="
                        absolute
                        top-2
                        right-2
                        w-2
                        h-2
                        bg-red-500
                        rounded-full
                    "/>

                </button>


                {/* Admin */}
                <div className="
                    flex
                    items-center
                    gap-2
                    pl-3
                    border-l
                    border-slate-200
                ">

                    <div className="
                        w-9
                        h-9
                        rounded-full
                        bg-emerald-100
                        flex
                        items-center
                        justify-center
                    ">
                        <span className="
                            text-sm
                            font-bold
                            text-emerald-700
                        ">
                            A
                        </span>
                    </div>

                    <div className="hidden sm:block">

                        <p className="
                            text-sm
                            font-semibold
                            text-slate-900
                        ">
                            Admin
                        </p>

                        <p className="
                            text-[11px]
                            text-slate-400
                        ">
                            Administrator
                        </p>

                    </div>

                    <ChevronDown
                        size={15}
                        className="text-slate-400"
                    />

                </div>

            </div>

        </header>
    );
};

export default Header;