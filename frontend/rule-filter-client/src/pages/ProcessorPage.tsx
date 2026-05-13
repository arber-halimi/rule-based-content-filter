import { useEffect, useState } from "react";
import { getRules } from "../api/rulesApi";
import { processText } from "../api/textProcessingApi";
import ProcessedOutput from "../components/ProcessedOutput";
import {
    RuleActionType,
    RuleMatchType,
    type ProcessingTextResult,
    type Rule,
} from "../types/RuleTypes";

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

export default function ProcessorPage() {
    const [text, setText] = useState(
        "The meeting with the finance team is tomorrow. The deadline is urgent."
    );
    const [result, setResult] = useState<ProcessingTextResult | null>(null);
    const [activeRules, setActiveRules] = useState<Rule[]>([]);
    const [processing, setProcessing] = useState(false);
    const [loadingRules, setLoadingRules] = useState(false);
    const [error, setError] = useState("");

    async function loadActiveRules() {
        try {
            setLoadingRules(true);

            const rules = await getRules();
            setActiveRules(rules.filter((rule) => rule.ruleIsActive));
        } catch {
            setActiveRules([]);
        } finally {
            setLoadingRules(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadActiveRules();
    }, []);

    async function handleProcessText() {
        if (!text.trim()) {
            setError("Please enter text to process.");
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const data = await processText(text);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to process text.");
        } finally {
            setProcessing(false);
        }
    }

    function handleClear() {
        setText("");
        setResult(null);
        setError("");
    }

    return (
        <section className="page-section">
            <div className="page-header">
                <div>
                    <h2>Text Processor</h2>
                    <p>Run input text against active rules and review the matched output.</p>
                </div>

                <div className="rules-summary-card">
                    <span>{loadingRules ? "--" : activeRules.length}</span>
                    <small>Active Rules</small>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="processor-workspace">
                <div className="panel input-card">
                    <div className="panel-header">
                        <div>
                            <h2>Input</h2>
                            <p>Submit a block of text to detect matching patterns.</p>
                        </div>
                    </div>

                    <textarea
                        aria-label="Text to process"
                        className="text-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text here..."
                    />

                    <div className="form-actions">
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>

                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleProcessText}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Process Text"}
                        </button>
                    </div>
                </div>

                <div className="processor-results">
                    <div className="panel active-rules-card">
                        <div className="panel-header">
                            <div>
                                <h2>Rule Set</h2>
                                <p>Only active rules are applied during processing.</p>
                            </div>
                        </div>

                        {activeRules.length === 0 ? (
                            <div className="mini-empty-state">
                                <strong>No active rules available</strong>
                                <p>Enable or create a rule before processing text.</p>
                            </div>
                        ) : (
                            <div className="active-rules-list">
                                {activeRules.map((rule) => (
                                    <div key={rule.ruleId} className="rule-chip">
                                        <strong>{rule.keyword}</strong>
                                        <span>
                                            {getMatchTypeLabel(rule.ruleMatchType)} /{" "}
                                            {getActionTypeLabel(rule.actionType)}
                                        </span>
                                        {rule.actionType === RuleActionType.Highlight && (
                                            <i style={{ backgroundColor: rule.color || "#7c3aed" }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ProcessedOutput result={result} />
                </div>
            </div>
        </section>
    );
}
