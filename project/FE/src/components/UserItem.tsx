import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface UserType {
  _id: string;
  fullname: string;
  profilePic?: string;
  occupation?: string;
  [key: string]: any;
}

interface UserItemProps {
  user: UserType;
  serverPublic: string;
  buttonText?: string;
}

const UserItem = ({
  user,
  serverPublic,
  buttonText = "View Profile",
}: UserItemProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center hover:bg-gray-50 transition-colors">
      <img
        src={
          user.profilePic
            ? `${serverPublic}${user.profilePic}`
            : `${serverPublic}defaultProfile.png`
        }
        alt={user.fullname}
        className="w-14 h-14 rounded-full object-cover mr-4"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `${serverPublic}defaultProfile.png`;
        }}
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{user.fullname}</h3>
        <p className="text-sm text-gray-500">
          {user.occupation || "No occupation"}
        </p>
      </div>
      <Button
        variant="outline"
        className="border-blue-500 text-blue-500 hover:bg-blue-50"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default UserItem;
