'use client';

import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import { DeleteConfirmDialog } from '@/components/form/DeleteConfirmDialog';
import { Header } from '@/components/layout/Header';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openUserForm, setUserDeleteTarget } from '@/redux/slices/user-slice';
import { deleteUser, fetchUsers } from '@/redux/slices/user-thunks';
import { Plus } from 'lucide-react';
import { UserFormDialog } from './component/UserFormDialog';
import UsersTable from './component/UsersTable';
import { useEffect } from 'react';

export default function UsersTableContent() {
  const dispatch = useAppDispatch();
  const { deleteTarget } = useAppSelector((s) => s.users);

  const openCreateUserForm = () => dispatch(openUserForm(null));
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await dispatch(deleteUser((deleteTarget._id as string))).unwrap();
      dispatch(setUserDeleteTarget(null));
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  return (
    <div className="w-full">
      <Header />
      <DashboardToolbar
        buttonLabel="Add User"
        buttonIcon={<Plus className="h-4 w-4" />}
        onButtonClick={openCreateUserForm}
      />

      <h2 className="text-lg font-semibold pl-6 mt-2">List of all Argyle Internals</h2>
      <div className="mt-4 mb-2 pl-6">
        <UsersTable />
      </div>

      <UserFormDialog />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Delete "${deleteTarget?.firstName} ${deleteTarget?.lastName}"?`}
        onConfirm={handleDelete}
        onCancel={() => dispatch(setUserDeleteTarget(null))}
      />
    </div>
  );
}
