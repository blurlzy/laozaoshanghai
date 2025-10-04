namespace LaoShanghai.Host.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ContentItemsController : BaseApiController
    {
        private readonly CacheService _cacheService;
        
        public ContentItemsController(CacheService cacheService)
        {
            _cacheService = cacheService;
        }

        // return content list by keywords             
        [HttpGet]
        [EnsurePaginationFilter]
        [Produces("application/json")]
        // [SwaggerOperation(Tags = new[] { "Content Items: Search" })]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<PagedList<ContentItemDto>> SearchContentItemsAsync([FromQuery] int pageIndex = 0, int pageSize = 10, string? keyword = null)
        {
            // 
            var searchRequest = new SearchContentItemsRequest
            {
                PageIndex = pageIndex,
                PageSize = pageSize,
                Keyword = keyword
            };

            // send a message through the mediator
            return await this.Mediator.Send(searchRequest);
        }

        // return single content item by its id & partition key (author id)
        [HttpGet("{id}")]
        [ValidateGuid]
        [Produces("application/json")]        
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ContentItemDto> GetContentItemAsync(string id)
        {
            var request = new GetSingleContentItemRequest
            {
                Id = id                
            };

            return await this.Mediator.Send(request);
        }

        
        [HttpGet("total")]
        // [SwaggerOperation(Tags = new[] { "Content Items: Count" })]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public Task<int> CountContentItemAsync()
        {
            // return total number of contents from cache service
            // retreive the count if cache is expired
            return _cacheService.CountTotalAsync();
        }

        // return comments by a given contant item id        
        [HttpGet("{id}/comments")]
        [ValidateGuid]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public Task<List<CommentDto>> GetCommentsAsync(string id)
        {
            // send a message to its handler
            return this.Mediator.Send(new GetContentCommentsRequest { ContentItemId = id });
        }
        
        // create a new content (authorized users ONLY)        
        [Authorize(Policy = PolicyNames.WRITE_CONTENT_POLICY)]
        [HttpPost]
        // [SwaggerOperation(Tags = new[] { "Content Items: Add" })]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateAsync([FromForm] IFormCollection data)
        {
            var fileUploadList = Request.Form.Files.Select(m => new FileUploadDto { FileExtension = Path.GetExtension(m.FileName), FileStream = m.OpenReadStream() })
                                                   .ToList();

            // create a request instance 
            var addContentItemRequest = new AddContentItemRequest
            {
                Text = data["text"],
                //AuthorId = ClaimHelper.GetClaimValue(User, Auth0ClaimNames.EMAIL), // user name / email as the author id
                Source = data["source"],
                Tags = data["tags"],
                Files = fileUploadList
            };

            // send the request to its associated handler
            await this.Mediator.Send(addContentItemRequest);

            return Ok();
        }


        // update a content item (authorized users ONLY)        
        [Authorize(Policy = PolicyNames.WRITE_CONTENT_POLICY)]
        [HttpPut("{id}")]
        // [SwaggerOperation(Tags = new[] { "Content Items: Update" })]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateAsync(string id, [FromBody] ContentItemUpdateDto model)
        {
            //var request = new UpdateContentItemRequest(model.Id, model.AuthorId, model.Text, model.Source, model.Tags);
            var request = new UpdateContentItemRequest
            {
                Id = id,
                Text = model.Text,
                Source = model.Source,
                Tags = model.Tags,
            };

            // send  the request to its  handler
            await this.Mediator.Send(request);
            return Ok();
        }


        // delete a contente (authorized users ONLY)        
        [Authorize(Policy = PolicyNames.DELETE_CONTENT_POLICY)]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> DeleteAsync(string id)
        {
            var request = new DeleteContentItemRequest{ Id = id };
            await this.Mediator.Send(request);
            return Ok();
        }
    }
}
