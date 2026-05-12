namespace RuleFilter.Api.DTOs
{
    public class RuleResponseDTO
    {
        public int Id { get; set; }

        public string Keyword { get; set; } = string.Empty;

        public string MatchType { get; set; } = string.Empty;

        public string ActionType { get; set; } = string.Empty;

        public string? Color { get; set; }

        public string? TooltipText { get; set; }

        public bool IsActive { get; set; }

        public int Priority { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
