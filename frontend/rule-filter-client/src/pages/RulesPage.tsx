import { useEffect, useState } from "react";
import {
    createRule,
    deleteRule,
    getRules,
    updateRule,
} from "../api/rulesApi";
import RuleForm from "../components/RuleForm";
import RulesList from "../components/RulesList";
import type { Rule, RuleCreateRequest } from "../types/RuleTypes";

export default function RulesPage() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
        "all"
    );

    async function loadRules() {
        try {
            setLoading(true);
            setPageError("");

            const data = await getRules();
            setRules(data);
        } catch (err) {
            setPageError(
                err instanceof Error ? err.message : "Failed to load rules."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadRules();
    }, []);

    async function handleSubmitRule(ruleRequest: RuleCreateRequest) {
        if (editingRule) {
            await updateRule(editingRule.ruleId, ruleRequest);
            setSuccessMessage("Rule updated successfully.");
            setEditingRule(null);
        } else {
            await createRule(ruleRequest);
            setSuccessMessage("Rule created successfully.");
        }

        await loadRules();

        window.setTimeout(() => {
            setSuccessMessage("");
        }, 2500);
    }

    async function handleDeleteRule(id: number) {
        const confirmed = window.confirm("Are you sure you want to delete this rule?");

        if (!confirmed) {
            return;
        }

        try {
            setPageError("");
            await deleteRule(id);

            if (editingRule?.ruleId === id) {
                setEditingRule(null);
            }

            setSuccessMessage("Rule deleted successfully.");
            await loadRules();

            window.setTimeout(() => {
                setSuccessMessage("");
            }, 2500);
        } catch (err) {
            setPageError(
                err instanceof Error ? err.message : "Failed to delete rule."
            );
        }
    }

    async function handleToggleRule(rule: Rule) {
        try {
            setPageError("");

            await updateRule(rule.ruleId, {
                keyword: rule.keyword,
                ruleMatchType: rule.ruleMatchType,
                actionType: rule.actionType,
                color: rule.color,
                tooltipText: rule.tooltipText,
                ruleIsActive: !rule.ruleIsActive,
            });

            setSuccessMessage(
                `Rule ${rule.ruleIsActive ? "disabled" : "enabled"} successfully.`
            );
            await loadRules();

            window.setTimeout(() => {
                setSuccessMessage("");
            }, 2500);
        } catch (err) {
            setPageError(
                err instanceof Error ? err.message : "Failed to update rule status."
            );
        }
    }

    const filteredRules = rules.filter((rule) => {
        const query = searchTerm.trim().toLowerCase();
        const matchesQuery =
            !query ||
            rule.keyword.toLowerCase().includes(query) ||
            rule.tooltipText?.toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && rule.ruleIsActive) ||
            (statusFilter === "inactive" && !rule.ruleIsActive);

        return matchesQuery && matchesStatus;
    });

    return (
        <section className="page-section">
            <div className="page-header">
                <div>
                    <h2>Rule Management</h2>
                    <p>Create and maintain the rules used by the text processor.</p>
                </div>

                <div className="page-metrics">
                    <div>
                        <span>{rules.length}</span>
                        <small>Total Rules</small>
                    </div>
                    <div>
                        <span>{rules.filter((rule) => rule.ruleIsActive).length}</span>
                        <small>Active</small>
                    </div>
                </div>
            </div>

            {pageError && <div className="alert alert-error">{pageError}</div>}
            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}

            <div className="rules-layout">
                <RuleForm
                    editingRule={editingRule}
                    onSubmit={handleSubmitRule}
                    onCancelEdit={() => setEditingRule(null)}
                />

                <RulesList
                    rules={filteredRules}
                    totalRules={rules.length}
                    loading={loading}
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchTerm}
                    onStatusFilterChange={setStatusFilter}
                    onEdit={setEditingRule}
                    onDelete={handleDeleteRule}
                    onToggle={handleToggleRule}
                />
            </div>
        </section>
    );
}
