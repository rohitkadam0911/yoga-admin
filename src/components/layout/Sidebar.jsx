import {
    LayoutDashboard,
    Users,
    UserRoundCheck,
    BookOpen,
    CalendarDays,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    School
} from "lucide-react";
import api from "../../services/api"

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

        const handleLogout = async () => {

        try {

            const response = await api.post(
                "/admin/logout"
            );


            if (response.data.success) {

                navigate("/login", {
                    replace: true
                });

            }

        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

            navigate("/login", {
                replace: true
            });

        }

    };

    const items = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin"
        },
        {
            label: "Users",
            icon: Users,
            path: "/admin/users"
        },
        {
            label: "Instructors",
            icon: UserRoundCheck,
            path: "/admin/instructors"
        },
        {
            label: "Classes",
            icon: BookOpen,
            path: "/admin/classes"
        },
        {
            label: "Class-session",
            icon: School,
            path: "/admin/class-sessions"
        },
        {
            label: "Bookings",
            icon: CalendarDays,
            path: "/admin/bookings"
        },
        {
            label: "Payments",
            icon: CreditCard,
            path: "/admin/payments"
        },
        {
            label: "Blogs",
            icon: FileText,
            path: "/admin/blogs"
        }
    ];

    return (
        <aside className="w-60 shrink-0 max-h-screen overflow-y-auto">

            <div className="
                bg-white
                rounded-3xl
                border
                border-slate-200
                shadow-sm
                p-4
            ">

                {/* Section */}
                <p className="
                    px-3
                    mb-3
                    text-[11px]
                    font-bold
                    tracking-widest
                    text-slate-400
                ">
                    MAIN MENU
                </p>


                {/* Menu */}
                <nav className="space-y-1">

                    {items.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/admin"}
                                className={({ isActive }) => `
                                    flex
                                    items-center
                                    gap-3
                                    px-3
                                    py-2
                                    rounded-xl
                                    text-sm
                                    font-medium
                                    transition-all
                                    ${
                                        isActive
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }
                                `}
                            >

                                <Icon size={19} />

                                {item.label}

                            </NavLink>
                        );
                    })}

                </nav>


                {/* Bottom */}
                <div className="mt-2 pt-5 border-t border-slate-100 space-y-1">

                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => `
                            flex
                            items-center
                            gap-3
                            px-3
                            py-3
                            rounded-xl
                            text-sm
                            font-medium
                            transition-all
                            ${
                                isActive
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "text-slate-600 hover:bg-slate-100"
                            }
                        `}
                    >
                        <Settings size={19} />
                        Settings
                    </NavLink>

                    <button
        onClick={handleLogout}
        type="button"
        className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-3
            rounded-xl
            text-sm
            font-medium
            text-red-600
            hover:bg-slate-100
            transition-all
        "
    >
        <LogOut
            size={19}
            className="text-red-600"
        />

        Logout
    </button>

                </div>

            </div>

        </aside>
    );
};

export default Sidebar;