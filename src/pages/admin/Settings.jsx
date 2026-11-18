import { useEffect, useState } from "react";

import {
    User,
    Mail,
    Phone,
    Camera,
    Lock,
    Save,
    Eye,
    EyeOff
} from "lucide-react";

import api from "../../services/api";


// =====================================================
// PASSWORD INPUT
// IMPORTANT:
// Keep this component OUTSIDE Settings.
// =====================================================

const PasswordInput = ({
    name,
    placeholder,
    value,
    show,
    setShow,
    onChange
}) => {

    return (
        <div className="relative">

            <input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete="new-password"
                className="
                    w-full
                    px-4
                    py-3
                    pr-12
                    rounded-xl
                    border
                    border-slate-200
                    outline-none
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-100
                "
            />

            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-slate-600
                "
            >
                {show ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
            </button>

        </div>
    );
};


// =====================================================
// SETTINGS
// =====================================================

const Settings = () => {

    // =================================================
    // USER
    // =================================================

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);


    // =================================================
    // PROFILE
    // =================================================

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: ""
    });


    // =================================================
    // PASSWORD
    // =================================================

    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    // =================================================
    // SHOW / HIDE PASSWORD
    // =================================================

    const [showOldPassword, setShowOldPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // =================================================
    // GET PROFILE
    // =================================================

    const fetchProfile = async () => {
    try {
        setLoading(true);

        const response = await api.get("/admin/profile");

        if (response.data.success) {
            const data = response.data.data;

            setUser(data);

            setProfile({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || ""
            });
        }
    } catch (error) {
        console.error("Admin Profile Error:", error);
    } finally {
        setLoading(false);
    }
};


    // =================================================
    // FETCH PROFILE ON PAGE LOAD
    // =================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // =================================================
    // PROFILE INPUT
    // =================================================

    const handleProfileChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =================================================
    // PASSWORD INPUT
    // =================================================

    const handlePasswordChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setPasswords((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =================================================
    // UPDATE PROFILE
    // =================================================

    const handleUpdateProfile = async (e) => {

        e.preventDefault();


        try {

            setSaving(true);


            const formData = new FormData();


            formData.append(
                "name",
                profile.name
            );


            formData.append(
                "phone",
                profile.phone
            );


            const response = await api.put(
                "/admin/update-profile",
                formData
            );


            if (response.data.success) {

                alert(
                    "Profile updated successfully"
                );


                await fetchProfile();

            }

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // =================================================
    // PROFILE IMAGE
    // =================================================

    const handleImageChange = async (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        // Optional basic validation

        if (!file.type.startsWith("image/")) {

            alert("Please select an image file");

            return;

        }


        try {

            setSaving(true);


            const formData = new FormData();


            formData.append(
                "profileImage",
                file
            );


            const response = await api.put(
                "/admin/profile-image",
                formData
            );


            if (response.data.success) {

                alert(
                    "Profile image updated successfully"
                );


                await fetchProfile();

            }

        } catch (error) {

            console.error(
                "Profile Image Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to update profile image"
            );

        } finally {

            setSaving(false);

        }

    };


    // =================================================
    // CHANGE PASSWORD
    // =================================================

    const handleChangePassword = async (e) => {

        e.preventDefault();


        // ---------------------------------------------
        // EMPTY FIELD VALIDATION
        // ---------------------------------------------

        if (
            !passwords.oldPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {

            alert(
                "Please fill all password fields"
            );

            return;

        }


        // ---------------------------------------------
        // PASSWORD MATCH
        // ---------------------------------------------

        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {

            alert(
                "New password and confirm password do not match"
            );

            return;

        }


        try {

            setSaving(true);


            const response = await api.put(
                "/admin/change-password",
                {
                    oldPassword:
                        passwords.oldPassword,

                    newPassword:
                        passwords.newPassword,

                    confirmPassword:
                        passwords.confirmPassword
                }
            );


            if (response.data.success) {

                alert(
                    "Password changed successfully"
                );


                setPasswords({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });


                setShowOldPassword(false);

                setShowNewPassword(false);

                setShowConfirmPassword(false);

            } else {

                alert(
                    response.data.message ||
                    "Failed to change password"
                );

            }

        } catch (error) {

            console.error(
                "Change Password Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to change password"
            );

        } finally {

            setSaving(false);

        }

    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <div className="
                min-h-full
                flex
                items-center
                justify-center
                p-8
            ">

                <p className="text-slate-500">
                    Loading profile...
                </p>

            </div>

        );

    }


    // =================================================
    // PAGE
    // =================================================

    return (

        <div className="p-8">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="mb-8">

                <p className="
                    text-emerald-600
                    font-medium
                    mb-1
                ">
                    Account Settings
                </p>


                <h1 className="
                    text-3xl
                    font-bold
                    text-slate-900
                ">
                    Admin Profile
                </h1>


                <p className="
                    mt-1
                    text-slate-500
                ">
                    Manage your profile and account security
                </p>

            </div>


            {/* =========================================
                MAIN GRID
            ========================================= */}

            <div className="
                grid
                grid-cols-1
                xl:grid-cols-3
                gap-6
            ">


                {/* =====================================
                    LEFT PROFILE CARD
                ===================================== */}

                <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    p-6
                    h-fit
                ">


                    <div className="
                        flex
                        flex-col
                        items-center
                    ">


                        {/* PROFILE IMAGE */}

                        <div className="
                            relative
                            w-28
                            h-28
                            mb-4
                        ">

                            <div className="
                                w-28
                                h-28
                                rounded-full
                                overflow-hidden
                                bg-emerald-50
                                border-4
                                border-white
                                shadow
                                flex
                                items-center
                                justify-center
                            ">

                                {user?.profileImage?.url ? (

                                    <img
                                        src={
                                            user.profileImage.url
                                        }
                                        alt={
                                            user.name || "Profile"
                                        }
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <User
                                        size={45}
                                        className="
                                            text-emerald-600
                                        "
                                    />

                                )}

                            </div>


                            {/* CAMERA BUTTON */}

                            <label className="
                                absolute
                                right-0
                                bottom-0
                                w-9
                                h-9
                                rounded-full
                                bg-emerald-600
                                text-white
                                flex
                                items-center
                                justify-center
                                cursor-pointer
                                hover:bg-emerald-700
                                border-4
                                border-white
                            ">

                                <Camera size={16} />


                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={
                                        handleImageChange
                                    }
                                />

                            </label>

                        </div>


                        {/* NAME */}

                        <h2 className="
                            text-xl
                            font-bold
                            text-slate-900
                        ">
                            {user?.name || "Admin"}
                        </h2>


                        {/* EMAIL */}

                        <p className="
                            text-sm
                            text-slate-500
                            mt-1
                        ">
                            {user?.email || "-"}
                        </p>


                        {/* ADMIN */}

                        <span className="
                            mt-4
                            px-4
                            py-1.5
                            rounded-full
                            bg-emerald-100
                            text-emerald-700
                            text-xs
                            font-semibold
                        ">
                            ADMIN
                        </span>

                    </div>


                    {/* ACCOUNT INFO */}

                    <div className="
                        mt-8
                        pt-6
                        border-t
                        border-slate-200
                        space-y-4
                    ">


                        {/* EMAIL */}

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <Mail
                                size={18}
                                className="text-slate-400"
                            />


                            <div>

                                <p className="
                                    text-xs
                                    text-slate-400
                                ">
                                    Email
                                </p>


                                <p className="
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    {user?.email || "-"}
                                </p>

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <Phone
                                size={18}
                                className="text-slate-400"
                            />


                            <div>

                                <p className="
                                    text-xs
                                    text-slate-400
                                ">
                                    Phone
                                </p>


                                <p className="
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    {user?.phone || "-"}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    RIGHT CONTENT
                ===================================== */}

                <div className="
                    xl:col-span-2
                    space-y-6
                ">


                    {/* =================================
                        PERSONAL INFORMATION
                    ================================= */}

                    <div className="
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        p-6
                    ">


                        <div className="
                            flex
                            items-center
                            gap-3
                            mb-6
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

                                <User
                                    size={20}
                                    className="
                                        text-emerald-600
                                    "
                                />

                            </div>


                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                ">
                                    Personal Information
                                </h2>


                                <p className="
                                    text-sm
                                    text-slate-500
                                ">
                                    Update your basic account information
                                </p>

                            </div>

                        </div>


                        {/* PROFILE FORM */}

                        <form
                            onSubmit={
                                handleUpdateProfile
                            }
                        >

                            <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-5
                            ">


                                {/* NAME */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                        Full Name
                                    </label>


                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            profile.name
                                        }
                                        onChange={
                                            handleProfileChange
                                        }
                                        className="
                                            w-full
                                            px-4
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


                                {/* EMAIL */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                        Email
                                    </label>


                                    <input
                                        type="email"
                                        value={
                                            profile.email
                                        }
                                        disabled
                                        className="
                                            w-full
                                            px-4
                                            py-3
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            text-slate-500
                                            cursor-not-allowed
                                        "
                                    />


                                    <p className="
                                        text-xs
                                        text-slate-400
                                        mt-1
                                    ">
                                        Email cannot be changed here.
                                    </p>

                                </div>


                                {/* PHONE */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                        Phone
                                    </label>


                                    <input
                                        type="text"
                                        name="phone"
                                        value={
                                            profile.phone
                                        }
                                        onChange={
                                            handleProfileChange
                                        }
                                        placeholder="Enter phone number"
                                        className="
                                            w-full
                                            px-4
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

                            </div>


                            {/* SAVE */}

                            <div className="
                                flex
                                justify-end
                                mt-6
                            ">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-emerald-600
                                        text-white
                                        font-medium
                                        hover:bg-emerald-700
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                        transition
                                    "
                                >

                                    <Save size={17} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>


                    {/* =================================
                        CHANGE PASSWORD
                    ================================= */}

                    <div className="
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        p-6
                    ">


                        {/* HEADER */}

                        <div className="
                            flex
                            items-center
                            gap-3
                            mb-6
                        ">

                            <div className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-50
                                flex
                                items-center
                                justify-center
                            ">

                                <Lock
                                    size={20}
                                    className="
                                        text-blue-600
                                    "
                                />

                            </div>


                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-slate-900
                                ">
                                    Change Password
                                </h2>


                                <p className="
                                    text-sm
                                    text-slate-500
                                ">
                                    Keep your admin account secure
                                </p>

                            </div>

                        </div>


                        {/* PASSWORD FORM */}

                        <form
                            onSubmit={
                                handleChangePassword
                            }
                        >

                            <div className="
                                grid
                                grid-cols-1
                                gap-5
                            ">


                                {/* CURRENT PASSWORD */}

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    ">
                                        Current Password
                                    </label>


                                    <PasswordInput
                                        name="oldPassword"
                                        placeholder="Enter current password"
                                        value={
                                            passwords.oldPassword
                                        }
                                        show={
                                            showOldPassword
                                        }
                                        setShow={
                                            setShowOldPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                    />

                                </div>


                                {/* NEW + CONFIRM */}

                                <div className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-5
                                ">


                                    {/* NEW PASSWORD */}

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        ">
                                            New Password
                                        </label>


                                        <PasswordInput
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            value={
                                                passwords.newPassword
                                            }
                                            show={
                                                showNewPassword
                                            }
                                            setShow={
                                                setShowNewPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                        />

                                    </div>


                                    {/* CONFIRM PASSWORD */}

                                    <div>

                                        <label className="
                                            block
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            mb-2
                                        ">
                                            Confirm New Password
                                        </label>


                                        <PasswordInput
                                            name="confirmPassword"
                                            placeholder="Confirm new password"
                                            value={
                                                passwords.confirmPassword
                                            }
                                            show={
                                                showConfirmPassword
                                            }
                                            setShow={
                                                setShowConfirmPassword
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* CHANGE PASSWORD BUTTON */}

                            <div className="
                                flex
                                justify-end
                                mt-6
                            ">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-5
                                        py-3
                                        rounded-xl
                                        bg-slate-900
                                        text-white
                                        font-medium
                                        hover:bg-slate-800
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                        transition
                                    "
                                >

                                    <Lock size={17} />

                                    {saving
                                        ? "Updating..."
                                        : "Change Password"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default Settings;