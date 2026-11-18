
import { useEffect, useMemo, useState } from "react";

import {
    Search,
    CalendarDays,
    Clock3,
    Users,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
} from "lucide-react";

import {
    getAllClassSessions,
    getAllClasses,
    getAllInstructors,
    createClassSession,
} from "../../services/adminService";

const initialFormData = {
    classId: "",
    instructorId: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: 20,
};

const ClassSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [classes, setClasses] = useState([]);
    const [instructors, setInstructors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [creating, setCreating] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState(initialFormData);

    const itemsPerPage = 10;

    // -------------------------
    // FETCH SESSIONS
    // -------------------------
    const fetchSessions = async () => {
        try {
            setLoading(true);

            const response = await getAllClassSessions();

            if (response?.success) {
                setSessions(response.data || []);
            } else {
                setSessions([]);
            }
        } catch (error) {
            console.error("Fetch sessions error:", error);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    // -------------------------
    // FETCH CLASSES AND INSTRUCTORS
    // -------------------------
    const fetchFormOptions = async () => {
        try {
            setLoadingOptions(true);

            const [classResponse, instructorResponse] =
                await Promise.all([
                    getAllClasses(),
                    getAllInstructors(),
                ]);

            const classData =
                Array.isArray(classResponse?.data)
                    ? classResponse.data
                    : Array.isArray(classResponse?.data?.data)
                      ? classResponse.data.data
                      : Array.isArray(classResponse?.classes)
                        ? classResponse.classes
                        : [];

            const instructorData =
                Array.isArray(instructorResponse?.data)
                    ? instructorResponse.data
                    : Array.isArray(instructorResponse?.data?.data)
                      ? instructorResponse.data.data
                      : Array.isArray(instructorResponse?.instructors)
                        ? instructorResponse.instructors
                        : [];

            setClasses(classData);
            setInstructors(instructorData);
        } catch (error) {
            console.error("Load form options error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to load classes and instructors."
            );
        } finally {
            setLoadingOptions(false);
        }
    };

    const openCreateForm = async () => {
        setFormData(initialFormData);
        setShowCreateForm(true);
        await fetchFormOptions();
    };

    // -------------------------
    // FORM HANDLING
    // -------------------------
    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();

        if (
            !formData.classId ||
            !formData.instructorId ||
            !formData.date ||
            !formData.startTime ||
            !formData.endTime ||
            Number(formData.capacity) < 1
        ) {
            alert("Please complete all fields.");
            return;
        }

        if (formData.startTime >= formData.endTime) {
            alert("End time must be later than start time.");
            return;
        }

        // Build a local date at midnight to avoid date shifting.
        const [year, month, day] = formData.date
            .split("-")
            .map(Number);

        const selectedDate = new Date(year, month - 1, day);

        if (Number.isNaN(selectedDate.getTime())) {
            alert("Please select a valid date.");
            return;
        }

        try {
            setCreating(true);

            const response = await createClassSession({
                ...formData,
                date: selectedDate.toISOString(),
                capacity: Number(formData.capacity),
            });

            if (!response?.success) {
                throw new Error(
                    response?.message || "Failed to create session."
                );
            }

            alert("Class session created successfully!");

            setShowCreateForm(false);
            setFormData(initialFormData);

            await fetchSessions();
        } catch (error) {
            console.error("Create session error:", error);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Unable to create class session."
            );
        } finally {
            setCreating(false);
        }
    };

    // -------------------------
    // SEARCH AND STATUS FILTER
    // -------------------------
    const filteredSessions = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return sessions.filter((session) => {
            const title =
                session.classId?.title?.toLowerCase() || "";

            const category =
                session.classId?.category?.toLowerCase() || "";

            const matchesSearch =
                title.includes(searchText) ||
                category.includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" &&
                    session.status === true) ||
                (statusFilter === "inactive" &&
                    session.status === false);

            return matchesSearch && matchesStatus;
        });
    }, [sessions, search, statusFilter]);

    // -------------------------
    // PAGINATION
    // -------------------------
    const totalFilteredSessions = filteredSessions.length;

    const totalPages = Math.ceil(
        totalFilteredSessions / itemsPerPage
    );

    const currentSessions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;

        return filteredSessions.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [filteredSessions, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // -------------------------
    // HELPERS
    // -------------------------
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getAvailableSeats = (session) => {
        return Math.max(
            Number(session.capacity || 0) -
                Number(session.bookedSeats || 0),
            0
        );
    };

    const getBookingPercentage = (session) => {
        const capacity = Number(session.capacity || 0);
        const booked = Number(session.bookedSeats || 0);

        if (!capacity) return 0;

        return Math.min(
            Math.round((booked / capacity) * 100),
            100
        );
    };

    const startEntry =
        totalFilteredSessions === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endEntry = Math.min(
        currentPage * itemsPerPage,
        totalFilteredSessions
    );

    // Handles common instructor response structures.
    const getInstructorName = (instructor) => {
        if (typeof instructor.userId === "object") {
            return (
                instructor.userId?.name ||
                instructor.userId?.fullName ||
                instructor.name ||
                "Instructor"
            );
        }

        return (
            instructor.name ||
            instructor.fullName ||
            instructor.user?.name ||
            "Instructor"
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="mb-1 font-medium text-emerald-600">
                        Schedule Management
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Class Sessions
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage scheduled yoga class sessions
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                            <CalendarDays
                                size={22}
                                className="text-emerald-600"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Sessions
                            </p>

                            <p className="text-xl font-bold text-slate-900">
                                {sessions.length}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <Plus size={20} />
                        Create Session
                    </button>
                </div>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search class or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    <div className="relative">
                        <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 lg:w-44"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SESSIONS TABLE */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                {[
                                    "Class",
                                    "Date",
                                    "Time",
                                    "Capacity",
                                    "Availability",
                                    "Status",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-6 py-4 text-left text-sm font-semibold text-slate-500"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-14 text-center text-slate-500"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                                            Loading sessions...
                                        </div>
                                    </td>
                                </tr>
                            ) : currentSessions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-14 text-center">
                                        <CalendarDays
                                            size={42}
                                            className="mx-auto mb-3 text-slate-300"
                                        />

                                        <p className="font-semibold text-slate-700">
                                            No sessions found
                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Create a session or change your search or filter.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                currentSessions.map((session) => {
                                    const capacity = Number(
                                        session.capacity || 0
                                    );

                                    const booked = Number(
                                        session.bookedSeats || 0
                                    );

                                    const available =
                                        getAvailableSeats(session);

                                    const percentage =
                                        getBookingPercentage(session);

                                    return (
                                        <tr
                                            key={session._id}
                                            className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                                        >
                                            {/* CLASS */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50">
                                                        {session.classId?.thumbnail?.url ? (
                                                            <img
                                                                src={session.classId.thumbnail.url}
                                                                alt={session.classId.title || "Class"}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <CalendarDays
                                                                size={20}
                                                                className="text-emerald-600"
                                                            />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {session.classId?.title ||
                                                                "Unknown Class"}
                                                        </p>

                                                        <p className="text-sm text-slate-400">
                                                            {session.classId?.category || "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* DATE */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <CalendarDays
                                                        size={17}
                                                        className="text-slate-400"
                                                    />
                                                    {formatDate(session.date)}
                                                </div>
                                            </td>

                                            {/* TIME */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Clock3
                                                        size={17}
                                                        className="text-slate-400"
                                                    />
                                                    {session.startTime || "-"} -{" "}
                                                    {session.endTime || "-"}
                                                </div>
                                            </td>

                                            {/* CAPACITY */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Users
                                                        size={17}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="font-medium text-slate-700">
                                                        {capacity}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {booked} booked
                                                </p>
                                            </td>

                                            {/* AVAILABILITY */}
                                            <td className="min-w-[190px] px-6 py-5">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {available} available
                                                    </span>

                                                    <span className="text-xs text-slate-400">
                                                        {percentage}%
                                                    </span>
                                                </div>

                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-500 transition-all"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-6 py-5">
                                                {session.status ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                                        <CheckCircle2 size={14} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700">
                                                        <XCircle size={14} />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {!loading && totalFilteredSessions > 0 && (
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 px-6 py-4 sm:flex-row">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {startEntry}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-slate-700">
                                {endEntry}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {totalFilteredSessions}
                            </span>{" "}
                            sessions
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        type="button"
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                                            currentPage === page
                                                ? "bg-emerald-600 text-white"
                                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE SESSION MODAL */}
            {showCreateForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-600">
                                    Schedule Management
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                    Create Class Session
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="rounded-lg p-2 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {loadingOptions ? (
                            <div className="py-12 text-center text-slate-500">
                                Loading classes and instructors...
                            </div>
                        ) : (
                            <form
                                onSubmit={handleCreateSession}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Select Class
                                    </label>

                                    <select
                                        name="classId"
                                        required
                                        value={formData.classId}
                                        onChange={handleFormChange}
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    >
                                        <option value="">
                                            Choose a class
                                        </option>

                                        {classes.map((item) => (
                                            <option
                                                key={item._id}
                                                value={item._id}
                                            >
                                                {item.title || "Untitled class"}
                                            </option>
                                        ))}
                                    </select>

                                    {classes.length === 0 && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            No classes returned by the classes API.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Select Instructor
                                    </label>

                                    <select
                                        name="instructorId"
                                        required
                                        value={formData.instructorId}
                                        onChange={handleFormChange}
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    >
                                        <option value="">
                                            Choose an instructor
                                        </option>

                                        {instructors.map((item) => (
                                            <option
                                                key={item._id}
                                                value={item._id}
                                            >
                                                {getInstructorName(item)}
                                            </option>
                                        ))}
                                    </select>

                                    {instructors.length === 0 && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            No instructors returned by the instructors API.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Session Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        min={new Date().toLocaleDateString(
                                            "en-CA"
                                        )}
                                        value={formData.date}
                                        onChange={handleFormChange}
                                        className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Start Time
                                        </label>

                                        <input
                                            type="time"
                                            name="startTime"
                                            required
                                            value={formData.startTime}
                                            onChange={handleFormChange}
                                            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            End Time
                                        </label>

                                        <input
                                            type="time"
                                            name="endTime"
                                            required
                                            value={formData.endTime}
                                            onChange={handleFormChange}
                                            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Seat Capacity
                                    </label>

                                    <input
                                        type="number"
                                        name="capacity"
                                        min="1"
                                        required
                                        value={formData.capacity}
                                        onChange={handleFormChange}
                                        className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    />
                                </div>

                                <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCreateForm(false)
                                        }
                                        className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            creating ||
                                            loadingOptions ||
                                            classes.length === 0 ||
                                            instructors.length === 0
                                        }
                                        className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {creating
                                            ? "Creating..."
                                            : "Create Session"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassSessions;
