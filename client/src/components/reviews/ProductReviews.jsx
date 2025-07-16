"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/lib/axiosInstance";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import { ReviewPagination } from "./ReviewPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import WriteReviewDialog from "./WriteReviewDialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";

const REVIEWS_PER_PAGE = 5;

export default function ProductReviews({ productId, productRating }) {
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userReview, setUserReview] = useState(null);
  const [hasCheckedReview, setHasCheckedReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest"); // 'latest' or 'helpful'
  const [currentRatingSummary, setCurrentRatingSummary] =
    useState(productRating);

  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    setCurrentRatingSummary(productRating);
  }, [productRating]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        // Fetch all public reviews
        const reviewsPromise = api.get(`/products/${productId}/reviews`);

        // If logged in, check for the user's own review
        const userReviewPromise = isLoggedIn
          ? api.get(`/products/${productId}/reviews/my-review`)
          : Promise.resolve(null);

        const [reviewsResponse, userReviewResponse] = await Promise.all([
          reviewsPromise,
          userReviewPromise,
        ]);

        setAllReviews(reviewsResponse.data.data);
        if (userReviewResponse && userReviewResponse.data.hasReview) {
          setUserReview(userReviewResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews data:", error);
      } finally {
        setIsLoading(false);
        setHasCheckedReview(true);
      }
    };
    if (productId) {
      fetchAllData();
    }
  }, [productId, isLoggedIn]);

  // Filter reviews with comments
  const reviewsWithComments = useMemo(() => {
    return allReviews.filter(
      (review) => review.comment && review.comment.trim() !== ""
    );
  }, [allReviews]);

  const sortedReviews = useMemo(() => {
    return [...reviewsWithComments].sort((a, b) => {
      if (sortBy === "helpful") {
        return b.likes.length - a.likes.length;
      }
      // Default to 'latest'
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [reviewsWithComments, sortBy]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  }, [sortedReviews, currentPage]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);

  const handleReviewSubmitted = (responsePayload) => {
    const submittedReview = responsePayload.review;
    const newRating = responsePayload.updatedProductRating;

    setUserReview(submittedReview);
    const existingIndex = allReviews.findIndex(
      (r) => r._id === submittedReview._id
    );
    if (existingIndex > -1) {
      const updatedReviews = [...allReviews];
      updatedReviews[existingIndex] = submittedReview;
      setAllReviews(updatedReviews);
    } else {
      setAllReviews([submittedReview, ...allReviews]);
    }

    if (newRating) {
      setCurrentRatingSummary(newRating);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const { data } = await api.patch(
        `/products/${productId}/reviews/${reviewId}/like`
      );
      setAllReviews((currentReviews) =>
        currentReviews.map((r) => (r._id === reviewId ? data.data : r))
      );
    } catch (error) {
      console.error("Failed to like review:", error);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      const response = await api.delete(
        `/products/${productId}/reviews/${userReview._id}`
      );

      if (response.data.data.updatedProductRating) {
        setCurrentRatingSummary(response.data.data.updatedProductRating);
      }

      setAllReviews((currentReviews) =>
        currentReviews.filter((r) => r._id !== userReview._id)
      );

      setUserReview(null);

      toast.success("Your review has been deleted.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete review.";
      toast.error(errorMessage);
    }
  };

  const renderReviewButton = () => {
    if (!hasCheckedReview) return null;

    if (!isLoggedIn) {
      return (
        <p className="text-sm text-gray-500">
          Please log in to write a review.
        </p>
      );
    }

    if (userReview) {
      return (
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open review actions</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <div className="flex flex-col">
                {/* Edit Review Option */}
                <WriteReviewDialog
                  productId={productId}
                  onReviewSubmitted={handleReviewSubmitted}
                  existingReview={userReview}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none"
                  >
                    Edit Your Review
                  </Button>
                </WriteReviewDialog>

                {/* Delete Review Option */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete Your Review
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your review and remove your data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteReview}
                        className="bg-[#AF0000] hover:bg-[#730000] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    } else {
      return (
        <WriteReviewDialog
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
          existingReview={null}
        >
          <Button variant="outline" className="ml-auto w-44">
            Write a Review
          </Button>
        </WriteReviewDialog>
      );
    }
  };

  return (
    <section className="w-full pt-8 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-16">
        {/* Left Side: Reviews List */}
        <div className="md:col-span-2 ">
          <div className="border rounded-md px-6 py-4 mb-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Reviews ({reviewsWithComments.length} total)
              </h2>
              <Select onValueChange={setSortBy} defaultValue="latest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Review submission section */}
            <div className="flex justify-end gap-8 items-center p-1 ">
              {userReview ? (
                <div>
                  <p className="text-sm text-gray-700">
                    You have rated this product with{" "}
                    <span className="text-yellow-400">{userReview.rating}</span>{" "}
                    stars
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  You haven't rated this product yet
                </p>
              )}
              {renderReviewButton()}
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <p>Loading reviews...</p>
            ) : paginatedReviews.length > 0 ? (
              <>
                {paginatedReviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onLike={handleLike}
                  />
                ))}
                <ReviewPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <p className="text-gray-500 pt-4">
                No reviews yet. Be the first to write one!
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Rating Summary */}
        <div className="md:col-span-1 mt-8 md:mt-0">
          <RatingSummary key={userReview} rating={currentRatingSummary} />
        </div>
      </div>
    </section>
  );
}
