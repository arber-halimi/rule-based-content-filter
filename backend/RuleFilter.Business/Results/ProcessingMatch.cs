using RuleFilter.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace RuleFilter.Business.Results
{
    public class ProcessingMatch
    {
        public int StartIndex { get; set; }

        public int Length { get; set; }

        public string MatchedText { get; set; } = string.Empty;

        public int RuleId { get; set; }

        public string Keyword { get; set; } = string.Empty;

        public RuleActionType ActionType { get; set; }

        public string? Color { get; set; }

        public string? Tag { get; set; }
    }
}
