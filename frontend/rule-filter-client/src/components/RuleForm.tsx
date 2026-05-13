import { useEffect, useState } from "react";
import {
    RuleActionType,
    RuleMatchType,
    type Rule,
    type RuleCreateRequest,
} from "../types/RuleTypes";

interface RuleFormProps {
    editingRule: Rule | null;
    onSubmit: (rule: RuleCreateRequest) => Promise<void>;
    onCancelEdit: () => void;
}

export default function RuleForm({
    editingRule,
    onSubmit,
    onCancelEdit,
}: RuleFormProps) {
    const [keyword, setKeyword] = useState("");
    const [ruleMatchType, setRuleMatchType] = useState<RuleMatchType>(
        RuleMatchType.Contains
    );
    const [actionType, setActionType] = useState<RuleActionType>(
        RuleActionType.Highlight
    );
    const [color, setColor] = useState("#7c3aed");
    const [tooltipText, setTooltipText] = useState("");
    const [ruleIsActive, setRuleIsActive] = useState(true);

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingRule) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setKeyword(editingRule.keyword);
            setRuleMatchType(editingRule.ruleMatchType);
            setActionType(editingRule.actionType);
            setColor(editingRule.color || "#7c3aed");
            setTooltipText(editingRule.tooltipText || "");
            setRuleIsActive(editingRule.ruleIsActive);
        } else {
            resetForm();
        }
    }, [editingRule]);

    function resetForm() {
        setKeyword("");
        setRuleMatchType(RuleMatchType.Contains);
        setActionType(RuleActionType.Highlight);
        setColor("#7c3aed");
        setTooltipText("");
        setRuleIsActive(true);
        setError("");
    }

    function validate(): string | null {
        if (!keyword.trim()) {
            return "Keyword is required.";
        }

        if (actionType === RuleActionType.Highlight && !color.trim()) {
            return "Color is required when action type is Highlight.";
        }

        if (actionType === RuleActionType.Tooltip && !tooltipText.trim()) {
            return "Tooltip text is required when action type is Tooltip.";
        }

        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        const request: RuleCreateRequest = {
            keyword: keyword.trim(),
            ruleMatchType,
            actionType,
            color: actionType === RuleActionType.Highlight ? color : null,
            tooltipText:
                actionType === RuleActionType.Tooltip ? tooltipText.trim() : null,
            ruleIsActive,
        };

        try {
            setSaving(true);
            setError("");

            await onSubmit(request);

            if (!editingRule) {
                resetForm();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save rule.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="panel rule-form" onSubmit={handleSubmit}>
            <div className="panel-header">
                <div>
                    <h2>{editingRule ? "Edit Rule" : "Create Rule"}</h2>
                    <p>
                        Configure matching criteria and output behavior.
                    </p>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="rule-keyword">Keyword</label>
                    <input
                        id="rule-keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g. urgent, finance, deadline"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rule-match-type">Match Type</label>
                    <select
                        id="rule-match-type"
                        value={ruleMatchType}
                        onChange={(e) => setRuleMatchType(Number(e.target.value) as RuleMatchType)}
                    >
                        <option value={RuleMatchType.Contains}>Contains</option>
                        <option value={RuleMatchType.StartsWith}>Starts With</option>
                        <option value={RuleMatchType.Exact}>Exact</option>
                    </select>
                    <p className="helper-text">
                        Contains matches anywhere, Starts With matches word beginnings,
                        Exact matches the full word or phrase.
                    </p>
                </div>

                <div className="form-group">
                    <label htmlFor="rule-action-type">Action Type</label>
                    <select
                        id="rule-action-type"
                        value={actionType}
                        onChange={(e) => setActionType(Number(e.target.value) as RuleActionType)}
                    >
                        <option value={RuleActionType.Highlight}>Highlight</option>
                        <option value={RuleActionType.Tooltip}>Tooltip</option>
                    </select>
                </div>

                {actionType === RuleActionType.Highlight && (
                    <div className="form-group">
                        <label htmlFor="rule-color">Highlight Color</label>
                        <div className="color-row">
                            <input
                                id="rule-color"
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />

                            <input
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="#7c3aed"
                            />
                        </div>
                        <p className="helper-text">Choose a readable color for inline highlights.</p>
                    </div>
                )}

                {actionType === RuleActionType.Tooltip && (
                    <div className="form-group">
                        <label htmlFor="rule-tooltip">Tooltip Text</label>
                        <input
                            id="rule-tooltip"
                            value={tooltipText}
                            onChange={(e) => setTooltipText(e.target.value)}
                            placeholder="e.g. Important term, Review required"
                        />
                        <p className="helper-text">This label appears beside matched text.</p>
                    </div>
                )}

                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={ruleIsActive}
                        onChange={(e) => setRuleIsActive(e.target.checked)}
                    />
                    <span>Rule is active</span>
                </label>
            </div>

            <div className="form-actions">
                {editingRule && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </button>
                )}

                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving
                        ? "Saving..."
                        : editingRule
                            ? "Update Rule"
                            : "Create Rule"}
                </button>
            </div>
        </form>
    );
}
