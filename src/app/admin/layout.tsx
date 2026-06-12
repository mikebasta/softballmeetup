import { createClient } from '@/lib/supabase/server';
import { signOut } from './actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects anonymous users; this distinguishes
  // logged-in non-admins. RLS hides other rows, so any result means
  // the current user is an admin.
  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-xl font-bold">Not authorized</h1>
        <p className="mt-2 text-gray-600">
          You are signed in as {user?.email}, but this account is not an
          admin. Ask an existing admin to add you.
        </p>
        <form action={signOut} className="mt-4">
          <button className="rounded bg-green-800 px-4 py-2 text-white hover:bg-green-700">
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
        <span className="text-sm text-gray-500">
          Signed in as {user?.email}
        </span>
        <form action={signOut}>
          <button className="text-sm text-green-800 hover:underline">
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
