import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RoleSwitcher from './components/RoleSwitcher';
import StatsOverview from './components/StatsOverview';
import CommunityShelf from './components/CommunityShelf';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import AddDonationModal from './components/AddDonationModal';
import HowItWorksModal from './components/HowItWorksModal';
import HubsView from './components/HubsView';
import MyRequestsView from './components/MyRequestsView';
import HubRequestManager from './components/HubRequestManager';
import VerificationRequestView from './components/VerificationRequestView';
import AdminReviewView from './components/AdminReviewView';
import ImpactView from './components/ImpactView';
import SettingsView from './components/SettingsView';
import ListingDetailModal from './components/ListingDetailModal';
import Toast from './components/Toast';
import { demoStorage } from './services/demoStorage';
import { Sparkles, PackagePlus, HeartHandshake, RotateCcw } from 'lucide-react';
import './App.css';

function App() {
  // Load persistent datasets from demoStorage
  const [listings, setListings] = useState(() => demoStorage.getListings());
  const [hubs, setHubs] = useState(() => demoStorage.getHubs());
  const [requests, setRequests] = useState(() => demoStorage.getRequests());
  const [verifications, setVerifications] = useState(() => demoStorage.getVerifications());
  const [flaggedListings, setFlaggedListings] = useState(() => demoStorage.getFlagged());
  const [userState, setUserState] = useState(() => demoStorage.getUserState());

  // Navigation and UI state
  const [activeView, setActiveView] = useState('shelf'); // 'shelf' | 'hubs' | 'my-requests' | 'hub-requests' | 'verification' | 'admin' | 'impact' | 'settings'
  const [activeHubFilter, setActiveHubFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialHubIdForAdd, setInitialHubIdForAdd] = useState('');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-sync state changes to demoStorage
  useEffect(() => {
    demoStorage.setListings(listings);
  }, [listings]);

  useEffect(() => {
    demoStorage.setHubs(hubs);
  }, [hubs]);

  useEffect(() => {
    demoStorage.setRequests(requests);
  }, [requests]);

  useEffect(() => {
    demoStorage.setVerifications(verifications);
  }, [verifications]);

  useEffect(() => {
    demoStorage.setFlagged(flaggedListings);
  }, [flaggedListings]);

  useEffect(() => {
    demoStorage.setUserState(userState);
  }, [userState]);

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

  // Active coordinator hub
  const coordinatorHub = useMemo(() => {
    return hubs.find((h) => h.id === userState.coordinatorHubId) || hubs[0];
  }, [hubs, userState.coordinatorHubId]);

  // Role switching
  const handleRoleChange = (newRole) => {
    setUserState((prev) => ({ ...prev, role: newRole }));
    showToast(
      'info',
      `Switched Demo Role`,
      `Operating interface as ${
        newRole === 'community'
          ? 'Community Member'
          : newRole === 'coordinator'
          ? 'Organization Coordinator'
          : 'Administrator'
      }.`
    );

    // Safeguard route accessibility
    if (newRole === 'community' && (activeView === 'hub-requests' || activeView === 'verification' || activeView === 'admin')) {
      setActiveView('shelf');
    } else if (newRole === 'coordinator' && activeView === 'admin') {
      setActiveView('hub-requests');
    } else if (newRole === 'admin' && (activeView === 'my-requests' || activeView === 'hub-requests' || activeView === 'verification')) {
      setActiveView('admin');
    }
  };

  const handleCoordinatorHubChange = (newHubId) => {
    setUserState((prev) => ({ ...prev, coordinatorHubId: newHubId }));
    const targetHub = hubs.find((h) => h.id === newHubId);
    showToast('info', 'Managed Hub Updated', `Now coordinating for ${targetHub?.name || newHubId}.`);
  };

  // Add listing
  const handleAddListing = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
    showToast(
      'success',
      'Donation Listed Successfully',
      `"${newListing.name}" is now cataloged at ${newListing.hubName}.`
    );
  };

  // Request supply toggle from shelf card
  const handleRequestToggle = (listingId) => {
    const item = listings.find((l) => l.id === listingId);
    if (!item) return;

    if (item.status === 'Available') {
      handleDetailedRequest(listingId, 'Community member reservation placed from shelf.');
    } else {
      // Return to shelf
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: 'Available', requestedAt: null } : l))
      );
      // Cancel active request in log
      setRequests((prev) =>
        prev.map((r) => {
          if (r.listingId === listingId && (r.status === 'Requested' || r.status === 'Accepted')) {
            return {
              ...r,
              status: 'Cancelled',
              updatedAt: new Date().toISOString(),
              history: [
                ...r.history,
                {
                  timestamp: new Date().toISOString(),
                  status: 'Cancelled',
                  actor: `${userState.userName} (You)`,
                  actorRole: 'Community Member',
                  note: 'Returned to shelf during demonstration test.',
                },
              ],
            };
          }
          return r;
        })
      );
      showToast('info', 'Returned to Shelf', `"${item.name}" is once again marked Available.`);
    }
  };

  // Detailed supply request with user note
  const handleDetailedRequest = (listingId, note) => {
    const item = listings.find((l) => l.id === listingId);
    if (!item) return;

    const newReqId = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newRequest = {
      id: newReqId,
      listingId: item.id,
      listingTitle: item.name,
      category: item.category,
      quantity: item.quantity,
      hubId: item.hubId,
      hubName: item.hubName,
      pickupLocation: item.location,
      requestedBy: 'Elena V. (You)',
      requestedByRole: 'Community Member',
      contactNote: note,
      status: 'Requested',
      createdAt: now,
      updatedAt: now,
      history: [
        {
          timestamp: now,
          status: 'Requested',
          actor: 'Elena V. (You)',
          actorRole: 'Community Member',
          note: note || 'Reservation placed via CareCycle.',
        },
      ],
    };

    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: 'Requested', requestedAt: now.split('T')[0] } : l))
    );

    setRequests((prev) => [newRequest, ...prev]);

    showToast(
      'success',
      'Supply Reserved!',
      `Request ${newReqId} created for "${item.name}". Track progress in My Requests.`
    );
  };

  // Cancel request by community member
  const handleCancelRequest = (requestId, reason) => {
    const now = new Date().toISOString();
    let affectedListingId = null;

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          affectedListingId = r.listingId;
          return {
            ...r,
            status: 'Cancelled',
            updatedAt: now,
            history: [
              ...r.history,
              {
                timestamp: now,
                status: 'Cancelled',
                actor: 'Elena V. (You)',
                actorRole: 'Community Member',
                note: reason || 'Cancelled by requester.',
              },
            ],
          };
        }
        return r;
      })
    );

    if (affectedListingId) {
      setListings((prev) =>
        prev.map((l) => (l.id === affectedListingId ? { ...l, status: 'Available', requestedAt: null } : l))
      );
    }

    showToast('info', 'Request Cancelled', 'The reserved supply has been returned to the available shelf.');
  };

  // Advance request status by coordinator
  const handleUpdateRequestStatus = (requestId, newStatus, actorName, actorRole, note) => {
    const now = new Date().toISOString();
    let affectedListingId = null;

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          affectedListingId = r.listingId;
          return {
            ...r,
            status: newStatus,
            updatedAt: now,
            history: [
              ...r.history,
              {
                timestamp: now,
                status: newStatus,
                actor: actorName,
                actorRole,
                note,
              },
            ],
          };
        }
        return r;
      })
    );

    // If declined, return listing to shelf
    if (newStatus === 'Declined' && affectedListingId) {
      setListings((prev) =>
        prev.map((l) => (l.id === affectedListingId ? { ...l, status: 'Available', requestedAt: null } : l))
      );
    }

    showToast('success', `Status Updated: ${newStatus}`, `Recorded activity note for request ${requestId}.`);
  };

  // Join or Leave Hub
  const handleToggleJoinHub = (hubId) => {
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id === hubId) {
          const nextJoined = !h.isJoined;
          const nextCount = nextJoined ? h.memberCount + 1 : Math.max(1, h.memberCount - 1);
          showToast(
            'success',
            nextJoined ? `Joined ${h.name}` : `Left ${h.name}`,
            nextJoined ? 'You will receive local coordination updates.' : 'Removed from your active hubs.'
          );
          return { ...h, isJoined: nextJoined, memberCount: nextCount };
        }
        return h;
      })
    );
  };

  // Submit Organization Verification Request
  const handleSubmitVerification = (verData) => {
    const now = new Date().toISOString();
    const newVer = {
      id: `VER-2026-${Math.floor(100 + Math.random() * 900)}`,
      ...verData,
      submittedAt: now,
      status: 'pending',
      reviewedAt: null,
      reviewerNotes: null,
    };

    setVerifications((prev) => [newVer, ...prev]);

    // Set hub status to pending
    setHubs((prev) =>
      prev.map((h) => (h.id === verData.hubId ? { ...h, trustStatus: 'verification_pending' } : h))
    );

    showToast(
      'success',
      'Verification Application Submitted',
      'Your request is now queued for administrator review.'
    );
  };

  // Review Verification Request by Admin
  const handleReviewVerification = (verId, decision, reviewerNotes) => {
    const now = new Date().toISOString();
    let affectedHubId = null;

    setVerifications((prev) =>
      prev.map((v) => {
        if (v.id === verId) {
          affectedHubId = v.hubId;
          return {
            ...v,
            status: decision,
            reviewedAt: now,
            reviewerNotes,
          };
        }
        return v;
      })
    );

    if (affectedHubId) {
      const newTrust = decision === 'approve' ? 'verified_admin' : 'unverified';
      setHubs((prev) =>
        prev.map((h) =>
          h.id === affectedHubId
            ? { ...h, trustStatus: newTrust, verifiedDate: decision === 'approve' ? now.split('T')[0] : null }
            : h
        )
      );
    }

    showToast(
      decision === 'approve' ? 'success' : 'info',
      `Verification ${decision === 'approve' ? 'Approved' : 'Rejected'}`,
      `Updated hub trust status and recorded administrative rationale.`
    );
  };

  // Direct hub trust change by admin
  const handleUpdateHubTrust = (hubId, newTrustStatus) => {
    setHubs((prev) =>
      prev.map((h) => (h.id === hubId ? { ...h, trustStatus: newTrustStatus } : h))
    );
    showToast('info', 'Hub Trust Badge Assigned', `Assigned new trust status to hub.`);
  };

  // Flag/Report listing
  const handleFlagListing = (listingId, listingName, reason) => {
    const now = new Date().toISOString();
    const newFlag = {
      id: `FLAG-2026-${Math.floor(100 + Math.random() * 900)}`,
      listingId,
      listingName,
      reportedBy: `${userState.userName} (Demo User)`,
      reason,
      reportedAt: now,
      status: 'open',
      resolutionNotes: null,
    };

    setFlaggedListings((prev) => [newFlag, ...prev]);
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, flagged: true, flagReason: reason } : l))
    );

    showToast(
      'warning',
      'Safety Inspection Report Filed',
      `"${listingName}" has been placed in the Administrator Safety Queue.`
    );
  };

  // Resolve flag
  const handleResolveFlag = (flagId, decision, resolutionNotes) => {
    setFlaggedListings((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, status: decision, resolutionNotes } : f))
    );
    showToast('success', 'Report Resolved', 'Safety report closed with administrator notes.');
  };

  // Remove listing from shelf by admin
  const handleRemoveListing = (listingId, flagId) => {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
    if (flagId) {
      setFlaggedListings((prev) =>
        prev.map((f) =>
          f.id === flagId ? { ...f, status: 'resolved', resolutionNotes: 'Listing removed from shelf.' } : f
        )
      );
    }
    showToast('info', 'Listing Removed', 'Item has been permanently unlisted from the community shelf.');
  };

  // Full reset
  const handleResetData = () => {
    demoStorage.resetAll();
    setListings(demoStorage.getListings());
    setHubs(demoStorage.getHubs());
    setRequests(demoStorage.getRequests());
    setVerifications(demoStorage.getVerifications());
    setFlaggedListings(demoStorage.getFlagged());
    setUserState(demoStorage.getUserState());
    setActiveView('shelf');
    setActiveHubFilter('All');
    showToast('info', 'Demo Data Reset', 'All records restored to coherent demonstration baseline.');
  };

  // Filter shelf by hub
  const handleViewHubListings = (hubId) => {
    setActiveHubFilter(hubId);
    setActiveView('shelf');
  };

  const handleOpenAddForHub = (hubId) => {
    setInitialHubIdForAdd(hubId);
    setIsAddModalOpen(true);
  };

  // Counters for sidebar badges
  const myRequestsCount = requests.filter(
    (r) =>
      (r.requestedBy.includes('You') || r.requestedBy === 'Elena Vance') &&
      (r.status === 'Requested' || r.status === 'Accepted' || r.status === 'Ready for collection')
  ).length;

  const hubRequestsCount = requests.filter(
    (r) =>
      r.hubId === coordinatorHub.id &&
      (r.status === 'Requested' || r.status === 'Accepted' || r.status === 'Ready for collection')
  ).length;

  const adminPendingCount =
    verifications.filter((v) => v.status === 'pending').length +
    flaggedListings.filter((f) => f.status === 'open').length;

  return (
    <div className="carecycle-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        currentRole={userState.role}
        onOpenAddModal={() => {
          setInitialHubIdForAdd('');
          setIsAddModalOpen(true);
        }}
        onResetData={handleResetData}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenSafetyGuide={() => {
          setActiveView('shelf');
          setTimeout(() => {
            document.getElementById('safety-disclaimer-title')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        myRequestsCount={myRequestsCount}
        hubRequestsCount={hubRequestsCount}
        adminPendingCount={adminPendingCount}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Header
          onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
          onOpenAddModal={() => {
            setInitialHubIdForAdd('');
            setIsAddModalOpen(true);
          }}
          currentRole={userState.role}
        />

        <main className="main-dashboard-body">
          {/* Role Switcher & Demo Mode Notice */}
          <RoleSwitcher
            currentRole={userState.role}
            onRoleChange={handleRoleChange}
            hubs={hubs}
            coordinatorHubId={userState.coordinatorHubId}
            onCoordinatorHubChange={handleCoordinatorHubChange}
          />

          {/* View Routing */}
          {activeView === 'shelf' && (
            <>
              {/* Hero Banner */}
              <section className="dashboard-hero">
                <div className="hero-content">
                  <div className="hero-tagline-badge">
                    <Sparkles size={14} className="badge-sparkle-icon" />
                    <span>Care, passed forward</span>
                  </div>
                  <h1 className="hero-heading">Community Medical Supply Exchange</h1>
                  <p className="hero-description">
                    Connecting unopened surplus health supplies and clean durable aids with community members who need them most. Zero waste, zero cost, pure care.
                  </p>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => {
                        setInitialHubIdForAdd('');
                        setIsAddModalOpen(true);
                      }}
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

              {/* Safety Disclaimer */}
              <SafetyDisclaimer />

              {/* Dashboard Statistics Overview */}
              <StatsOverview listings={listings} />

              {/* Community Shelf */}
              <CommunityShelf
                listings={listings}
                hubs={hubs}
                onRequestToggle={handleRequestToggle}
                onOpenAddModal={() => {
                  setInitialHubIdForAdd('');
                  setIsAddModalOpen(true);
                }}
                onOpenDetail={(listing) => setSelectedListingDetail(listing)}
                activeHubFilter={activeHubFilter}
                onSetActiveHubFilter={setActiveHubFilter}
              />
            </>
          )}

          {activeView === 'hubs' && (
            <HubsView
              hubs={hubs}
              listings={listings}
              requests={requests}
              onToggleJoinHub={handleToggleJoinHub}
              onViewHubListings={handleViewHubListings}
              onOpenAddDonationForHub={handleOpenAddForHub}
            />
          )}

          {activeView === 'my-requests' && (
            <MyRequestsView
              requests={requests}
              onCancelRequest={handleCancelRequest}
              onNavigateToShelf={() => setActiveView('shelf')}
            />
          )}

          {activeView === 'hub-requests' && (
            <HubRequestManager
              coordinatorHub={coordinatorHub}
              requests={requests}
              onUpdateRequestStatus={handleUpdateRequestStatus}
            />
          )}

          {activeView === 'verification' && (
            <VerificationRequestView
              coordinatorHub={coordinatorHub}
              verifications={verifications}
              onSubmitVerification={handleSubmitVerification}
            />
          )}

          {activeView === 'admin' && (
            <AdminReviewView
              hubs={hubs}
              verifications={verifications}
              flaggedListings={flaggedListings}
              listings={listings}
              requests={requests}
              onReviewVerification={handleReviewVerification}
              onUpdateHubTrust={handleUpdateHubTrust}
              onResolveFlag={handleResolveFlag}
              onRemoveListing={handleRemoveListing}
            />
          )}

          {activeView === 'impact' && (
            <ImpactView listings={listings} requests={requests} hubs={hubs} />
          )}

          {activeView === 'settings' && (
            <SettingsView
              listings={listings}
              requests={requests}
              hubs={hubs}
              verifications={verifications}
              flaggedListings={flaggedListings}
              userState={userState}
              onResetData={handleResetData}
            />
          )}

          {/* Footer note */}
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
        hubs={hubs}
        initialHubId={initialHubIdForAdd}
      />

      {/* Listing Detail Modal */}
      {selectedListingDetail && (
        <ListingDetailModal
          listing={selectedListingDetail}
          hub={hubs.find((h) => h.id === selectedListingDetail.hubId)}
          onClose={() => setSelectedListingDetail(null)}
          onRequest={handleDetailedRequest}
          onReturnToShelf={handleRequestToggle}
          onFlagListing={handleFlagListing}
        />
      )}

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onOpenAddModal={() => {
          setInitialHubIdForAdd('');
          setIsAddModalOpen(true);
        }}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
