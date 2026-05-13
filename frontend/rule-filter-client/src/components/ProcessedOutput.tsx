import {
    RuleActionType,
    type ProcessingTextResult,
} from "../types/RuleTypes";

interface ProcessedOutputProps {
    result: ProcessingTextResult | null;
}

function getActionTypeLabel(type: RuleActionType | null) {
    switch (type) {
        case RuleActionType.Highlight:
            return "Highlight";
        case RuleActionType.Tooltip:
            return "Tooltip";
        default:
            return "Match";
    }
}

export default function ProcessedOutput({ result }: ProcessedOutputProps) {
    if (!result) {
        return (
            <div className="panel empty-state">
                <h3>No processed text yet</h3>
                <p>Enter text and click Process Text to see matched rules visually.</p>
            </div>
        );
    }

    if (result.totalMatches === 0) {
        return (
            <div className="panel output-card">
                <div className="result-header">
                    <div>
                        <h2>Processed Output</h2>
                        <p>No active rule matched this text.</p>
                    </div>
                    <span className="match-count neutral">0 matches</span>
                </div>

                <div className="processed-output">
                    {result.originalText || "No text provided."}
                </div>
            </div>
        );
    }

    const matchedRules = result.segments
        .filter((segment) => segment.isMatch)
        .reduce<
            {
                key: string;
                keyword: string;
                actionType: RuleActionType | null;
                count: number;
                color: string | null;
                label: string;
            }[]
        >((summary, segment) => {
            const key = `${segment.ruleId ?? "unknown"}-${segment.keyword ?? segment.text}`;
            const existing = summary.find((item) => item.key === key);

            if (existing) {
                existing.count += 1;
                return summary;
            }

            summary.push({
                key,
                keyword: segment.keyword || segment.text,
                actionType: segment.actionType,
                count: 1,
                color: segment.color,
                label: segment.tooltipText || segment.tag || getActionTypeLabel(segment.actionType),
            });

            return summary;
        }, []);

    return (
        <div className="output-layout">
            <div className="panel output-card">
                <div className="result-header">
                    <div>
                        <h2>Processed Output</h2>
                        <p>Matched segments are highlighted or tagged below.</p>
                    </div>

                    <span className="match-count">{result.totalMatches} matches</span>
                </div>

                <div className="processed-output">
                    {result.segments.map((segment, index) => {
                        if (!segment.isMatch) {
                            return <span key={index}>{segment.text}</span>;
                        }

                        if (segment.actionType === RuleActionType.Highlight) {
                            return (
                                <span
                                    key={index}
                                    className="processed-highlight"
                                    style={{ backgroundColor: segment.color || "#7c3aed" }}
                                    title={`Matched rule: ${segment.keyword ?? ""}`}
                                >
                                    {segment.text}
                                </span>
                            );
                        }

                        if (segment.actionType === RuleActionType.Tooltip) {
                            const tooltip = segment.tooltipText || segment.tag || "";

                            return (
                                <span
                                    key={index}
                                    className="processed-tooltip"
                                    title={tooltip}
                                >
                                    {segment.text}
                                    <small>{tooltip}</small>
                                </span>
                            );
                        }

                        return <span key={index}>{segment.text}</span>;
                    })}
                </div>
            </div>

            <div className="panel match-summary-card">
                <div className="panel-header">
                    <div>
                        <h2>Matched Rules Summary</h2>
                        <p>Applied rule counts and action types.</p>
                    </div>
                </div>

                <div className="summary-total">
                    <span>{result.totalMatches}</span>
                    <small>Total matches</small>
                </div>

                <div className="matched-rule-list">
                    {matchedRules.map((rule) => (
                        <div key={rule.key} className="matched-rule-item">
                            <div>
                                <strong>{rule.keyword}</strong>
                                <span>{getActionTypeLabel(rule.actionType)}</span>
                            </div>

                            <div className="matched-rule-meta">
                                {rule.actionType === RuleActionType.Highlight && (
                                    <span
                                        className="color-dot"
                                        style={{ backgroundColor: rule.color || "#7c3aed" }}
                                    />
                                )}
                                <span>{rule.label}</span>
                                <b>{rule.count}x</b>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
