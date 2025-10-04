
namespace LaoShanghai.Core.Content.ContentItems
{
    public class ContentItemMapProfile : Profile
    {
        public ContentItemMapProfile()
        {
            CreateMap<ContentItem, ContentItemDto>();
        }
    }
}
