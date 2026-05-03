"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/", color: "red" },
    { name: "Dashboard", href: "/dashboard", color: "text-warning" },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="w-full border-b-[3px] border-base-300 bg-base-100 sticky top-0 z-50 shadow-comic">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-comic text-3xl tracking-wide text-base-content"
        >
          Narratrix <span className="text-pop">⚡</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`font-comic text-lg px-3 py-1 tracking-wide transition-all duration-150 hover:-translate-y-0.5 ${
                  active
                    ? `${item.color} border-b-[3px] border-base-300`
                    : `text-base-content/70 hover:${item.color}`
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="ml-3 font-comic tracking-wide text-base bg-error text-base-400 border-[3px] border-base-300 px-4 py-1 shadow-comic hover:-translate-y-0.5 hover:translate-x-[-2px] active:translate-y-0 active:translate-x-0 transition-transform"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
