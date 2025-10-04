
namespace LaoShanghai.Shared.IO
{
    public static class FileHelper
    {
        public static bool IsValidPhoto(string fileExtension)
        {
            var supportedTypes = new string[] { ".png", ".jpg", ".jpeg", ".gif", ".jfif" };

            if (!supportedTypes.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            return true;
        }
    }
}
