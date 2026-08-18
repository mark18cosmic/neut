import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in — Neut Studio", robots: { index: false } };

export default function LoginPage({ searchParams }) {
  return <LoginForm next={searchParams?.next || "/admin"} />;
}
