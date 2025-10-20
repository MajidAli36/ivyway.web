import ProtectedRoute from "@/app/components/ProtectedRoute";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Teacher-specific navigation items
const navigation = [
  { name: "Dashboard", href: "/teacher", icon: "Home" },
  { name: "My Students", href: "/teacher/students", icon: "User" },
  // { name: "Refer Student", href: "/teacher/refer-student", icon: "UserPlus" },
  {
    name: "Assignments",
    href: "/teacher/assignments",
    icon: "ClipboardDocumentList",
  },
  {
    name: "Progress Reports",
    href: "/teacher/progress-reports",
    icon: "ChartBar",
  },
  {
    name: "Available Providers",
    href: "/teacher/providers",
    icon: "UserGroup",
  },
  { name: "Messages", href: "/teacher/messages", icon: "ChatBubbleLeft" },
  {
    name: "AI Conversations",
    href: "/teacher/ai-conversations",
    icon: "SparklesIcon",
  },
  { name: "Profile", href: "/teacher/profile", icon: "User" },
  {
    name: "Notifications",
    href: "/teacher/notifications",
    icon: "BellIcon",
  },
  { name: "Support", href: "/teacher/support", icon: "QuestionMarkCircle" },
];

export default function TeacherLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout navigation={navigation} userRole="Teacher">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
