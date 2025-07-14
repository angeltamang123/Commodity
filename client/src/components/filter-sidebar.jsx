"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "./ui/button";

const SLIDER_MAX_VISUAL_VALUE = 1000; // Internal linear scale for the slider
const LOW_PRICE_THRESHOLD = 100000; // The price point where the sensitivity changes
const LOW_PRICE_SLIDER_PERCENTAGE = 0.7; // The percentage of the slider's visual range for low prices

// Calculate the corresponding slider value for the low price threshold
const LOW_PRICE_SLIDER_VALUE =
  SLIDER_MAX_VISUAL_VALUE * LOW_PRICE_SLIDER_PERCENTAGE;

// Function to convert a linear slider value (0-SLIDER_MAX_VISUAL_VALUE) to a non-linear price
const sliderValueToPrice = (sliderValue) => {
  if (sliderValue <= LOW_PRICE_SLIDER_VALUE) {
    // Linear scale for low prices
    return (sliderValue / LOW_PRICE_SLIDER_VALUE) * LOW_PRICE_THRESHOLD;
  } else {
    // Linear scale for high prices (from LOW_PRICE_THRESHOLD to MAX_PRICE)
    const highSliderRange = SLIDER_MAX_VISUAL_VALUE - LOW_PRICE_SLIDER_VALUE;
    const highPriceRange = 10000000 - LOW_PRICE_THRESHOLD; // Max price is 10,000,000
    const sliderProgressInHighRange = sliderValue - LOW_PRICE_SLIDER_VALUE;
    return (
      LOW_PRICE_THRESHOLD +
      (sliderProgressInHighRange / highSliderRange) * highPriceRange
    );
  }
};

// Function to convert a non-linear price to a linear slider value (0-SLIDER_MAX_VISUAL_VALUE)
const priceToSliderValue = (price) => {
  if (price <= LOW_PRICE_THRESHOLD) {
    // Convert low price to linear slider value
    return (price / LOW_PRICE_THRESHOLD) * LOW_PRICE_SLIDER_VALUE;
  } else {
    // Convert high price to linear slider value
    const highSliderRange = SLIDER_MAX_VISUAL_VALUE - LOW_PRICE_SLIDER_VALUE;
    const highPriceRange = 10000000 - LOW_PRICE_THRESHOLD;
    const priceProgressInHighRange = price - LOW_PRICE_THRESHOLD;
    return (
      LOW_PRICE_SLIDER_VALUE +
      (priceProgressInHighRange / highPriceRange) * highSliderRange
    );
  }
};

export function FilterSidebar({ initialSearchParams }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentCategory, setCurrentCategory] = useState(
    initialSearchParams.category || "all"
  );
  const [currentHasDiscount, setCurrentHasDiscount] = useState(
    initialSearchParams.hasDiscount === "true"
  );
  const [currentSearchQuery, setCurrentSearchQuery] = useState(
    initialSearchParams.q || ""
  );

  // Local state for slider
  const [currentSliderValues, setCurrentSliderValues] = useState(() => {
    const minPriceFromUrl = Number(initialSearchParams.minPrice ?? "0");
    const maxPriceFromUrl = Number(initialSearchParams.maxPrice ?? "10000000");
    return [
      priceToSliderValue(minPriceFromUrl),
      priceToSliderValue(maxPriceFromUrl),
    ];
  });

  const createQueryString = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(updates)) {
        if (
          (name === "minPrice" && value === 0) || // If minPrice is 0 (default)
          (name === "maxPrice" && value === 10000000) || // If maxPrice is max default
          (name === "category" && value === "all") || // If category is 'all'
          (name === "hasDiscount" && !value) || // If hasDiscount is false
          value === "" || // General empty string
          value === undefined || // General undefined
          value === null // General null
        ) {
          params.delete(name);
        } else {
          params.set(name, String(value)); // Ensuring value is a string for URL
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleApplyFilters = () => {
    const [minSliderVal, maxSliderVal] = currentSliderValues;
    const minPrice = Math.round(sliderValueToPrice(minSliderVal));
    const maxPrice = Math.round(sliderValueToPrice(maxSliderVal));

    // Build the updates object for createQueryString
    const updates = {
      q: currentSearchQuery,
      category: currentCategory,
      minPrice: minPrice,
      maxPrice: maxPrice,
      hasDiscount: currentHasDiscount ? "true" : "", // "true" or empty string
    };

    router.push("/search?" + createQueryString(updates));
  };

  const formatPrice = (price) => {
    return `NPR ${price.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Query Input */}
        <div className="space-y-2">
          <Label htmlFor="search-query">Search</Label>
          {/* You'll need to import Input from "@/components/ui/input" */}
          <input
            id="search-query"
            type="text"
            placeholder="Search products..."
            value={currentSearchQuery}
            onChange={(e) => setCurrentSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={setCurrentCategory}
            defaultValue={currentCategory}
            value={currentCategory}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Furnitures">Furnitures</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <Slider
            min={0}
            max={SLIDER_MAX_VISUAL_VALUE}
            step={1}
            minStepsBetweenThumbs={10}
            value={currentSliderValues}
            onValueChange={setCurrentSliderValues}
            onValueCommit={setCurrentSliderValues}
            className="py-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {formatPrice(
                Math.round(sliderValueToPrice(currentSliderValues[0]))
              )}
            </span>
            <span>
              {formatPrice(
                Math.round(sliderValueToPrice(currentSliderValues[1]))
              )}
            </span>
          </div>
        </div>

        {/* Discount Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has-discount"
            checked={currentHasDiscount}
            onCheckedChange={setCurrentHasDiscount}
          />
          <Label htmlFor="has-discount"> Only show Products on Sale</Label>
        </div>

        {/* Apply Filters Button */}
        <Button
          onClick={handleApplyFilters}
          className="inline-flex bg-[#AF0000] hover:bg-[#730000] items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 w-full"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
