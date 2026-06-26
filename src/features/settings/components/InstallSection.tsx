import { useTranslation } from "react-i18next";
import { Download, Share, SquarePlus, Check } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useInstallPrompt } from "@/lib/useInstallPrompt";

/** Settings section explaining how to install the app as a PWA. */
export function InstallSection() {
  const { t } = useTranslation("settings");
  const { canPrompt, promptInstall, installed, platform } = useInstallPrompt();

  return (
    <Card className="mb-3">
      <h2 className="mb-3 text-sm font-medium text-muted">{t("install.title")}</h2>

      {installed ? (
        <p className="flex items-center gap-2 text-success">
          <Check className="size-5" />
          {t("install.installed")}
        </p>
      ) : canPrompt ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">{t("install.intro")}</p>
          <Button className="self-start" onClick={promptInstall}>
            <Download className="size-5" />
            {t("install.button")}
          </Button>
        </div>
      ) : platform === "ios" ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">{t("install.iosIntro")}</p>
          <ol className="flex flex-col gap-2 text-sm text-text">
            <li className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                1
              </span>
              <Share className="size-5 text-primary" />
              {t("install.iosStep1")}
            </li>
            <li className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                2
              </span>
              <SquarePlus className="size-5 text-primary" />
              {t("install.iosStep2")}
            </li>
            <li className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                3
              </span>
              {t("install.iosStep3")}
            </li>
          </ol>
        </div>
      ) : (
        <p className="text-sm text-muted">{t("install.desktopHint")}</p>
      )}
    </Card>
  );
}
