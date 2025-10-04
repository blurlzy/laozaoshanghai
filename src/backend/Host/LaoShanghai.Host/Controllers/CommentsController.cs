namespace LaoShanghai.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : BaseApiController
    {
        public CommentsController()
        {
            
        }
             
        [Authorize]
        [HttpGet]
        [EnsurePaginationFilter]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<PagedList<CommentDto>> SearchAsync([FromQuery] bool reviewed = false, int pageIndex = 0, int pageSize = 12)
        {
            var request = new SearchCommentsRequest
            {
                Reviewed = reviewed,
                PageIndex = pageIndex,
                PageSize = pageSize
            };

            return await base.Mediator.Send(request);
        }

        // Allow anonymous users to leave the comments. Those comments will not be visible until they are reviewed and approved
        [HttpPost]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAsync([FromBody] AddCommentRequest request)
        {
            await base.Mediator.Send(request);
            return Ok();
        }


        [Authorize(Policy = PolicyNames.REVIEW_COMMENTS_POLICY)]
        [HttpPut("review")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ReviewCommentAsync([FromBody] ReviewCommentRequest request)
        {
            await base.Mediator.Send(request);
            return Ok();
        }

        [Authorize(Policy = PolicyNames.REVIEW_COMMENTS_POLICY)]
        [HttpDelete("{id}")]
        // [SwaggerOperation(Tags = new[] { "Comments: Delete" })]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteCommentAsync(string id)
        {
            var request = new DeleteCommentRequest
            {
                Id = id,
            };
            
            await base.Mediator.Send(request);
            return Ok();
        }
    }
}
