using Microsoft.AspNetCore.Mvc;
using RuleFilter.Business.Services;
using RuleFilter.Api.DTOs;

namespace RuleFilter.Api.Controllers
{


        [ApiController]
        [Route("api/text-processing")]
        public class TextProcessingController : ControllerBase
        {
            private readonly TextProcessingService _textProcessingService;

            public TextProcessingController(TextProcessingService textProcessingService)
            {
                _textProcessingService = textProcessingService;
            }

            [HttpPost("process")]
            public async Task<IActionResult> Process([FromBody] TextProcessDTO request)
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Text))
                {
                    return BadRequest("Text is required.");
                }

                var result = await _textProcessingService.ProcessAsync(request.Text);

                return Ok(result);
            }
    }
}
