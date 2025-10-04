namespace LaoShanghai.Core.Content.Comments
{
    public record AddCommentRequest: IRequest<Unit>
    {
        public string ContentItemId { get; init; }
        // the content comment has the same partition key as the content item (authorId property)
        //public string ContentAuthorId { get; set; }
        public string Name { get; init; }
        public string CommentText { get; init; }
    }

    public class AddCommentRequestHandler: IRequestHandler<AddCommentRequest, Unit>
    {
        //private readonly ICommentRepository _commentRepository;
        //private readonly IContentItemRepository _contentItemRepo;
        private readonly IContentService _contentService;
        private readonly IContentModerator _contentModerator;
        
        private readonly int _maxCommentLength = 180;

        // ctor
        public AddCommentRequestHandler(IContentService contentService,
                                        IContentModerator contentModerator)
        {
            //_commentRepository = commentRepository;
            //_contentItemRepo = contentItemRepo;
            _contentService = contentService;
            _contentModerator = contentModerator;
        }

        public async Task<Unit> Handle(AddCommentRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrWhiteSpace(request.Name))
            {
                throw new BadContentException("Name is required.");
            }
            
            if (string.IsNullOrEmpty(request.CommentText) || string.IsNullOrWhiteSpace(request.CommentText))
            {
                throw new BadContentException("Comment text is required.");    
            }

            if(request.CommentText.Length > _maxCommentLength)
            {
                throw new BadContentException($"The text may not be longer than {_maxCommentLength}");    
            }

            // auto review: run content moderator to ensure there is no profanity terms or censored words
            var containsProfanity = _contentModerator.ContainsProfanity(request.CommentText);
            
            // add the comment
            await _contentService.AddCommentAsync(request.ContentItemId, request.Name, request.CommentText, !containsProfanity, containsProfanity);
            
            // increate the comment count by 1 if it passed the content moderator
            if(!containsProfanity)
            {
                await _contentService.UpdateCommentCountAsync(request.ContentItemId, 1);
            }
            
            return Unit.Value;
        }
    }
}
