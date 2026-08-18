import ContentEditor from "@/components/admin/ContentEditor";
import { getContent } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content — Neut Studio" };

export default async function ContentPage() {
  const content = await getContent();
  return <ContentEditor initial={content} />;
}
