namespace LaoShanghai.Host.Cache
{
    public class CacheService
    {
        private readonly IMemoryCache _cache;
        private readonly ISender _mediator;
        // cache hours
        private const int _expireInHours = 12;
        // cache key
        private const string _cacheKey = "_total";
        private const string _siteActivityKey = "_site_activities";

        public CacheService(IMemoryCache cache, ISender mediator)
        {
            _cache = cache;
            _mediator = mediator;
        }

        public async Task<int> CountTotalAsync()
        {
            var cacheEntry = await _cache.GetOrCreateAsync(_cacheKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(_expireInHours);
                return _mediator.Send(new CountContentItemRequest());
            });

            return cacheEntry;
        }

        public async Task<List<SiteActivity>> GetSiteActivitiesAsync()
        {
            var cacheEntry = await _cache.GetOrCreateAsync(_siteActivityKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(48);
                return _mediator.Send(new GetSiteActivityListRequest());
            });

            return cacheEntry;
        }
    }
}
