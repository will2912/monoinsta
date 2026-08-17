"use client";

import { Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type RatingSliderProps = {
  initialRating?: number | null;
  averageRating?: number;
  onRatingChange?: (rating: number) => void;
};

export default function RatingSlider({
  initialRating,
  averageRating ,
  onRatingChange,
}: RatingSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(
    initialRating
  );
  const [previewRating, setPreviewRating] = useState(
    initialRating ?? 5
  );

  function calculateRating(clientY: number) {
    const slider = sliderRef.current;

    if (!slider) return;

    const rect = slider.getBoundingClientRect();

    // Distance of pointer from the top of slider
    const pointerPosition = clientY - rect.top;

    // Convert pointer position into a value between 0 and 1
    const percentage = pointerPosition / rect.height;

    // Top should be 10 and bottom should be 1
    const rating = 10 - Math.floor(percentage * 10);

    // Protect value so it always remains between 1 and 10
    const safeRating = Math.min(10, Math.max(1, rating));

    setPreviewRating(safeRating);
  }

  function handlePointerDown(
  event: React.PointerEvent<HTMLButtonElement>
) {
  event.preventDefault();

  setPreviewRating(selectedRating ?? 5);
  setIsOpen(true);

  event.currentTarget.setPointerCapture(event.pointerId);
}


  function handlePointerMove(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    if (!isOpen) return;

    calculateRating(event.clientY);
  }

  function handlePointerUp(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    if (!isOpen) return;

    setSelectedRating(previewRating);
    setIsOpen(false);

    onRatingChange?.(previewRating);

    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleNumberClick(rating: number) {
    setPreviewRating(rating);
    setSelectedRating(rating);
    setIsOpen(false);

    onRatingChange?.(rating);
  }

  useEffect(() => {
  setSelectedRating(initialRating);
  setPreviewRating(initialRating ?? 5);
}, [initialRating]);

  return (
    <div className="relative flex flex-col items-center">
      {/* VERTICAL SLIDER */}
      {isOpen && (
  <div
    ref={sliderRef}
    className="
      absolute
      left-1/2
      top-1/2
      z-50
      flex
      h-72
      w-12
      -translate-x-1/2
      -translate-y-[48%]
      flex-col
      items-center
      justify-between
      overflow-hidden
      rounded-full
      border-[3px]
      border-white/70
      bg-transparent
      py-2
      shadow-2xl
      backdrop-blur-[2px]
    "
  >
    {/* COLORED FILL */}
    <div
      className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0
        bg-gradient-to-t
        from-pink-600
        via-red-500
        to-orange-400
        transition-all
        duration-100
      "
      style={{
        height: `${previewRating * 10}%`,
      }}
    />

    {/* NUMBERS */}
    {Array.from({ length: 10 }, (_, index) => {
      const rating = 10 - index;
      const isActive = previewRating === rating;
      const isFilled = rating <= previewRating;

      return (
        <button
          key={rating}
          type="button"
          onClick={() => handleNumberClick(rating)}
          className={`
            relative
            z-10
            flex
            h-6
            w-8
            items-center
            justify-center
            rounded-full
            text-xs
            font-bold
            transition-all
            duration-100
            ${
              isActive
                ? "scale-125 bg-white text-black shadow-lg"
                : isFilled
                  ? "text-white"
                  : "text-white/70"
            }
          `}
        >
          {rating}
        </button>
      );
    })}
  </div>
)}

      {/* MAIN RATING BUTTON */}
      <button
  type="button"
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={() => setIsOpen(false)}
  className={`
    relative flex h-11 w-11 touch-none items-center justify-center
    rounded-full border transition active:scale-90
    ${
      selectedRating !== null
        ? "border-orange-300/80 bg-black/40 shadow-[0_0_12px_rgba(249,115,22,0.45)]"
        : "border-white/30 bg-black/30 hover:bg-black/50"
    }
  `}
  aria-label="Rate this post"
>
  <Star
    size={27}
    className={
      selectedRating !== null
        ? "fill-orange-400 text-orange-400"
        : "text-white"
    }
  />

  {selectedRating !== null && (
    <span
      className="
        absolute -right-1 -top-1
        flex h-5 min-w-5 items-center justify-center
        rounded-full
        bg-gradient-to-br from-pink-500 to-orange-400
        px-1 text-[10px] font-bold text-white
        ring-2 ring-black
      "
    >
      {selectedRating}
    </span>
  )}
</button>

      {/* SCORE UNDER BUTTON */}
      <span className="mt-1 text-xs font-medium text-white">
  {averageRating.toFixed(1)}
</span>
    </div>
  );
}