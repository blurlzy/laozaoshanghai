
namespace LaoShanghai.Core.Content.ContentItems
{

    // using Unit for requests without return values
    // IRequest inherits IRequest<Unit> where Unit represents a terminal/ignored return type.
    public record AddContentItemRequest: IRequest<Unit>
    {
        public string Text { get; init; } 
        
        public string Source { get; init; }

        public string Tags { get; init; }
        
        // public string AuthorId { get; init; }

        public List<FileUploadDto> Files { get; set; }
    }

    public class AddContenteItemHander: IRequestHandler<AddContentItemRequest, Unit>
    {
        private readonly IContentService _contentService;
        private readonly IBlobRepository _blobRepo;
        // content image container
        private readonly string _blobContainer = "photos";
        
        // ctor
        public AddContenteItemHander(IContentService contentService,
                                     IBlobRepository blobRepo)
        {
            _contentService = contentService;
            _blobRepo = blobRepo;
        }
        
        public async Task<Unit> Handle(AddContentItemRequest request, CancellationToken cancellationToken)
        {
            // ensure each content item has at least one image fiel
            if(request.Files == null || !request.Files.Any())
            {
                throw new BadRequestException("At least one file / image is required.");
            }

            var mediaItems = new List<MediaItem>();
            
            // upload files
            foreach (var file in request.Files)
            {
                var fileName = Guid.NewGuid().ToString() + file.FileExtension;
                // upload file
                var blobUri = await _blobRepo.UploadBlobAsync(_blobContainer, file.FileStream, fileName);
                //  todo: close  the list of file stream?
                // add into media Items
                mediaItems.Add(new MediaItem
                {
                    Type = "photo",
                    FileName = fileName,
                    Url = blobUri.AbsoluteUri,
                    PreviewUrl = string.Empty
                });
            }
            
            // new content item
            var newContent = new ContentItem
            {
                Text = request.Text,
                ContentType = ContentTypes.Item.ToString(),
                //AuthorId = request.AuthorId,
                Source = request.Source,
                Tags = request.Tags?.Split(","),
                MediaItems = mediaItems,
                DateCreated = DateTime.UtcNow,
            };

            // save
            await _contentService.AddContentAsync(newContent);
            
            return Unit.Value;
        }
    }

}
