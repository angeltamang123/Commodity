import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductDetail from "../productComponents/productDetails";
import { Button } from "../ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function ProductDetailsDialog({ product }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} className="p-0">
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start w-full px-2 py-1.5 text-sm"
        >
          View details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader>
          {/*  Wrap DialogTitle with VisuallyHidden */}
          <VisuallyHidden.Root>
            <DialogTitle>Product Details for {product?.name}</DialogTitle>
          </VisuallyHidden.Root>
        </DialogHeader>
        <ProductDetail product={product} />
      </DialogContent>
    </Dialog>
  );
}
