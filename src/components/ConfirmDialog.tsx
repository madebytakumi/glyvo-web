import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  const { t } = useTranslation("common");
  return (
    <Modal open={open} onClose={onCancel}>
      <p className="mb-5 text-text">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {t("cancel")}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {t("delete")}
        </Button>
      </div>
    </Modal>
  );
}
