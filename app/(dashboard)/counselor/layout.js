import ProtectedRoute from "@/app/components/ProtectedRoute";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  BellIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

// Focused navigation items based on counselor requirements
const navigation = [
  { name: "Dashboard", href: "/counselor", icon: "Home" },
  {
    name: "Availability",
    href: "/counselor/availability",
    icon: "Calendar",
  },
  {
    name: "Requests",
    href: "/counselor/requests",
    icon: "ClipboardDocumentList",
  },
  {
    name: "Sessions",
    href: "/counselor/sessions",
    icon: "Calendar",
  },
  // {
  //   name: "Meetings",
  //   href: "/counselor/meetings",
  //   icon: "VideoCamera",
  // },
  // {
  //   name: "Offer Guidance",
  //   href: "/counselor/guidance",
  //   icon: "ChatBubbleLeft",
  // },
  {
    name: "Messages",
    href: "/counselor/messages",
    icon: "ChatBubbleLeft",
  },
  // {
  //   name: "AI Conversations",
  //   href: "/counselor/ai-conversations",
  //   icon: "SparklesIcon",
  // },
  {
    name: "Earnings",
    href: "/counselor/earnings",
    icon: "CurrencyDollarIcon",
  },
  {
    name: "Profile",
    href: "/counselor/profile",
    icon: "UserCircleIcon",
  },
  {
    name: "Notifications",
    href: "/counselor/notifications",
    icon: "BellIcon",
  },
  { name: "Support", href: "/counselor/support", icon: "QuestionMarkCircle" },
];

// Icon map for client-side rendering
const iconMap = {
  BellIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  // ...other icons
};

export default function CounselorLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["counselor"]}>
      <DashboardLayout navigation={navigation} userRole="Counselor">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
