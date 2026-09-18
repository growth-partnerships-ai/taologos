import { redirect } from "next/navigation";

/** Shortcut URL → Sanity Studio */
export default function CmsRedirect() {
  redirect("/studio");
}
