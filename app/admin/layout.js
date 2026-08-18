import Link from "next/link";
import Shell from "@/components/admin/Shell";
import { signOut } from "@/app/admin/actions";
import { getAdmin, getServerClient, supabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Neut Studio", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  if (!supabaseConfigured) return <Setup />;

  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Signed out — middleware has already sent everything except /admin/login
  // here, so this is the login page rendering its own frame.
  if (!user) return <>{children}</>;

  // Signed in but not on the allowlist. Creating an auth user grants nothing;
  // say so plainly instead of bouncing them around a redirect loop.
  const admin = await getAdmin();
  if (!admin) return <NotAllowed email={user.email} />;

  return <Shell admin={admin}>{children}</Shell>;
}

function NotAllowed({ email }) {
  return (
    <div className="mx-auto max-w-lg animate-riseIn px-5 py-24 text-center">
      <p className="eyebrow text-clay">Studio</p>
      <h1 className="wordmark mt-2 text-4xl text-olive-deep">Not on the list</h1>
      <p className="mt-5 leading-relaxed text-olive/70">
        <span className="text-olive-deep">{email}</span> is signed in but hasn&apos;t been given
        studio access. An owner needs to add this account to the{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 text-sm">admins</code> table.
      </p>
      <form action={signOut} className="mt-8">
        <button className="rounded-full border border-olive/25 px-6 py-2 text-sm text-olive/75 transition hover:border-olive hover:text-olive-deep">
          Sign out
        </button>
      </form>
    </div>
  );
}

function Setup() {
  return (
    <div className="mx-auto max-w-xl animate-riseIn px-5 py-24">
      <p className="eyebrow text-clay">Studio</p>
      <h1 className="wordmark mt-2 text-4xl text-olive-deep">Connect Supabase first</h1>
      <p className="mt-5 leading-relaxed text-olive/70">
        The studio needs a Supabase project before it can store anything. Add these to
        <code className="mx-1 rounded bg-cream px-1.5 py-0.5 text-sm">.env.local</code>
        and restart the dev server:
      </p>
      <pre className="scroll-x mt-5 rounded-lg bg-chrome p-4 text-xs leading-relaxed text-cream">
{`NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key>`}
      </pre>
      <p className="mt-5 text-sm text-olive/60">
        Then run <code className="rounded bg-cream px-1.5 py-0.5">supabase/schema.sql</code> and{" "}
        <code className="rounded bg-cream px-1.5 py-0.5">supabase/seed.sql</code> in the Supabase SQL
        editor. Until then the shop renders its built-in defaults.
      </p>
      <Link href="/" className="link-grow mt-8 inline-block text-sm text-olive">
        ← Back to the shop
      </Link>
    </div>
  );
}
