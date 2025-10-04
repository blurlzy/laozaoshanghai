namespace LaoShanghai.Core.Content.Comments
{
    public class CommentDto
    {
        public string Id { get; set; }
        
        public string ContentItemId { get; set; }

        public string AuthorId { get; set; }

        public string Name { get; set; }

        public string CommentText { get; set; }

        public bool Reviewed { get; set; }

        public DateTime? DateCreated { get; set; }
    }
}
