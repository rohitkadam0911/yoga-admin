import { useEffect, useMemo, useState } from "react";

import {
    Search,
    Eye,
    UserCheck,
    UserX,
    X,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal
} from "lucide-react";

import {
    getAllUsers,
    updateUserStatus
} from "../../services/adminService";


const Users = () => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");

    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState(null);

    const [updatingUserId, setUpdatingUserId] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 10;


    const fetchUsers = async () => {

        try {

            setLoading(true);

            const response = await getAllUsers();

            if (response.success) {
                setUsers(response.data);
            }

        } catch (error) {

            console.error("Users Error:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchUsers();
    }, []);


    const filteredUsers = useMemo(() => {

        return users.filter((user) => {

            // Search
            const matchesSearch =
                user.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                user.email
                    ?.toLowerCase()
                    .includes(search.toLowerCase());


            // Status
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && user.status === true) ||
                (statusFilter === "inactive" && user.status === false);


            // Verification
            const matchesVerification =
                verificationFilter === "all" ||
                (verificationFilter === "verified" && user.isVerified === true) ||
                (verificationFilter === "unverified" && user.isVerified === false);


            return (
                matchesSearch &&
                matchesStatus &&
                matchesVerification
            );

        });

    }, [
        users,
        search,
        statusFilter,
        verificationFilter
    ]);

    const totalPages = Math.ceil(
        filteredUsers.length / usersPerPage
    );


    const startIndex =
        (currentPage - 1) * usersPerPage;


    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + usersPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        statusFilter,
        verificationFilter
    ]);

    const handleStatusChange = async (user) => {

        const action = user.status
            ? "deactivate"
            : "activate";


        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${user.name}?`
        );


        if (!confirmed) {
            return;
        }


        try {

            setUpdatingUserId(user._id);


            const response = await updateUserStatus(
                user._id
            );


            if (response.success) {

                setUsers((previousUsers) =>
                    previousUsers.map((item) =>
                        item._id === user._id
                            ? {
                                ...item,
                                status: response.data.status
                            }
                            : item
                    )
                );


                if (
                    selectedUser &&
                    selectedUser._id === user._id
                ) {

                    setSelectedUser((previous) => ({
                        ...previous,
                        status: response.data.status
                    }));

                }

            }

        } catch (error) {

            console.error(
                "Update User Status Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update user status"
            );

        } finally {

            setUpdatingUserId(null);

        }

    };

    const clearFilters = () => {

        setSearch("");
        setStatusFilter("all");
        setVerificationFilter("all");
        setCurrentPage(1);

    };

    const pageNumbers = [];

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        pageNumbers.push(i);

    }


    return (

        <div className="p-8">

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Users
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Manage YogaConnect users
                    </p>

                </div>


                <div className="px-5 py-3 bg-white rounded-xl border border-slate-200">

                    <span className="text-slate-500">
                        Total Users
                    </span>

                    <span className="ml-3 font-bold text-emerald-600">
                        {users.length}
                    </span>

                </div>

            </div>

            <div className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                p-5
                mb-6
            ">

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-4
                ">

                    {/* Search */}

                    <div className="relative w-full lg:w-[360px]">

                        <Search
                            size={20}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="
                                w-full
                                pl-12
                                pr-4
                                py-3
                                rounded-xl
                                border
                                border-slate-200
                                outline-none
                                focus:border-emerald-500
                                focus:ring-2
                                focus:ring-emerald-100
                            "
                        />

                    </div>


                    {/* Status Filter */}

                    <div className="flex items-center gap-2">

                        <SlidersHorizontal
                            size={18}
                            className="text-slate-400"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="
                                px-4
                                py-3
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-slate-600
                                outline-none
                                focus:border-emerald-500
                            "
                        >

                            <option value="all">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* Verification Filter */}

                    <select
                        value={verificationFilter}
                        onChange={(e) =>
                            setVerificationFilter(
                                e.target.value
                            )
                        }
                        className="
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-slate-600
                            outline-none
                            focus:border-emerald-500
                        "
                    >

                        <option value="all">
                            All Verification
                        </option>

                        <option value="verified">
                            Verified
                        </option>

                        <option value="unverified">
                            Not Verified
                        </option>

                    </select>


                    {/* Clear */}

                    {(search ||
                        statusFilter !== "all" ||
                        verificationFilter !== "all") && (

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="
                                px-4
                                py-3
                                rounded-xl
                                text-sm
                                font-medium
                                text-slate-500
                                hover:bg-slate-100
                            "
                        >
                            Clear Filters
                        </button>

                    )}

                </div>


                {/* Result Count */}

                <div className="mt-4 text-sm text-slate-400">

                    Showing{" "}

                    <span className="font-semibold text-slate-600">
                        {filteredUsers.length === 0
                            ? 0
                            : startIndex + 1}
                    </span>

                    {" "}to{" "}

                    <span className="font-semibold text-slate-600">
                        {Math.min(
                            startIndex + usersPerPage,
                            filteredUsers.length
                        )}
                    </span>

                    {" "}of{" "}

                    <span className="font-semibold text-slate-600">
                        {filteredUsers.length}
                    </span>

                    {" "}users

                </div>

            </div>

            <div className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="
                            bg-slate-50
                            border-b
                            border-slate-200
                        ">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    User
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Email
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Phone
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Verified
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Status
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {/* LOADING */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            text-center
                                            py-10
                                            text-slate-500
                                        "
                                    >
                                        Loading users...
                                    </td>

                                </tr>

                            ) : currentUsers.length === 0 ? (

                                /* EMPTY */

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            text-center
                                            py-12
                                            text-slate-500
                                        "
                                    >

                                        <div className="flex flex-col items-center">

                                            <UsersIcon />

                                            <p className="mt-3">
                                                No users found
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                currentUsers.map((user) => (

                                    <tr
                                        key={user._id}
                                        className="
                                            border-b
                                            border-slate-100
                                            hover:bg-slate-50
                                        "
                                    >

                                        {/* USER */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={
                                                        user.profileImage?.url ||
                                                        "https://dummyimage.com/45"
                                                    }
                                                    alt={user.name}
                                                    className="
                                                        w-11
                                                        h-11
                                                        rounded-full
                                                        object-cover
                                                    "
                                                />

                                                <div>

                                                    <p className="
                                                        font-semibold
                                                        text-slate-800
                                                    ">
                                                        {user.name}
                                                    </p>

                                                    <p className="
                                                        text-xs
                                                        text-slate-400
                                                    ">
                                                        {user._id}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td className="
                                            px-6
                                            py-5
                                            text-slate-600
                                        ">
                                            {user.email}
                                        </td>


                                        {/* PHONE */}

                                        <td className="
                                            px-6
                                            py-5
                                            text-slate-600
                                        ">
                                            {user.phone || "-"}
                                        </td>


                                        {/* VERIFIED */}

                                        <td className="px-6 py-5">

                                            <span
                                                className={
                                                    user.isVerified
                                                        ? `
                                                            px-3 py-1
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            bg-emerald-100
                                                            text-emerald-700
                                                        `
                                                        : `
                                                            px-3 py-1
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            bg-amber-100
                                                            text-amber-700
                                                        `
                                                }
                                            >

                                                {user.isVerified
                                                    ? "Verified"
                                                    : "Not Verified"}

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-6 py-5">

                                            <span
                                                className={
                                                    user.status
                                                        ? `
                                                            px-3 py-1
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            bg-emerald-100
                                                            text-emerald-700
                                                        `
                                                        : `
                                                            px-3 py-1
                                                            rounded-full
                                                            text-xs
                                                            font-semibold
                                                            bg-red-100
                                                            text-red-700
                                                        `
                                                }
                                            >

                                                {user.status
                                                    ? "Active"
                                                    : "Inactive"}

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td className="px-6 py-5">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                {/* VIEW */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedUser(user)
                                                    }
                                                    title="View user"
                                                    className="
                                                        p-2
                                                        rounded-lg
                                                        text-slate-500
                                                        hover:bg-slate-100
                                                        hover:text-slate-800
                                                        transition
                                                    "
                                                >

                                                    <Eye size={18} />

                                                </button>


                                                {/* STATUS */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusChange(user)
                                                    }
                                                    disabled={
                                                        updatingUserId ===
                                                        user._id
                                                    }
                                                    title={
                                                        user.status
                                                            ? "Deactivate user"
                                                            : "Activate user"
                                                    }
                                                    className={
                                                        user.status
                                                            ? `
                                                                p-2
                                                                rounded-lg
                                                                text-red-500
                                                                hover:bg-red-50
                                                                transition
                                                                disabled:opacity-50
                                                            `
                                                            : `
                                                                p-2
                                                                rounded-lg
                                                                text-emerald-600
                                                                hover:bg-emerald-50
                                                                transition
                                                                disabled:opacity-50
                                                            `
                                                    }
                                                >

                                                    {user.status ? (
                                                        <UserX size={18} />
                                                    ) : (
                                                        <UserCheck size={18} />
                                                    )}

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {totalPages > 1 && (

                    <div className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-4
                        border-t
                        border-slate-100
                    ">

                        {/* Previous */}

                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page - 1
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-slate-200
                                text-sm
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >

                            <ChevronLeft size={17} />

                            Previous

                        </button>


                        {/* Page Numbers */}

                        <div className="flex items-center gap-2">

                            {pageNumbers.map((page) => (

                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={
                                        page === currentPage
                                            ? `
                                                w-9 h-9
                                                rounded-lg
                                                bg-emerald-600
                                                text-white
                                                text-sm
                                                font-semibold
                                            `
                                            : `
                                                w-9 h-9
                                                rounded-lg
                                                text-slate-600
                                                text-sm
                                                hover:bg-slate-100
                                            `
                                    }
                                >
                                    {page}
                                </button>

                            ))}

                        </div>


                        {/* Next */}

                        <button
                            type="button"
                            disabled={
                                currentPage === totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page + 1
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-slate-200
                                text-sm
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >

                            Next

                            <ChevronRight size={17} />

                        </button>

                    </div>

                )}

            </div>

            {selectedUser && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        p-4
                    "
                    onClick={() =>
                        setSelectedUser(null)
                    }
                >

                    <div
                        className="
                            w-full
                            max-w-lg
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            overflow-hidden
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Header */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            px-6
                            py-2
                            border-b
                            border-slate-200
                        ">

                            <h2 className="
                                text-xl
                                font-bold
                                text-slate-900
                            ">
                                User Details
                            </h2>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                                className="
                                    p-2
                                    rounded-lg
                                    text-slate-400
                                    hover:bg-slate-100
                                "
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* Body */}

                        <div className="p-2">

                            <div className="flex flex-col items-center">

                                <img
                                    src={
                                        selectedUser.profileImage?.url ||
                                        "https://via.placeholder.com/100"
                                    }
                                    alt={selectedUser.name}
                                    className="
                                        w-24
                                        h-22
                                        rounded-full
                                        object-cover
                                        border-4
                                        border-emerald-50
                                    "
                                />

                                <h3 className="
                                    mt-4
                                    text-xl
                                    font-bold
                                    text-slate-900
                                ">
                                    {selectedUser.name}
                                </h3>

                                <p className="text-slate-500">
                                    {selectedUser.email}
                                </p>

                            </div>


                            <div className="
                                grid
                                grid-cols-2
                                gap-4
                                mt-7
                            ">

                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                ">

                                    <p className="text-xs text-slate-400">
                                        Phone
                                    </p>

                                    <p className="
                                        mt-1
                                        font-semibold
                                        text-slate-700
                                    ">
                                        {selectedUser.phone || "-"}
                                    </p>

                                </div>


                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                ">

                                    <p className="text-xs text-slate-400">
                                        Role
                                    </p>

                                    <p className="
                                        mt-1
                                        font-semibold
                                        text-slate-700
                                        capitalize
                                    ">
                                        {selectedUser.role}
                                    </p>

                                </div>


                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                ">

                                    <p className="text-xs text-slate-400">
                                        Verification
                                    </p>

                                    <p className={
                                        selectedUser.isVerified
                                            ? "mt-1 font-semibold text-emerald-600"
                                            : "mt-1 font-semibold text-amber-600"
                                    }>
                                        {selectedUser.isVerified
                                            ? "Verified"
                                            : "Not Verified"}
                                    </p>

                                </div>


                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                ">

                                    <p className="text-xs text-slate-400">
                                        Account Status
                                    </p>

                                    <p className={
                                        selectedUser.status
                                            ? "mt-1 font-semibold text-emerald-600"
                                            : "mt-1 font-semibold text-red-600"
                                    }>
                                        {selectedUser.status
                                            ? "Active"
                                            : "Inactive"}
                                    </p>

                                </div>

                            </div>


                            {/* JOINED */}

                            <div className="
                                mt-4
                                p-4
                                rounded-xl
                                bg-slate-50
                            ">

                                <p className="text-xs text-slate-400">
                                    Joined
                                </p>

                                <p className="
                                    mt-1
                                    font-semibold
                                    text-slate-700
                                ">

                                    {selectedUser.createdAt
                                        ? new Date(
                                            selectedUser.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric"
                                            }
                                        )
                                        : "-"
                                    }

                                </p>

                            </div>


                            {/* STATUS */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleStatusChange(
                                        selectedUser
                                    )
                                }
                                disabled={
                                    updatingUserId ===
                                    selectedUser._id
                                }
                                className={
                                    `
                                    w-full
                                    mt-6
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    transition
                                    disabled:opacity-50
                                    ${
                                        selectedUser.status
                                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    }
                                    `
                                }
                            >

                                {updatingUserId ===
                                selectedUser._id

                                    ? "Updating..."

                                    : selectedUser.status
                                        ? "Deactivate User"
                                        : "Activate User"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UsersIcon = () => {
    return (
        <div className="
            w-12
            h-12
            rounded-full
            bg-slate-100
            flex
            items-center
            justify-center
            text-slate-400
        ">
            <Search size={22} />
        </div>
    );
};

export default Users;