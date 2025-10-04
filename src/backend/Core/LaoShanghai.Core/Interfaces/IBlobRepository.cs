

namespace LaoShanghai.Core.Interfaces
{
    public interface IBlobRepository
    {
        Task<string> GetBlobAsync(string containerName, string fileName);
        Task<Uri> UploadBlobAsync(string containerName, Stream stream, string fileName);
    }
}
