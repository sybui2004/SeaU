import { useState } from "react";
interface PostContentProps {
  text: string;
  maxLength?: number;
}
function PostContent({ text, maxLength = 200 }: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="self-start mt-2 text-sm leading-relaxed text-black font-normal">
      {isExpanded ? text : text.slice(0, maxLength)}
      {text.length > maxLength && (
        <span
          onClick={toggleExpand}
          className="text-black font-bold cursor-pointer ml-1"
        >
          {isExpanded ? " Show less" : "...more"}
        </span>
      )}
    </div>
  );
}
export default PostContent;
