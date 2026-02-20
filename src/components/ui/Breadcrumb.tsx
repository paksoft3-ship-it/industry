import Link from "next/link";
import MaterialIcon from "./MaterialIcon";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 overflow-x-auto hide-scrollbar">
      <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
        Ana Sayfa
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <MaterialIcon icon="chevron_right" className="text-[14px] flex-shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors whitespace-nowrap">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium whitespace-nowrap">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
