"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  CalendarIcon,
  Package2Icon,
  TagIcon,
  DollarSignIcon,
  BlocksIcon,
  CheckCircle2Icon,
  PercentIcon,
  ImageIcon,
  GalleryVerticalIcon,
  FileTextIcon,
  Loader2Icon,
} from "lucide-react";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import axios from "axios";
import { toast } from "sonner";
import api from "@/lib/axiosInstance";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const getFileFromPondFile = (pondFile) => {
  return pondFile.file;
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string(),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be at least 0"),
  category: Yup.string().oneOf(
    ["Electronics", "Clothing", "Books", "Furnitures", "Sports", "Others"],
    "Invalid category selected"
  ),
  stock: Yup.number()
    .required("Stock is required")
    .min(0, "Stock must be at least 0"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Invalid status selected")
    .required("Status is required"),

  // Validation for the single main image
  image: Yup.array()
    .min(1, "A main product image is required")
    .max(1, "Only one main image can be uploaded")
    .of(
      Yup.mixed()
        .test("fileSize", "Main image size is too large (max 5MB)", (value) => {
          if (!value || typeof value === "string") return true;
          return value.size <= 5000000;
        })
        .test("fileType", "Unsupported main image format", (value) => {
          if (!value || typeof value === "string") return true;
          return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
        })
    )
    .required("Main product image is required"),

  // Validation for additional images array
  images: Yup.array()
    .max(5, "You can upload a maximum of 5 additional images")
    .of(
      Yup.mixed()
        .test(
          "fileSize",
          "Additional image size is too large (max 5MB)",
          (value) => {
            if (!value || typeof value === "string") return true;
            return value.size <= 5000000;
          }
        )
        .test("fileType", "Unsupported additional image format", (value) => {
          if (!value || typeof value === "string") return true;
          return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
        })
    )
    .nullable(),

  // Discount fields validation
  hasDiscount: Yup.boolean(),
  discountPrice: Yup.number().when("hasDiscount", {
    is: true,
    then: (schema) =>
      schema
        .required("Discount price is required")
        .min(0, "Discount price must be at least 0")
        .test(
          "is-less-than-price",
          "Discount price must be less than the original price",
          function (discountPrice) {
            const { price } = this.parent;
            return discountPrice < price;
          }
        ),
    otherwise: (schema) => schema.nullable(), // Discount price is not required if no discount
  }),
  discountTill: Yup.date().when("hasDiscount", {
    is: true,
    then: (schema) =>
      schema
        .required("Discount till date is required")
        .min(getTomorrow(), "Discount till date must be at least tomorrow"),
    otherwise: (schema) => schema.nullable(), // Discount till date is not required if no discount
  }),
});

