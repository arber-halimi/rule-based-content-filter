using RuleFilter.Entities.Enums;

namespace RuleFilter.Api.DTOs
{
    public class RuleResponseDTO
    {
        public int RuleId { get; set; }

        public string Keyword { get; set; } = string.Empty;

        public RuleMatchType RuleMatchType { get; set; }

        public RuleActionType ActionType { get; set; }

        public string? Color { get; set; }

        public string? TooltipText { get; set; }

        public bool RuleIsActive { get; set; }

        public DateTime RuleCreatedDate { get; set; }

        public DateTime? RuleUpdatedDate { get; set; }
    }
   }

