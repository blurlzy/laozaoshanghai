namespace LaoShanghai.Domain.Content
{
    public class ContentItem: BaseDocument
    {
        [JsonPropertyName("text")]
        public string Text { get; set; }

        //// deprecated
        //[JsonPropertyName("authorId")]
        //public string AuthorId { get; set; }

        [JsonPropertyName("source")]
        public string Source { get; set; }

        [JsonPropertyName("mediaItems")]
        public List<MediaItem> MediaItems { get; set; }

        [JsonPropertyName("tweetDate")]
        public DateTime? TweetDate { get; set; }

        // tags 
        [JsonPropertyName("tags")]
        public string[] Tags { get; set; }

        // count of comments
        [JsonPropertyName("totalComments")]
        public int? TotalComments { get; set; }
        
        // default image  item (only available for content item)
        [JsonIgnore]
        public string DefaultImageUrl
        {
            get
            {
                if (!string.IsNullOrEmpty(this.ContentType) && this.ContentType != ContentTypes.Item.ToString())
                {
                    return string.Empty;
                }
                return this.MediaItems.FirstOrDefault(m => m.Type == "photo")?.Url;
            }
        }
    }

    public class MediaItem
    {
        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("url")]
        public string Url { get; set; }

        [JsonPropertyName("fileName")]
        public string FileName { get; set; }

        // for video ONLY
        [JsonPropertyName("previewUrl")]
        public string PreviewUrl { get; set; }
    }

    public enum ContentTypes
    {
        Item,

        Comment
    }
}
