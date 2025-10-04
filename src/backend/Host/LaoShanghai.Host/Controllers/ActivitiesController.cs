namespace LaoShanghai.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : BaseApiController
    {
        private readonly CacheService _cache;

        public ActivitiesController(CacheService cache)
        {
            _cache = cache;
        }

        // return site activites
        [HttpGet("site")]
        [EnsurePaginationFilter]
        [Produces("application/json")]
        [SwaggerOperation(Tags = new[] { "Activities: Site" })]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<List<SiteActivity>> GetSiteActivitiesAsync()
        {
            return await _cache.GetSiteActivitiesAsync();
            //return await base.Mediator.Send(new GetSiteActivityListRequest());
        }
    }
}
