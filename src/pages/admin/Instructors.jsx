import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    Star,
    CheckCircle,
    XCircle,
    UserRound,
    Plus,
    Pencil,
    Trash2
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getAllInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    toggleInstructorStatus
} from "../../services/adminService";

const emptyForm = {
    name: "",
    email: "",
    password: "",
    contact: "",
    bio: "",
    qualification: "",
    experience: "",
    expertise: "",
    languages: "",
    fees: ""
};

const Instructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState(emptyForm);

    const instructorsPerPage = 10;

    const fetchInstructors = async () => {
        try {
            setLoading(true);

            const response = await getAllInstructors();

            if (response.success) {
                setInstructors(response.data || []);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch instructors"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    const filteredInstructors = useMemo(() => {
        return instructors.filter((instructor) => {
            const user = instructor.userId || {};
            const searchText = search.toLowerCase();

            const matchesSearch =
                user?.name?.toLowerCase().includes(searchText) ||
                user?.email?.toLowerCase().includes(searchText) ||
                instructor?.qualification?.toLowerCase().includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && instructor.status === true) ||
                (statusFilter === "inactive" && instructor.status === false);

            const matchesAvailability =
                availabilityFilter === "all" ||
                (availabilityFilter === "available" &&
                    instructor.availability === true) ||
                (availabilityFilter === "unavailable" &&
                    instructor.availability === false);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesAvailability
            );
        });
    }, [
        instructors,
        search,
        statusFilter,
        availabilityFilter
    ]);

    const totalPages = Math.ceil(
        filteredInstructors.length / instructorsPerPage
    );

    const startIndex =
        (currentPage - 1) * instructorsPerPage;

    const currentInstructors =
        filteredInstructors.slice(
            startIndex,
            startIndex + instructorsPerPage
        );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        statusFilter,
        availabilityFilter
    ]);

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setAvailabilityFilter("all");
        setCurrentPage(1);
    };

    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openAddForm = () => {
        setEditingInstructor(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    const openEditForm = (instructor) => {
        const user = instructor.userId || {};

        setEditingInstructor(instructor);

        setFormData({
            name: user.name || "",
            email: user.email || "",
            password: "",
            contact: user.contact || user.phone || "",
            bio: instructor.bio || "",
            qualification: instructor.qualification || "",
            experience: instructor.experience || "",
            expertise: Array.isArray(instructor.expertise)
                ? instructor.expertise.join(", ")
                : "",
            languages: Array.isArray(instructor.languages)
                ? instructor.languages.join(", ")
                : "",
            fees: instructor.fees || ""
        });

        setSelectedInstructor(null);
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingInstructor(null);
        setFormData(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const data = {
                name: formData.name,
                email: formData.email,
                contact: formData.contact,
                bio: formData.bio,
                qualification: formData.qualification,
                experience: Number(formData.experience) || 0,
                expertise: formData.expertise
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                languages: formData.languages
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                fees: Number(formData.fees) || 0
            };

            if (!editingInstructor) {
                data.password = formData.password;

                await createInstructor(data);

                toast.success(
                    "Instructor created successfully"
                );
            } else {
                if (formData.password.trim()) {
                    data.password = formData.password;
                }

                await updateInstructor(
                    editingInstructor._id,
                    data
                );

                toast.success(
                    "Instructor updated successfully"
                );
            }

            closeForm();
            await fetchInstructors();

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save instructor"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this instructor?"
        );

        if (!confirmed) return;

        try {
            await deleteInstructor(id);

            toast.success(
                "Instructor deleted successfully"
            );

            setSelectedInstructor(null);

            await fetchInstructors();

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete instructor"
            );
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleInstructorStatus(id);

            toast.success(
                "Instructor status updated"
            );

            await fetchInstructors();

            if (selectedInstructor?._id === id) {
                setSelectedInstructor(null);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update instructor status"
            );
        }
    };

    return (
        <div className="p-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Instructors
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Manage YogaConnect instructors
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <div className="px-5 py-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-500">
                            Total Instructors
                        </span>

                        <span className="ml-3 font-bold text-emerald-600">
                            {instructors.length}
                        </span>
                    </div>

                    <button
                        onClick={openAddForm}
                        className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
                    >
                        <Plus size={19} />
                        Add Instructor
                    </button>

                </div>

            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">

                <div className="flex flex-wrap items-center gap-4">

                    <div className="relative w-full lg:w-[360px]">

                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search instructor..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />

                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 outline-none focus:border-emerald-500"
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

                    <select
                        value={availabilityFilter}
                        onChange={(e) =>
                            setAvailabilityFilter(e.target.value)
                        }
                        className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 outline-none focus:border-emerald-500"
                    >
                        <option value="all">
                            All Availability
                        </option>

                        <option value="available">
                            Available
                        </option>

                        <option value="unavailable">
                            Unavailable
                        </option>
                    </select>

                    {(search ||
                        statusFilter !== "all" ||
                        availabilityFilter !== "all") && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100"
                        >
                            Clear Filters
                        </button>
                    )}

                </div>

                <div className="mt-4 text-sm text-slate-400">
                    Showing{" "}
                    <span className="font-semibold text-slate-600">
                        {filteredInstructors.length === 0
                            ? 0
                            : startIndex + 1}
                    </span>
                    {" "}to{" "}
                    <span className="font-semibold text-slate-600">
                        {Math.min(
                            startIndex + instructorsPerPage,
                            filteredInstructors.length
                        )}
                    </span>
                    {" "}of{" "}
                    <span className="font-semibold text-slate-600">
                        {filteredInstructors.length}
                    </span>
                    {" "}instructors
                </div>

            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50 border-b border-slate-200">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Instructor
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Qualification
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Experience
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Fees
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Rating
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                                    Availability
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

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-12 text-slate-500"
                                    >
                                        Loading instructors...
                                    </td>

                                </tr>

                            ) : currentInstructors.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-12 text-slate-500"
                                    >

                                        <div className="flex flex-col items-center">

                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">

                                                <UserRound
                                                    size={22}
                                                    className="text-slate-400"
                                                />

                                            </div>

                                            <p className="mt-3">
                                                No instructors found
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                currentInstructors.map(
                                    (instructor) => {

                                        const user =
                                            instructor.userId || {};

                                        return (

                                            <tr
                                                key={instructor._id}
                                                className="border-b border-slate-100 hover:bg-slate-50"
                                            >

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

                                                        <img
                                                            src={
                                                                user?.profileImage?.url ||
                                                                "https://via.placeholder.com/45"
                                                            }
                                                            alt={
                                                                user?.name || "Instructor"
                                                            }
                                                            className="w-11 h-11 rounded-full object-cover"
                                                        />

                                                        <div>

                                                            <p className="font-semibold text-slate-800">
                                                                {user?.name || "Unknown"}
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                {user?.email || "-"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5 text-slate-600">
                                                    {instructor.qualification || "-"}
                                                </td>

                                                <td className="px-6 py-5 text-slate-600">
                                                    {instructor.experience || 0} years
                                                </td>

                                                <td className="px-6 py-5 font-semibold text-slate-700">
                                                    ₹{instructor.fees || 0}
                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-1">

                                                        <Star
                                                            size={16}
                                                            className="fill-amber-400 text-amber-400"
                                                        />

                                                        <span className="font-semibold text-slate-700">
                                                            {typeof instructor.rating === "number"
                                                                ? instructor.rating.toFixed(1)
                                                                : "0.0"}
                                                        </span>

                                                        <span className="text-xs text-slate-400">
                                                            ({instructor.totalReviews || 0})
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-6 py-5">

                                                    {instructor.availability ? (

                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">

                                                            <CheckCircle size={14} />

                                                            Available

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">

                                                            <XCircle size={14} />

                                                            Unavailable

                                                        </span>

                                                    )}

                                                </td>

                                                <td className="px-6 py-5">

                                                    <button
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                instructor._id
                                                            )
                                                        }
                                                        className={
                                                            instructor.status
                                                                ? "px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"
                                                                : "px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                                                        }
                                                    >
                                                        {instructor.status
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </button>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-1">

                                                        <button
                                                            onClick={() =>
                                                                setSelectedInstructor(
                                                                    instructor
                                                                )
                                                            }
                                                            title="View instructor"
                                                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                openEditForm(
                                                                    instructor
                                                                )
                                                            }
                                                            title="Edit instructor"
                                                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    instructor._id
                                                                )
                                                            }
                                                            title="Delete instructor"
                                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

                {totalPages > 1 && (

                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">

                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page - 1
                                )
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >

                            <ChevronLeft size={17} />

                            Previous

                        </button>

                        <div className="flex items-center gap-2">

                            {pageNumbers.map(
                                (page) => (

                                    <button
                                        key={page}
                                        onClick={() =>
                                            setCurrentPage(page)
                                        }
                                        className={
                                            page === currentPage
                                                ? "w-9 h-9 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
                                                : "w-9 h-9 rounded-lg text-slate-600 text-sm hover:bg-slate-100"
                                        }
                                    >
                                        {page}
                                    </button>

                                )
                            )}

                        </div>

                        <button
                            disabled={
                                currentPage === totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page + 1
                                )
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >

                            Next

                            <ChevronRight size={17} />

                        </button>

                    </div>

                )}

            </div>

            {selectedInstructor && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() =>
                        setSelectedInstructor(null)
                    }
                >

                    <div
                        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                            <h2 className="text-xl font-bold text-slate-900">
                                Instructor Details
                            </h2>

                            <button
                                onClick={() =>
                                    setSelectedInstructor(null)
                                }
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-6">

                            {(() => {

                                const user =
                                    selectedInstructor.userId || {};

                                return (

                                    <>

                                        <div className="flex flex-col items-center">

                                            <img
                                                src={
                                                    user?.profileImage?.url ||
                                                    "https://via.placeholder.com/100"
                                                }
                                                alt={
                                                    user?.name || "Instructor"
                                                }
                                                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50"
                                            />

                                            <h3 className="mt-4 text-2xl font-bold text-slate-900">
                                                {user?.name || "Unknown"}
                                            </h3>

                                            <p className="text-slate-500">
                                                {user?.email || "-"}
                                            </p>

                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

                                            <InfoBox
                                                label="Phone"
                                                value={
                                                    user?.phone ||
                                                    user?.contact ||
                                                    "-"
                                                }
                                            />

                                            <InfoBox
                                                label="Qualification"
                                                value={
                                                    selectedInstructor.qualification ||
                                                    "-"
                                                }
                                            />

                                            <InfoBox
                                                label="Experience"
                                                value={`${selectedInstructor.experience || 0} years`}
                                            />

                                            <InfoBox
                                                label="Fees"
                                                value={`₹${selectedInstructor.fees || 0}`}
                                            />

                                            <InfoBox
                                                label="Rating"
                                                value={`⭐ ${
                                                    typeof selectedInstructor.rating === "number"
                                                        ? selectedInstructor.rating.toFixed(1)
                                                        : "0.0"
                                                } (${selectedInstructor.totalReviews || 0} reviews)`}
                                            />

                                            <InfoBox
                                                label="Status"
                                                value={
                                                    selectedInstructor.status
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                valueClass={
                                                    selectedInstructor.status
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }
                                            />

                                        </div>

                                        <div className="mt-5 p-5 rounded-xl bg-slate-50">

                                            <p className="text-xs text-slate-400 uppercase tracking-wide">
                                                Bio
                                            </p>

                                            <p className="mt-2 text-slate-600 leading-7">
                                                {selectedInstructor.bio ||
                                                    "No bio available."}
                                            </p>

                                        </div>

                                        <TagSection
                                            title="Expertise"
                                            items={
                                                selectedInstructor.expertise
                                            }
                                        />

                                        <TagSection
                                            title="Languages"
                                            items={
                                                selectedInstructor.languages
                                            }
                                        />

                                        <div className="mt-5 flex items-center justify-between p-5 rounded-xl bg-slate-50">

                                            <div>

                                                <p className="text-sm font-semibold text-slate-800">
                                                    Availability
                                                </p>

                                                <p className="text-sm text-slate-400 mt-1">
                                                    Instructor can accept new classes
                                                </p>

                                            </div>

                                            {selectedInstructor.availability ? (

                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                    Available
                                                </span>

                                            ) : (

                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                    Unavailable
                                                </span>

                                            )}

                                        </div>

                                    </>

                                );

                            })()}

                        </div>

                    </div>

                </div>

            )}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

                        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-5 border-b border-slate-200">

                            <div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingInstructor
                                        ? "Edit Instructor"
                                        : "Add Instructor"}
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    {editingInstructor
                                        ? "Update instructor information"
                                        : "Create a new instructor account"}
                                </p>

                            </div>

                            <button
                                onClick={closeForm}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <FormInput
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                />

                                <FormInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    required
                                />

                                <FormInput
                                    label={
                                        editingInstructor
                                            ? "New Password"
                                            : "Password"
                                    }
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    required={!editingInstructor}
                                    placeholder={
                                        editingInstructor
                                            ? "Leave empty to keep current password"
                                            : "Enter password"
                                    }
                                />

                                <FormInput
                                    label="Contact"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleFormChange}
                                    required
                                />

                                <FormInput
                                    label="Qualification"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleFormChange}
                                />

                                <FormInput
                                    label="Experience"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleFormChange}
                                    min="0"
                                />

                                <FormInput
                                    label="Fees"
                                    name="fees"
                                    type="number"
                                    value={formData.fees}
                                    onChange={handleFormChange}
                                    min="0"
                                />

                                <FormInput
                                    label="Languages"
                                    name="languages"
                                    value={formData.languages}
                                    onChange={handleFormChange}
                                    placeholder="English, Hindi, Marathi"
                                />

                            </div>

                            <div className="mt-5">

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Expertise
                                </label>

                                <input
                                    type="text"
                                    name="expertise"
                                    value={formData.expertise}
                                    onChange={handleFormChange}
                                    placeholder="Hatha Yoga, Meditation, Pranayama"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />

                                <p className="text-xs text-slate-400 mt-1">
                                    Separate multiple expertise using commas.
                                </p>

                            </div>

                            <div className="mt-5">

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Bio
                                </label>

                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleFormChange}
                                    rows="4"
                                    placeholder="Write instructor biography..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />

                            </div>

                            <div className="flex justify-end gap-3 mt-7">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
                                >

                                    {editingInstructor ? (
                                        <Pencil size={18} />
                                    ) : (
                                        <Plus size={18} />
                                    )}

                                    {saving
                                        ? "Saving..."
                                        : editingInstructor
                                            ? "Update Instructor"
                                            : "Create Instructor"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

const FormInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    placeholder = "",
    min
}) => {
    return (
        <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                min={min}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

        </div>
    );
};

const InfoBox = ({
    label,
    value,
    valueClass = "text-slate-700"
}) => {
    return (
        <div className="p-4 rounded-xl bg-slate-50">

            <p className="text-xs text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 font-semibold ${valueClass}`}
            >
                {value}
            </p>

        </div>
    );
};

const TagSection = ({
    title,
    items = []
}) => {
    return (
        <div className="mt-5">

            <p className="text-sm font-semibold text-slate-800 mb-3">
                {title}
            </p>

            {Array.isArray(items) && items.length > 0 ? (

                <div className="flex flex-wrap gap-2">

                    {items.map(
                        (item, index) => (

                            <span
                                key={index}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium"
                            >
                                {item}
                            </span>

                        )
                    )}

                </div>

            ) : (

                <p className="text-sm text-slate-400">
                    No information available.
                </p>

            )}

        </div>
    );
};

export default Instructors;