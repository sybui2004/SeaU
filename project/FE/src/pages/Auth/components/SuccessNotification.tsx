import { useEffect } from "react";
import { motion } from "framer-motion";
import iconTick from "@assets/images/icon-tick.png";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

export default function SuccessNotification({
  message,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 bg-blue-100 border-l-4 border-blue-200 text-blue-500 p-4 rounded shadow-md transition-all duration-500 z-50"
    >
      <div className="flex items-center">
        <div className="py-1">
          <img src={iconTick} alt="Success" className="w-8 mr-2" />
        </div>
        <div>
          <p className="font-bold">Success!</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
