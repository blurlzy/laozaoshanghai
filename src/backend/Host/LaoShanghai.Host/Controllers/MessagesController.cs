namespace LaoShanghai.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : BaseApiController
    {
        // logger
        private readonly ILogger _logger;

        public MessagesController(ILogger<MessagesController> logger)
        {
            _logger = logger;
        }

        //[HttpGet]
        //public IActionResult Get()
        //{
        //    throw new BadContentException("Testing: Invalid content.");
        //    return Ok();
        //}

        [HttpPost]
        [SwaggerOperation(Tags = new[] { "Messages: Send" })]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SendAsync([FromBody] SendMessageRequest request)
        {
            await base.Mediator.Send(request);
            return Ok();
        }
    }
}
