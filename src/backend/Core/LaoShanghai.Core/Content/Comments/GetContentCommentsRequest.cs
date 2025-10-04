namespace LaoShanghai.Core.Content.Comments
{
    public record GetContentCommentsRequest: IRequest<List<CommentDto>>
    {
        public string ContentItemId { get; init; }
    }

    public class GetContentCommentsRequestHandler : IRequestHandler<GetContentCommentsRequest, List<CommentDto>>
    {
        private readonly IContentService _contentService;
        private readonly IMapper _mapper;
        
        // ctor
        public GetContentCommentsRequestHandler(IContentService contentService, IMapper mapper)
        {
            _contentService = contentService;
            _mapper = mapper;
        }
        
        public async Task<List<CommentDto>> Handle(GetContentCommentsRequest request, CancellationToken cancellationToken)
        {
            if(string.IsNullOrEmpty(request.ContentItemId) || string.IsNullOrWhiteSpace(request.ContentItemId))
            {

                throw new BadContentException("Content item is null or empty");
            }

            // only reviewed comments are visible to public
            var comments = await _contentService.GetCommentsAsync(request.ContentItemId, true);

            return _mapper.Map<List<Comment>, List<CommentDto>>(comments);
        }
    }
}
