import { defineMiddleware } from "astro:middleware";
import { HSTS_HEADER, SECURITY_HEADERS } from "@/lib/security-headers";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (name === "Content-Security-Policy" && context.url.protocol !== "https:") {
      response.headers.set(name, value.replace("; upgrade-insecure-requests", ""));
      continue;
    }
    response.headers.set(name, value);
  }

  // Browsers ignore HSTS on insecure responses. Send it only for HTTPS.
  if (context.url.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", HSTS_HEADER);
  }

  return response;
});
