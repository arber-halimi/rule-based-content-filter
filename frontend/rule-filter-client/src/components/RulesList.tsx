import {
    RuleActionType,
    RuleMatchType,
    type Rule,
} from "../types/RuleTypes";

interface RulesListProps {
    rules: Rule[];
    totalRules: number;
    loading: boolean;
    searchTerm: string;
    statusFilter: "all" | "active" | "inactive";
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
    onEdit: (rule: Rule) => void;
    onDelete: (id: number) => Promise<void>;
    onToggle: (rule: Rule) => Promise<void>;
}

function getMatchTypeLabel(type: RuleMatchType) {
    switch (type) {
        case RuleMatchType.Contains:
            return "Contains";
        case RuleMatchType.StartsWith:
            return "Starts With";
        case RuleMatchType.Exact:
            return "Exact";
        default:
            return "Unknown";
    }
}

function getActionTypeLabel(type: RuleActionType) {
    switch (type) {
        case RuleActionType.Highlight:
            return "Highlight";
        case RuleActionType.Tooltip:
            return "Tooltip";
        default:
            return "Unknown";
    }
}

export default function RulesList({
    rules,
    totalRules,
    loading,
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
    onEdit,
    onDelete,
    onToggle,
}: RulesListProps) {
    if (loading) {
        return (
            <div className="card loading-card">
                <div className="skeleton-line wide" />
                <div className="skeleton-line" />
                <div className="skeleton-table">
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        );
    }

    if (rules.length === 0) {
        return (
            <div className="panel rules-list-card">
                <RulesToolbar
                    totalRules={totalRules}
                    visibleRules={rules.length}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    onSearchChange={onSearchChange}
                    onStatusFilterChange={onStatusFilterChange}
                />

                <div className="empty-state">
                    <h3>No rules found</h3>
                    <p>
                        {totalRules === 0
                            ? "Create your first rule to start processing text."
                            : "Adjust the search or status filter to view more rules."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel rules-list-card">
            <RulesToolbar
                totalRules={totalRules}
                visibleRules={rules.length}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={onSearchChange}
                onStatusFilterChange={onStatusFilterChange}
            />

            <div className="table-wrapper">
                <table className="rules-table">
                    <thead>
                        <tr>
                            <th>Keyword</th>
                            <th>Match Type</th>
                            <th>Action</th>
                            <th>Preview</th>
                            <th>Status</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rules.map((rule) => (
                            <tr key={rule.ruleId}>
                                <td>
                                    <div className="keyword-cell">
                                        <strong>{rule.keyword}</strong>
                                        <span>#{rule.ruleId}</span>
                                    </div>
                                </td>

                                <td>
                                    <span className="badge badge-neutral">
                                        {getMatchTypeLabel(rule.ruleMatchType)}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={
                                            rule.actionType === RuleActionType.Highlight
                                                ? "badge badge-highlight"
                                                : "badge badge-tooltip"
                                        }
                                    >
                                        {getActionTypeLabel(rule.actionType)}
                                    </span>
                                </td>

                                <td>
                                    {rule.actionType === RuleActionType.Highlight ? (
                                        <span
                                            className="highlight-preview"
                                            style={{ backgroundColor: rule.color || "#7c3aed" }}
                                        >
                                            {rule.keyword}
                                        </span>
                                    ) : (
                                        <span className="tooltip-preview">
                                            {rule.keyword}
                                            <small>[{rule.tooltipText}]</small>
                                        </span>
                                    )}
                                </td>

                                <td>
                                    <span
                                        className={
                                            rule.ruleIsActive ? "status active" : "status inactive"
                                        }
                                    >
                                        {rule.ruleIsActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                <td className="actions-cell">
                                    <button
                                        className="btn btn-small btn-ghost"
                                        onClick={() => onToggle(rule)}
                                    >
                                        {rule.ruleIsActive ? "Disable" : "Enable"}
                                    </button>

                                    <button
                                        className="btn btn-small btn-secondary"
                                        onClick={() => onEdit(rule)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-small btn-danger"
                                        onClick={() => onDelete(rule.ruleId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface RulesToolbarProps {
    totalRules: number;
    visibleRules: number;
    searchTerm: string;
    statusFilter: "all" | "active" | "inactive";
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
}

function RulesToolbar({
    totalRules,
    visibleRules,
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
}: RulesToolbarProps) {
    return (
        <div className="table-toolbar">
            <div>
                <h2>Rules</h2>
                <p>
                    Showing {visibleRules} of {totalRules} configured rules
                </p>
            </div>

            <div className="table-controls">
                <input
                    aria-label="Search rules"
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search keyword or tag"
                />

                <select
                    aria-label="Filter by status"
                    value={statusFilter}
                    onChange={(event) =>
                        onStatusFilterChange(
                            event.target.value as "all" | "active" | "inactive"
                        )
                    }
                >
                    <option value="all">All statuses</option>
                    <option value="active">Active only</option>
                    <option value="inactive">Inactive only</option>
                </select>
            </div>
        </div>
    );
}
