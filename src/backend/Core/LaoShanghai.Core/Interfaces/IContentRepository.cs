namespace LaoShanghai.Core.Interfaces
{
    public interface IContentItemRepository
    {
        Task<ContentItem> GetContentItemAsync(string id, string authorId);
        Task<PagedList<ContentItem>> GetContentListAsync(int pageIndex, int pageSize);
        Task<PagedList<ContentItem>> GetContentListAsync(string keyword, string keyword2, int pageIndex, int pageSize);
        Task<int> GetTotalAsync();

        Task<ContentItem> AddContentAsync(ContentItem item);
        Task<ContentItem> UpdateItemAsync(string id, string authorId, string text, string source, string[] tags);
        Task<ContentItem> UpdateItemAsync(ContentItem item);
        Task<ContentItem> UpdateCommentCountAsync(string id, string authorId, int increment = 1);
        Task<ContentItem> DeleteItemAsync(string id, string authorId);
    }
}
