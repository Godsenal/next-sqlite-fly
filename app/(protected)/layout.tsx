import { validateRequest } from "@/auth/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    const header = headers();
    const redirectUri = header.get("x-current-path") ?? "/";

    return redirect("/auth/google/login?redirect_uri=" + redirectUri);
  }

  return children;
}
