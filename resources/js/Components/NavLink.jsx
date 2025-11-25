import React, { forwardRef } from "react";
import { Link } from "@inertiajs/react";

/**
 * NavLink that properly merges activeClassName when `active` is true.
 * Usage:
 * <NavLink href={route('...')} active={route().current('admin.dashboard')} className="..." activeClassName="animate-activeMenu" />
 */
const NavLink = forwardRef(function NavLink(
  { href, active = false, className = "", activeClassName = "", children, ...props },
  ref
) {
  const base = "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300";
  const inactive = "text-gray-700 hover:bg-gray-100";
  const activeDefaults = ""; // keep default active styling small; pass additional via activeClassName

  // Compose classes: base + (active ? activeDefaults + activeClassName : inactive) + user className
  const finalClass = [
    base,
    active ? activeDefaults : inactive,
    active ? activeClassName : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} ref={ref} className={finalClass} aria-current={active ? "page" : undefined} {...props}>
      {children}
    </Link>
  );
});

export default NavLink;
