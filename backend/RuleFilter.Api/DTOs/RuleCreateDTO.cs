using RuleFilter.Entities.Enums;

namespace RuleFilter.Api.DTOs
{
    public class RuleCreateDTO
    {
        public string Keyword { get; set; } = string.Empty;

        public RuleMatchType MatchType { get; set; }

        public RuleActionType ActionType { get; set; }

        public string? Color { get; set; }

        public string? TooltipText { get; set; }

        public bool IsActive { get; set; } = true;

        public int Priority { get; set; } = 0;
    }
}
