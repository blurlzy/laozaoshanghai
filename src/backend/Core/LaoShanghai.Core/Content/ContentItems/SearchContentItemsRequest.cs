
namespace LaoShanghai.Core.Content.ContentItems
{
    // Request/response messages, dispatched to a single handler
    public class SearchContentItemsRequest: PaginationFilter, IRequest<PagedList<ContentItemDto>>
    {
        public string Keyword { get; init; }
    }

    public class SearchContentItemsHandler : IRequestHandler<SearchContentItemsRequest, PagedList<ContentItemDto>>
    {
        private readonly IContentService _contentService;
        // model mapper
        private readonly IMapper _mapper; 
        
        // ctor
        public SearchContentItemsHandler(IContentService contentService, IMapper mapper)
        {
            _contentService = contentService;
            _mapper = mapper;
        }

        public async Task<PagedList<ContentItemDto>> Handle(SearchContentItemsRequest request, CancellationToken cancellationToken)
        {
            PagedList<ContentItem> searchResult;
            
            if(string.IsNullOrEmpty(request.Keyword) || string.IsNullOrWhiteSpace(request.Keyword))
            {
                searchResult = await _contentService.GetContentListAsync(request.PageIndex, request.PageSize);
            }
            else
            {
                searchResult =  await _contentService.GetContentListAsync(ChineseConverter.Convert(request.Keyword, ChineseConversionDirection.TraditionalToSimplified),
                                                                   ChineseConverter.Convert(request.Keyword, ChineseConversionDirection.SimplifiedToTraditional),
                                                                   request.PageIndex,
                                                                   request.PageSize);
            }

            // convert data
            var data = _mapper.Map<IReadOnlyCollection<ContentItem>, IReadOnlyCollection<ContentItemDto>>(searchResult.Data);
            return new PagedList<ContentItemDto>(searchResult.Total, data);
        }
    }
}
