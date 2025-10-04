using Microsoft.Azure.Cosmos;
using LaoShanghai.Core.Interfaces;
using LaoShanghai.Infrastructure.Persistence;
using LaoShanghai.Domain.Content;
using System.Collections.Generic;
using Azure.Core;

namespace LaoShanghai.Tests
{
    public class CosmosTests
    {
        private readonly ITestOutputHelper _output;
        // cosmos container id
        private static readonly string _contentContainerId = "content-items";
        // new container id
        private static readonly string _newContainerId = "content";

        // cosmos db & container
        //private readonly List<(string, string)> _containersToInitialize = new List<(string, string)> { (KeyVault.CosmosDbName, _contentContainerId) };

        private readonly CosmosClient _cosmosClient;
        // cosmos service
        private readonly CosmosDbService _cosmosDbService;
        private readonly ContentItemService _contentItemService;

        // ctor
        public CosmosTests(ITestOutputHelper output)
        {
            // Creates a new CosmosClient with the account endpoint URI string and TokenCredential.
            CosmosClientOptions clientOptions = new CosmosClientOptions()
            {
                SerializerOptions = new CosmosSerializationOptions()
                {
                    IgnoreNullValues = true,
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }
            };

            _cosmosClient = new CosmosClient(KeyVault.CosmosDbEndpoint, KeyVault.CosmosPrimaryKey, clientOptions);

            // new services
            _cosmosDbService = new CosmosDbService(_cosmosClient, KeyVault.CosmosDbName, _newContainerId);
            _contentItemService = new ContentItemService(_cosmosDbService);

            _output = output;
        }

        [Theory]
        [InlineData(0, 10)]
        public async Task TestGetContenteListAsync(int pageIndex, int pageSize)
        {
            // var contentPagedList = await _contentRepo.GetContentListAsync(pageIndex, pageSize);            
            var contentList = await _contentItemService.GetContentListAsync(pageIndex, pageSize);
            _output.WriteLine($"Total: {contentList.Total}");

            foreach (var item in contentList.Data)
            {
                _output.WriteLine($"id: {item.Id}");
            }  
        }

        [Theory]
        [InlineData("90年代长寿路", "90年代", "laozaoshanghai")]
        public async Task TestAddContentAsync(string text, string tags, string source)
        {

            var mediaItems = new List<MediaItem>();
            // add into media Items
            mediaItems.Add(new MediaItem
            {
                Type = "photo",
                FileName = "b8392501-a071-4926-bd69-db88d15441db.webp",
                Url = "https://stlaoshanghaiprod.blob.core.windows.net/photos/b8392501-a071-4926-bd69-db88d15441db.webp",
                PreviewUrl = string.Empty
            });

            var newContent = new ContentItem
            {
                Text = text,
                ContentType = ContentTypes.Item.ToString(),
                Source = source,
                Tags = tags.Split(","),
                MediaItems = mediaItems,
                DateCreated = DateTime.UtcNow,
            };


            // save
            await _contentItemService.AddContentAsync(newContent);
        }


        [Theory]
        [InlineData("0e5e80d1-5222-4ce3-a89d-925e789ad2db")]
        public async Task TestListCommentsAsync(string contentId)
        {
            var comments = await _contentItemService.GetCommentsAsync(contentId);

            Assert.True(comments.Count >= 0);
        }

        [Theory]
        [InlineData("e5a95fb3-90ef-4c53-8bad-6e9aaffe2c86")]
        public async Task TestDeleteContentItemAsync(string id)
        {
            await _contentItemService.DeleteItemAsync(id);
        }


        [Theory]
        [InlineData("103d335e-1fc8-46d9-b39d-2f6fb7a8ac78")]// 
        public async Task TestUpdateContentItenAsync(string id)
        {
            // get the item
            var contentItem = await _contentItemService.GetContentItemAsync(id);

            // update the item created date time            
            if(contentItem != null)
            {
                contentItem.ContentType = ContentTypes.Item.ToString();
                contentItem.DateCreated = DateTime.UtcNow;


                // update
                await _contentItemService.UpdateItemAsync(contentItem);
            }
        }
        
        [Theory]
        [InlineData("69fdc2db-913a-4308-865d-ab3c2f766f9c", "Lazaoshanghai", "This is my second comment.")]
        public async Task TestAddCommentAsync(string contentItemId, string name, string commentText)
        {
            var newComment = await _contentItemService.AddCommentAsync(contentItemId, name, commentText);

            _output.WriteLine($"New comment id : {newComment.Id}");
        }

        [Theory]
        [InlineData("ecb12803-98b3-4cb7-980e-0317ab8e3648")]
        public async Task TestDeleteCommentAsync(string commentId)
        {
            await _contentItemService.DeleteCommentAsync(commentId);
        }
        
        [Theory]
        [InlineData("a471cae2-a7c0-4cee-9a82-7beadae2ad8a")]
        public async Task TestReviewCommentAsync(string commentId)
        {
            await _contentItemService.ReviewCommentAsync(commentId, true);
        }

        [Theory]
        [InlineData("69fdc2db-913a-4308-865d-ab3c2f766f9c", 1)]
        public async Task TestUpdateCommentCountAsync(string id, int increment)
        {
            await _contentItemService.UpdateCommentCountAsync(id, increment);
        }

        [Theory]
        [InlineData(0, 10)]
        public async Task TestGetCommentsAsync(int pageIndex, int pageSize)
        {
            var result = await _contentItemService.GetCommentsAsync(true, pageIndex, pageSize);
            _output.WriteLine($"Total reviewed comments: {result.Total}");

            var result2 = await _contentItemService.GetCommentsAsync(false, pageIndex, pageSize);
            _output.WriteLine($"Total unreviewed comments: {result2.Total}");
        }

        // copy from old container to new container
        [Theory]
        [InlineData(300)]
        public async Task CopyAsync(int batchSize)
        {
            var sourceContainer = _cosmosClient.GetContainer(KeyVault.CosmosDbName, _contentContainerId);
            var targetContainer = _cosmosClient.GetContainer(KeyVault.CosmosDbName, _newContainerId);

            FeedIterator<dynamic> iterator = sourceContainer.GetItemQueryIterator<dynamic>();
            List<Task> tasks = new List<Task>();
            int count = 0;

            while (iterator.HasMoreResults)
            {
                FeedResponse<dynamic> response = await iterator.ReadNextAsync();
                foreach (var item in response)
                {
                    // Assuming 'id' and 'partitionKey' are properties of your documents.
                    string id = item.id;
                    string partitionKey = item.id; // Update this based on your partition key

                    tasks.Add(CopyItemAsync(targetContainer, id, partitionKey, item));

                    if (++count >= batchSize)
                    {
                        // Wait for the current batch to complete
                        await Task.WhenAll(tasks);
                        tasks.Clear();
                        count = 0;
                    }
                }
            }

            // Ensure any remaining items are copied
            if (tasks.Count > 0)
            {
                await Task.WhenAll(tasks);
            }
        }


        private async Task CopyItemAsync(Container targetContainer, string id, string partitionKey, dynamic item)
        {
            try
            {
                // Check if item exists in the destination container
                await targetContainer.ReadItemAsync<dynamic>(id, new PartitionKey(partitionKey));
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                // Item does not exist, so create it
                await targetContainer.CreateItemAsync(item, new PartitionKey(partitionKey));
            }
        }
    }
}
