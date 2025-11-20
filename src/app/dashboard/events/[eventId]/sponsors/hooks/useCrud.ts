import { useState } from "react";

export function useCrud<T>(eventId: string, service: any) {
  const [items, setItems] = useState<T[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  return {
    items,
    deleteTarget,
    openDialog,
    editItem,
    setOpenDialog,
    deleteItem: setDeleteTarget,
    editExisting: setEditItem,

    async loadItems(params = { page: 1, limit: 10, search: "" }) {
      const res = await service.getAll(eventId, params);
      setItems(res.data);
      return res;
    },

    async confirmDelete() {
      if (!deleteTarget) return;
      await service.delete(eventId, (deleteTarget as any)._id);
      setDeleteTarget(null);
      this.loadItems();
    },

    addItem() {
      setEditItem(null);
      setOpenDialog(true);
    },
  };
}
