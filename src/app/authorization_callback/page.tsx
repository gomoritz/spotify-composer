"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const previewIdRegex = /[a-zA-Z0-9]{10}/;

export default function AuthorizationCallbackPage() {
  const [authorizationState, setAuthorizationState] = useState("Authorizing...");
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.has("error")) {
      setAuthorizationState("Access denied");
      return;
    }

    const parsed = hash.substr(1, hash.length - 1);
    const hashParams = new URLSearchParams(parsed);

    const accessToken = hashParams.get("access_token");
    const expiresIn = hashParams.get("expires_in");

    if (!accessToken || !expiresIn) {
      setAuthorizationState("Cannot retrieve access token");
      return;
    }

    const previewRedirect = hashParams.get("state");
    if (
      previewRedirect &&
      previewIdRegex.test(previewRedirect) &&
      previewRedirect !== process.env.NEXT_PUBLIC_PREVIEW_ID
    ) {
      setAuthorizationState("Redirecting to preview...");
      window.location.replace(
        `https://${previewRedirect}.preview.composer.goessl.me/authorization_callback${hash}`
      );
      return;
    }

    const currentSeconds = Date.now() / 1000;
    const expiresAt = currentSeconds + parseInt(expiresIn);

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("expires_at", String(expiresAt));
    setAuthorizationState("Success!");

    router.push("/");
  }, [router]);

  return (
    <div className="flex justify-center items-center flex-grow">
      {authorizationState}
    </div>
  );
}
