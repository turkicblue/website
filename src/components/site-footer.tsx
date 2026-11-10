import { getTranslations } from "next-intl/server";
import { PROJECTS } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { LogoMark } from "./logo";
import { EmailLink } from "./sections";
import { wrap } from "./ui";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const tp = await getTranslations("Projects.items");
  const brand = await getTranslations("Brand");
  const heading = "mb-3 text-[13px] font-semibold text-star";
  const link = "text-mist no-underline hover:text-star";
  return (
    <footer className="bg-night pb-8 pt-16 text-[15px] text-mist">
      <div className={wrap}>
        <div className="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-display text-[19px] font-medium text-star no-underline">
              <LogoMark className="size-[26px]" />
              <span>
                Turkic Blue <span className="font-light opacity-80">{brand("suffix")}</span>
              </span>
            </Link>
            <p className="mt-2.5 max-w-[38ch]">{t("blurb")}</p>
          </div>
          <div>
            <h2 className={heading}>{t("foundation")}</h2>
            <ul className="grid gap-2">
              <li><Link className={link} href="/about">{nav("about")}</Link></li>
              <li><Link className={link} href="/governance">{nav("governance")}</Link></li>
              <li><Link className={link} href="/about#name">{t("ourName")}</Link></li>
              <li><Link className={link} href="/get-involved">{nav("getInvolved")}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={heading}>{t("projects")}</h2>
            <ul className="grid gap-2">
              {PROJECTS.map((p) => (
                <li key={p.slug}>
                  <Link className={link} href={`/projects/${p.slug}`}>{tp(`${p.slug}.name`)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={heading}>{t("contact")}</h2>
            <ul className="grid gap-2">
              <li><EmailLink className={`${link} break-all`} /></li>
              <li><Link className={link} href="/legal">{t("legal")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-[#173342] pt-6 text-sm">
          <span>{t("rights", { year: new Date().getFullYear() })}</span>
          <LanguageSwitcher label={t("languages")} />
        </div>
      </div>
    </footer>
  );
}
