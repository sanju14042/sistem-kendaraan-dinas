"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CarFront,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("Layanan login belum terhubung. Silakan hubungi administrator.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:min-h-[620px] lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
              <CarFront aria-hidden="true" size={27} />
            </span>
            <div>
              <p className="font-semibold tracking-wide">KENDARAAN DINAS</p>
              <p className="text-sm text-slate-400">Manajemen kendaraan operasional</p>
            </div>
          </div>

          <div className="relative max-w-md">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Sistem terpadu
            </p>
            <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
              Perjalanan dinas, lebih terkelola.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-slate-300">
              Kelola peminjaman, penugasan, dan pemeliharaan kendaraan dalam
              satu tempat.
            </p>
          </div>

          <p className="relative text-sm text-slate-400">
            Sistem Manajemen Kendaraan Dinas Operasional
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <CarFront aria-hidden="true" size={24} />
              </span>
              <span className="font-semibold tracking-wide text-slate-900">
                KENDARAAN DINAS
              </span>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">Selamat datang</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Masuk ke akun Anda
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Gunakan akun terdaftar untuk melanjutkan ke sistem.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    autoComplete="username"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    id="email"
                    name="email"
                    placeholder="nama@instansi.go.id"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="password"
                >
                  Kata sandi
                </label>
                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    id="password"
                    name="password"
                    placeholder="Masukkan kata sandi"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={
                      showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" size={18} />
                    ) : (
                      <Eye aria-hidden="true" size={18} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-sm text-slate-600">
                <input
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  name="remember"
                  type="checkbox"
                />
                Ingat saya
              </label>

              <button
                className="h-12 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                type="submit"
              >
                Masuk
              </button>

              {notice ? (
                <p
                  aria-live="polite"
                  className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  role="status"
                >
                  {notice}
                </p>
              ) : null}
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Mengalami kendala? Hubungi administrator sistem.
            </p>

            {process.env.NODE_ENV === "development" ? (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-center text-xs text-slate-500">
                  Pintasan demo pengembangan
                </p>
                <Link
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  href="/super-admin"
                >
                  Masuk ke Super Admin (Demo)
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
