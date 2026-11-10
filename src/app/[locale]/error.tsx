"use client";

import { useTranslations } from "next-intl";
import { PageHero } from "@/components/page-hero";
import { btnLight, btnOutlineLight } from "@/components/ui";
import { Link } from "@/i18n/navigation";

/** Shown in place of a page that failed to render. */
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("Error");
  return (
    <PageHero title={t("title")} lede={t("text")}>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className={btnLight} onClick={() => retry()}>{t("retry")}</button>
        <Link href="/" className={btnOutlineLight}>{t("home")}</Link>
      </div>
    </PageHero>
  );
}
