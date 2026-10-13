import { Package, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function StatsOverview({ listings }) {
  const total = listings.length;
  const available = listings.filter((l) => l.status === 'Available').length;
  const requested = listings.filter((l) => l.status === 'Requested').length;

  // Calculate unique community hubs
  const uniqueHubs = new Set(listings.map((l) => l.location)).size;

  const stats = [
    {
      id: 'total',
      label: 'Total Listings',
      value: total,
      subtext: 'Cataloged demo items',
      icon: Package,
      badge: 'All Supplies',
      badgeClass: 'badge--neutral',
      colorVar: 'total',
    },
    {
      id: 'available',
      label: 'Available Supplies',
      value: available,
      subtext: 'Ready for community pickup',
      icon: CheckCircle2,
      badge: `${total > 0 ? Math.round((available / total) * 100) : 0}% available`,
      badgeClass: 'badge--mint',
      colorVar: 'available',
    },
    {
      id: 'requested',
      label: 'Requested Items',
      value: requested,
      subtext: 'Claimed by community members',
      icon: Clock,
      badge: `${requested} active requests`,
      badgeClass: 'badge--peach',
      colorVar: 'requested',
    },
    {
      id: 'hubs',
      label: 'Community Hubs',
      value: uniqueHubs,
      subtext: 'Local pickup & drop locations',
      icon: MapPin,
      badge: 'Neighborhood network',
      badgeClass: 'badge--forest',
      colorVar: 'hubs',
    },
  ];

  return (
    <section className="stats-overview" aria-label="Dashboard Overview Statistics">
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={`stat-card stat-card--${stat.colorVar}`}>
              <div className="stat-card__top">
                <div className="stat-card__icon-box">
                  <Icon size={22} />
                </div>
                <span className={`stat-card__pill ${stat.badgeClass}`}>{stat.badge}</span>
              </div>
              <div className="stat-card__body">
                <span className="stat-card__value">{stat.value}</span>
                <h3 className="stat-card__label">{stat.label}</h3>
                <p className="stat-card__subtext">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
