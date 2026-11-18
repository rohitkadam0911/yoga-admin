import { useEffect, useState } from "react";

import {
    Search,
    CalendarDays,
    User,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Eye,
    X,
    Mail,
    Phone,
    Clock,
    CreditCard,
    MapPin
} from "lucide-react";

import { getAllBookings } from "../../services/adminService";


const Bookings = () => {

    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    // Selected booking for modal
    const [selectedBooking, setSelectedBooking] = useState(null);

    const itemsPerPage = 10;


    // =========================================
    // FETCH BOOKINGS
    // =========================================

    const fetchBookings = async () => {

        try {

            setLoading(true);

            const response = await getAllBookings();

            if (response.success) {
                setBookings(response.data || []);
            }

        } catch (error) {

            console.error("Bookings Error:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchBookings();
    }, []);


    // =========================================
    // SEARCH
    // =========================================

    const filteredBookings = bookings.filter((booking) => {

        const userName =
            booking.userId?.name?.toLowerCase() || "";

        const userEmail =
            booking.userId?.email?.toLowerCase() || "";

        const className =
            booking.classId?.title?.toLowerCase() || "";

        const searchValue =
            search.toLowerCase();

        return (
            userName.includes(searchValue) ||
            userEmail.includes(searchValue) ||
            className.includes(searchValue)
        );

    });


    // =========================================
    // PAGINATION
    // =========================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredBookings.length / itemsPerPage)
    );


    const startIndex =
        (currentPage - 1) * itemsPerPage;


    const currentBookings =
        filteredBookings.slice(
            startIndex,
            startIndex + itemsPerPage
        );


    // =========================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =========================================

    const handleSearch = (e) => {

        setSearch(e.target.value);
        setCurrentPage(1);

    };


    // =========================================
    // STATUS COLORS
    // =========================================

    const getBookingStatusClass = (status) => {

        switch (status) {

            case "Booked":
                return "bg-emerald-100 text-emerald-700";

            case "Completed":
                return "bg-blue-100 text-blue-700";

            case "Cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-600";

        }

    };


    const getPaymentStatusClass = (status) => {

        switch (status) {

            case "Paid":
                return "bg-emerald-100 text-emerald-700";

            case "Pending":
                return "bg-amber-100 text-amber-700";

            case "Failed":
                return "bg-red-100 text-red-700";

            case "Refunded":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-slate-100 text-slate-600";

        }

    };


    // =========================================
    // DATE FORMAT
    // =========================================

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================
    // TIME FORMAT
    // =========================================

    const formatTime = (time) => {

        if (!time) return "-";

        return time;

    };


    // =========================================
    // VIEW BOOKING
    // =========================================

    const handleViewBooking = (booking) => {

        setSelectedBooking(booking);

    };


    // =========================================
    // CLOSE MODAL
    // =========================================

    const closeModal = () => {

        setSelectedBooking(null);

    };


    return (

        <div className="p-8">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <p className="text-emerald-600 font-medium mb-1">
                        Management
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Bookings
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Manage YogaConnect class bookings
                    </p>

                </div>


                {/* TOTAL BOOKINGS */}

                <div
                    className="
                        flex
                        items-center
                        gap-4
                        px-5
                        py-4
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                    "
                >

                    <div
                        className="
                            w-12
                            h-12
                            rounded-xl
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <CalendarDays
                            size={24}
                            className="text-emerald-600"
                        />

                    </div>


                    <div>

                        <p className="text-sm text-slate-500">
                            Total Bookings
                        </p>

                        <p className="text-2xl font-bold text-slate-900">
                            {bookings.length}
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================
                SEARCH
            ========================================= */}

            <div className="mb-6">

                <div className="relative max-w-md">

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
                        placeholder="Search by user or class..."
                        value={search}
                        onChange={handleSearch}
                        className="
                            w-full
                            pl-12
                            pr-4
                            py-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            outline-none
                            focus:border-emerald-500
                            focus:ring-2
                            focus:ring-emerald-100
                        "
                    />

                </div>

            </div>


            {/* =========================================
                TABLE
            ========================================= */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    overflow-hidden
                "
            >

                <div className="overflow-x-auto">

                    <table className="w-full">

                        {/* TABLE HEADER */}

                        <thead
                            className="
                                bg-slate-50
                                border-b
                                border-slate-200
                            "
                        >

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    User
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Class
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Instructor
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Date
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Booking
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Payment
                                </th>

                                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-500">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            text-center
                                            py-12
                                            text-slate-500
                                        "
                                    >
                                        Loading bookings...
                                    </td>

                                </tr>

                            ) : currentBookings.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            text-center
                                            py-12
                                            text-slate-500
                                        "
                                    >
                                        No bookings found
                                    </td>

                                </tr>

                            ) : (

                                currentBookings.map((booking) => (

                                    <tr
                                        key={booking._id}
                                        className="
                                            border-b
                                            border-slate-100
                                            hover:bg-slate-50
                                            transition
                                        "
                                    >


                                        {/* =====================================
                                            USER
                                        ===================================== */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="
                                                        w-10
                                                        h-10
                                                        rounded-full
                                                        bg-emerald-50
                                                        flex
                                                        items-center
                                                        justify-center
                                                        overflow-hidden
                                                    "
                                                >

                                                    {booking.userId?.profileImage?.url ? (

                                                        <img
                                                            src={
                                                                booking.userId.profileImage.url
                                                            }
                                                            alt={
                                                                booking.userId?.name || "User"
                                                            }
                                                            className="
                                                                w-full
                                                                h-full
                                                                object-cover
                                                            "
                                                        />

                                                    ) : (

                                                        <User
                                                            size={20}
                                                            className="text-emerald-600"
                                                        />

                                                    )}

                                                </div>


                                                <div>

                                                    <p className="font-semibold text-slate-800">
                                                        {booking.userId?.name || "-"}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        {booking.userId?.email || "-"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* =====================================
                                            CLASS
                                        ===================================== */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-2">

                                                <BookOpen
                                                    size={18}
                                                    className="text-emerald-600"
                                                />

                                                <div>

                                                    <p className="font-medium text-slate-800">
                                                        {booking.classId?.title || "-"}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        {booking.classId?.category || "-"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* =====================================
                                            INSTRUCTOR
                                        ===================================== */}

                                        <td className="px-6 py-5 text-slate-600">

                                            {booking.instructorId?.userId?.name || "-"}

                                        </td>


                                        {/* =====================================
                                            DATE
                                        ===================================== */}

                                        <td
                                            className="
                                                px-6
                                                py-5
                                                text-slate-600
                                                whitespace-nowrap
                                            "
                                        >

                                            {formatDate(
                                                booking.createdAt
                                            )}

                                        </td>


                                        {/* =====================================
                                            BOOKING STATUS
                                        ===================================== */}

                                        <td className="px-6 py-5">

                                            <span
                                                className={`
                                                    px-3
                                                    py-1.5
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
                                                    ${getBookingStatusClass(
                                                        booking.bookingStatus
                                                    )}
                                                `}
                                            >

                                                {booking.bookingStatus || "-"}

                                            </span>

                                        </td>


                                        {/* =====================================
                                            PAYMENT STATUS
                                        ===================================== */}

                                        <td className="px-6 py-5">

                                            <span
                                                className={`
                                                    px-3
                                                    py-1.5
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
                                                    ${getPaymentStatusClass(
                                                        booking.paymentStatus
                                                    )}
                                                `}
                                            >

                                                {booking.paymentStatus || "-"}

                                            </span>

                                        </td>


                                        {/* =====================================
                                            ACTION
                                        ===================================== */}

                                        <td className="px-6 py-5 text-center">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewBooking(booking)
                                                }
                                                className="
                                                    w-9
                                                    h-9
                                                    rounded-lg
                                                    bg-slate-100
                                                    hover:bg-emerald-50
                                                    text-slate-500
                                                    hover:text-emerald-600
                                                    flex
                                                    items-center
                                                    justify-center
                                                    mx-auto
                                                    transition
                                                "
                                                title="View booking"
                                            >

                                                <Eye size={18} />

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =========================================
                    PAGINATION
                ========================================= */}

                {!loading && filteredBookings.length > 0 && (

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            px-6
                            py-4
                            border-t
                            border-slate-200
                        "
                    >

                        {/* RESULTS */}

                        <p className="text-sm text-slate-500">

                            Showing{" "}

                            <span className="font-semibold text-slate-700">
                                {startIndex + 1}
                            </span>

                            {" "}to{" "}

                            <span className="font-semibold text-slate-700">
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    filteredBookings.length
                                )}
                            </span>

                            {" "}of{" "}

                            <span className="font-semibold text-slate-700">
                                {filteredBookings.length}
                            </span>

                        </p>


                        {/* PAGINATION */}

                        <div className="flex items-center gap-2">

                            {/* PREVIOUS */}

                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    );
                                }}
                                disabled={currentPage === 1}
                                className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    border
                                    border-slate-200
                                    flex
                                    items-center
                                    justify-center
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    hover:bg-slate-50
                                "
                            >

                                <ChevronLeft size={18} />

                            </button>


                            {/* PAGE */}

                            <span
                                className="
                                    px-3
                                    text-sm
                                    font-medium
                                    text-slate-600
                                "
                            >

                                Page {currentPage} of {totalPages}

                            </span>


                            {/* NEXT */}

                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    );
                                }}
                                disabled={currentPage >= totalPages}
                                className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    border
                                    border-slate-200
                                    flex
                                    items-center
                                    justify-center
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    hover:bg-slate-50
                                "
                            >

                                <ChevronRight size={18} />

                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* =========================================
                VIEW BOOKING MODAL
            ========================================= */}

            {selectedBooking && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/40
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                    onClick={closeModal}
                >

                    <div
                        className="
                            w-full
                            max-w-2xl
                            max-h-[90vh]
                            overflow-y-auto
                            bg-white
                            rounded-2xl
                            shadow-2xl
                        "
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                px-6
                                py-5
                                border-b
                                border-slate-200
                            "
                        >

                            <div>

                                <p className="text-sm text-emerald-600 font-medium">
                                    Booking Details
                                </p>

                                <h2 className="text-xl font-bold text-slate-900">
                                    {selectedBooking.classId?.title || "Booking"}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    bg-slate-100
                                    hover:bg-red-50
                                    hover:text-red-600
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="p-6">

                            {/* USER */}

                            <div className="mb-6">

                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                    User Information
                                </h3>

                                <div
                                    className="
                                        p-4
                                        rounded-xl
                                        bg-slate-50
                                        border
                                        border-slate-200
                                    "
                                >

                                    <div className="flex items-center gap-4">

                                        <div
                                            className="
                                                w-14
                                                h-14
                                                rounded-full
                                                bg-emerald-100
                                                flex
                                                items-center
                                                justify-center
                                                overflow-hidden
                                            "
                                        >

                                            {selectedBooking.userId?.profileImage?.url ? (

                                                <img
                                                    src={
                                                        selectedBooking.userId.profileImage.url
                                                    }
                                                    alt={
                                                        selectedBooking.userId?.name || "User"
                                                    }
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                    "
                                                />

                                            ) : (

                                                <User
                                                    size={25}
                                                    className="text-emerald-600"
                                                />

                                            )}

                                        </div>


                                        <div>

                                            <p className="font-semibold text-lg text-slate-800">
                                                {selectedBooking.userId?.name || "-"}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Mail size={14} />
                                                {selectedBooking.userId?.email || "-"}
                                            </div>

                                            {selectedBooking.userId?.phone && (

                                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                    <Phone size={14} />
                                                    {selectedBooking.userId.phone}
                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* BOOKING DETAILS */}

                            <div className="mb-6">

                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                    Booking Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                                        <div className="flex items-center gap-2 text-slate-500 mb-1">

                                            <BookOpen size={16} />

                                            <span className="text-sm">
                                                Class
                                            </span>

                                        </div>

                                        <p className="font-semibold text-slate-800">
                                            {selectedBooking.classId?.title || "-"}
                                        </p>

                                    </div>


                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                                        <div className="flex items-center gap-2 text-slate-500 mb-1">

                                            <User size={16} />

                                            <span className="text-sm">
                                                Instructor
                                            </span>

                                        </div>

                                        <p className="font-semibold text-slate-800">
                                            {selectedBooking.instructorId?.userId?.name || "-"}
                                        </p>

                                    </div>


                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                                        <div className="flex items-center gap-2 text-slate-500 mb-1">

                                            <CalendarDays size={16} />

                                            <span className="text-sm">
                                                Booking Date
                                            </span>

                                        </div>

                                        <p className="font-semibold text-slate-800">
                                            {formatDate(
                                                selectedBooking.createdAt
                                            )}
                                        </p>

                                    </div>


                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                                        <div className="flex items-center gap-2 text-slate-500 mb-1">

                                            <Clock size={16} />

                                            <span className="text-sm">
                                                Time
                                            </span>

                                        </div>

                                        <p className="font-semibold text-slate-800">
                                            {formatTime(
                                                selectedBooking.time
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* STATUS */}

                            <div>

                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                    Status
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    <span
                                        className={`
                                            px-4
                                            py-2
                                            rounded-full
                                            text-sm
                                            font-semibold
                                            ${getBookingStatusClass(
                                                selectedBooking.bookingStatus
                                            )}
                                        `}
                                    >
                                        Booking:{" "}
                                        {selectedBooking.bookingStatus || "-"}
                                    </span>


                                    <span
                                        className={`
                                            px-4
                                            py-2
                                            rounded-full
                                            text-sm
                                            font-semibold
                                            ${getPaymentStatusClass(
                                                selectedBooking.paymentStatus
                                            )}
                                        `}
                                    >
                                        Payment:{" "}
                                        {selectedBooking.paymentStatus || "-"}
                                    </span>

                                </div>

                            </div>


                            {/* EXTRA INFO */}

                            {selectedBooking._id && (

                                <div className="mt-6 pt-5 border-t border-slate-200">

                                    <p className="text-xs text-slate-400 break-all">
                                        Booking ID: {selectedBooking._id}
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* MODAL FOOTER */}

                        <div
                            className="
                                px-6
                                py-4
                                border-t
                                border-slate-200
                                flex
                                justify-end
                            "
                        >

                            <button
                                type="button"
                                onClick={closeModal}
                                className="
                                    px-5
                                    py-2.5
                                    rounded-xl
                                    bg-emerald-600
                                    text-white
                                    font-medium
                                    hover:bg-emerald-700
                                    transition
                                "
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


export default Bookings;