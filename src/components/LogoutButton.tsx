"use client";
import { useState } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleLogOut = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const errorMessages = null;
        if (!errorMessages) {
            toast.success('Logged out',{
                description: "You have been logged out successfully",
            });
            router.push('/');
        } else {
            toast.error('Error', {
                description: errorMessages,
            });
        }
        setLoading(false);
    };
  return (
    <Button className="w-24" variant={'outline'} onClick={handleLogOut} disabled={loading}>
        {loading? <Loader2 className=" animate-spin"/>: 'Log out'}
        </Button>
  )
}

export default LogoutButton;