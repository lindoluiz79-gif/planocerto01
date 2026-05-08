import { Star } from "lucide-react";

export function StarRating({ 
  rating, 
  reviewCount,
  size = "md" 
}: { 
  rating: number; 
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className={`${textSizeClasses[size]} text-muted-foreground ml-1`}>
        {rating.toFixed(1)}
        {reviewCount && ` (${reviewCount})`}
      </span>
    </div>
  );
}
