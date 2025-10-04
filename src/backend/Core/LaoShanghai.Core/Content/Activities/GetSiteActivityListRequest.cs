



namespace LaoShanghai.Core.Content.Activities
{
    public class GetSiteActivityListRequest: IRequest<List<SiteActivity>>
    {
        
    }

    public class GetSiteActivityListRequestHandler: IRequestHandler<GetSiteActivityListRequest, List<SiteActivity>>
    {
        private readonly IBlobRepository _blobRepo;

        public GetSiteActivityListRequestHandler(IBlobRepository blobRepo)
        {
            _blobRepo = blobRepo;
        }

        public async Task<List<SiteActivity>> Handle(GetSiteActivityListRequest request, CancellationToken cancellationToken)
        {
            // retreive the site activities from the blob
            var blobContent = await _blobRepo.GetBlobAsync("data", "update-logs.json");

            if (blobContent == null)
            {
                throw new BadContentException("Invalid data.");
            }

            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return JsonSerializer.Deserialize<List<SiteActivity>>(blobContent, serializeOptions);
            //return JsonConvert.DeserializeObject<List<SiteActivity>>(blobContent);
        }
    }
}
