import {
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Building2,
  PieChart,
  HelpCircle,
  Activity,
  Layers,
} from 'lucide-react';

export default function ImpactView({ listings, requests, hubs }) {
  // 1. Total donation listings created
  const totalListings = listings.length;

  // 2. Currently available listings
  const availableListings = listings.filter((l) => l.status === 'Available').length;

  // 3. Total requests received
  const totalRequests = requests.length;

  // 4. Completed requests
  const completedRequests = requests.filter((r) => r.status === 'Completed').length;

  // 5. Active community hubs (hubs that have at least 1 listing or 1 request)
  const activeHubsCount = hubs.filter(
    (h) =>
      listings.some((l) => l.hubId === h.id) ||
      requests.some((r) => r.hubId === h.id)
  ).length;

  // 6. Simple completion rate formula: (completedRequests / totalRequests) * 100
  // Safe zero denominator handling
  const completionRate =
    totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(1) : '0.0';

  // Request status breakdown
  const requestedPendingCount = requests.filter((r) => r.status === 'Requested').length;
  const inProgressCount = requests.filter(
    (r) => r.status === 'Accepted' || r.status === 'Ready for collection'
  ).length;
  const terminalOtherCount = requests.filter(
    (r) => r.status === 'Declined' || r.status === 'Cancelled'
  ).length;

  // Listings by Category breakdown
  const categoryCounts = {};
  listings.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  // Calculate percentages for category breakdown
  const categoryList = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    count,
    percent: totalListings > 0 ? Math.round((count / totalListings) * 100) : 0,
  }));

  // Recent timeline events (merged from requests and listings)
  const recentEvents = [
    ...requests.map((r) => ({
      id: `req-${r.id}`,
      type: 'request',
      title: `Request ${r.id}: ${r.listingTitle}`,
      detail: `Status: ${r.status} (${r.hubName})`,
      time: new Date(r.updatedAt || r.createdAt),
    })),
    ...listings.map((l) => ({
      id: `list-${l.id}`,
      type: 'listing',
      title: `Listed: ${l.name}`,
      detail: `${l.quantity} at ${l.hubName || l.location}`,
      time: new Date(l.dateAdded),
    })),
  ]
    .sort((a, b) => b.time - a.time)
    .slice(0, 6);

  return (
    <section className="impact-view" aria-labelledby="impact-title">
      <div className="view-header">
        <div className="view-header__title-group">
          <div className="view-badge">
            <TrendingUp size={14} />
            <span>Empirical Coordination Analytics</span>
          </div>
          <h2 id="impact-title" className="view-title">
            Community Impact &amp; Circulation Insights
          </h2>
          <p className="view-subtitle">
            All metrics shown below are calculated strictly from the records stored in this demonstration session.
          </p>
        </div>
      </div>

      {/* Core Stored Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon-box">
              <Package size={22} />
            </div>
            <span className="stat-card__pill badge--neutral">Cataloged</span>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__value">{totalListings}</span>
            <h3 className="stat-card__label">Total Listings Created</h3>
            <p className="stat-card__subtext">Count of items ever cataloged</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon-box text-mint">
              <CheckCircle2 size={22} />
            </div>
            <span className="stat-card__pill badge--mint">
              {totalListings > 0 ? Math.round((availableListings / totalListings) * 100) : 0}% of inventory
            </span>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__value">{availableListings}</span>
            <h3 className="stat-card__label">Currently Available</h3>
            <p className="stat-card__subtext">Ready for community reservation</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon-box text-peach">
              <Clock size={22} />
            </div>
            <span className="stat-card__pill badge--peach">{totalRequests} recorded</span>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__value">{totalRequests}</span>
            <h3 className="stat-card__label">Total Requests Received</h3>
            <p className="stat-card__subtext">Community reservations placed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__top">
            <div className="stat-card__icon-box text-forest">
              <Building2 size={22} />
            </div>
            <span className="stat-card__pill badge--forest">{activeHubsCount} active</span>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__value">{activeHubsCount}</span>
            <h3 className="stat-card__label">Active Community Hubs</h3>
            <p className="stat-card__subtext">Hubs with items or requests</p>
          </div>
        </div>
      </div>

      {/* Completion Rate Indicator Card */}
      <div className="card completion-rate-banner">
        <div className="completion-rate-content">
          <div className="completion-rate-left">
            <span className="rate-number">{completionRate}%</span>
            <div className="rate-text-group">
              <h3 className="rate-title">Request Completion Rate</h3>
              <p className="rate-formula">
                Formula: <code>(Completed Requests / Total Requests) &times; 100</code> &bull; ({completedRequests} / {totalRequests})
              </p>
            </div>
          </div>
          <div className="completion-bar-container">
            <div
              className="completion-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, parseFloat(completionRate)))}%` }}
              role="progressbar"
              aria-valuenow={parseFloat(completionRate)}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      </div>

      {/* Visual Breakdowns: Request Status & Categories */}
      <div className="impact-grid-2">
        {/* Request Lifecycle Distribution */}
        <div className="card breakdown-card">
          <div className="breakdown-card__header">
            <PieChart size={18} className="breakdown-icon" />
            <h3 className="breakdown-card__title">Request Fulfillment Distribution</h3>
          </div>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-item__top">
                <span>Completed Handovers</span>
                <strong>{completedRequests}</strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-bar progress--forest"
                  style={{ width: `${totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-item__top">
                <span>In Progress (Accepted / Ready)</span>
                <strong>{inProgressCount}</strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-bar progress--mint"
                  style={{ width: `${totalRequests > 0 ? (inProgressCount / totalRequests) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-item__top">
                <span>Pending Coordinator Intake</span>
                <strong>{requestedPendingCount}</strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-bar progress--peach"
                  style={{ width: `${totalRequests > 0 ? (requestedPendingCount / totalRequests) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-item__top">
                <span>Declined or Cancelled</span>
                <strong>{terminalOtherCount}</strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-bar progress--neutral"
                  style={{ width: `${totalRequests > 0 ? (terminalOtherCount / totalRequests) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Category Breakdown */}
        <div className="card breakdown-card">
          <div className="breakdown-card__header">
            <Layers size={18} className="breakdown-icon" />
            <h3 className="breakdown-card__title">Inventory by Category</h3>
          </div>
          <div className="breakdown-list">
            {categoryList.map((cat) => (
              <div key={cat.name} className="breakdown-item">
                <div className="breakdown-item__top">
                  <span>{cat.name}</span>
                  <strong>{cat.count} ({cat.percent}%)</strong>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-bar progress--forest"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="card activity-stream-card">
        <div className="breakdown-card__header">
          <Activity size={18} className="breakdown-icon" />
          <h3 className="breakdown-card__title">Recent Stored Activity</h3>
        </div>
        <div className="activity-stream-list">
          {recentEvents.map((ev) => (
            <div key={ev.id} className="activity-stream-item">
              <div className="activity-dot" />
              <div className="activity-info">
                <div className="activity-title">{ev.title}</div>
                <div className="activity-detail">{ev.detail}</div>
              </div>
              <time className="activity-date">
                {ev.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </time>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Notice */}
      <div className="data-source-footer-box">
        <HelpCircle size={16} />
        <p>
          <strong>Methodology Note:</strong> CareCycle does not generate fabricated claims such as financial savings or patient outcomes. All indicators reflect genuine local storage transactions recorded within this browser session.
        </p>
      </div>
    </section>
  );
}
