

namespace LaoShanghai.Core.Content.ContentItems
{
    public record CountContentItemRequest: IRequest<int>
    {
        
    }

    public class CountContentItemHandler: IRequestHandler<CountContentItemRequest, int>
    {
        // content item repository
        private readonly IContentService _contentService;

        // ctor
        public CountContentItemHandler(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<int> Handle(CountContentItemRequest request, CancellationToken cancellationToken)
        {
            return await _contentService.GetTotalAsync();
        }
    }
}
