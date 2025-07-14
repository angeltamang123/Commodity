"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for slider
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) ?? "0",
    Number(searchParams.get("maxPrice")) ?? "10000000",
  ]);

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

  const handleCategoryChange = (value) => {
    router.push(pathname + "?" + createQueryString({ category: value }));
  };

  const handlePriceCommit = (value) => {
    router.push(
      pathname +
        "?" +
        createQueryString({ minPrice: value[0], maxPrice: value[1] })
    );
  };

  const handleDiscountChange = (checked) => {
    router.push(
      pathname + "?" + createQueryString({ hasDiscount: checked ? "true" : "" })
    );
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
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={handleCategoryChange}
            defaultValue={searchParams.get("category") || "all"}
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
            max={10000000}
            step={1000}
            minStepsBetweenThumbs={1}
            value={priceRange}
            onValueChange={setPriceRange} // Updates local state for display
            onValueCommit={handlePriceCommit} // Updates URL on release
            className="py-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        {/* Discount Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has-discount"
            checked={searchParams.get("hasDiscount") === "true"}
            onCheckedChange={handleDiscountChange}
          />
          <Label htmlFor="has-discount">On Sale</Label>
        </div>
      </CardContent>
    </Card>
  );
}
