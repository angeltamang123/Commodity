import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarIcon, ThumbsUpIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

export default function ReviewCard({ review, onLike }) {
  const { user } = review;
  const { userId: currentUserId, isLoggedIn } = useSelector(
    (state) => state.persisted.user
  );

  const isLikedByCurrentUser = review.likes.includes(currentUserId);

  return (
    <div className="flex gap-4 border-b pb-4">
      <Avatar>
        <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between ">
          <h4 className="font-semibold">{user.fullName}</h4>
          <span className="text-sm font-semibold text-gray-500 mr-6">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "h-4 w-4",
                i < review.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
        <p className="text-gray-700 mt-4 text-sm">{review.comment}</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto -ml-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
              onClick={() => onLike(review._id)}
              disabled={!isLoggedIn}
            >
              <ThumbsUpIcon
                className={cn(
                  "h-4 w-4",
                  isLikedByCurrentUser && "fill-[#AF0000] text-[#111B25]"
                )}
              />
            </Button>
            <span className="text-xs text-gray-600">
              {review.likes.length}{" "}
              {review.likes.length > 1
                ? "people found this helpful"
                : review.likes.length === 1
                ? "person found this helpful"
                : null}{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
