"use client";

import dynamic from "next/dynamic";

const SwaggerUi = dynamic(() => import("@/src/components/swagger/swagger-ui"), {
  ssr: false,
});

export default function SwaggerUiLazy({ url }: { url: string }) {
  return <SwaggerUi url={url} />;
}