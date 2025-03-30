import { useState } from "react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";
import searchIcon from "@assets/images/icon-search.png";

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex gap-10 pl-4 w-full h-[90px] text-xl whitespace-nowrap bg-white shadow-sm max-md:px-5 max-md:max-w-full sticky top-0 z-1">
      <div
        className="flex items-center justify-center font-bold text-zinc-900 text-2xl tracking-tight cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Home
      </div>
      <div className="flex items-center justify-center w-full max-w-[80%]">
        <div
          className={`flex overflow-hidden items-center w-full h-12 gap-2 px-8 py-2.5 leading-none rounded-3xl border border-solid bg-zinc-100 transition-all duration-300 ${
            isHovered ? "border-[#1CA7EC] shadow-md" : "border-transparent"
          } text-zinc-900 max-md:px-5 max-md:max-w-full`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow bg-transparent outline-none"
          />
          <Button variant={"ghost"} className="-mr-4">
            <img
              src={searchIcon}
              className={`object-contain shrink-0 w-[32px] transition-transform duration-300 ${
                isHovered ? "scale-110" : ""
              }`}
              alt="Search icon"
            />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <NotificationBell></NotificationBell>
      </div>
    </div>
  );
};

export default Header;
