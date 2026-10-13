import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import CommunityShelf from './components/CommunityShelf';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import AddDonationModal from './components/AddDonationModal';
import HowItWorksModal from './components/HowItWorksModal';
import Toast from './components/Toast';
import { INITIAL_LISTINGS } from './data/mockListings';
import { HeartHandshake, Sparkles, PackagePlus, RotateCcw } from 'lucide-react';
import './App.css';

const STORAGE_KEY = 'carecycle_prototype_listings_v1';

function App() {
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load listings from localStorage, falling back to defaults:', err);
    }
    return INITIAL_LISTINGS;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeView, setActiveView] = useState('shelf');
  const [toast, setToast] = useState(null);

  // Sync state to localStorage whenever listings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [listings]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  // Add new listing handler
  const handleAddListing = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
    showToast(
      'success',
      'Donation Listed Successfully',
      `"${newListing.name}" is now visible on the Community Shelf for local pickup.`
    );
  };

  // Toggle Request status handler
  const handleRequestToggle = (id) => {
    let affectedItem = null;
    let newStatus = '';

    setListings((prevListings) =>
      prevListings.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Available' ? 'Requested' : 'Available';
          newStatus = nextStatus;
          affectedItem = item;
          return {
            ...item,
            status: nextStatus,
            requestedAt: nextStatus === 'Requested' ? new Date().toISOString().split('T')[0] : null,
          };
        }
        return item;
      })
    );

    if (affectedItem) {
      if (newStatus === 'Requested') {
        showToast(
          'success',
          'Supply Requested',
          `You reserved "${affectedItem.name}". Coordinate with the coordinator at ${affectedItem.location}.`
        );
      } else {
        showToast(
          'info',
          'Returned to Shelf',
          `"${affectedItem.name}" has been marked Available again on the Community Shelf.`
        );
      }
    }
  };

  // Reset to default fictional dataset
  const handleResetData = () => {
    setListings(INITIAL_LISTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LISTINGS));
    showToast(
      'info',
      'Demo Data Reset',
      'The catalog was refreshed with default fictional community listings.'
    );
  };

  const handleOpenSafetyGuide = () => {
    const el = document.getElementById('safety-disclaimer-title');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="carecycle-app-layout">
      {/* Sidebar navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenSafetyGuide={handleOpenSafetyGuide}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Header
          onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="main-dashboard-body">
          {/* Hero Welcome Banner */}
          <section className="dashboard-hero">
            <div className="hero-content">
              <div className="hero-tagline-badge">
                <Sparkles size={14} className="badge-sparkle-icon" />
                <span>Care, passed forward</span>
              </div>
              <h1 className="hero-heading">
                Community Medical Supply Exchange
              </h1>
              <p className="hero-description">
                Connecting unopened surplus health supplies and clean durable aids with community members who need them most. Zero waste, zero cost, pure care.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <PackagePlus size={18} />
                  <span>Donate Supplies</span>
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setIsHowItWorksOpen(true)}
                >
                  <HeartHandshake size={18} />
                  <span>How CareCycle Works</span>
                </button>
              </div>
            </div>
          </section>

          {/* Prominent Safety Disclaimer */}
          <SafetyDisclaimer />

          {/* Dashboard Statistics Overview */}
          <StatsOverview listings={listings} />

          {/* Community Shelf Section */}
          <CommunityShelf
            listings={listings}
            onRequestToggle={handleRequestToggle}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />

          {/* Footer note & prototype transparency */}
          <footer className="dashboard-footer">
            <div className="footer-content">
              <div className="footer-brand">
                <strong>CareCycle</strong> — <em>Care, passed forward.</em>
              </div>
              <p className="footer-disclaimer-note">
                Fictional demo data for prototype exploration. Prototype data is stored locally in your browser&apos;s localStorage and is not shared with any backend or other users.
              </p>
              <button
                type="button"
                className="btn-footer-reset"
                onClick={handleResetData}
              >
                <RotateCcw size={13} />
                <span>Reset Fictional Demo Catalog</span>
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Add Donation Modal */}
      <AddDonationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddListing={handleAddListing}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
