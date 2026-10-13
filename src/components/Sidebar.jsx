import {
  HeartHandshake,
  Layers,
  ShieldCheck,
  HelpCircle,
  PackagePlus,
  RotateCcw,
  Database,
} from 'lucide-react';

export default function Sidebar({
  activeView,
  setActiveView,
  onOpenAddModal,
  onResetData,
  onOpenHowItWorks,
  onOpenSafetyGuide,
  isOpenMobile,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          role="presentation"
        />
      )}

      <aside className={`app-sidebar ${isOpenMobile ? 'app-sidebar--mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <HeartHandshake size={28} className="brand-icon" />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">CareCycle</h1>
            <p className="brand-tagline">Care, passed forward.</p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="sidebar-cta-wrap">
          <button
            type="button"
            className="btn btn--primary btn--full"
            onClick={() => {
              onOpenAddModal();
              if (isOpenMobile) onCloseMobile();
            }}
          >
            <PackagePlus size={18} />
            <span>Donate Supplies</span>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <div className="nav-section-title">Navigation</div>
          <ul className="nav-list">
            <li>
              <button
                type="button"
                className={`nav-item ${activeView === 'shelf' ? 'nav-item--active' : ''}`}
                onClick={() => {
                  setActiveView('shelf');
                  if (isOpenMobile) onCloseMobile();
                }}
              >
                <Layers size={18} className="nav-item-icon" />
                <span>Community Shelf</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-item"
                onClick={() => {
                  onOpenHowItWorks();
                  if (isOpenMobile) onCloseMobile();
                }}
              >
                <HelpCircle size={18} className="nav-item-icon" />
                <span>How It Works</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-item"
                onClick={() => {
                  onOpenSafetyGuide();
                  if (isOpenMobile) onCloseMobile();
                }}
              >
                <ShieldCheck size={18} className="nav-item-icon" />
                <span>Safety Guidelines</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* LocalStorage Prototype Notice */}
        <div className="sidebar-prototype-badge">
          <div className="prototype-badge-header">
            <Database size={15} />
            <span>Local Prototype Storage</span>
          </div>
          <p className="prototype-badge-desc">
            Data is stored in this browser&apos;s <code>localStorage</code> for demonstration. It is not shared across multi-user devices.
          </p>
          <button
            type="button"
            className="btn-reset-demo"
            onClick={() => {
              onResetData();
              if (isOpenMobile) onCloseMobile();
            }}
            title="Reset to default fictional demo dataset"
          >
            <RotateCcw size={13} />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <p className="footer-tagline">CareCycle &copy; 2026</p>
          <p className="footer-subtext">Social-Impact Health Exchange</p>
        </div>
      </aside>
    </>
  );
}
