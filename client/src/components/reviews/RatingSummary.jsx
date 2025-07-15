import { Star, StarHalf, StarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function RatingSummary({ rating }) {
  if (!rating || rating.count === 0) {
    return (
      <div className="p-6 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-lg mb-2">Customer Reviews</h3>
        <p className="text-sm text-gray-500">No reviews available.</p>
      </div>
    );
  }

  const totalReviews = rating.count;
  const ratingDistribution = [
    { star: 5, count: rating["5"] || 0 },
    { star: 4, count: rating["4"] || 0 },
    { star: 3, count: rating["3"] || 0 },
    { star: 2, count: rating["2"] || 0 },
    { star: 1, count: rating["1"] || 0 },
  ];

  const averageRating = parseFloat(rating.average.toFixed(1));
  const numFullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const starPosition = i + 1; // 1st, 2nd, 3rd, 4th, 5th star

            if (starPosition < numFullStars) {
              // Render full yellow star
              return (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              );
            } else if (starPosition === numFullStars && hasHalfStar) {
              // Render half yellow star
              return (
                <StarHalf
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              );
            } else {
              // Render empty gray star
              return <Star key={i} className="h-5 w-5 text-gray-300" />;
            }
          })}
        </div>
        <span className="text-3xl font-bold">{rating.average.toFixed(1)}</span>
      </div>
      <div className="space-y-2">
        {ratingDistribution.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-4 text-sm">
            <span className="w-4 text-center font-medium">{star}</span>
            <Progress
              value={(count / totalReviews) * 100}
              className="h-2 flex-1"
            />
            <span className="w-8 text-right text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
