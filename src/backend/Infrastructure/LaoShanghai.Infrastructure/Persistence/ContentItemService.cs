

namespace LaoShanghai.Infrastructure.Persistence
{
    public class ContentItemService: IContentService
    {
        private readonly CosmosDbService _cosmosDbService;

        public ContentItemService(CosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService;
        }

        // add content item
        public async Task<ContentItem> AddContentAsync(ContentItem item)
        {
            // id 
            if (string.IsNullOrEmpty(item.Id))
            {
                item.Id = Guid.NewGuid().ToString();
            }

            if (!item.DateCreated.HasValue)
            {
                item.DateCreated = DateTime.UtcNow;
            }

            // Create an item in the container
            return await _cosmosDbService.AddItemAsync<ContentItem>(item,item.Id);
        }

        // add an comment
        public async Task<Comment> AddCommentAsync(string contentId, string name, string commentText, bool reviewed = false, bool containsProfanity = false)
        {
            var newComment = new Comment
            {
                Id = Guid.NewGuid().ToString(),                
                ContentItemId = contentId,
                ContentType = ContentTypes.Comment.ToString(),                
                Name = name,
                CommentText = commentText,
                Reviewed = reviewed,
                ContainsProfanity = containsProfanity,
                DateCreated = DateTime.UtcNow
            };

            // add new comment 
            // Create a new item in the container
            return await _cosmosDbService.AddItemAsync<Comment>(newComment, newComment.Id);
        }

        // return paginated list
        public async Task<PagedList<ContentItem>> GetContentListAsync(int pageIndex, int pageSize)
        {

            // return contente items (exclude comments)
            QueryDefinition query = new QueryDefinition("SELECT * FROM c WHERE (IS_DEFINED(c.contentType) = false OR c.contentType = 'Item') ORDER BY c.dateCreated DESC OFFSET @skip LIMIT @take")
                                   .WithParameter("@skip", pageIndex * pageSize)
                                   .WithParameter("@take", pageSize);

            // get the data
            var pagedData = await _cosmosDbService.RunQueryAsync<ContentItem>(query);

            // count query
            QueryDefinition countQuery = new QueryDefinition("SELECT VALUE COUNT(1) FROM c");

            // calc total count
            var total = await _cosmosDbService.CountAsync(countQuery);

            return new PagedList<ContentItem>(total, pagedData);
        }

        // search keyword in text as well as tag list, it search both in simplified chinese (keyword1) & traditional chinese (keyword2)
        public async Task<PagedList<ContentItem>> GetContentListAsync(string keyword, string keyword2, int pageIndex, int pageSize)
        {

            QueryDefinition query = new QueryDefinition("SELECT * FROM c WHERE (IS_DEFINED(c.contentType) = false OR c.contentType = 'Item') AND (CONTAINS(c.text, @keyword) OR CONTAINS(c.text, @keyword2)) OR (ARRAY_CONTAINS(c.tags, @keyword) OR ARRAY_CONTAINS(c.tags, @keyword2)) ORDER BY c.dateCreated DESC OFFSET @skip LIMIT @take")
                                    .WithParameter("@keyword", keyword)
                                    .WithParameter("@keyword2", keyword2)
                                    .WithParameter("@skip", pageIndex * pageSize)
                                    .WithParameter("@take", pageSize);


            var pagedData = await _cosmosDbService.RunQueryAsync<ContentItem>(query);

            // count query
            QueryDefinition countQuery = new QueryDefinition("SELECT VALUE COUNT(1) FROM c WHERE (IS_DEFINED(c.contentType) = false OR c.contentType = 'Item') AND (CONTAINS(c.text, @keyword) OR CONTAINS(c.text, @keyword2)) OR (ARRAY_CONTAINS(c.tags, @keyword) OR ARRAY_CONTAINS(c.tags, @keyword2))")
                                                .WithParameter("@keyword", keyword)
                                                .WithParameter("@keyword2", keyword2);

            // get the total
            var total = await _cosmosDbService.CountAsync(countQuery);

            return new PagedList<ContentItem>(total, pagedData);
        }

        // get item by id
        public async Task<ContentItem> GetContentItemAsync(string id)
        {
            // Read the item to see if it exists.  
            return await _cosmosDbService.GetItemAsync<ContentItem>(id, id);            
        }

