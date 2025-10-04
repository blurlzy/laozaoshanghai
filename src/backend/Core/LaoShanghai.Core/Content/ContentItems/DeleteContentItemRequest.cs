

namespace LaoShanghai.Core.Content.ContentItems
{
    public record DeleteContentItemRequest: IRequest<Unit>
    {
        public string Id { get; init; }
    }

    public class DeleteContentItemHandler: IRequestHandler<DeleteContentItemRequest, Unit>
    {
        private readonly IContentService _contenService;

        public DeleteContentItemHandler(IContentService contentService)
        {
            _contenService= contentService;
        }

        public async Task<Unit> Handle(DeleteContentItemRequest request, CancellationToken cancellationToken)
        {
            await _contenService.DeleteItemAsync(request.Id);
            return Unit.Value;
        }
    }
}
