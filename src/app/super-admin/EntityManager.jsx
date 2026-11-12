"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

function normalizeValue(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("id-ID");
}

export default function EntityManager({
  title,
  description,
  schema,
  fields,
  columns,
  records,
  identityFields,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [formNotice, setFormNotice] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(
      fields.map((field) => [field.name, field.defaultValue ?? ""]),
    ),
  });

  function resetForm() {
    setEditingId(null);
    setFormNotice("");
    reset(
      Object.fromEntries(
        fields.map((field) => [field.name, field.defaultValue ?? ""]),
      ),
    );
  }

  function submitRecord(data) {
    const duplicate = records.some(
      (record) =>
        record.id !== editingId &&
        identityFields.every(
          (field) =>
            normalizeValue(record[field]) === normalizeValue(data[field]),
        ),
    );

    if (duplicate) {
      setFormNotice("Data dengan identitas tersebut sudah terdaftar.");
      return;
    }

    if (editingId) {
      onUpdate(editingId, data);
      setNotice("Perubahan data berhasil disimpan.");
    } else {
      onCreate(data);
      setNotice("Data berhasil ditambahkan.");
    }

    resetForm();
  }

  function startEditing(record) {
    setEditingId(record.id);
    setFormNotice("");
    setNotice("");
    reset(
      Object.fromEntries(
        fields.map((field) => [field.name, record[field.name] ?? ""]),
      ),
    );
  }

  function deleteRecord(record) {
    if (!window.confirm(`Hapus data "${record[identityFields[0]]}"?`)) {
      return;
    }

    if (onDelete(record.id) === false) {
      setFormNotice(
        "Data ini masih dipakai oleh peminjaman aktif dan tidak dapat dihapus.",
      );
      return;
    }

    setNotice("Data berhasil dihapus.");
    if (editingId === record.id) {
      resetForm();
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              {editingId ? (
                <Pencil aria-hidden="true" size={19} />
              ) : (
                <Plus aria-hidden="true" size={21} />
              )}
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">
                {editingId ? `Ubah ${title}` : `Tambah ${title}`}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            </div>
          </div>
        </div>

        <form
          className="grid gap-x-6 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-7"
          noValidate
          onSubmit={handleSubmit(submitRecord)}
        >
          {fields.map((field) => (
            <div className={field.fullWidth ? "sm:col-span-2" : ""} key={field.name}>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              {field.options ? (
                <select
                  className={`${inputClassName} appearance-none`}
                  id={field.name}
                  {...register(field.name)}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  autoComplete="off"
                  className={inputClassName}
                  id={field.name}
                  list={field.suggestions ? `${field.name}-suggestions` : undefined}
                  max={field.max}
                  min={field.min}
                  placeholder={field.placeholder}
                  type={field.type ?? "text"}
                  {...register(field.name)}
                />
              )}
              {field.suggestions ? (
                <datalist id={`${field.name}-suggestions`}>
                  {field.suggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              ) : null}
              {errors[field.name] ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors[field.name].message}
                </p>
              ) : null}
            </div>
          ))}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Data dikelola sementara di halaman ini dan belum tersimpan ke
              database.
            </p>
            <div className="flex gap-2">
              {editingId ? (
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  onClick={resetForm}
                  type="button"
                >
                  <X aria-hidden="true" size={16} />
                  Batal
                </button>
              ) : null}
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                type="submit"
              >
                {editingId ? (
                  <Check aria-hidden="true" size={17} />
                ) : (
                  <Plus aria-hidden="true" size={17} />
                )}
                {editingId ? "Simpan perubahan" : "Tambahkan"}
              </button>
            </div>
          </div>

          {formNotice ? (
            <p className="text-sm text-red-600 sm:col-span-2" role="alert">
              {formNotice}
            </p>
          ) : null}
        </form>

        {notice ? (
          <div
            aria-live="polite"
            className="mx-5 mb-5 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:mx-7"
            role="status"
          >
            <Check aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
            <span>{notice}</span>
            <button
              aria-label="Tutup notifikasi"
              className="ml-auto text-emerald-700 hover:text-emerald-900"
              onClick={() => setNotice("")}
              type="button"
            >
              <X aria-hidden="true" size={17} />
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 className="font-semibold text-slate-900">Daftar {title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Kelola data yang sudah ditambahkan.
            </p>
          </div>
          <span className="text-sm text-slate-500">{records.length} data</span>
        </div>

        {records.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-7">
            <p className="text-sm font-medium text-slate-700">
              Belum ada data {title.toLocaleLowerCase("id-ID")}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Data yang ditambahkan akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {columns.map((column) => (
                    <th
                      className="px-6 py-3.5 font-semibold"
                      key={column.key}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3.5 font-semibold">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr className="text-slate-700" key={record.id}>
                    {columns.map((column) => (
                      <td className="px-6 py-4" key={column.key}>
                        {column.badges ? (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${column.badges[record[column.key]]}`}
                          >
                            {record[column.key]}
                          </span>
                        ) : (
                          <span
                            className={
                              column.emphasized
                                ? "font-semibold text-slate-900"
                                : ""
                            }
                          >
                            {record[column.key]}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        aria-label={`Ubah ${record[identityFields[0]]}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => startEditing(record)}
                        type="button"
                      >
                        <Pencil aria-hidden="true" size={16} />
                      </button>
                      <button
                        aria-label={`Hapus ${record[identityFields[0]]}`}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        onClick={() => deleteRecord(record)}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
