import ProtectedRoute from "@/app/components/ProtectedRoute";
import "../../(site)/globals.css";
import DashboardLayout from "../../components/layout/DashboardLayout";

const navigation = [
  { name: "Dashboard", href: "/student", icon: "Home" },
  { name: "Book Session", href: "/student/book-session", icon: "Calendar" },
  // {
  //   name: "Book Counselor",
  //   href: "/student/book-counselor",
  //   icon: "ChatBubbleLeft",
  // },
  { name: "My Sessions", href: "/student/my-sessions", icon: "DocumentText" },
  // { name: "Meetings", href: "/student/meetings", icon: "VideoCamera" },
  // { name: "Find Tutors", href: "/student/find-tutor", icon: "AcademicCap" },
  { name: "Messages", href: "/student/messages", icon: "ChatBubbleLeft" },
  // {
  //   name: "AI Conversations",
  //   href: "/student/ai-conversations",
  //   icon: "SparklesIcon",
  // },
  { name: "Notifications", href: "/student/notifications", icon: "BellIcon" },
  // { name: "My Progress", href: "/student/progress", icon: "ChartBar" },
  { name: "Billing", href: "/student/billing", icon: "CreditCard" },
  { name: "Profile", href: "/student/profile", icon: "User" },
  { name: "Support", href: "/student/support", icon: "QuestionMarkCircle" },
];

export default function StudentLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout navigation={navigation} userRole="Student">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
