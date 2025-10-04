namespace LaoShanghai.Core.Content.Comments
{
    public class CommentMapProfile: Profile
    {
        public CommentMapProfile()
        {
            CreateMap<Comment, CommentDto>();
        }
    }
}
