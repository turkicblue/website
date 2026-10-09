import { getTranslations } from "next-intl/server";
import { HeaderBar } from "./header-bar";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const brand = await getTranslations("Brand");
  const items = [
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/governance", label: t("governance") },
    { href: "/get-involved", label: t("getInvolved") },
  ];
  return <HeaderBar items={items} labels={{ main: t("main"), menu: t("menu"), close: t("close"), home: t("home"), suffix: brand("suffix") }} />;
}
