import ProtectedRoute from "@/app/components/ProtectedRoute";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Tutor-specific navigation items
const navigation = [
  { name: "Dashboard", href: "/tutor", icon: "Home" },
  { name: "Student Requests", href: "/tutor/requests", icon: "InboxArrowDown" },
  { name: "Schedule", href: "/tutor/schedule/availability", icon: "Calendar" },
  { name: "Sessions", href: "/tutor/sessions", icon: "AcademicCap" },
  // { name: "My Students", href: "/tutor/students", icon: "User" },
  // { name: "Session Reports", href: "/tutor/reports", icon: "DocumentText" },
  { name: "Messages", href: "/tutor/messages", icon: "ChatBubbleLeft" },
  // {
  //   name: "AI Conversations",
  //   href: "/tutor/ai-conversations",
  //   icon: "SparklesIcon",
  // },
  { name: "Upgrade", href: "/tutor/upgrade", icon: "ArrowUpCircle" },
  { name: "Earnings", href: "/tutor/earnings", icon: "CreditCard" },
  { name: "Profile", href: "/tutor/profile", icon: "User" },
  {
    name: "Notifications",
    href: "/tutor/notifications",
    icon: "BellIcon",
  },
  { name: "Support", href: "/tutor/support", icon: "QuestionMarkCircle" },
];

export default function TutorLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["tutor"]}>
      <DashboardLayout navigation={navigation} userRole="Tutor">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
