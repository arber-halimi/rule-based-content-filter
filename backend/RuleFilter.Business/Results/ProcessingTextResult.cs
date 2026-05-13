using System;
using System.Collections.Generic;
using System.Text;

namespace RuleFilter.Business.Results
{

    public class ProcessingTextResult
    {
        public string OriginalText { get; set; } = string.Empty;

        public List<ProcessingSegment> Segments { get; set; } = new();

        public int TotalMatches { get; set; }
    }
}

