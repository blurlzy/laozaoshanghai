namespace LaoShanghai.Core.Content.Comments
{
    public record ReviewCommentRequest: IRequest<Unit>
    {
        public string Id { get; init; }
        public string ContentItemId { get; init; }
        // public string AuthorId { get; set; } // partition key
        public bool Approved { get; init; } 
    }

    public class ReviewCommentRequestHandler: IRequestHandler<ReviewCommentRequest, Unit>
    {
        //private readonly ICommentRepository _commentRepo;
        //private readonly IContentItemRepository _contentItemRepo;
        private readonly IContentService _contentService;
        
        // ctor
        public ReviewCommentRequestHandler(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<Unit> Handle(ReviewCommentRequest request, CancellationToken cancellationToken)
        {
            // review the comment
            await _contentService.ReviewCommentAsync(request.Id, request.Approved);

            // unapprove the commment
            if (!request.Approved)
            {
                return Unit.Value;    
            }

            // increase total comment count by 1
            await _contentService.UpdateCommentCountAsync(request.ContentItemId, 1);
            
            return Unit.Value;
        }
    }
}
