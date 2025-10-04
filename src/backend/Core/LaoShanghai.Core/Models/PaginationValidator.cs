namespace LaoShanghai.Core.Models
{
    public static class PageSizeValidator
    {
        public static void ValidatePageSize(int pageSize, int maxiumPageSize)
        {
            if (pageSize <= 5)
            {
                throw new ArgumentOutOfRangeException("Minimal page size is 5.");
            }

            if (pageSize > maxiumPageSize)
            {
                throw new ArgumentOutOfRangeException($"Page size must be less than {maxiumPageSize}. ");
            }
        }
    }
}
