namespace LaoShanghai.Core.Content.Comments
{
    public class SearchCommentsRequest: PaginationFilter, IRequest<PagedList<CommentDto>>
    {
        public bool Reviewed { get; init; }
    }

    public class SearchCommentsRequestHandler: IRequestHandler<SearchCommentsRequest, PagedList<CommentDto>>
    {
        private readonly IContentService _contentService;
        private readonly IMapper _mapper;

        // ctor
        public SearchCommentsRequestHandler(IContentService contentService, IMapper mapper)
        {
            _contentService = contentService;
            _mapper = mapper;
        }

        public async Task<PagedList<CommentDto>> Handle(SearchCommentsRequest request, CancellationToken cancellationToken)
        {
            var result = await _contentService.GetCommentsAsync(request.Reviewed, request.PageIndex, request.PageSize);

            // convert
            var data = _mapper.Map<IReadOnlyCollection<Comment>, IReadOnlyCollection<CommentDto>>(result.Data);
            return new PagedList<CommentDto>(result.Total, data);
        }
    }
}
