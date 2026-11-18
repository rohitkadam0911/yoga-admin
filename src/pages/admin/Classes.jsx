
import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, X, Search, Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
    getAllClasses,
    createClass,
    updateClass,
    deleteClass,
} from "../../services/adminService";

const initialForm = {
    title: "",
    description: "",
    category: "Hatha Yoga",
    level: "Beginner",
    price: "",
    duration: "",
    capacity: "",
    mode: "Online",
    instructorId: "",
    scheduleDate: "",
    startTime: "",
    endTime: "",
    status: true,
};

const categories = [
    "Hatha Yoga",
    "Power Yoga",
    "Meditation",
    "Kids Yoga",
    "Prenatal Yoga",
    "Pranayama",
];

const inputClass =
    "w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500";

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [edit, setEdit] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadClasses = async () => {
        try {
            const res = await getAllClasses();
            const result = res.data?.data ?? res.data;
            setClasses(Array.isArray(result) ? result : []);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load classes"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEdit((prev) => ({
            ...prev,
            [name]: name === "status" ? value === "true" : value,
        }));
    };

    const closeAddModal = () => {
        setShowAdd(false);
        setForm({ ...initialForm });
        setThumbnail(null);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                if (value !== "" && value !== null) {
                    formData.append(key, value);
                }
            });

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            await createClass(formData);

            toast.success("Class created successfully");
            closeAddModal();
            await loadClasses();
        } catch (error) {
            const errors = error.response?.data?.errors;
            toast.error(
                errors?.map((item) => item.msg).join(", ") ||
                error.response?.data?.message ||
                "Failed to create class"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class?")) {
            return;
        }

        try {
            await deleteClass(id);
            toast.success("Class deleted successfully");

            if (selected?._id === id) setSelected(null);

            await loadClasses();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Delete failed"
            );
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                title: edit.title,
                description: edit.description,
                category: edit.category,
                level: edit.level,
                price: Number(edit.price),
                duration: Number(edit.duration),
                capacity: Number(edit.capacity),
                mode: edit.mode,
                scheduleDate: edit.scheduleDate,
                startTime: edit.startTime,
                endTime: edit.endTime,
                status: edit.status,
            };

            await updateClass(edit._id, payload);

            toast.success("Class updated successfully");
            setEdit(null);
            await loadClasses();
        } catch (error) {
            const errors = error.response?.data?.errors;
            toast.error(
                errors?.map((item) => item.msg).join(", ") ||
                error.response?.data?.message ||
                "Update failed"
            );
        } finally {
            setSaving(false);
        }
    };

    const openEdit = (item) => {
        setEdit({
            ...item,
            instructorId: item.instructorId?._id || item.instructorId || "",
            scheduleDate: item.scheduleDate
                ? new Date(item.scheduleDate).toISOString().slice(0, 10)
                : "",
            startTime: item.startTime || "",
            endTime: item.endTime || "",
        });
    };

    const renderFields = (values, onChange, includeInstructor = false) => (
        <>
            <input
                name="title"
                value={values.title || ""}
                onChange={onChange}
                placeholder="Class title"
                className={inputClass}
                required
            />

            <textarea
                name="description"
                value={values.description || ""}
                onChange={onChange}
                placeholder="Description"
                className={inputClass}
                rows={3}
                required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                    name="category"
                    value={values.category || "Hatha Yoga"}
                    onChange={onChange}
                    className={inputClass}
                    required
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select
                    name="level"
                    value={values.level || "Beginner"}
                    onChange={onChange}
                    className={inputClass}
                    required
                >
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>

                <input
                    name="price"
                    type="number"
                    min="0"
                    value={values.price ?? ""}
                    onChange={onChange}
                    placeholder="Price (₹)"
                    className={inputClass}
                    required
                />

                <input
                    name="duration"
                    type="number"
                    min="1"
                    value={values.duration ?? ""}
                    onChange={onChange}
                    placeholder="Duration (minutes)"
                    className={inputClass}
                    required
                />

                <input
                    name="capacity"
                    type="number"
                    min="1"
                    value={values.capacity ?? ""}
                    onChange={onChange}
                    placeholder="Capacity"
                    className={inputClass}
                    required
                />

                <select
                    name="mode"
                    value={values.mode || "Online"}
                    onChange={onChange}
                    className={inputClass}
                    required
                >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                </select>

                <div>
                    <label className="block text-sm mb-1">Schedule Date</label>
                    <input
                        type="date"
                        name="scheduleDate"
                        value={values.scheduleDate || ""}
                        onChange={onChange}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        value={values.startTime || ""}
                        onChange={onChange}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        value={values.endTime || ""}
                        onChange={onChange}
                        className={inputClass}
                        required
                    />
                </div>
            </div>

            {includeInstructor && (
                <input
                    name="instructorId"
                    value={values.instructorId || ""}
                    onChange={onChange}
                    placeholder="Instructor ID (MongoDB ObjectId)"
                    className={inputClass}
                    required
                />
            )}

            <select
                name="status"
                value={String(values.status ?? true)}
                onChange={onChange}
                className={inputClass}
            >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
        </>
    );

    const getInstructorName = (item) =>
        item.instructorId?.userId?.name ||
        item.instructorId?.name ||
        "-";

    const filtered = classes.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Classes
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Add, view, update and manage all classes
                    </p>
                </div>

                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl"
                >
                    <Plus size={18} />
                    Add Class
                </button>
            </div>

            <div className="relative mb-5 max-w-sm">
                <Search
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search class..."
                    className="w-full border rounded-xl pl-9 pr-4 py-2.5"
                />
            </div>

            <div className="bg-white rounded-2xl border overflow-x-auto">
                <table className="w-full min-w-[850px]">
                    <thead className="bg-slate-50">
                        <tr>
                            {["Class", "Instructor", "Category", "Price", "Status", "Actions"].map(
                                (heading) => (
                                    <th key={heading} className="text-left p-4 text-sm text-slate-600">
                                        {heading}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center p-8">
                                    Loading classes...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center p-8">
                                    No classes found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((item) => (
                                <tr key={item._id} className="border-t hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.thumbnail?.url || "https://placehold.co/80x80?text=Yoga"}
                                                alt={item.title}
                                                className="w-12 h-12 rounded-xl object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold">{item.title}</p>
                                                <p className="text-xs text-slate-400">{item.level}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4">{getInstructorName(item)}</td>
                                    <td className="p-4">{item.category}</td>
                                    <td className="p-4">₹{item.price}</td>
                                    <td className="p-4">
                                        <span className={item.status ? "text-emerald-600" : "text-red-600"}>
                                            {item.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                title="View class"
                                                onClick={() => setSelected(item)}
                                                className="p-2 rounded-lg hover:bg-slate-100"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                title="Edit class"
                                                onClick={() => openEdit(item)}
                                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                title="Delete class"
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showAdd && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleCreate}
                        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-bold">Add Class</h2>
                            <button type="button" onClick={closeAddModal}>
                                <X />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {renderFields(form, handleChange, true)}

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Class Thumbnail (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                    className="w-full border rounded-xl p-3"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                type="button"
                                onClick={closeAddModal}
                                className="w-full border rounded-xl py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-emerald-600 disabled:opacity-60 text-white rounded-xl py-3"
                            >
                                {saving ? "Creating..." : "Create Class"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{selected.title}</h2>
                            <button onClick={() => setSelected(null)}>
                                <X />
                            </button>
                        </div>

                        <img
                            src={selected.thumbnail?.url || "https://placehold.co/500x250?text=Yoga"}
                            alt={selected.title}
                            className="w-full h-48 object-cover rounded-xl mt-4"
                        />

                        <p className="mt-4 text-slate-600">{selected.description}</p>

                        <div className="mt-4 space-y-2 text-sm">
                            <p><b>Category:</b> {selected.category}</p>
                            <p><b>Level:</b> {selected.level}</p>
                            <p><b>Price:</b> ₹{selected.price}</p>
                            <p><b>Duration:</b> {selected.duration} minutes</p>
                            <p><b>Capacity:</b> {selected.capacity}</p>
                            <p><b>Mode:</b> {selected.mode}</p>
                            <p><b>Schedule Date:</b> {selected.scheduleDate ? new Date(selected.scheduleDate).toLocaleDateString() : "-"}</p>
                            <p><b>Start Time:</b> {selected.startTime || "-"}</p>
                            <p><b>End Time:</b> {selected.endTime || "-"}</p>
                            <p><b>Instructor:</b> {getInstructorName(selected)}</p>
                            <p><b>Status:</b> {selected.status ? "Active" : "Inactive"}</p>
                        </div>
                    </div>
                </div>
            )}

            {edit && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-bold">Edit Class</h2>
                            <button type="button" onClick={() => setEdit(null)}>
                                <X />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {renderFields(edit, handleEditChange)}
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                type="button"
                                onClick={() => setEdit(null)}
                                className="w-full border rounded-xl py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-emerald-600 disabled:opacity-60 text-white rounded-xl py-3"
                            >
                                {saving ? "Updating..." : "Update Class"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Classes;
