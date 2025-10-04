
namespace LaoShanghai.Core.Content.ContentItems
{
    public class ContentItemDto
    {
        public string Id { get; set; }

        //public string AuthorId { get; set; } // partition key  

        public string ContentType { get; set; }
        
        public string Text { get; set; }

        public string Source { get; set; }

        public List<MediaItem> MediaItems { get; set; }

        public string[] Tags { get; set; }

        public int? TotalComments { get; set; }
        
        public DateTime? DateCreated { get; set; }
        
        public string DefaultImageUrl { get; set; }
    }

    public class ContentItemUpdateDto
    {
        public string Id { get; set; }
        // public string AuthorId { get; set; }
        public string Text { get; set; }
        public string Source { get; set; }
        public IEnumerable<string> Tags { get; set; }

    }
}
