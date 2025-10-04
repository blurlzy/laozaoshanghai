using Microsoft.Azure.Cosmos.Linq;
using System.Linq.Expressions;

namespace LaoShanghai.Infrastructure.Persistence
{
    public class CosmosDbService
    {
        private readonly Container _container;
        private const int MAX_LIST_COUNT = 300;

        public Container Container => _container;

        public CosmosDbService(CosmosClient cosmosClient, string databaseId, string containerId)
        {
            _container = cosmosClient.GetContainer(databaseId, containerId);
        }

        // list items
        public async Task<List<T>> ListItemsAsync<T>(Expression<Func<T, bool>> predicate)
        {
            List<T> results = new List<T>();

            // LINQ query generation
            using (FeedIterator<T> iterator = _container.GetItemLinqQueryable<T>(false).Where(predicate).ToFeedIterator())
            {
                // async
                while (iterator.HasMoreResults && results.Count < MAX_LIST_COUNT)
                {
                    foreach (var item in await iterator.ReadNextAsync())
                    {
                        results.Add(item);
                    }
                }
            }

            return results;
        }

        // list items with pagination
        public async Task<List<T>> ListPagedItemsAsync<T>(Expression<Func<T, bool>> predicate, int pageNumber, int pageSize)
        {
            if (pageNumber < 1)
            {
                throw new ArgumentException("Page number must be larger than 0.");
            }

            if (pageSize < 1)
            {
                throw new ArgumentException("Page size must be larger than 0.");
            }


            // result
            List<T> results = new List<T>();
            // LINQ query generation
            using FeedIterator<T> iterator = _container.GetItemLinqQueryable<T>(false)
                                                       .Where(predicate)
                                                       .Skip((pageNumber - 1) * pageSize)
                                                       .Take(pageSize)
                                                       .ToFeedIterator();

            // async
            while (iterator.HasMoreResults && results.Count < MAX_LIST_COUNT)
            {
                foreach (var item in await iterator.ReadNextAsync())
                {
                    results.Add(item);
                }
            }

            return results;
        }

        // get item by id
        public async Task<T> GetItemAsync<T>(string id, string partitionKey)
        {
            ItemResponse<T> response = await _container.ReadItemAsync<T>(id, new PartitionKey(partitionKey));
            return response.Resource;
        }

        // add a single item
        public async Task<ItemResponse<T>> AddItemAsync<T>(T item, string partitionKey)
        {
            return await _container.CreateItemAsync<T>(item, new PartitionKey(partitionKey));
        }

        // update an existed item
        public async Task<ItemResponse<T>> UpdateItemAsync<T>(T item, string partitionKey)
        {
            return await this._container.UpsertItemAsync<T>(item, new PartitionKey(partitionKey));
        }

        // delete an item
        public async Task<ItemResponse<T>> DeleteItemAsync<T>(string id, string partitionKey)
        {
            return await this._container.DeleteItemAsync<T>(id, new PartitionKey(partitionKey));
        }

        // run query
        public async Task<List<T>> RunQueryAsync<T>(QueryDefinition queryDefinition, string? continuationToken = null)
        {
            var results = new List<T>();

            using FeedIterator<T> resultSetIterator = _container.GetItemQueryIterator<T>(queryDefinition, continuationToken);

            // read data
            while (resultSetIterator.HasMoreResults && results.Count < MAX_LIST_COUNT)
            {
                FeedResponse<T> response = await resultSetIterator.ReadNextAsync();
                results.AddRange(response);

            }

            return results;
        }

        // get the count value
        public async Task<int> CountAsync(QueryDefinition queryDefinition)
        {
            int count = 0;
            using FeedIterator<int> resultSetIterator = _container.GetItemQueryIterator<int>(queryDefinition);

            // it should only contain 1 row 
            while (resultSetIterator.HasMoreResults)
            {
                var currentResultSet = await resultSetIterator.ReadNextAsync();
                foreach (var res in currentResultSet)
                {
                    count += res;
                }
            }

            return count;
        }
    }
}
