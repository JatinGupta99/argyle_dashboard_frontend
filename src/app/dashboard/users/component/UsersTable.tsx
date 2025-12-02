'use client';

import { DataTable } from '@/components/common/GenericTable';
import type { User } from '@/lib/types/user';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openUserForm, setUserDeleteTarget } from '@/redux/slices/user-slice';
import { fetchUsers } from '@/redux/slices/user-thunks';
import { useEffect, useState } from 'react';
import { userColumns } from './UserRow';

export default function UsersTable() {
  const dispatch = useAppDispatch();
  const { items: users, meta, loading } = useAppSelector((s) => s.users);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // fetch data on mount and whenever page or limit change
  useEffect(() => {
    dispatch(fetchUsers({ page, limit }));
  }, [dispatch, page, limit]);

  const columns = userColumns(
    {
      onEdit: (u: User) => dispatch(openUserForm(u)),
      onDelete: (u: User) => dispatch(setUserDeleteTarget(u)),
    },
    page,
    limit,
  );

  return (
    <>
      {/* Optionally show loading */}
      {loading && <div>Loading…</div>}

      <DataTable
        data={users}
        columns={columns}
        totalItems={meta.total /* or total */}
        query={{ page, limit }}
        setQuery={({ page: p, limit: l }) => {
          setPage(p);
          setLimit(l);
        }}
      />
    </>
  );
}