        // list comments by content id 
        public async Task<List<Comment>> GetCommentsAsync(string contentItemId, bool reviewed = true)
        {
            string query = @"SELECT * FROM c 
                                WHERE c.contentItemId = @contentItemId AND 
                                      c.contentType = 'Comment' AND 
                                      c.reviewed = @reviewed 
                                      ORDER BY c.dateCreated DESC";

            // search query (convert to lower to make the query insensitive) 
            QueryDefinition queryDef = new QueryDefinition(query)
                                   .WithParameter("@contentItemId", contentItemId)
                                   .WithParameter("@reviewed", reviewed);

            // get the data
            return await _cosmosDbService.RunQueryAsync<Comment>(queryDef);
        }

        // list comments
        public async Task<PagedList<Comment>> GetCommentsAsync(bool reviewed = true, int pageIndex = 0, int pageSize = 12)
        {
            // count query
            QueryDefinition countQuery = new QueryDefinition("SELECT VALUE COUNT(1) FROM c WHERE c.contentType = 'Comment' AND c.reviewed = @reviewed")
                                                .WithParameter("@reviewed", reviewed);

            // get the total
            var total = await _cosmosDbService.CountAsync(countQuery);

            // search query (convert to lower to make the query insensitive) 
            QueryDefinition query = new QueryDefinition("SELECT * FROM c WHERE c.contentType = 'Comment' AND c.reviewed = @reviewed ORDER BY c.dateCreated DESC OFFSET @skip LIMIT @take")
                                               .WithParameter("@reviewed", reviewed)
                                               .WithParameter("@skip", pageIndex * pageSize)
                                               .WithParameter("@take", pageSize);

            var pagedData = await _cosmosDbService.RunQueryAsync<Comment>(query);

            return new PagedList<Comment>(total, pagedData);

        }

        // get comment by its id
        public async Task<Comment> GetCommentAsync(string id)
        {
            // Read the item to see if it exists.  
            return await _cosmosDbService.GetItemAsync<Comment>(id, id);
        }

        // count total content items 
        public async Task<int> GetTotalAsync()
        {
            // query
            QueryDefinition query = new QueryDefinition("SELECT VALUE COUNT(1) FROM c WHERE IS_DEFINED(c.contentType) = false OR c.contentType = 'Item'");

            // get the total
            return await _cosmosDbService.CountAsync(query);
        }

        // update item
        public async Task<ContentItem> UpdateItemAsync(string id, string text, string source, string[] tags)
        {
            // get the item            
            ContentItem itemBody = await _cosmosDbService.GetItemAsync<ContentItem>(id, id);

            if (itemBody == null)
            {
                throw new BadContentException($"Can not find content item by id: {id}");
            }

            itemBody.Text = text;
            itemBody.ContentType = ContentTypes.Item.ToString(); 
            itemBody.Source = source;
            itemBody.Tags = tags;
            itemBody.DateModified = DateTime.UtcNow;
            itemBody.DateCreated = DateTime.UtcNow;

            // update
            return await _cosmosDbService.UpdateItemAsync<ContentItem>(itemBody, itemBody.Id);    
        }

        public async Task<ContentItem> UpdateItemAsync(ContentItem item)
        {
            item.DateModified = DateTime.UtcNow;
            return await _cosmosDbService.UpdateItemAsync<ContentItem>(item, item.Id);
        }

        public async Task<ContentItem> UpdateCommentCountAsync(string id, int increment = 1)
        {
            // var partitionKey = new PartitionKey(authorId);
            ContentItem contentItem = await _cosmosDbService.GetItemAsync<ContentItem>(id, id);


            var totalCountOfComments = contentItem.TotalComments.HasValue ? contentItem.TotalComments.Value + increment : 0 + increment;

            // update the total count of its comments
            contentItem.TotalComments = totalCountOfComments < 0 ? 0 : totalCountOfComments;
            contentItem.DateModified = DateTime.UtcNow;

            // update
            return await _cosmosDbService.UpdateItemAsync<ContentItem>(contentItem, contentItem.Id);
        }

        public async Task<Comment> ReviewCommentAsync(string id, bool isApproved)
        {
            // find the comment
            Comment comment = await _cosmosDbService.GetItemAsync<Comment>(id, id);

            comment.Reviewed = isApproved;
            comment.DateModified = DateTime.UtcNow; // review data time

            // update
            await _cosmosDbService.UpdateItemAsync<Comment>(comment, id);

            return comment;
        }

        // delete an item
        public async Task<ContentItem> DeleteItemAsync(string id)
        {
            return await _cosmosDbService.DeleteItemAsync<ContentItem>(id, id);
        }

        // delete an comment
        public async Task<Comment> DeleteCommentAsync(string id)
        {
            // Delete an item. Note we must provide the partition key value and id of the item to delete
            return await _cosmosDbService.DeleteItemAsync<Comment>(id, id);
        }
    }
}
