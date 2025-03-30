import { motion, AnimatePresence } from "framer-motion";
import img1 from "@assets/images/img-home/intro-section-home-1.jpg";
import img2 from "@assets/images/img-home/intro-section-home-2.jpg";
import img3 from "@assets/images/img-home/intro-section-home-3.jpg";

const images = [img1, img2, img3];

interface ImageSliderProps {
  currentImageIndex: number;
  handleNextImage: () => void;
}

export default function ImageSlider({
  currentImageIndex,
  handleNextImage,
}: ImageSliderProps) {
  return (
    <figure
      className="relative flex justify-center items-center w-full h-full cursor-pointer"
      onClick={handleNextImage}
    >
      <AnimatePresence mode="wait">
        <motion.img
          src={images[currentImageIndex]}
          className="object-cover h-[90%] w-[90%] rounded-3xl shadow-lg"
          key={currentImageIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="absolute bottom-15 right-15 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all bg-white ${
              index === currentImageIndex ? "w-6" : "w-2"
            }`}
          ></span>
        ))}
      </div>
    </figure>
  );
}
