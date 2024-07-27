import { logout } from "@/auth/action";
import { validateRequest } from "@/auth/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const Header = async () => {
  const { user } = await validateRequest();
  const currentPath = headers().get("x-current-path");

  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          className="dark:invert"
          width={100}
          height={24}
          priority
        />
      </Link>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={user.profileImage ?? ""}
                alt="User Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <form action={logout}>
                <button>Logout</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={`/auth/google/login?redirect_uri=${currentPath ?? "/"}`}>
          <img
            src="/google/login/light.png"
            alt="Google Login"
            className="w-36 dark:hidden"
          />
          <img
            src="/google/login/dark.png"
            alt="Google Login"
            className="hidden dark:block"
          />
        </Link>
      )}
    </header>
  );
};

export default Header;
