
namespace LaoShanghai.Core.Content.ContentItems
{
    public class CdnUrlReplacerService
    {
        // original blob storage endpoint
        private readonly string _blobStorageEndpoint;
        // frond door / cdn endpoint
        private readonly string _cdnEndpoint;

        public CdnUrlReplacerService(string blobStorageEndpoint, string cdnEndpoint)
        {
            _blobStorageEndpoint = blobStorageEndpoint ?? throw new ArgumentNullException(nameof(blobStorageEndpoint));
            _cdnEndpoint = cdnEndpoint ?? throw new ArgumentNullException(nameof(cdnEndpoint));
        }

        public ContentItemDto ReplaceUrlsWithCdn(ContentItemDto content)
        {

            if (content?.MediaItems == null)
            {
                return content;
            }
            
            foreach (var mediaItem in content.MediaItems)
            {
                mediaItem.Url = ReplaceUrl(mediaItem.Url);
            }

            return content;
        }

        public void ReplaceUrlsWithCdnInPlace(ContentItemDto content)
        {
            if (content?.MediaItems == null)
                return;

            foreach (var mediaItem in content.MediaItems)
            {
                mediaItem.Url = ReplaceUrl(mediaItem.Url);
                //mediaItem.PreviewUrl = ReplaceUrl(mediaItem.PreviewUrl);
            }
        }

        private string ReplaceUrl(string url)
        {
            if (string.IsNullOrEmpty(url))
                return url;

            return url.StartsWith(_blobStorageEndpoint, StringComparison.OrdinalIgnoreCase)
                ? url.Replace(_blobStorageEndpoint, _cdnEndpoint, StringComparison.OrdinalIgnoreCase)
                : url;
        }
    }
}
