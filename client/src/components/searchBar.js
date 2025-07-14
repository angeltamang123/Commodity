"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const commandRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products?q=${query}&limit=5`
        );
        setResults(data.products);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commandRef.current && !commandRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (productId) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/products/${productId}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (document.activeElement?.getAttribute("role") !== "option") {
      setIsOpen(false);
      router.push(`/search?q=${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query) {
      handleFormSubmit(e);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={commandRef}>
      <form onSubmit={handleFormSubmit}>
        <Command
          shouldFilter={false}
          className="z-20 rounded-lg border shadow-sm border-gray-400 bg-gray-100 overflow-visible"
        >
          <CommandInput
            placeholder="Search for products"
            value={query}
            onValueChange={setQuery}
            onFocus={() => setIsOpen(query.length > 0)}
            onKeyDown={handleKeyDown}
            className
          />
          {isOpen && (
            <CommandList className="absolute top-full left-0 right-0 z-50 border bg-white rounded-md shadow-lg max-h-80 overflow-auto">
              {isLoading ? (
                <div className="p-4 text-sm text-center">Searching...</div>
              ) : results.length > 0 ? (
                <CommandGroup>
                  {results.map((product) => (
                    <CommandItem
                      key={product._id}
                      value={product.name}
                      onSelect={() => handleSelectResult(product._id)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.image}`}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="p-4 text-sm text-center">
                  No results found for "{query}"
                </CommandEmpty>
              )}
            </CommandList>
          )}
        </Command>
      </form>
    </div>
  );
}
