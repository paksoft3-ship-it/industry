"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";

const ENTITY_TYPES = [
  "Product",
  "Category",
  "Brand",
  "Order",
  "User",
  "Coupon",
  "Bundle",
  "BlogPost",
  "BlogCategory",
  "FileLibrary",
  "StaticPage",
  "SiteSettings",
] as const;

const ACTION_TYPES = ["CREATE", "UPDATE", "DELETE"] as const;

interface AuditUser {
  firstName: string | null;
  lastName: string | null;
  email: string;
}

interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: AuditUser | null;
}

interface Props {
  logs: AuditLog[];
  total: number;
  totalPages: number;
  page: number;
  entityFilter: string;
  actionFilter: string;
}

function getActionBadge(action: string) {
  switch (action) {
    case "CREATE":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
          <MaterialIcon icon="add_circle" className="!text-sm" />
          CREATE
        </span>
      );
    case "UPDATE":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          <MaterialIcon icon="edit" className="!text-sm" />
          UPDATE
        </span>
      );
    case "DELETE":
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
          <MaterialIcon icon="delete" className="!text-sm" />
          DELETE
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
          {action}
        </span>
      );
  }
}

function getUserDisplay(log: AuditLog) {
  if (!log.user) return "Sistem";
  const { firstName, lastName, email } = log.user;
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ");
  }
  return email;
}

export default function AdminAuditLogClient({
  logs,
  total,
  totalPages,
  page,
  entityFilter,
  actionFilter,
}: Props) {
  const router = useRouter();
  const [entity, setEntity] = useState(entityFilter);
  const [action, setAction] = useState(actionFilter);

  function applyFilters(newEntity?: string, newAction?: string) {
    const e = newEntity ?? entity;
    const a = newAction ?? action;
    const params = new URLSearchParams();
    if (e) params.set("entity", e);
    if (a) params.set("action", a);
    params.set("page", "1");
    router.push(`/admin/audit-log?${params.toString()}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams();
    if (entity) params.set("entity", entity);
    if (action) params.set("action", action);
    params.set("page", String(p));
    router.push(`/admin/audit-log?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
          Audit Log
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Sistem işlem geçmişi — toplam {total} kayıt
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Varlık:</label>
          <select
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              applyFilters(e.target.value, undefined);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Tümü</option>
            {ENTITY_TYPES.map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">İşlem:</label>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              applyFilters(undefined, e.target.value);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Tümü</option>
            {ACTION_TYPES.map((at) => (
              <option key={at} value={at}>
                {at}
              </option>
            ))}
          </select>
        </div>

        {(entity || action) && (
          <button
            onClick={() => {
              setEntity("");
              setAction("");
              router.push("/admin/audit-log?page=1");
            }}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MaterialIcon icon="filter_alt_off" className="!text-base" />
            Filtreleri temizle
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Tarih
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Kullanıcı
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  İşlem
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Varlık
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                  Detay
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <MaterialIcon
                      icon="info"
                      className="!text-4xl text-gray-300 mb-2"
                    />
                    <p>Kayıt bulunamadı</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {getUserDisplay(log)}
                    </td>
                    <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                        {log.entity}
                        {log.entityId ? `:${log.entityId}` : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Sayfa {page} / {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <MaterialIcon icon="chevron_left" className="!text-xl" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) {
                  acc.push("ellipsis");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-9 h-9 flex items-center justify-center text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item as number)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === item
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <MaterialIcon icon="chevron_right" className="!text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
