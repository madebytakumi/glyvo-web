import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StickyNote } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { ListItem } from "@/components/ListItem";
import { EmptyState } from "@/components/EmptyState";
import { Spinner } from "@/components/Spinner";
import { formatDateTime } from "@/lib/datetime";
import { useNoteList } from "../queries";
import { parseTags } from "../model";

export function NoteListPage() {
  const { t, i18n } = useTranslation("notes");
  const { t: tc } = useTranslation("common");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: notes, isLoading } = useNoteList(search);
  const lang = i18n.language as "es" | "en";

  return (
    <div>
      <PageHeader
        title={t("title")}
        icon={<StickyNote className="size-6" />}
        action={
          <Button size="sm" onClick={() => navigate("/notes/new")}>
            {t("newNote")}
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
      ) : !notes || notes.length === 0 ? (
        <EmptyState message={search ? tc("empty") : t("emptyMessage")} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((n) => (
            <li key={n.id}>
              <ListItem onClick={() => navigate(`/notes/${n.id}`)}>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium">
                    {n.title || n.content.slice(0, 40)}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {parseTags(n.tags).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {formatDateTime(n.noteAt, lang)}
                </span>
              </ListItem>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
