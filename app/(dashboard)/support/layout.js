import ProtectedRoute from "@/app/components/ProtectedRoute";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Support navigation items
const navigation = [
  { name: "Dashboard", href: "/student", icon: "Home" },
  { name: "Support", href: "/support", icon: "QuestionMarkCircle" },
];

export default function SupportLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["student", "tutor", "counselor", "admin"]}>
      <DashboardLayout navigation={navigation} userRole="Support">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
