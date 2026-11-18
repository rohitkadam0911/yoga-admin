import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";

import AdminLayout from "./components/layout/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Instructors from "./pages/admin/Instructors";
import Classes from "./pages/admin/Classes";
import ClassSessions from "./pages/admin/ClassSessions";
import Bookings from "./pages/admin/Bookings";
import Payments from "./pages/admin/Payments";
import Blogs from "./pages/admin/Blogs";
import Settings from "./pages/admin/Settings"

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ADMIN LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* ADMIN DASHBOARD */}
                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="users"
                        element={<Users />}
                    />

                    <Route
                        path="instructors"
                        element={<Instructors />}
                    />

                    <Route
                        path="classes"
                        element={<Classes />}
                    />

                    <Route
                        path="class-sessions"
                        element={<ClassSessions />}
                    />

                    <Route
                        path="bookings"
                        element={<Bookings />}
                    />

                    <Route
                        path="payments"
                        element={<Payments />}
                    />

                    <Route
                        path="blogs"
                        element={<Blogs />}
                    />

                    <Route
                        path="settings"
                        element={<Settings />}
                    />
                </Route>

                {/* DEFAULT */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* UNKNOWN ROUTES */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;