import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRate?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
}

const ratingLabels = {
  1: "Muy malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
}

export function StarRating({ rating, onRate, readonly = false, size = "md", showLabels = false }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readonly && onRate?.(star)}
            disabled={readonly}
            className={cn(
              "transition-all duration-200",
              !readonly && "hover:scale-110 cursor-pointer active:scale-95",
              readonly && "cursor-default",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : readonly
                    ? "fill-gray-200 text-gray-200"
                    : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200",
                !readonly && "transition-colors duration-200",
              )}
            />
          </button>
        ))}
      </div>

      {showLabels && rating > 0 && (
        <span className="text-sm font-medium text-gray-700">{ratingLabels[rating as keyof typeof ratingLabels]}</span>
      )}
    </div>
  )
}
