

namespace LaoShanghai.Core.Interfaces
{
    public interface IContentService
    {
        Task<ContentItem> AddContentAsync(ContentItem item);
        Task<Comment> AddCommentAsync(string contentId, string name, string commentText, bool reviewed = false, bool containsProfanity = false);
        Task<PagedList<ContentItem>> GetContentListAsync(int pageIndex, int pageSize);
        Task<PagedList<ContentItem>> GetContentListAsync(string keyword, string keyword2, int pageIndex, int pageSize);
        Task<ContentItem> GetContentItemAsync(string id);
        Task<List<Comment>> GetCommentsAsync(string contentItemId, bool reviewed = true);
        Task<PagedList<Comment>> GetCommentsAsync(bool reviewed = true, int pageIndex = 0, int pageSize = 12);
        Task<Comment> GetCommentAsync(string id);
        Task<int> GetTotalAsync();
        Task<ContentItem> UpdateItemAsync(string id, string text, string source, string[] tags);
        Task<ContentItem> UpdateItemAsync(ContentItem item);
        Task<ContentItem> UpdateCommentCountAsync(string id, int increment = 1);
        Task<Comment> ReviewCommentAsync(string id, bool isApproved);
        Task<ContentItem> DeleteItemAsync(string id);
        Task<Comment> DeleteCommentAsync(string id);
    }
}
