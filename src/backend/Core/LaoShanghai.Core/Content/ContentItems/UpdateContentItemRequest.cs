

namespace LaoShanghai.Core.Content.ContentItems
{
    public record UpdateContentItemRequest: IRequest<Unit>
    {
        public string Id { get; init; }               
        public string Text { get; init; }        
        public string Source { get; init; }         
        public IEnumerable<string> Tags { get; init; }
    }

    public class UpdateContentItemRequestHandler : IRequestHandler<UpdateContentItemRequest, Unit>
    {
        private readonly IContentService _contentService;

        public UpdateContentItemRequestHandler(IContentService contentService)
        {
            _contentService = contentService;
        }

        public async Task<Unit> Handle(UpdateContentItemRequest request, CancellationToken cancellationToken)
        {

            await _contentService.UpdateItemAsync(request.Id, request.Text, request.Source, request.Tags?.ToArray());

            return Unit.Value;
        }
    }
}
