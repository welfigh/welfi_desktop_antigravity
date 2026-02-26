import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { InvestmentsPage } from "../pages/InvestmentsPage";
import { MovementsPage } from "../pages/MovementsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { StrategiesPage } from "../pages/StrategiesPage";
import { ThematicPacksPage } from "../pages/ThematicPacksPage";
import { InvestmentDetailPage } from "../pages/InvestmentDetailPage";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

// Wrapper for protected routes
function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Wrapper for public routes (redirects to home if already logged in)
function PublicRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default function AppRouter() {
    const router = createBrowserRouter([
        {
            path: "/login",
            element: (
                <PublicRoute>
                    <LoginPage />
                </PublicRoute>
            ),
        },
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
                {
                    path: "investments",
                    children: [
                        { index: true, element: <InvestmentsPage /> },
                        { path: ":id", element: <InvestmentDetailPage /> }
                    ]
                },
                {
                    path: "strategies",
                    element: <StrategiesPage />,
                },
                {
                    path: "packs",
                    element: <ThematicPacksPage />,
                },
                {
                    path: "movements",
                    element: <MovementsPage />,
                },
                {
                    path: "settings",
                    element: <SettingsPage />
                }
            ],
        },
        {
            path: "*",
            element: <Navigate to="/" replace />
        }
    ]);

    return <RouterProvider router={router} />;
}
