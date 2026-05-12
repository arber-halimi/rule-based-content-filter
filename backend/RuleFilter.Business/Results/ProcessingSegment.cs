using RuleFilter.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace RuleFilter.Business.Results
{
    public class ProcessingSegment
    {

        public string Text { get; set; } = string.Empty;

        public bool IsMatch { get; set; }

        public int? RuleId { get; set; }

        public RuleActionType? ActionType { get; set; }

        public string? Color { get; set; }

        public string? TooltipText { get; set; }

    }
}
