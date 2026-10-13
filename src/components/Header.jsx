import { Menu, HeartHandshake, PackagePlus } from 'lucide-react';

export default function Header({ onToggleMobileMenu, onOpenAddModal }) {
  return (
    <header className="app-mobile-header">
      <div className="mobile-header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="mobile-brand">
          <HeartHandshake size={22} className="mobile-brand-icon" />
          <div className="mobile-brand-text">
            <span className="mobile-brand-name">CareCycle</span>
            <span className="mobile-brand-tagline">Care, passed forward</span>
          </div>
        </div>
      </div>

      <div className="mobile-header-right">
        <button
          type="button"
          className="btn btn--primary btn--compact"
          onClick={onOpenAddModal}
        >
          <PackagePlus size={16} />
          <span>Donate</span>
        </button>
      </div>
    </header>
  );
}
