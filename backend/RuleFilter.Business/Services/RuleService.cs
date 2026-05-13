using Microsoft.EntityFrameworkCore;
using RuleFilter.DataAccess;
using RuleFilter.Entities;
using RuleFilter.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace RuleFilter.Business.Services
{
    public class RuleService
    {
        private readonly AppDbContext _context;

        public RuleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Rule>> GetAllAsync()
        {
            return await _context.Rules
                .OrderByDescending(x => x.RuleId)
                .ToListAsync();
        }

        public async Task<Rule?> GetByIdAsync(int id)
        {
            return await _context.Rules
                .FirstOrDefaultAsync(x => x.RuleId == id);
        }

        public async Task<Rule> CreateAsync(Rule rule)
        {
            ValidateRule(rule);
            rule.Keyword = rule.Keyword.Trim();
            rule.RuleCreatedDate = DateTime.UtcNow;
            rule.RuleUpdatedDate = null;

            await _context.Rules.AddAsync(rule);
            await _context.SaveChangesAsync();

            return rule;
        }

        public async Task<bool> UpdateAsync(int id, Rule updatedRule)
        {
            var existingRule = await _context.Rules
                .FirstOrDefaultAsync(x => x.RuleId == id);

            if (existingRule == null)
                return false;

            ValidateRule(updatedRule);

            existingRule.Keyword = updatedRule.Keyword.Trim();
            existingRule.RuleMatchType = updatedRule.RuleMatchType;
            existingRule.ActionType = updatedRule.ActionType;
            existingRule.Color = updatedRule.Color;
            existingRule.TooltipText = updatedRule.TooltipText;
            existingRule.RuleIsActive = updatedRule.RuleIsActive;
            existingRule.RuleUpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rule = await _context.Rules
                .FirstOrDefaultAsync(x => x.RuleId == id);

            if (rule == null)
                return false;

            _context.Rules.Remove(rule);
            await _context.SaveChangesAsync();

            return true;
        }

        private static void ValidateRule(Rule rule)
        {
            if (string.IsNullOrWhiteSpace(rule.Keyword))
                throw new ArgumentException("Keyword is required.");


            if (rule.ActionType == RuleActionType.Highlight &&
                string.IsNullOrWhiteSpace(rule.Color))
            {
                throw new ArgumentException("Color is required when action type is Highlight.");
            }

            if (rule.ActionType == RuleActionType.Tooltip &&
                string.IsNullOrWhiteSpace(rule.TooltipText))
            {
                throw new ArgumentException("Tooltip text is required when action type is Tooltip.");
            }
        }
    }
}
