import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Utensils } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { ListItem } from "@/components/ListItem";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { formatDateTime } from "@/lib/datetime";
import { useMealList } from "../queries";

export function MealListPage() {
  const { t, i18n } = useTranslation("meals");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: meals, isLoading } = useMealList(search);
  const lang = i18n.language as "es" | "en";

  return (
    <div>
      <PageHeader
        title={t("title")}
        icon={<Utensils className="size-6" />}
        action={
          <Button size="sm" onClick={() => navigate("/meals/new")}>
            {t("newMeal")}
          </Button>
        }
      />
      <Input
        className="mb-4"
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : !meals || meals.length === 0 ? (
        <EmptyState message={search ? tc("empty") : t("emptyMessage")} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {meals.map((m) => (
            <li key={m.id}>
              <ListItem onClick={() => navigate(`/meals/${m.id}`)}>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <Badge tone="primary">{t(`types.${m.type}`)}</Badge>
                  </div>
                  {m.description && (
                    <span className="mt-1 truncate text-sm text-muted">
                      {m.description}
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {formatDateTime(m.mealAt, lang)}
                </span>
              </ListItem>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
