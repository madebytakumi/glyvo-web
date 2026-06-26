import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { Pug } from "./mascots/Pug";
import { Beagle } from "./mascots/Beagle";

/** App brand lockup: the two mascots + wordmark. */
export function Brand({ className }: { className?: string }) {
  const { t } = useTranslation("common");
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex items-end">
        <Beagle size={28} className="-mr-2" />
        <Pug size={26} />
      </span>
      <span className="text-xl font-bold text-primary">{t("appName")}</span>
    </span>
  );
}
