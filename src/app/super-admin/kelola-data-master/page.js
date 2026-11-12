"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CarFront,
  ClipboardList,
  Users,
} from "lucide-react";
import EntityManager from "../EntityManager";
import { useSuperAdminData } from "../SuperAdminDataProvider";
import {
  civilServiceGrades,
  commonRegionalDepartments,
  indonesianProvinces,
} from "@/lib/indonesia-master-data";

const currentYear = new Date().getFullYear();

const vehicleSchema = z.object({
  nomorPolisi: z
    .string()
    .trim()
    .min(4, "Nomor polisi minimal 4 karakter.")
    .max(12, "Nomor polisi maksimal 12 karakter.")
    .transform((value) => value.toUpperCase()),
  merek: z.string().trim().min(1, "Merek kendaraan wajib diisi."),
  model: z.string().trim().min(1, "Tipe atau model wajib diisi."),
  tahunProduksi: z.coerce
    .number()
    .int("Tahun produksi harus berupa tahun yang valid.")
    .min(1950, "Tahun produksi tidak boleh sebelum 1950.")
    .max(currentYear, `Tahun produksi tidak boleh melebihi ${currentYear}.`),
  warna: z.string().trim().min(1, "Warna kendaraan wajib diisi."),
  kondisi: z.enum(["Baik", "Perlu Perawatan", "Rusak"]),
});

const employeeSchema = z.object({
  nama: z.string().trim().min(1, "Nama pegawai wajib diisi."),
  nip: z
    .string()
    .trim()
    .regex(/^\d{18}$/, "NIP harus terdiri dari 18 angka."),
  jabatan: z.string().trim().min(1, "Jabatan wajib diisi."),
  golongan: z.string().min(1, "Golongan wajib dipilih."),
});

const agencySchema = z.object({
  nama: z.string().trim().min(1, "Nama perangkat daerah wajib diisi."),
  jenis: z.string().min(1, "Jenis perangkat daerah wajib dipilih."),
  provinsi: z
    .string()
    .refine(
      (value) => indonesianProvinces.includes(value),
      "Pilih provinsi dari daftar.",
    ),
  kabupatenKota: z
    .string()
    .trim()
    .min(1, "Kabupaten atau kota wajib diisi."),
});

const vehicleFields = [
  {
    name: "nomorPolisi",
    label: "Nomor polisi",
    placeholder: "Contoh: B 1234 ABC",
  },
  { name: "merek", label: "Merek kendaraan", placeholder: "Contoh: Toyota" },
  {
    name: "model",
    label: "Tipe atau model",
    placeholder: "Contoh: Innova Zenix",
  },
  {
    name: "tahunProduksi",
    label: "Tahun produksi",
    placeholder: "Contoh: 2024",
    type: "number",
    min: 1950,
    max: currentYear,
    defaultValue: currentYear,
  },
  {
    name: "warna",
    label: "Warna kendaraan",
    placeholder: "Contoh: Hitam metalik",
  },
  {
    name: "kondisi",
    label: "Kondisi kendaraan",
    defaultValue: "Baik",
    options: [
      { value: "Baik", label: "Baik" },
      { value: "Perlu Perawatan", label: "Perlu Perawatan" },
      { value: "Rusak", label: "Rusak" },
    ],
  },
];

const employeeFields = [
  { name: "nama", label: "Nama pegawai", placeholder: "Nama lengkap PNS" },
  { name: "nip", label: "NIP", placeholder: "Masukkan 18 angka" },
  { name: "jabatan", label: "Jabatan", placeholder: "Contoh: Analis Kebijakan" },
  {
    name: "golongan",
    label: "Golongan",
    defaultValue: "",
    options: [
      { value: "", label: "Pilih golongan" },
      ...civilServiceGrades.map((grade) => ({
        value: grade,
        label: grade,
      })),
    ],
  },
];

const agencyFields = [
  {
    name: "nama",
    label: "Nama perangkat daerah",
    placeholder: "Contoh: Dinas Pendidikan Kota Bandung",
    suggestions: commonRegionalDepartments,
    fullWidth: true,
  },
  {
    name: "jenis",
    label: "Jenis perangkat daerah",
    defaultValue: "",
    options: [
      { value: "", label: "Pilih jenis" },
      { value: "Dinas", label: "Dinas" },
      { value: "Badan", label: "Badan" },
      { value: "Satuan", label: "Satuan" },
      { value: "Sekretariat", label: "Sekretariat" },
      { value: "Lainnya", label: "Lainnya" },
    ],
  },
  {
    name: "provinsi",
    label: "Provinsi",
    options: [
      { value: "", label: "Pilih provinsi" },
      ...indonesianProvinces.map((province) => ({
        value: province,
        label: province,
      })),
    ],
  },
  {
    name: "kabupatenKota",
    label: "Kabupaten/kota",
    placeholder: "Ketik nama kabupaten atau kota",
  },
];

const entityTabs = [
  { id: "vehicles", label: "Kendaraan", icon: CarFront },
  { id: "employees", label: "Pegawai negeri sipil", icon: Users },
  { id: "agencies", label: "Perangkat daerah", icon: Building2 },
];

