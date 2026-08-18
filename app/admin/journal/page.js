import JournalManager from "@/components/admin/JournalManager";
import { getJournal } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Journal — Neut Studio" };

export default async function AdminJournalPage() {
  const posts = await getJournal({ includeUnpublished: true });
  return <JournalManager initial={posts} />;
}
