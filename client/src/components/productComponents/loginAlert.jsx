import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const LoginAlert = ({ open, onOpenChange, from }) => {
  const router = useRouter();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are not logged in</AlertDialogTitle>
          <AlertDialogDescription>
            You need to Login to complete this action!!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-[#AF0000] hover:bg-[#730000] text-white"
              onClick={() => router.push(`/login?from=${from}`)}
            >
              Go to Login Page
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginAlert;