function createRecord(data, extra = {}) {
  return { ...data, ...extra, id: crypto.randomUUID() };
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("vehicles");
  const {
    vehicles,
    setVehicles,
    employees,
    setEmployees,
    agencies,
    setAgencies,
    loans,
  } = useSuperAdminData();

  function updateRecord(setRecords, id, data) {
    setRecords((records) =>
      records.map((record) =>
        record.id === id ? { ...record, ...data } : record,
      ),
    );
  }

  function deleteRecord(setRecords, id) {
    setRecords((records) => records.filter((record) => record.id !== id));
  }

  function deleteVehicle(id) {
    if (loans.some((loan) => loan.vehicleId === id)) {
      return false;
    }

    deleteRecord(setVehicles, id);
    return true;
  }

  function deleteEmployee(id) {
    if (loans.some((loan) => loan.employeeId === id)) {
      return false;
    }

    deleteRecord(setEmployees, id);
    return true;
  }

  function deleteAgency(id) {
    if (loans.some((loan) => loan.agencyId === id)) {
      return false;
    }

    deleteRecord(setAgencies, id);
    return true;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <div className="mb-5">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
              href="/super-admin"
            >
              <ArrowLeft aria-hidden="true" size={17} />
              Kembali ke dashboard
            </Link>
          </div>
          <p className="text-sm font-semibold text-blue-700">Administrasi sistem</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Kelola Data Master
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Kelola inventaris kendaraan, data pegawai negeri sipil, dan
            perangkat daerah.
          </p>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Kendaraan",
              count: vehicles.length,
              icon: CarFront,
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
              color: "bg-emerald-50 text-emerald-700",
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
        </div>

        <div
          aria-label="Pilih data yang dikelola"
          className="mb-6 flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
          role="tablist"
        >
          {entityTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                aria-controls={`${tab.id}-panel`}
                aria-selected={isActive}
                className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                id={`${tab.id}-tab`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                type="button"
              >
                <Icon aria-hidden="true" size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`${activeTab}-tab`}
          id={`${activeTab}-panel`}
          role="tabpanel"
        >
          {activeTab === "vehicles" ? (
            <EntityManager
              columns={[
                { key: "nomorPolisi", label: "Nomor polisi", emphasized: true },
                { key: "merek", label: "Merek" },
                { key: "model", label: "Tipe/model" },
                { key: "tahunProduksi", label: "Tahun" },
                { key: "warna", label: "Warna" },
                {
                  key: "kondisi",
                  label: "Kondisi",
                  badges: {
                    Baik: "bg-emerald-100 text-emerald-800",
                    "Perlu Perawatan": "bg-amber-100 text-amber-800",
                    Rusak: "bg-red-100 text-red-800",
                  },
                },
                {
                  key: "status",
                  label: "Status",
                  badges: {
                    Tersedia: "bg-emerald-100 text-emerald-800",
                    Dipinjam: "bg-blue-100 text-blue-800",
                  },
                },
              ]}
              description="Lengkapi informasi kendaraan dinas operasional."
              fields={vehicleFields}
              identityFields={["nomorPolisi"]}
              onCreate={(data) =>
                setVehicles((items) => [
                  createRecord(data, { status: "Tersedia" }),
                  ...items,
                ])
              }
              onDelete={deleteVehicle}
              onUpdate={(id, data) => updateRecord(setVehicles, id, data)}
              records={vehicles}
              schema={vehicleSchema}
              title="kendaraan"
            />
          ) : null}

          {activeTab === "employees" ? (
            <EntityManager
              columns={[
                { key: "nama", label: "Nama pegawai", emphasized: true },
                { key: "nip", label: "NIP" },
                { key: "jabatan", label: "Jabatan" },
                { key: "golongan", label: "Golongan" },
              ]}
              description="Masukkan identitas dan informasi kepegawaian PNS."
              fields={employeeFields}
              identityFields={["nip"]}
              onCreate={(data) =>
                setEmployees((items) => [createRecord(data), ...items])
              }
              onDelete={deleteEmployee}
              onUpdate={(id, data) => updateRecord(setEmployees, id, data)}
              records={employees}
              schema={employeeSchema}
              title="pegawai"
            />
          ) : null}

          {activeTab === "agencies" ? (
            <EntityManager
              columns={[
                { key: "nama", label: "Perangkat daerah", emphasized: true },
                { key: "jenis", label: "Jenis" },
                { key: "kabupatenKota", label: "Kabupaten/kota" },
                { key: "provinsi", label: "Provinsi" },
              ]}
              description="Pilih provinsi dan masukkan nama resmi perangkat daerah."
              fields={agencyFields}
              identityFields={["nama", "provinsi", "kabupatenKota"]}
              onCreate={(data) =>
                setAgencies((items) => [createRecord(data), ...items])
              }
              onDelete={deleteAgency}
              onUpdate={(id, data) => updateRecord(setAgencies, id, data)}
              records={agencies}
              schema={agencySchema}
              title="perangkat daerah"
            />
          ) : null}
        </div>

        {activeTab === "agencies" ? (
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <ClipboardList
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={15}
            />
            Katalog awal memuat 38 provinsi dan saran jenis perangkat daerah.
            Nama kabupaten/kota serta nama perangkat daerah dapat disesuaikan
            dengan struktur resmi masing-masing pemerintah daerah.
          </p>
        ) : null}
      </main>
  );
}
