import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white">
      <ul className="flex justify-between items-center py-4 px-6">
        <li>
          <Link href="/" className="text-xl font-bold">
            Creative Image Generator
          </Link>
        </li>
        <li>
          {session ? (
            <>
              <Link className="mr-4" href="/profile">
                {session?.user?.name}
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
            >
              Sign in
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
