using System;
using System.Collections.Generic;
using System.Text;
using RuleFilter.Entities.Enums;

namespace RuleFilter.Entities
{
    public class Rule
    {
        public int RuleId { get; set; }

        public string Keyword { get; set; } = string.Empty;

        public MatchType MatchType { get; set; }

        public RuleActionType ActionType { get; set; }

        public string? Color { get; set; }

        public string? TooltipText { get; set; }

        public bool RuleIsActive { get; set; } = true;
        public DateTime RuleCreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime? RuleUpdatedDate { get; set; }
    }
}
