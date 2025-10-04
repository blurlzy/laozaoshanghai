namespace LaoShanghai.Core.Content.Comments
{
    public record DeleteCommentRequest: IRequest<Unit>
    {
        public string Id { get; init; }
    }

    public class DeleteCommentRequestHandler : IRequestHandler<DeleteCommentRequest, Unit>
    {

        private readonly IContentService _contentService;

        // ctor
        public DeleteCommentRequestHandler(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<Unit> Handle(DeleteCommentRequest request, CancellationToken cancellationToken)
        {
            // retreive the comment
            var comment = await _contentService.GetCommentAsync(request.Id);
                        
            if(comment.Reviewed)
            {
                // update the total comment of the contente
                await _contentService.UpdateCommentCountAsync(comment.ContentItemId, -1);
            }

            // delete the comment
            await _contentService.DeleteCommentAsync(comment.Id);
            
            return Unit.Value;
        }
    }
}