export default function EditProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [initialProductData, setInitialProductData] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [mainImagePondFiles, setMainImagePondFiles] = useState([]);
  const [additionalImagePondFiles, setAdditionalImagePondFiles] = useState([]);

  // Fetch product data
  useEffect(() => {
    if (!productId) {
      toast.error("Product ID is missing.");
      setLoadingProduct(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const response = await api.get(`/products/${productId}`);
        const product = response.data;

        // Prepare FilePond files for existing images
        const initialMainImage = product.image
          ? [
              {
                source: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.image}`,
                options: { type: "local" }, // 'local' tells FilePond this is an existing file
              },
            ]
          : [];

        const initialAdditionalImages = product.images
          ? product.images.map((img) => ({
              source: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`,
              options: { type: "local" },
            }))
          : [];

        setMainImagePondFiles(initialMainImage);
        setAdditionalImagePondFiles(initialAdditionalImages);

        // Set initial formik values
        setInitialProductData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "Others",
          stock: product.stock || "",
          status: product.status || "active",
          // For images, we'll set the field to an array of sources for validation purposes initially
          // FilePond handles the actual file objects
          image: initialMainImage.map((file) => file.source),
          images: initialAdditionalImages.map((file) => file.source),
          hasDiscount:
            product.discountPrice !== null &&
            product.discountPrice !== undefined,
          discountPrice: product.discountPrice || null,
          discountTill: product.discountTill
            ? new Date(product.discountTill)
            : null,
        });
        // IMPORTANT: Workaround for a race condition with shadcn/ui Select and Formik's enableReinitialize.
        // Better solution would be setting formik fields in useEffect after product is available,not during initialization itself,
        // for now we stick with current structure
        // PROBLEM:
        // After initial product data is fetched and `initialProductData` is set,
        // Formik's `enableReinitialize: true` correctly updates `formik.values.category`.
        // However, immediately following this, the `shadcn/ui` (Radix UI-based) Select component's
        // internal `useEffect` (identified as `BubbleSelect.useEffect` in call stack)
        // sometimes fires its `onValueChange` with an empty string (""),
        // causing `formik.values.category` to revert to an empty state.
        //
        // SOLUTION:
        // This `setTimeout(..., 0)` defers the `setFieldValue` call to the next microtask queue,
        // giving the `Select` component's internal state a chance to fully reconcile
        // with the `value` prop provided by Formik after reinitialization.
        // This ensures the correct category from `product.category` is re-applied
        // and persists, overriding the unintended empty string set by the Select's internal logic.
        setTimeout(() => {
          if (formik.values.category !== (product.category || "Others")) {
            formik.setFieldValue("category", product.category || "Others");
          }

          if (formik.values.status !== product.status) {
            formik.setFieldValue("status", product.status);
          }
        }, 0);
        setLoadingProduct(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data.");
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Function to configure FilePond's server property for existing files
  const filePondServerConfig = {
    load: (source, load, error, progress, abort, headers) => {
      const request = new XMLHttpRequest();
      request.open("GET", source);

      request.responseType = "blob"; // Important for image data

      request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
          load(request.response); // Pass the Blob to FilePond
        } else {
          error(
            `Failed to load image: ${request.statusText} (${request.status})`
          );
        }
      };

      request.onerror = function () {
        error("Network error occurred while loading image.");
      };

      request.onprogress = (e) => {
        if (e.lengthComputable) {
          progress(e.detail, e.loaded, e.total);
        }
      };

      request.onabort = function () {
        abort();
      };

      request.send();

      return {
        abort: () => {
          request.abort();
        },
      };
    },
  };

  const formik = useFormik({
    initialValues: initialProductData || {
      // Use initialProductData or fallback empty values
      name: "",
      description: "",
      price: "",
      category: "Others",
      stock: "",
      status: "active",
      image: [],
      images: [],
      hasDiscount: false,
      discountPrice: null,
      discountTill: null,
    },
    validationSchema: ProductSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitStatus("loading");
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price.toString());
        formData.append("category", values.category);
        formData.append("stock", values.stock.toString());

        // Dynamic status based on stock, if user selected 'active'
        let finalStatus = values.status;
        if (values.stock === 0 && values.status === "active") {
          finalStatus = "inactive";
        }
        formData.append("status", finalStatus);

        if (values.hasDiscount) {
          formData.append("discountPrice", values.discountPrice);
          console.log(values.discountPrice);
          if (values.discountTill) {
            formData.append("discountTill", values.discountTill.toISOString()); // Send ISO string for date
            console.log(values.discountTill.toISOString());
          }
        } else {
          formData.append("discountPrice", "");
          formData.append("discountTill", "");
        }

        // Handle main image: if it's a new file, append it. If it's an existing string, don't re-append.
        if (mainImagePondFiles.length > 0) {
          const file = getFileFromPondFile(mainImagePondFiles[0]);
          if (file instanceof File) {
            // Only append if it's a new file
            formData.append("image", file);
          }
          // If it's a string (existing URL), it means no change, so don't append.
          // The backend should handle keeping the existing image if no new file is provided.
        }

        // Handle additional images: append new files, and signal existing ones.
        const newImageFiles = [];
        const existingImageSources = [];

        additionalImagePondFiles.forEach((fileItem) => {
          const file = getFileFromPondFile(fileItem);
          if (file instanceof File) {
            newImageFiles.push(file);
          } else if (typeof fileItem.source === "string") {
            // This is an existing image from the server
            // We need to send its original filename/path to the backend
            const fileName = fileItem.source.split("/").pop();
            existingImageSources.push(fileName);
          }
        });

        newImageFiles.forEach((file) => {
          formData.append("images[]", file);
        });
        // Send existing image filenames separately
        formData.append("existingImages", JSON.stringify(existingImageSources));

        const response = await api.patch(`/products/${productId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Product updated successfully!");
        setSubmitStatus("success");
        router.push("/admin/inventory");
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error(
          `Error updating product: ${
            error.response?.data?.message || error.message
          }`
        );
        setSubmitStatus("error");
      }
    },
  });

  const handleMainImageUpdate = (pondFiles) => {
    setMainImagePondFiles(pondFiles);
    formik.setFieldValue(
      "image",
      pondFiles.map((pf) =>
        getFileFromPondFile(pf) instanceof File
          ? getFileFromPondFile(pf)
          : pf.source
      )
    );
  };

  const handleAdditionalImagesUpdate = (pondFiles) => {
    setAdditionalImagePondFiles(pondFiles);
    formik.setFieldValue(
      "images",
      pondFiles.map((pf) =>
        getFileFromPondFile(pf) instanceof File
          ? getFileFromPondFile(pf)
          : pf.source
      )
    );
  };

  // Effect to manage status based on stock
  useEffect(() => {
    if (formik.values.stock === 0 && formik.values.status === "active") {
      formik.setFieldValue("status", "inactive");
    }
  }, [formik.values.stock, formik.values.status, formik]);

  // Effect to return submit status to idle after success
  useEffect(() => {
    if (submitStatus === "success") {
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 1000);
    }
  }, [submitStatus]);

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2Icon className="h-8 w-8 animate-spin text-gray-700" />
        <span className="ml-2 text-gray-700">Loading product...</span>
      </div>
    );
  }

  // If initialProductData is null after loading, display an error or redirect
  if (!initialProductData && !loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">
          Product not found or an error occurred.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Edit Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                <Package2Icon className="h-4 w-4" /> Product Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="flex items-center gap-2 mb-2"
              >
                <FileTextIcon className="h-4 w-4" /> Description
              </Label>
              <Textarea
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                rows={4}
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="flex items-center gap-2 mb-2">
                  <DollarSignIcon className="h-4 w-4" /> Price (NPR)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.price}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="stock" className="flex items-center gap-2 mb-2">
                  <BlocksIcon className="h-4 w-4" /> Stock Quantity
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.stock}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="category"
                  className="flex items-center gap-2 mb-2"
                >
                  <TagIcon className="h-4 w-4" /> Category
                </Label>
                <Select
                  name="category"
                  onValueChange={(value) => {
                    formik.setFieldValue("category", value);
                  }}
                  value={formik.values.category}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Furnitures">Furnitures</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.category}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="status"
                  className="flex items-center gap-2 mb-2"
                >
                  <CheckCircle2Icon className="h-4 w-4" /> Product Status
                </Label>

                <Select
                  name="status"
                  onValueChange={(value) =>
                    formik.setFieldValue("status", value)
                  }
                  value={formik.values.status}
                  // Disable if stock is 0, always set to inactive
                  disabled={formik.values.stock === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.status}
                  </p>
                )}
                {formik.values.stock === 0 && (
                  <p className="text-orange-500 text-xs mt-1">
                    Status must be &apos;Inactive&apos; for 0 stock.
                  </p>
                )}
              </div>
            </div>

            {/* Discount Section */}
            <div className="space-y-4 border p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDiscount"
                  checked={formik.values.hasDiscount}
                  onCheckedChange={(checked) => {
                    formik.setFieldValue("hasDiscount", checked);
                    if (!checked) {
                      formik.setFieldValue("discountPrice", null);
                      formik.setFieldValue("discountTill", null);
                    }
                  }}
                />
                <Label
                  htmlFor="hasDiscount"
                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                >
                  <PercentIcon className="h-4 w-4" /> Apply Discount
                </Label>
              </div>

              {formik.values.hasDiscount && (
                <>
                  <div>
                    <Label
                      htmlFor="discountPrice"
                      className="flex items-center gap-2 mb-2"
                    >
                      <DollarSignIcon className="h-4 w-4" /> Discount Price
                    </Label>
                    <Input
                      id="discountPrice"
                      name="discountPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.discountPrice ?? ""}
                    />
                    {formik.touched.discountPrice &&
                      formik.errors.discountPrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.discountPrice}
                        </p>
                      )}
                  </div>

                  <div>
                    <Label
                      htmlFor="discountTill"
                      className="flex items-center gap-2 mb-2"
                    >
                      <CalendarIcon className="h-4 w-4" /> Discount Till
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline-solid"}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !formik.values.discountTill &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formik.values.discountTill ? (
                            format(new Date(formik.values.discountTill), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formik.values.discountTill}
                          onSelect={(date) =>
                            formik.setFieldValue("discountTill", date)
                          }
                          initialFocus
                          disabled={(date) => date < getTomorrow()} // Disable dates before tomorrow
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.discountTill &&
                      formik.errors.discountTill && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.discountTill}
                        </p>
                      )}
                  </div>
                </>
              )}
            </div>

            {/* Main Product Image with FilePond */}
            <div>
              <Label
                htmlFor="mainImagePond"
                className="flex items-center gap-2 mb-2"
              >
                <ImageIcon className="h-4 w-4" /> Main Product Image
              </Label>
              <FilePond
                files={mainImagePondFiles}
                onupdatefiles={handleMainImageUpdate}
                allowMultiple={false}
                maxFiles={1}
                name="mainImagePond"
                labelIdle='Drag & Drop main image or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
                server={filePondServerConfig}
              />
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.image}
                </p>
              )}
            </div>

            {/* Additional Product Images with FilePond */}
            <div>
              <Label
                htmlFor="additionalImagesPond"
                className="flex items-center gap-2 mb-2"
              >
                <GalleryVerticalIcon className="h-4 w-4" /> Additional Product
                Images (Optional, Max 5)
              </Label>
              <FilePond
                files={additionalImagePondFiles}
                onupdatefiles={handleAdditionalImagesUpdate}
                allowReorder={true}
                allowMultiple={true}
                maxFiles={5}
                name="additionalImagesPond"
                labelIdle='Drag & Drop additional images or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
                server={filePondServerConfig}
              />
              {formik.touched.images && formik.errors.images && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.images}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitStatus === "loading"}
              className="w-full"
            >
              {submitStatus === "loading" ? "Updating..." : "Update Product"}
            </Button>

            {submitStatus === "success" && (
              <p className="text-green-600 text-sm mt-3 text-center">
                Product updated successfully!
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-500 text-sm mt-3 text-center">
                Error updating product. Please try again.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
