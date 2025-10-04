
namespace LaoShanghai.Core.Interfaces
{
    public interface ICommentRepository
    {
        // return comments with reviewed filtler
        Task<PagedList<Comment>> GetCommentsAsync(bool reviewed = true, int pageIndex = 0, int pageSize = 12);
        // return comments withe a given content item id, ONLY reviewed comments can be viewed by public
        Task<List<Comment>> GetCommentsAsync(string contentItemId, bool reviewed = true);
        // return comment with its id & partitionkey
        Task<Comment> GetCommmentAsync(string id, string partitionKey);
        
        
        Task<Comment> AddCommentAsync(string contentItemId, string authorId, string name, string commentText, bool reviewed = false, bool containsProfanity = false);
        Task<Comment> DeleteCommentAsync(string id, string authorId);
        Task<Comment> ReviewCommentAsync(string id, string authorId, bool isApproved);
    }
}
