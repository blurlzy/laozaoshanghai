
namespace LaoShanghai.Domain.Content
{
    public abstract class BaseDocument
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("contentType")]
        public string ContentType { get; set; }

        [JsonPropertyName("dateCreated")]
        public DateTime? DateCreated { get; set; }

        [JsonPropertyName("dateModified")]
        public DateTime? DateModified { get; set; }
    }
}
