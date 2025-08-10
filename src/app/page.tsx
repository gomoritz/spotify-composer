"use client";

import { useState, useEffect } from "react";
import Composer from "@/components/composer/Composer";
import Authorize from "@/components/authorization/Authorize";
import { getAccessToken } from "@/spotify/authorization";

export default function HomePage() {
  const [hasAccessToken, setHasAccessToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasAccessToken(!!getAccessToken());
  }, []);

  if (hasAccessToken === null) {
    return null; // or a loading spinner
  }

  if (!hasAccessToken) {
    return <Authorize />;
  }

  return <Composer />;
}
