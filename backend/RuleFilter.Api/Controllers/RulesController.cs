using Microsoft.AspNetCore.Mvc;
using RuleFilter.Api.DTOs;
using RuleFilter.Business.Services;
using RuleFilter.Entities;

namespace RuleFilter.Api.Controllers
{
    [ApiController]
    [Route("api/rules")]
    public class RulesController : ControllerBase
    {
        private readonly RuleService _ruleService;

        public RulesController(RuleService ruleService)
        {
            _ruleService = ruleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rules = await _ruleService.GetAllAsync();

            var response = rules.Select(rule => new RuleResponseDTO
            {
                RuleId = rule.RuleId,
                Keyword = rule.Keyword,
                RuleMatchType = rule.RuleMatchType,
                ActionType = rule.ActionType,
                Color = rule.Color,
                TooltipText = rule.TooltipText,
                RuleIsActive = rule.RuleIsActive,
                RuleCreatedDate = rule.RuleCreatedDate,
                RuleUpdatedDate = rule.RuleUpdatedDate
            }).ToList();

            return Ok(response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var rule = await _ruleService.GetByIdAsync(id);

            if (rule == null)
            {
                return NotFound("Rule not found.");
            }

            var response = new RuleResponseDTO
            {
                RuleId = rule.RuleId,
                Keyword = rule.Keyword,
                RuleMatchType = rule.RuleMatchType,
                ActionType = rule.ActionType,
                Color = rule.Color,
                TooltipText = rule.TooltipText,
                RuleIsActive = rule.RuleIsActive,
                RuleCreatedDate = rule.RuleCreatedDate,
                RuleUpdatedDate = rule.RuleUpdatedDate
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RuleCreateDTO request)
        {
            try
            {
                var rule = new Rule
                {
                    Keyword = request.Keyword,
                    RuleMatchType = request.RuleMatchType,
                    ActionType = request.ActionType,
                    Color = request.Color,
                    TooltipText = request.TooltipText,
                    RuleIsActive = request.RuleIsActive
                };

                var createdRule = await _ruleService.CreateAsync(rule);

                var response = new RuleResponseDTO
                {
                    RuleId = createdRule.RuleId,
                    Keyword = createdRule.Keyword,
                    RuleMatchType = createdRule.RuleMatchType,
                    ActionType = createdRule.ActionType,
                    Color = createdRule.Color,
                    TooltipText = createdRule.TooltipText,
                    RuleIsActive = createdRule.RuleIsActive,
                    RuleCreatedDate = createdRule.RuleCreatedDate,
                    RuleUpdatedDate = createdRule.RuleUpdatedDate
                };

                return CreatedAtAction(nameof(GetById), new { id = response.RuleId }, response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] RuleUpdateDTO request)
        {
            try
            {
                var rule = new Rule
                {
                    Keyword = request.Keyword,
                    RuleMatchType = request.RuleMatchType,
                    ActionType = request.ActionType,
                    Color = request.Color,
                    TooltipText = request.TooltipText,
                    RuleIsActive = request.RuleIsActive
                };

                var updated = await _ruleService.UpdateAsync(id, rule);

                if (!updated)
                {
                    return NotFound("Rule not found.");
                }

                var updatedRule = await _ruleService.GetByIdAsync(id);

                if (updatedRule == null)
                {
                    return NotFound("Rule not found.");
                }

                var response = new RuleResponseDTO
                {
                    RuleId = updatedRule.RuleId,
                    Keyword = updatedRule.Keyword,
                    RuleMatchType = updatedRule.RuleMatchType,
                    ActionType = updatedRule.ActionType,
                    Color = updatedRule.Color,
                    TooltipText = updatedRule.TooltipText,
                    RuleIsActive = updatedRule.RuleIsActive,
                    RuleCreatedDate = updatedRule.RuleCreatedDate,
                    RuleUpdatedDate = updatedRule.RuleUpdatedDate
                };

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _ruleService.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound("Rule not found.");
            }

            return NoContent();
        }
    }
}