
namespace LaoShanghai.Infrastructure.FileStorage
{
    public class BlobRepository: IBlobRepository
    {
        private readonly BlobServiceClient _blobServiceClient;

        public BlobRepository(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }

        // return string content from a given blob (and container name)
        public async Task<string> GetBlobAsync(string containerName, string fileName)
        {
            // Creturn a container client object
            BlobContainerClient containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

            // Get a reference to a blob
            BlobClient blobClient = containerClient.GetBlobClient(fileName);

            // downlaod blob
            BlobDownloadInfo download = await blobClient.DownloadAsync();

            // steam reader
            using StreamReader streamReader = new StreamReader(download.Content);

            // read as string
            var result = await streamReader.ReadToEndAsync();

            return result;
        }

        // upload a file blob via Stream
        public async Task<Uri> UploadBlobAsync(string containerName, Stream stream, string fileName)
        {
            // container client
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

            // blob client
            var blobClient = containerClient.GetBlobClient(fileName);

            // upload
            await blobClient.UploadAsync(stream, true);

            return blobClient.Uri;
        }
    }
}
