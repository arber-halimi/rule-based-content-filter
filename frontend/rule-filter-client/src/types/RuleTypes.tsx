export const RuleMatchType = {
    Contains: 1,
    StartsWith: 2,
    Exact: 3,
} as const;

export type RuleMatchType = (typeof RuleMatchType)[keyof typeof RuleMatchType];

export const RuleActionType = {
    Highlight: 1,
    Tooltip: 2,
} as const;

export type RuleActionType = (typeof RuleActionType)[keyof typeof RuleActionType];

export interface Rule {
    ruleId: number;
    keyword: string;
    ruleMatchType: RuleMatchType;
    actionType: RuleActionType;
    color: string | null;
    tooltipText: string | null;
    ruleIsActive: boolean;
    ruleCreatedDate: string;
    ruleUpdatedDate: string | null;
}

export interface RuleCreateRequest {
    keyword: string;
    ruleMatchType: RuleMatchType;
    actionType: RuleActionType;
    color: string | null;
    tooltipText: string | null;
    ruleIsActive: boolean;
}

export interface ProcessingSegment {
    text: string;
    isMatch: boolean;
    ruleId: number | null;
    keyword: string | null;
    actionType: RuleActionType | null;
    color: string | null;

    // Backend-i yt më herët po kthente "tag".
    // Nëse e ke ndërru në tooltipText, përdore tooltipText.
    // Për siguri po i lëmë të dyja.
    tooltipText?: string | null;
    tag?: string | null;
}

export interface ProcessingTextResult {
    originalText: string;
    segments: ProcessingSegment[];
    totalMatches: number;
}