"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  StarIcon,
  StarHalf,
  ShoppingCartIcon,
  Share2Icon,
  HeartIcon,
  Star,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import ShareLinkDialog from "./shareLinkDialog";
import { useDispatch, useSelector } from "react-redux";
import LoginAlert from "./loginAlert";
import { toast } from "sonner";
import axios from "axios";
import {
  addToWishList,
  removeFromWishList,
} from "@/redux/reducerSlices/userSlice";
import api from "@/lib/axiosInstance";
import ProductReviews from "../reviews/ProductReviews";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetail({ product }) {
  const pathname = usePathname();
  const isAdminPath = pathname.includes("/admin/inventory");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(product.price);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullUrl, setFullUrl] = useState("");
  const [loginDialog, setLoginDialog] = useState(false);
  const [inWishList, setInWishList] = useState(false);

  const { isLoggedIn, wishlist, userId } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  let averageRating;
  let numFullStars;
  let hasHalfStar;
  if (product.rating.average) {
    averageRating = parseFloat(product?.rating?.average.toFixed(1));
    numFullStars = Math.floor(averageRating);
    hasHalfStar = averageRating % 1 !== 0;
  }

  // Array of all images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  useEffect(() => {
    // Determine the price to display based on discount
    if (
      product.discountPrice !== null &&
      product.discountPrice !== undefined &&
      new Date(product.discountTill) > new Date()
    ) {
      setDisplayPrice(product.discountPrice);
    } else {
      setDisplayPrice(product.price);
    }
    // Check if product is in wishlist
    if (wishlist.includes(product._id)) {
      setInWishList(true);
    }
  }, [product.price, product.discountPrice, product.discountTill]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.origin + pathname);
    }
  }, [pathname]);

  // Placeholder for add to cart / buy item logic
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setLoginDialog(true);
      return;
    }
    console.log("Added to cart:", product.name, selectedColor, selectedSize);
    // Implement actual add to cart logic here
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setLoginDialog(true);
      return;
    }
    console.log("Buying item:", product.name, selectedColor, selectedSize);
    // Implement actual buy now logic here
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      setLoginDialog(true);
      return;
    }
    try {
      if (inWishList) {
        await api.patch(`/user/${userId}/remove-wishlist`, {
          product: product._id,
        });
        dispatch(removeFromWishList(product._id));
        setInWishList(false);
        toast.success("Item removed from Wishlist");
      } else {
        await api.patch(`/user/${userId}/add-wishlist`, {
          product: product._id,
        });
        dispatch(addToWishList(product._id));
        setInWishList(true);
        toast.success("Item added to Wishlist");
      }
    } catch (error) {
      toast.error(`Error with Wishlist: ${error.message}`);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Check if product is available (active and in stock)
  const isProductAvailable = product.status === "active" && product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid lg:grid-cols-2 ">
        {/* Product Images */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative bg-gray-200 overflow-hidden max-w-lg mx-auto lg:mx-0">
            <Image
              src={`${API_BASE_URL}/uploads/${allImages[currentImageIndex]}`}
              alt={product.name}
              style={{ objectFit: "contain" }}
              width={600}
              height={300}
              className="p-3 w-[600px] h-[300px]"
              priority
            />
          </div>

          {/* Thumbnail Carousel */}
          {allImages.length > 1 && (
            <div className="w-full max-w-lg mx-auto lg:mx-0">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-1 md:-ml-2">
                  {allImages.map((imgSrc, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-1 md:pl-2 basis-1/3 lg:basis-1/4"
                    >
                      <div
                        className={cn(
                          "relative aspect-square bg-gray-50 rounded-md overflow-hidden border-2 cursor-pointer transition-all hover:border-[#730000]",
                          currentImageIndex === index
                            ? "border-[#AF0000]"
                            : "border-gray-200"
                        )}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <Image
                          src={`${API_BASE_URL}/uploads/${imgSrc}`}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          style={{ objectFit: "contain" }}
                          className="p-1"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 opacity-30 hover:opacity-100 hover:border-[#111B25]" />
                <CarouselNext className="right-1 opacity-30 hover:opacity-100 hover:border-[#111B25]" />
              </Carousel>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111B25] mb-2">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {product.rating.average !== null &&
            product.rating.average !== undefined &&
            product.rating.average > 0 ? (
              <>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starPosition = i + 1; // 1st, 2nd, 3rd, 4th, 5th star

                    if (starPosition <= numFullStars) {
                      // Render full yellow star
                      return (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                        />
                      );
                    } else if (
                      starPosition === numFullStars + 1 &&
                      hasHalfStar
                    ) {
                      // Render half yellow star
                      return (
                        <StarHalf
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                        />
                      );
                    } else {
                      // Render empty gray star
                      return <Star key={i} className="h-4 w-4 text-gray-300" />;
                    }
                  })}
                </div>
                <span className="text-sm text-gray-600">
                  {product?.rating?.average.toFixed(1)} (
                  {product.rating.count > 1
                    ? `${product.rating.count} reviews`
                    : `${product.rating.count} review`}
                  )
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No ratings yet.</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold text-[#111B25]">
              NPR {displayPrice.toLocaleString()}
            </span>
            {product.discountPrice !== null &&
              product.discountPrice !== undefined &&
              new Date(product.discountTill) > new Date() && (
                <span className="text-lg md:text-xl text-[#730000] line-through">
                  NPR {product.price.toLocaleString()}
                </span>
              )}
          </div>

          {/* Color Selection (visible only for 'Clothing' category) */}
          {product.category === "Clothing" &&
            product.colors &&
            product.colors.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-[#111B25] mb-2">
                  Color: {selectedColor || "Select a color"}
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110",
                        selectedColor === color
                          ? "border-[#AF0000] ring-2 ring-[#AF0000] ring-offset-1"
                          : "border-gray-300 hover:border-gray-500"
                      )}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Size Selection (visible only for 'Clothing' category) */}
          {product.category === "Clothing" &&
            product.sizes &&
            product.sizes.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-[#111B25] mb-2">
                  Size: {selectedSize || "Select a size"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge
                      key={size}
                      className={cn(
                        "px-3 py-1 text-sm font-medium cursor-pointer transition-colors",
                        selectedSize === size
                          ? "bg-[#AF0000] text-white hover:bg-[#730000]"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      )}
                      onClick={() => setSelectedSize(size)}
                      variant="secondary"
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-[#111B25]">
              Availability:
            </span>
            {isProductAvailable ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">
                In Stock ({product.stock})
              </Badge>
            ) : product.stock > 0 && product.status === "inactive" ? (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                Inactive (Stock: {product.stock})
              </Badge>
            ) : (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Action Buttons (Visible only for non-admin paths) */}
          {!isAdminPath && (
            <div className="space-y-3 pt-4">
              <div className="flex flex-col gap-3">
                <Button
                  className="flex-1 border rounded-lg border-[#AF0000] bg-white hover:bg-[#111B25] hover:border-[#111B25]  hover:text-white text-[#AF0000] py-2.5 font-semibold transition-colors"
                  onClick={handleAddToCart}
                  disabled={!isProductAvailable}
                >
                  <ShoppingCartIcon className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  className="flex-1 rounded-lg bg-[#AF0000] hover:bg-[#730000] text-white py-2.5 font-semibold transition-colors"
                  onClick={handleBuyNow}
                  disabled={!isProductAvailable}
                >
                  Buy this Item
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 h-10 border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-[#730000] transition-colors bg-transparent ${
                    inWishList && "text-[#AF0000]"
                  }`}
                  onClick={handleWishlist}
                >
                  <HeartIcon
                    className={`h-4 w-4 mr-1 ${inWishList && "fill-[#AF0000]"}`}
                  />
                  Wishlist
                </Button>
                <ShareLinkDialog urlToShare={fullUrl}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-[#730000] transition-colors bg-transparent"
                  >
                    <Share2Icon className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </ShareLinkDialog>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isAdminPath && (
        <div className="mt-12 md:mt-16">
          <ProductReviews
            productId={product._id}
            productRating={product.rating}
          />
        </div>
      )}

      <LoginAlert
        open={loginDialog}
        onOpenChange={setLoginDialog}
        from={pathname}
      />
    </div>
  );
}
