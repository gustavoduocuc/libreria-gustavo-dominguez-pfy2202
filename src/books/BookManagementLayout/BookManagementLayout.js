import { NavLink, Navigate, Outlet } from 'react-router';
import { focusRingClass } from '../../ui/focusRing';

const baseLinkClass = `inline-flex min-h-11 items-center rounded-control px-3 py-2 text-sm transition-colors duration-200 ${focusRingClass}`;
const currentLinkClass = `${baseLinkClass} bg-accent-soft font-semibold text-accent`;
const otherLinkClass = `${baseLinkClass} text-muted hover:bg-surface hover:text-text`;

export function BookManagementIndex() {
  return <Navigate to="inventario-libros" replace />;
}

function bookLinkClass(state) {
  if (state.isActive) {
    return currentLinkClass;
  }
  return otherLinkClass;
}

export function BookManagementLayout() {
  return (
    <>
      <nav aria-label="Gestión de libros" className="mb-section flex flex-wrap gap-2">
        <NavLink className={bookLinkClass} to="agregar-libro">
          Agregar libro
        </NavLink>
        <NavLink className={bookLinkClass} to="inventario-libros">
          Inventario de libros
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
}
