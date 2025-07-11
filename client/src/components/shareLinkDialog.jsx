"use client";

import { useState } from "react";
import { Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ShareLinkDialog({ urlToShare, children }) {
  const [open, setOpen] = useState(false);

  const handleCopyLink = async () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard API not supported by your browser.");
      return;
    }

    try {
      await navigator.clipboard.writeText(urlToShare);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy link.");
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold">
            Shareable public link
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Input
            id="link"
            defaultValue={urlToShare}
            readOnly
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#AF0000]"
          />
          <Button
            type="button"
            onClick={handleCopyLink}
            className="bg-[#AF0000] hover:bg-[#730000] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
