using RuleFilter.DataAccess;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RuleFilter.Business.Results;
using RuleFilter.Entities;
using RuleFilter.Entities.Enums;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;


namespace RuleFilter.Business.Services
{
    public class TextProcessingService
    {
        private readonly AppDbContext _context;

        public TextProcessingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProcessingTextResult> ProcessAsync(string text)
        {
            ProcessingTextResult objProcessingTextResult = new ProcessingTextResult();

            if (text != null)
            {
                objProcessingTextResult.OriginalText = text;
            }
            else
            {
                objProcessingTextResult.OriginalText = string.Empty;
            }

            if (string.IsNullOrWhiteSpace(text))
            {
                objProcessingTextResult.Segments.Add(new ProcessingSegment
                {
                    Text = string.Empty,
                    IsMatch = false
                });

                return objProcessingTextResult;
            }

            var rules = await _context.Rules
                .Where(x => x.RuleIsActive)
                .OrderBy(x => x.RuleId)
                .ToListAsync();

            var allMatches = new List<ProcessingMatch>();

            foreach (var rule in rules)
            {
                var ruleMatches = FindMatches(text, rule);
                allMatches.AddRange(ruleMatches);
            }

            var validMatches = RemoveOverlappingMatches(allMatches);

            objProcessingTextResult.Segments = BuildSegments(text, validMatches);
            objProcessingTextResult.TotalMatches = validMatches.Count;

            return objProcessingTextResult;
        }

        private List<ProcessingMatch> FindMatches(string text, Rule rule)
        {
            var matches = new List<ProcessingMatch>();

            if (string.IsNullOrWhiteSpace(text))
                return matches;

            if (string.IsNullOrWhiteSpace(rule.Keyword))
                return matches;

            var pattern = BuildRegexPattern(rule);

            if (string.IsNullOrWhiteSpace(pattern))
                return matches;

            var regexMatches = Regex.Matches(
                text,
                pattern,
                RegexOptions.IgnoreCase | RegexOptions.CultureInvariant
            );

            foreach (Match match in regexMatches)
            {
                if (!match.Success)
                    continue;

                matches.Add(new ProcessingMatch
                {
                    StartIndex = match.Index,
                    Length = match.Length,
                    MatchedText = match.Value,
                    RuleId = rule.RuleId,
                    Keyword = rule.Keyword,
                    ActionType = rule.ActionType,
                    Color = rule.Color,
                    Tag = rule.TooltipText
                });
            }

            return matches;
        }

        private string BuildRegexPattern(Rule rule)
        {
            var keyword = Regex.Escape(rule.Keyword.Trim());

            return rule.RuleMatchType switch
            {
                RuleMatchType.Contains => keyword,

                RuleMatchType.StartsWith => $@"\b{keyword}\w*",

                RuleMatchType.Exact => $@"\b{keyword}\b",

                _ => keyword
            };
        }

        private List<ProcessingMatch> RemoveOverlappingMatches(List<ProcessingMatch> matches)
        {
            var result = new List<ProcessingMatch>();

            var orderedMatches = matches
                .OrderBy(x => x.StartIndex)
                .ThenByDescending(x => x.Length)
                .ThenBy(x => x.RuleId)
                .ToList();

            foreach (var match in orderedMatches)
            {
                var overlaps = result.Any(existing =>
                    match.StartIndex < existing.StartIndex + existing.Length &&
                    existing.StartIndex < match.StartIndex + match.Length
                );

                if (!overlaps)
                {
                    result.Add(match);
                }
            }

            return result
                .OrderBy(x => x.StartIndex)
                .ToList();
        }

        private List<ProcessingSegment> BuildSegments(string text, List<ProcessingMatch> matches)
        {
            var segments = new List<ProcessingSegment>();

            if (matches == null || matches.Count == 0)
            {
                segments.Add(new ProcessingSegment
                {
                    Text = text,
                    IsMatch = false
                });

                return segments;
            }

            var currentIndex = 0;

            foreach (var match in matches)
            {
                if (match.StartIndex > currentIndex)
                {
                    var normalText = text.Substring(
                        currentIndex,
                        match.StartIndex - currentIndex
                    );

                    segments.Add(new ProcessingSegment
                    {
                        Text = normalText,
                        IsMatch = false
                    });
                }

                var matchedText = text.Substring(match.StartIndex, match.Length);

                segments.Add(new ProcessingSegment
                {
                    Text = matchedText,
                    IsMatch = true,
                    RuleId = match.RuleId,
                    Keyword = match.Keyword,
                    ActionType = match.ActionType,
                    Color = match.Color,
                    Tag = match.Tag
                });

                currentIndex = match.StartIndex + match.Length;
            }

            if (currentIndex < text.Length)
            {
                var remainingText = text.Substring(currentIndex);

                segments.Add(new ProcessingSegment
                {
                    Text = remainingText,
                    IsMatch = false
                });
            }

            return segments;
        }

    }
}
