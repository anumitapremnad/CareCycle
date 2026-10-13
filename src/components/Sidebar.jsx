import {
  HeartHandshake,
  Layers,
  Building2,
  Clock,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Settings,
  HelpCircle,
  PackagePlus,
  RotateCcw,
  Database,
  Inbox,
  FileCheck,
} from 'lucide-react';

export default function Sidebar({
  activeView,
  setActiveView,
  currentRole,
  onOpenAddModal,
  onResetData,
  onOpenHowItWorks,
  onOpenSafetyGuide,
  isOpenMobile,
  onCloseMobile,
  myRequestsCount = 0,
  hubRequestsCount = 0,
  adminPendingCount = 0,
}) {
  const handleNavClick = (view) => {
    setActiveView(view);
    if (isOpenMobile) onCloseMobile();
  };

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
          <div className="nav-section-title">Explore &amp; Circulation</div>
          <ul className="nav-list">
            <li>
              <button
                type="button"
                className={`nav-item ${activeView === 'shelf' ? 'nav-item--active' : ''}`}
                onClick={() => handleNavClick('shelf')}
              >
                <Layers size={18} className="nav-item-icon" />
                <span>Community Shelf</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`nav-item ${activeView === 'hubs' ? 'nav-item--active' : ''}`}
                onClick={() => handleNavClick('hubs')}
              >
                <Building2 size={18} className="nav-item-icon" />
                <span>Community Hubs</span>
              </button>
            </li>

            {/* Role-Specific Navigation items */}
            {currentRole === 'community' && (
              <li>
                <button
                  type="button"
                  className={`nav-item ${activeView === 'my-requests' ? 'nav-item--active' : ''}`}
                  onClick={() => handleNavClick('my-requests')}
                >
                  <Clock size={18} className="nav-item-icon" />
                  <span>My Requests</span>
                  {myRequestsCount > 0 && (
                    <span className="sidebar-pill-badge">{myRequestsCount}</span>
                  )}
                </button>
              </li>
            )}

            {currentRole === 'coordinator' && (
              <>
                <li>
                  <button
                    type="button"
                    className={`nav-item ${activeView === 'hub-requests' ? 'nav-item--active' : ''}`}
                    onClick={() => handleNavClick('hub-requests')}
                  >
                    <Inbox size={18} className="nav-item-icon" />
                    <span>Hub Requests Intake</span>
                    {hubRequestsCount > 0 && (
                      <span className="sidebar-pill-badge">{hubRequestsCount}</span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-item ${activeView === 'verification' ? 'nav-item--active' : ''}`}
                    onClick={() => handleNavClick('verification')}
                  >
                    <FileCheck size={18} className="nav-item-icon" />
                    <span>Hub Verification</span>
                  </button>
                </li>
              </>
            )}

            {currentRole === 'admin' && (
              <li>
                <button
                  type="button"
                  className={`nav-item ${activeView === 'admin' ? 'nav-item--active' : ''}`}
                  onClick={() => handleNavClick('admin')}
                >
                  <ShieldAlert size={18} className="nav-item-icon text-peach" />
                  <span>Admin Review Queue</span>
                  {adminPendingCount > 0 && (
                    <span className="sidebar-pill-badge sidebar-pill-badge--warning">
                      {adminPendingCount}
                    </span>
                  )}
                </button>
              </li>
            )}

            <li>
              <button
                type="button"
                className={`nav-item ${activeView === 'impact' ? 'nav-item--active' : ''}`}
                onClick={() => handleNavClick('impact')}
              >
                <TrendingUp size={18} className="nav-item-icon" />
                <span>Impact Insights</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className={`nav-item ${activeView === 'settings' ? 'nav-item--active' : ''}`}
                onClick={() => handleNavClick('settings')}
              >
                <Settings size={18} className="nav-item-icon" />
                <span>Demo Settings &amp; Data</span>
              </button>
            </li>
          </ul>

          <div className="nav-section-title mt-2">Information</div>
          <ul className="nav-list">
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
                <span>Safety Standards</span>
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
          <p className="footer-subtext">Care, passed forward &bull; MVP</p>
        </div>
      </aside>
    </>
  );
}
