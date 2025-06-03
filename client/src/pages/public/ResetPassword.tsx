import { handleResetPassword } from "@/api/authServices";
import ResetPasswordForm from "@/components/ui/ResetPasswordForm";
import { useState } from "react";
import { useSearchParams } from "react-router";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [newPassword, setNewPassword] = useState<string>("")

  async function resetPassword() {
    setLoading(true);
    await handleResetPassword({ token, newPassword: "" })
      .then((res) => {})
      .catch((err) => {
        
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setError(undefined), 3000);
      });
  }

  return (
    <div>
        <ResetPasswordForm token={token!}/>
    </div>
  );
}
