import Link from "next/link";
import { CarFront, ShieldCheck } from "lucide-react";
import { SuperAdminDataProvider } from "./SuperAdminDataProvider";

export const metadata = {
  title: "Super Admin | Kendaraan Dinas",
  description: "Dashboard dan pengelolaan data sistem kendaraan dinas.",
};

export default function SuperAdminLayout({ children }) {
  return (
    <SuperAdminDataProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link className="flex items-center gap-3" href="/super-admin">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <CarFront aria-hidden="true" size={23} />
              </span>
              <span>
                <span className="block text-sm font-bold tracking-wide">
                  KENDARAAN DINAS
                </span>
                <span className="block text-xs text-slate-500">
                  Manajemen operasional
                </span>
              </span>
            </Link>

            {/* <nav
              aria-label="Navigasi super admin"
              className="order-3 flex w-full items-center gap-2 border-t border-slate-100 pt-3 sm:order-none sm:w-auto sm:border-0 sm:pt-0"
            >
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                href="/super-admin"
              >
                Dashboard
              </Link>
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                href="/super-admin/kelola-data-master"
              >
                Kelola data master
              </Link>
            </nav> */}

            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">
              <ShieldCheck aria-hidden="true" size={17} />
              <span>Super Admin</span>
            </div>
          </div>
        </header>
        {children}
      </div>
    </SuperAdminDataProvider>
  );
}
