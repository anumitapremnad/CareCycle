import { Users, Building2, ShieldAlert, Info } from 'lucide-react';

const ROLES = [
  {
    id: 'community',
    label: 'Community Member',
    icon: Users,
    description: 'Browse, search, request supplies, join community hubs, and track personal requests.',
  },
  {
    id: 'coordinator',
    label: 'Organization Coordinator',
    icon: Building2,
    description: 'Manage hub listings, review incoming requests, advance collection statuses, and request verification.',
  },
  {
    id: 'admin',
    label: 'Administrator',
    icon: ShieldAlert,
    description: 'Platform oversight: review organization verifications, manage hub trust badges, and inspect safety reports.',
  },
];

export default function RoleSwitcher({
  currentRole,
  onRoleChange,
  hubs,
  coordinatorHubId,
  onCoordinatorHubChange,
}) {
  const activeRoleData = ROLES.find((r) => r.id === currentRole) || ROLES[0];

  return (
    <div className="role-switcher-banner" role="region" aria-label="Demo Role Selector">
      <div className="role-switcher-header">
        <div className="role-switcher-title-wrap">
          <span className="demo-pill">Demo Mode</span>
          <h2 className="role-switcher-heading">Active Demonstration Role:</h2>
        </div>
        <div className="role-buttons" role="radiogroup" aria-label="Select Demonstration Role">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = currentRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`role-button ${isSelected ? 'role-button--active' : ''}`}
                onClick={() => onRoleChange(role.id)}
              >
                <Icon size={16} className="role-button__icon" />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="role-context-bar">
        <div className="role-description">
          <Info size={15} className="role-description__icon" />
          <span>
            <strong>{activeRoleData.label}:</strong> {activeRoleData.description}
          </span>
        </div>

        {currentRole === 'coordinator' && hubs && hubs.length > 0 && (
          <div className="coordinator-hub-selector">
            <label htmlFor="coordinator-hub-select" className="coordinator-hub-label">
              Operating as:
            </label>
            <select
              id="coordinator-hub-select"
              className="coordinator-hub-select"
              value={coordinatorHubId}
              onChange={(e) => onCoordinatorHubChange(e.target.value)}
              aria-label="Select managed hub"
            >
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name} ({hub.type})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p className="role-security-disclaimer">
        * Client-side simulation only. Role switching allows evaluating different interfaces and does not enforce a security boundary.
      </p>
    </div>
  );
}
