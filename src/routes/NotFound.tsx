import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { MascotPair } from "@/components/mascots/MascotPair";

export function NotFound() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <MascotPair size={96} mood="sleepy" />
      <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
      <p className="text-muted">{t("notFound.body")}</p>
      <Button onClick={() => navigate("/")}>{t("notFound.goHome")}</Button>
    </div>
  );
}
