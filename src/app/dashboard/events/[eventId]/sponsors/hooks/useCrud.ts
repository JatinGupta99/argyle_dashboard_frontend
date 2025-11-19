import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface Identifiable {
  _id: string;
}
interface CrudService<T> {
  getAll: (eventId: string) => Promise<{ data: T[] } | T[]>;
  remove: (eventId: string, id: string) => Promise<{ statusCode: number; data: unknown }>;
}

export function useCrud<T extends Identifiable>(eventId: string, service: CrudService<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const loadItems = useCallback(async () => {
    if (!eventId) return;

    try {
      const res = await service.getAll(eventId);
      const data = Array.isArray(res) ? res : res.data;
      setItems(data ?? []);
    } catch (e) {
      console.error('Failed to load items', e);
      toast.error('Failed to load data');
    }
  }, [eventId, service]);

  const addItem = () => {
    setEditItem(null);
    setOpenDialog(true);
  };

  const editExisting = (item: T) => {
    setEditItem(item);
    setOpenDialog(true);
  };

  const deleteItem = (item: T) => setDeleteTarget(item);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await service.remove(eventId, deleteTarget._id);
      toast.success('Item deleted');
      await loadItems();
    } catch (e) {
      console.error('Failed to delete item', e);
      toast.error('Failed to delete');
    } finally {
      setDeleteTarget(null);
    }
  };

  return {
    items,
    openDialog,
    setOpenDialog,
    editItem,
    deleteTarget,
    loadItems,
    addItem,
    editExisting,
    deleteItem,
    confirmDelete,
  };
}
