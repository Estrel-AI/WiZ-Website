"use client";

import SwaggerUI from "swagger-ui-react";

type SwaggerUiProps = {
  url: string;
};

export default function SwaggerUi({ url }: SwaggerUiProps) {
  return (
    <SwaggerUI
      url={url}
      docExpansion="list"
      defaultModelsExpandDepth={1}
      withCredentials
      requestInterceptor={(
        request: Record<string, unknown> & { credentials?: RequestCredentials },
      ) => ({
        ...request,
        credentials: "include",
      })}
    />
  );
}
