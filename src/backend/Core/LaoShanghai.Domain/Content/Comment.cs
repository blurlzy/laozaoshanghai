

namespace LaoShanghai.Domain.Content
{
    public class Comment: BaseDocument
    {
        
        [JsonPropertyName("contentItemId")]
        public string ContentItemId { get; set; }

        // to be deprecated
        [JsonPropertyName("authorId")]
        public string AuthorId { get; set; }  

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("commentText")]
        public string CommentText { get; set; }

        [JsonPropertyName("reviewed")]
        public bool Reviewed { get; set; }

        [JsonPropertyName("containsProfanity")]
        public bool? ContainsProfanity { get; set; }
    }
}
