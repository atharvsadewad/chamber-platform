import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

export function SocialLogin() {
  return (
    <div className="space-y-4 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        <Button variant="outline" type="button" className="w-full gap-2">
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </Button>

        <Button variant="outline" type="button" className="w-full gap-2">
          <FaMicrosoft className="h-5 w-5 text-[#00a4ef]" />
          Continue with Microsoft
        </Button>
      </div>
    </div>
  );
}