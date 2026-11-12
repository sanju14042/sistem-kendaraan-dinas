"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CarFront,
  ClipboardList,
  Clock3,
  RotateCcw,
  Users,
} from "lucide-react";
import { useSuperAdminData } from "./SuperAdminDataProvider";

function getVehicleName(vehicle) {
  return `${vehicle.merek} ${vehicle.model}`;
}

export default function SuperAdminDashboard() {
  const {
    vehicles,
    setVehicles,
    employees,
    agencies,
    loans,
    setLoans,
  } = useSuperAdminData();
  const [assigningVehicleId, setAssigningVehicleId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [notice, setNotice] = useState("");

  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.status !== "Dipinjam" && vehicle.kondisi === "Baik",
  );
  const borrowedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "Dipinjam",
  );
  const unavailableVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status !== "Dipinjam" && vehicle.kondisi !== "Baik",
  );

  function startAssignment(vehicleId) {
    if (employees.length === 0 || agencies.length === 0) {
      setNotice(
        "Tambahkan data PNS dan perangkat daerah terlebih dahulu melalui Kelola Data Master.",
      );
      return;
    }

    setNotice("");
    setAssigningVehicleId(vehicleId);
    setSelectedEmployeeId(employees[0].id);
    setSelectedAgencyId(agencies[0].id);
  }

  function assignVehicle(event) {
    event.preventDefault();
    if (!selectedEmployeeId || !selectedAgencyId) {
      setNotice("Pilih PNS dan perangkat daerah untuk mencatat peminjaman.");
      return;
    }

    const vehicle = vehicles.find(
      (item) => item.id === assigningVehicleId,
    );
    if (!vehicle) {
      setNotice("Kendaraan tidak ditemukan. Muat ulang halaman dan coba lagi.");
      setAssigningVehicleId("");
      return;
    }

    setLoans((currentLoans) => [
      {
        id: crypto.randomUUID(),
        vehicleId: vehicle.id,
        employeeId: selectedEmployeeId,
        agencyId: selectedAgencyId,
        borrowedAt: new Date().toISOString(),
      },
      ...currentLoans,
    ]);
    setVehicles((currentVehicles) =>
      currentVehicles.map((item) =>
        item.id === vehicle.id ? { ...item, status: "Dipinjam" } : item,
      ),
    );
    setAssigningVehicleId("");
    setNotice(`${vehicle.nomorPolisi} berhasil dicatat sebagai kendaraan dipinjam.`);
  }

  function returnVehicle(vehicle) {
    setLoans((currentLoans) =>
      currentLoans.filter((loan) => loan.vehicleId !== vehicle.id),
    );
    setVehicles((currentVehicles) =>
      currentVehicles.map((item) =>
        item.id === vehicle.id ? { ...item, status: "Tersedia" } : item,
      ),
    );
    setNotice(`${vehicle.nomorPolisi} berhasil dikembalikan.`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Ringkasan operasional
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard Super Admin
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau ketersediaan kendaraan dan informasi peminjam aktif.
          </p>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:self-auto"
          href="/super-admin/kelola-data-master"
        >
          <ClipboardList aria-hidden="true" size={17} />
          Kelola data master
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <section
        aria-label="Ringkasan data"
        className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "Kendaraan tersedia",
            count: availableVehicles.length,
            icon: CarFront,
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Kendaraan dipinjam",
            count: borrowedVehicles.length,
            icon: Clock3,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Pegawai negeri sipil",
            count: employees.length,
            icon: Users,
            color: "bg-violet-50 text-violet-700",
          },
          {
            label: "Perangkat daerah",
            count: agencies.length,
            icon: Building2,
            color: "bg-amber-50 text-amber-700",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              key={item.label}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon aria-hidden="true" size={21} />
              </span>
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-0.5 text-2xl font-bold">{item.count}</p>
              </div>
            </div>
          );
        })}
      </section>

      {notice ? (
        <div
          aria-live="polite"
          className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900"
          role="status"
        >
          <p>{notice}</p>
          <button
            aria-label="Tutup notifikasi"
            className="shrink-0 font-medium text-blue-700 hover:text-blue-900"
            onClick={() => setNotice("")}
            type="button"
          >
            Tutup
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Kendaraan tersedia
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Kondisi baik dan belum dipinjam.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              {availableVehicles.length} tersedia
            </span>
          </div>

          {availableVehicles.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6">
              <CarFront
                aria-hidden="true"
                className="mx-auto text-slate-400"
                size={27}
              />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Belum ada kendaraan yang tersedia
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Tambahkan kendaraan atau pastikan kondisinya baik.
              </p>
              <Link
                className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
                href="/super-admin/kelola-data-master"
              >
                Buka data master kendaraan
                <ArrowRight aria-hidden="true" className="ml-1" size={16} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {availableVehicles.map((vehicle) => (
                <div className="px-5 py-4 sm:px-6" key={vehicle.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {vehicle.nomorPolisi}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {getVehicleName(vehicle)} · {vehicle.tahunProduksi} ·{" "}
                        {vehicle.warna}
                      </p>
                    </div>
                    <button
                      className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 px-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                      onClick={() => startAssignment(vehicle.id)}
                      type="button"
                    >
                      Tugaskan peminjam
                    </button>
                  </div>

                  {assigningVehicleId === vehicle.id ? (
                    <form
                      className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"
                      onSubmit={assignVehicle}
                    >
                      <div>
                        <label
                          className="mb-1.5 block text-xs font-medium text-slate-700"
                          htmlFor={`employee-${vehicle.id}`}
                        >
                          Peminjam (PNS)
                        </label>
                        <select
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          id={`employee-${vehicle.id}`}
                          onChange={(event) =>
                            setSelectedEmployeeId(event.target.value)
                          }
                          required
                          value={selectedEmployeeId}
                        >
                          <option value="">Pilih PNS</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.nama} — {employee.nip}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          className="mb-1.5 block text-xs font-medium text-slate-700"
                          htmlFor={`agency-${vehicle.id}`}
                        >
                          Perangkat daerah
                        </label>
                        <select
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          id={`agency-${vehicle.id}`}
                          onChange={(event) =>
                            setSelectedAgencyId(event.target.value)
                          }
                          required
                          value={selectedAgencyId}
                        >
                          <option value="">Pilih perangkat daerah</option>
                          {agencies.map((agency) => (
                            <option key={agency.id} value={agency.id}>
                              {agency.nama} — {agency.kabupatenKota}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                        <button
                          className="h-9 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-200"
                          onClick={() => setAssigningVehicleId("")}
                          type="button"
                        >
                          Batal
                        </button>
                        <button
                          className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                          type="submit"
                        >
                          Catat peminjaman
                        </button>
                      </div>
                    </form>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Kendaraan dipinjam
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Informasi kendaraan dan peminjam aktif.
              </p>
            </div>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
              {borrowedVehicles.length} dipinjam
            </span>
          </div>

          {borrowedVehicles.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-6">
              <Clock3
                aria-hidden="true"
                className="mx-auto text-slate-400"
                size={27}
              />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Belum ada kendaraan yang dipinjam
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Kendaraan yang dipinjam akan menampilkan data PNS dan
                perangkat daerah di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {borrowedVehicles.map((vehicle) => {
                const loan = loans.find(
                  (item) => item.vehicleId === vehicle.id,
                );
                const employee = employees.find(
                  (item) => item.id === loan?.employeeId,
                );
                const agency = agencies.find(
                  (item) => item.id === loan?.agencyId,
                );

                return (
                  <article className="px-5 py-5 sm:px-6" key={vehicle.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {vehicle.nomorPolisi}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {getVehicleName(vehicle)} · {vehicle.tahunProduksi}
                        </p>
                      </div>
                      <button
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => returnVehicle(vehicle)}
                        type="button"
                      >
                        <RotateCcw aria-hidden="true" size={14} />
                        Tandai kembali
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 rounded-xl bg-blue-50/70 p-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Peminjam (PNS)
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {employee?.nama ?? "Data PNS tidak ditemukan"}
                        </p>
                        {employee ? (
                          <p className="mt-0.5 text-xs text-slate-600">
                            NIP {employee.nip} · {employee.jabatan}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Perangkat daerah
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {agency?.nama ?? "Data perangkat daerah tidak ditemukan"}
                        </p>
                        {agency ? (
                          <p className="mt-0.5 text-xs text-slate-600">
                            {agency.kabupatenKota}, {agency.provinsi}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {unavailableVehicles.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900">
            Kendaraan perlu perhatian
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Kendaraan dengan kondisi selain baik tidak dihitung sebagai
            kendaraan tersedia.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {unavailableVehicles.map((vehicle) => (
              <span
                className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-slate-700"
                key={vehicle.id}
              >
                <strong className="font-semibold">{vehicle.nomorPolisi}</strong>
                <span className="text-slate-500"> · {vehicle.kondisi}</span>
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-6 text-xs leading-5 text-slate-500">
        Data dashboard mengikuti data yang dikelola pada halaman ini dan hanya
        tersimpan selama sesi aplikasi berlangsung.
      </p>
    </main>
  );
}
