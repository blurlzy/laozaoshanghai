namespace LaoShanghai.Core.Content.ContentItems
{
    public record GetSingleContentItemRequest: IRequest<ContentItemDto>
    {
        public string Id { get; init; }
    }

    
    public class GetSingleContentItemRequestHander: IRequestHandler<GetSingleContentItemRequest,  ContentItemDto>
    {

        private  readonly IContentService _contentService;
        private readonly IMapper _mapper;

        public GetSingleContentItemRequestHander(IContentService contentService, IMapper mapper)
        {
            _contentService = contentService;
            _mapper = mapper;
        }

        public async Task<ContentItemDto> Handle(GetSingleContentItemRequest request, CancellationToken cancellationToken)
        {
            var contentItem = await _contentService.GetContentItemAsync(request.Id);
            return _mapper.Map<ContentItemDto>(contentItem);
        }
    }
}
