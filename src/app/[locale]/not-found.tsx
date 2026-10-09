import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { btnLight } from "@/components/ui";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <PageHero title={t("title")} lede={t("text")}>
      <div className="mt-8"><Link href="/" className={btnLight}>{t("home")}</Link></div>
    </PageHero>
  );
}
