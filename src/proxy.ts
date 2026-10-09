import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects "/" to the visitor's language and keeps the locale prefix on every page.
export default createMiddleware(routing);

export const config = {
  // Everything except Next.js internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
