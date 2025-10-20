import DashboardLayout from "../../components/layout/DashboardLayout";

// Admin-specific navigation items
const navigation = [
  { name: "Dashboard", href: "/admin", icon: "Home" },
  { name: "Teachers", href: "/admin/teachers", icon: "UserGroup" },
  { name: "Users", href: "/admin/users", icon: "User" },
  { name: "Waitlist", href: "/admin/waitlist", icon: "User" },
  { name: "Sessions", href: "/admin/sessions", icon: "Calendar" },
  {
    name: "Tutor Upgrades",
    href: "/admin/tutor-upgrades",
    icon: "ArrowUpCircle",
  },
  // {
  //   name: "Track Performance",
  //   href: "/admin/performance",
  //   icon: "TrackPerformance",
  // },
  { name: "Plans", href: "/admin/plans", icon: "CreditCard" },
  { name: "Payments", href: "/admin/payments", icon: "CreditCard" },
  // { name: "Messages", href: "/student/messages", icon: "ChatBubbleLeft" },
];

export default function AdminLayout({ children }) {
  return (
    <DashboardLayout navigation={navigation} userRole="Administrator">
      {children}
    </DashboardLayout>
  );
}
