import { useEffect, useState } from "react";

import {
    Search,
    CreditCard,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    CalendarDays,
    IndianRupee,
    Hash,
    Wallet,
    CheckCircle,
    Clock,
    AlertCircle,
    RotateCcw
} from "lucide-react";

import { getAllPayments } from "../../services/adminService";


const Payments = () => {

    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedPayment, setSelectedPayment] = useState(null);

    const itemsPerPage = 10;


    // =========================================
    // FETCH PAYMENTS
    // =========================================

    const fetchPayments = async () => {

        try {

            setLoading(true);

            const response = await getAllPayments();

            if (response.success) {
                setPayments(response.data || []);
            }

        } catch (error) {

            console.error("Payments Error:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchPayments();
    }, []);


    // =========================================
    // SEARCH
    // =========================================

    const filteredPayments = payments.filter((payment) => {

        const userName =
            payment.userId?.name?.toLowerCase() || "";

        const userEmail =
            payment.userId?.email?.toLowerCase() || "";

        const transactionId =
            payment.transactionId?.toLowerCase() || "";

        const razorpayOrderId =
            payment.razorpayOrderId?.toLowerCase() || "";

        const paymentMethod =
            payment.paymentMethod?.toLowerCase() || "";

        const paymentStatus =
            payment.paymentStatus?.toLowerCase() || "";

        const searchValue =
            search.toLowerCase();

        return (
            userName.includes(searchValue) ||
            userEmail.includes(searchValue) ||
            transactionId.includes(searchValue) ||
            razorpayOrderId.includes(searchValue) ||
            paymentMethod.includes(searchValue) ||
            paymentStatus.includes(searchValue)
        );

    });


    // =========================================
    // PAGINATION
    // =========================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredPayments.length / itemsPerPage
        )
    );


    const startIndex =
        (currentPage - 1) * itemsPerPage;


    const currentPayments =
        filteredPayments.slice(
            startIndex,
            startIndex + itemsPerPage
        );


    // =========================================
    // SEARCH HANDLER
    // =========================================

    const handleSearch = (e) => {

        setSearch(e.target.value);
        setCurrentPage(1);

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
    // DATE + TIME
    // =========================================

    const formatDateTime = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================================
    // CURRENCY
    // =========================================

    const formatAmount = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        ).format(amount || 0);

    };


    // =========================================
    // PAYMENT STATUS CLASS
    // =========================================

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
    // PAYMENT STATUS ICON
    // =========================================

    const getPaymentStatusIcon = (status) => {

        switch (status) {

            case "Paid":
                return <CheckCircle size={14} />;

            case "Pending":
                return <Clock size={14} />;

            case "Failed":
                return <AlertCircle size={14} />;

            case "Refunded":
                return <RotateCcw size={14} />;

            default:
                return null;

        }

    };


    // =========================================
    // PAYMENT METHOD CLASS
    // =========================================

    const getPaymentMethodClass = (method) => {

        switch (method) {

            case "UPI":
                return "bg-purple-50 text-purple-700";

            case "Card":
                return "bg-blue-50 text-blue-700";

            case "Net Banking":
                return "bg-indigo-50 text-indigo-700";

            case "Wallet":
                return "bg-orange-50 text-orange-700";

            default:
                return "bg-slate-50 text-slate-600";

        }

    };


    // =========================================
    // VIEW PAYMENT
    // =========================================

    const handleViewPayment = (payment) => {

        setSelectedPayment(payment);

    };


    // =========================================
    // CLOSE MODAL
    // =========================================

    const closeModal = () => {

        setSelectedPayment(null);

    };


    // =========================================
    // SUMMARY
    // =========================================

    const paidPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "Paid"
    );


    const pendingPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "Pending"
    );


    const failedPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "Failed"
    );


    const refundedPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "Refunded"
    );


    const totalRevenue = paidPayments.reduce(
        (total, payment) =>
            total + Number(payment.amount || 0),
        0
    );


    return (

        <div className="p-8">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="
                flex
                items-center
                justify-between
                mb-8
            ">

                <div>

                    <p className="
                        text-emerald-600
                        font-medium
                        mb-1
                    ">
                        Finance Management
                    </p>

                    <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                    ">
                        Payments
                    </h1>

                    <p className="
                        mt-1
                        text-slate-500
                    ">
                        Manage YogaConnect payment transactions
                    </p>

                </div>


                {/* TOTAL REVENUE */}

                <div className="
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                ">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-emerald-50
                        flex
                        items-center
                        justify-center
                    ">

                        <IndianRupee
                            size={24}
                            className="text-emerald-600"
                        />

                    </div>


                    <div>

                        <p className="
                            text-sm
                            text-slate-500
                        ">
                            Total Revenue
                        </p>

                        <p className="
                            text-xl
                            font-bold
                            text-slate-900
                        ">
                            {formatAmount(totalRevenue)}
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================
                SUMMARY CARDS
            ========================================= */}

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
                mb-6
            ">


                {/* PAID */}

                <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-4
                    ">

                        <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                        ">

                            <CheckCircle
                                size={20}
                                className="text-emerald-600"
                            />

                        </div>

                        <span className="
                            text-xs
                            font-semibold
                            text-emerald-600
                        ">
                            PAID
                        </span>

                    </div>


                    <p className="
                        text-2xl
                        font-bold
                        text-slate-900
                    ">
                        {paidPayments.length}
                    </p>

                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                    ">
                        Successful payments
                    </p>

                </div>


                {/* PENDING */}

                <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-4
                    ">

                        <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-amber-50
                            flex
                            items-center
                            justify-center
                        ">

                            <Clock
                                size={20}
                                className="text-amber-600"
                            />

                        </div>

                        <span className="
                            text-xs
                            font-semibold
                            text-amber-600
                        ">
                            PENDING
                        </span>

                    </div>


                    <p className="
                        text-2xl
                        font-bold
                        text-slate-900
                    ">
                        {pendingPayments.length}
                    </p>

                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                    ">
                        Awaiting payment
                    </p>

                </div>


                {/* FAILED */}

                <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-4
                    ">

                        <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-red-50
                            flex
                            items-center
                            justify-center
                        ">

                            <AlertCircle
                                size={20}
                                className="text-red-600"
                            />

                        </div>

                        <span className="
                            text-xs
                            font-semibold
                            text-red-600
                        ">
                            FAILED
                        </span>

                    </div>


                    <p className="
                        text-2xl
                        font-bold
                        text-slate-900
                    ">
                        {failedPayments.length}
                    </p>

                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                    ">
                        Failed transactions
                    </p>

                </div>


                {/* REFUNDED */}

                <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-4
                    ">

                        <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-purple-50
                            flex
                            items-center
                            justify-center
                        ">

                            <RotateCcw
                                size={20}
                                className="text-purple-600"
                            />

                        </div>

                        <span className="
                            text-xs
                            font-semibold
                            text-purple-600
                        ">
                            REFUNDED
                        </span>

                    </div>


                    <p className="
                        text-2xl
                        font-bold
                        text-slate-900
                    ">
                        {refundedPayments.length}
                    </p>

                    <p className="
                        text-sm
                        text-slate-500
                        mt-1
                    ">
                        Refunded payments
                    </p>

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
                        placeholder="Search payments..."
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

            <div className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="w-full">


                        {/* TABLE HEADER */}

                        <thead className="
                            bg-slate-50
                            border-b
                            border-slate-200
                        ">

                            <tr>

                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                ">
                                    User
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                ">
                                    Amount
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                ">
                                    Method
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                ">
                                    Transaction
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                ">
                                    Status
                                </th>


                                <th className="
                                    text-left
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                ">
                                    Date
                                </th>


                                <th className="
                                    text-center
                                    px-6
                                    py-4
                                    text-sm
                                    font-semibold
                                    text-slate-500
                                ">
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
                                        Loading payments...
                                    </td>

                                </tr>

                            ) : currentPayments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="
                                            text-center
                                            py-12
                                            text-slate-500
                                        "
                                    >
                                        No payments found
                                    </td>

                                </tr>

                            ) : (

                                currentPayments.map((payment) => (

                                    <tr
                                        key={payment._id}
                                        className="
                                            border-b
                                            border-slate-100
                                            hover:bg-slate-50
                                            transition
                                        "
                                    >


                                        {/* USER */}

                                        <td className="
                                            px-6
                                            py-5
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-3
                                            ">

                                                <div className="
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    bg-emerald-50
                                                    flex
                                                    items-center
                                                    justify-center
                                                    overflow-hidden
                                                ">

                                                    {payment.userId?.profileImage?.url ? (

                                                        <img
                                                            src={
                                                                payment.userId.profileImage.url
                                                            }
                                                            alt={
                                                                payment.userId?.name || "User"
                                                            }
                                                            className="
                                                                w-full
                                                                h-full
                                                                object-cover
                                                            "
                                                        />

                                                    ) : (

                                                        <User
                                                            size={19}
                                                            className="
                                                                text-emerald-600
                                                            "
                                                        />

                                                    )}

                                                </div>


                                                <div>

                                                    <p className="
                                                        font-semibold
                                                        text-slate-800
                                                    ">
                                                        {payment.userId?.name || "-"}
                                                    </p>

                                                    <p className="
                                                        text-xs
                                                        text-slate-400
                                                    ">
                                                        {payment.userId?.email || "-"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* AMOUNT */}

                                        <td className="
                                            px-6
                                            py-5
                                            whitespace-nowrap
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-1
                                                font-bold
                                                text-slate-800
                                            ">

                                                <IndianRupee
                                                    size={15}
                                                />

                                                {Number(
                                                    payment.amount || 0
                                                ).toLocaleString("en-IN")}

                                            </div>

                                        </td>


                                        {/* PAYMENT METHOD */}

                                        <td className="px-6 py-5">

                                            <span className={`
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-3
                                                py-1.5
                                                rounded-full
                                                text-xs
                                                font-semibold
                                                ${getPaymentMethodClass(
                                                    payment.paymentMethod
                                                )}
                                            `}>

                                                <Wallet size={13} />

                                                {payment.paymentMethod || "-"}

                                            </span>

                                        </td>


                                        {/* TRANSACTION */}

                                        <td className="
                                            px-6
                                            py-5
                                        ">

                                            <p className="
                                                max-w-[180px]
                                                truncate
                                                text-sm
                                                font-medium
                                                text-slate-700
                                            "
                                            title={
                                                payment.transactionId ||
                                                payment.razorpayOrderId ||
                                                ""
                                            }
                                            >

                                                {payment.transactionId ||
                                                    payment.razorpayOrderId ||
                                                    "-"}

                                            </p>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-6 py-5">

                                            <span className={`
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                px-3
                                                py-1.5
                                                rounded-full
                                                text-xs
                                                font-semibold
                                                ${getPaymentStatusClass(
                                                    payment.paymentStatus
                                                )}
                                            `}>

                                                {getPaymentStatusIcon(
                                                    payment.paymentStatus
                                                )}

                                                {payment.paymentStatus || "-"}

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td className="
                                            px-6
                                            py-5
                                            text-slate-600
                                            whitespace-nowrap
                                        ">

                                            {formatDate(
                                                payment.paymentDate ||
                                                payment.createdAt
                                            )}

                                        </td>


                                        {/* ACTION */}

                                        <td className="
                                            px-6
                                            py-5
                                            text-center
                                        ">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewPayment(payment)
                                                }
                                                title="View payment"
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

                {!loading && filteredPayments.length > 0 && (

                    <div className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-4
                        border-t
                        border-slate-200
                    ">


                        {/* RESULTS */}

                        <p className="
                            text-sm
                            text-slate-500
                        ">

                            Showing{" "}

                            <span className="
                                font-semibold
                                text-slate-700
                            ">
                                {startIndex + 1}
                            </span>

                            {" "}to{" "}

                            <span className="
                                font-semibold
                                text-slate-700
                            ">
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    filteredPayments.length
                                )}
                            </span>

                            {" "}of{" "}

                            <span className="
                                font-semibold
                                text-slate-700
                            ">
                                {filteredPayments.length}
                            </span>

                        </p>


                        {/* PAGINATION BUTTONS */}

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">


                            {/* PREVIOUS */}

                            <button
                                type="button"
                                onClick={() => {

                                    setCurrentPage((prev) =>
                                        Math.max(
                                            prev - 1,
                                            1
                                        )
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

                            <span className="
                                px-3
                                text-sm
                                font-medium
                                text-slate-600
                            ">

                                Page {currentPage} of {totalPages}

                            </span>


                            {/* NEXT */}

                            <button
                                type="button"
                                onClick={() => {

                                    setCurrentPage((prev) =>
                                        Math.min(
                                            prev + 1,
                                            totalPages
                                        )
                                    );

                                }}
                                disabled={
                                    currentPage >= totalPages
                                }
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
                PAYMENT DETAILS MODAL
            ========================================= */}

            {selectedPayment && (

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
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            px-6
                            py-5
                            border-b
                            border-slate-200
                        ">

                            <div>

                                <p className="
                                    text-sm
                                    text-emerald-600
                                    font-medium
                                ">
                                    Payment Details
                                </p>

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-slate-900
                                ">
                                    {formatAmount(
                                        selectedPayment.amount
                                    )}
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


                            {/* STATUS */}

                            <div className="
                                flex
                                items-center
                                justify-between
                                p-4
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-200
                                mb-6
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                        mb-1
                                    ">
                                        Payment Status
                                    </p>

                                    <span className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        px-3
                                        py-1.5
                                        rounded-full
                                        text-xs
                                        font-semibold
                                        ${getPaymentStatusClass(
                                            selectedPayment.paymentStatus
                                        )}
                                    `}>

                                        {getPaymentStatusIcon(
                                            selectedPayment.paymentStatus
                                        )}

                                        {selectedPayment.paymentStatus}

                                    </span>

                                </div>


                                <div className="text-right">

                                    <p className="
                                        text-xs
                                        text-slate-400
                                        mb-1
                                    ">
                                        Amount
                                    </p>

                                    <p className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    ">
                                        {formatAmount(
                                            selectedPayment.amount
                                        )}
                                    </p>

                                </div>

                            </div>


                            {/* USER INFORMATION */}

                            <h3 className="
                                text-sm
                                font-semibold
                                text-slate-500
                                uppercase
                                tracking-wide
                                mb-3
                            ">
                                User Information
                            </h3>


                            <div className="
                                p-4
                                rounded-xl
                                bg-slate-50
                                border
                                border-slate-200
                                mb-6
                            ">

                                <div className="
                                    flex
                                    items-center
                                    gap-4
                                ">

                                    <div className="
                                        w-12
                                        h-12
                                        rounded-full
                                        bg-emerald-100
                                        flex
                                        items-center
                                        justify-center
                                        overflow-hidden
                                    ">

                                        {selectedPayment.userId?.profileImage?.url ? (

                                            <img
                                                src={
                                                    selectedPayment.userId.profileImage.url
                                                }
                                                alt={
                                                    selectedPayment.userId?.name || "User"
                                                }
                                                className="
                                                    w-full
                                                    h-full
                                                    object-cover
                                                "
                                            />

                                        ) : (

                                            <User
                                                size={22}
                                                className="
                                                    text-emerald-600
                                                "
                                            />

                                        )}

                                    </div>


                                    <div>

                                        <p className="
                                            font-semibold
                                            text-slate-800
                                        ">
                                            {selectedPayment.userId?.name || "-"}
                                        </p>

                                        <p className="
                                            text-sm
                                            text-slate-500
                                        ">
                                            {selectedPayment.userId?.email || "-"}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* PAYMENT INFORMATION */}

                            <h3 className="
                                text-sm
                                font-semibold
                                text-slate-500
                                uppercase
                                tracking-wide
                                mb-3
                            ">
                                Payment Information
                            </h3>


                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                                mb-6
                            ">


                                {/* METHOD */}

                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-slate-500
                                        mb-2
                                    ">

                                        <Wallet size={16} />

                                        <span className="text-sm">
                                            Payment Method
                                        </span>

                                    </div>

                                    <p className="
                                        font-semibold
                                        text-slate-800
                                    ">
                                        {selectedPayment.paymentMethod || "-"}
                                    </p>

                                </div>


                                {/* GATEWAY */}

                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-slate-500
                                        mb-2
                                    ">

                                        <CreditCard size={16} />

                                        <span className="text-sm">
                                            Gateway
                                        </span>

                                    </div>

                                    <p className="
                                        font-semibold
                                        text-slate-800
                                    ">
                                        {selectedPayment.gateway || "-"}
                                    </p>

                                </div>


                                {/* TRANSACTION ID */}

                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-slate-500
                                        mb-2
                                    ">

                                        <Hash size={16} />

                                        <span className="text-sm">
                                            Transaction ID
                                        </span>

                                    </div>

                                    <p className="
                                        font-semibold
                                        text-slate-800
                                        text-sm
                                        break-all
                                    ">
                                        {selectedPayment.transactionId || "-"}
                                    </p>

                                </div>


                                {/* RAZORPAY ORDER ID */}

                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-slate-500
                                        mb-2
                                    ">

                                        <Hash size={16} />

                                        <span className="text-sm">
                                            Razorpay Order ID
                                        </span>

                                    </div>

                                    <p className="
                                        font-semibold
                                        text-slate-800
                                        text-sm
                                        break-all
                                    ">
                                        {selectedPayment.razorpayOrderId || "-"}
                                    </p>

                                </div>

                            </div>


                            {/* DATES */}

                            <h3 className="
                                text-sm
                                font-semibold
                                text-slate-500
                                uppercase
                                tracking-wide
                                mb-3
                            ">
                                Date Information
                            </h3>


                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                            ">


                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-slate-500
                                        mb-2
                                    ">

                                        <CalendarDays size={16} />

                                        <span className="text-sm">
                                            Payment Date
                                        </span>

                                    </div>

                                    <p className="
                                        font-semibold
                                        text-slate-800
                                    ">
                                        {formatDateTime(
                                            selectedPayment.paymentDate
                                        )}
                                    </p>

                                </div>


                                <div className="
                                    p-4
                                    rounded-xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-2
                                        text-slate-500
                                        mb-2
                                    ">

                                        <CalendarDays size={16} />

                                        <span className="text-sm">
                                            Created
                                        </span>

                                    </div>

                                    <p className="
                                        font-semibold
                                        text-slate-800
                                    ">
                                        {formatDateTime(
                                            selectedPayment.createdAt
                                        )}
                                    </p>

                                </div>

                            </div>


                            {/* BOOKING ID */}

                            {selectedPayment.bookingId?._id && (

                                <div className="
                                    mt-6
                                    pt-5
                                    border-t
                                    border-slate-200
                                ">

                                    <p className="
                                        text-xs
                                        text-slate-400
                                        break-all
                                    ">
                                        Booking ID:{" "}
                                        {selectedPayment.bookingId._id}
                                    </p>

                                    {selectedPayment.bookingId.bookingStatus && (

                                        <p className="
                                            text-xs
                                            text-slate-400
                                            mt-1
                                        ">
                                            Booking Status:{" "}
                                            {selectedPayment.bookingId.bookingStatus}
                                        </p>

                                    )}

                                </div>

                            )}

                        </div>


                        {/* MODAL FOOTER */}

                        <div className="
                            px-6
                            py-4
                            border-t
                            border-slate-200
                            flex
                            justify-end
                        ">

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


export default Payments;