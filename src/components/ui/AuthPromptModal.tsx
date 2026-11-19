"use client";

import { useRouter } from "next/navigation";
import Dialog from "@/components/ui/Dialog";
import AuthForm from "@/components/auth/AuthForm";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
  /** Called after sign-in, e.g. to retry the add-to-bag that triggered the prompt. */
  onLoginSuccess?: () => void;
}

export default function AuthPromptModal({ isOpen, onClose, redirectPath, onLoginSuccess }: AuthPromptModalProps) {
  const router = useRouter();

  const handleSignedIn = () => {
    onClose();
    if (onLoginSuccess) onLoginSuccess();
    else if (redirectPath) router.push(redirectPath);
    else window.location.reload();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title="Sign in to book"
      description="You'll need an account to rent this. We'll add it to your bag as soon as you're in."
    >
      <AuthForm headingLevel="h2" hideHeading onSignedIn={handleSignedIn} />
    </Dialog>
  );
}
