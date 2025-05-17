import { FC } from "react";

type ActiveView =
  | "dashboard"
  | "users"
  | "posts"
  | "conversations"
  | "comments";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const Sidebar: FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "User", icon: "👥" },
    { id: "posts", label: "Post", icon: "📝" },
    { id: "conversations", label: "Conversation", icon: "💬" },
    { id: "comments", label: "Comment", icon: "💭" },
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-[#1CA7EC] to-[#4ADEDE] text-white shadow-lg w-full">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <nav className="mt-5">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center px-6 py-4 cursor-pointer transition-colors ${
              activeView === item.id
                ? "bg-[#117bb1] border-l-4 border-white"
                : "hover:bg-[#1ca7ec]"
            }`}
            onClick={() => setActiveView(item.id as ActiveView)}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
