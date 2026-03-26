import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const platform = searchParams.get("platform");

    if (error) {
      toast.error("Authorization cancelled");
      // If in popup, close it
      if (window.opener) {
        window.opener.postMessage({ type: "oauth_error", platform }, window.location.origin);
        setTimeout(() => window.close(), 1000);
      } else {
        navigate("/app/network");
      }
      return;
    }

    if (code && state) {
      toast.success("Account connected successfully!");
      // If in popup, notify parent and close
      if (window.opener) {
        window.opener.postMessage({ type: "oauth_success", platform }, window.location.origin);
        setTimeout(() => window.close(), 1500);
      } else {
        // If not popup, redirect to network page
        setTimeout(() => navigate("/app/network"), 1500);
      }
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Connecting your account...</p>
        <p className="text-sm text-gray-400 mt-2">This window will close automatically</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
