import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUsers } from '@/redux/slices/user-thunks';
import { useEffect } from 'react';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.users);

  const refresh = () => {
    dispatch(fetchUsers());
  };

  useEffect(() => {
    refresh();
  }, [items]);

  return {
    users: items,
    loading,
    error,
    refresh,
  };
};
