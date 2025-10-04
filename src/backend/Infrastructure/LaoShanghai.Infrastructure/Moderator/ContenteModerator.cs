
using System.Text;

namespace LaoShanghai.Infrastructure.Moderator
{
    public class CommentModerator: IContentModerator
    {
        // 
        private readonly ContentModeratorClient _client;

        // custom term list id 
        private readonly string _customerTermListId = "245";
        
        public CommentModerator(ContentModeratorClient client)
        {
            _client = client;
        }

        public bool ContainsProfanity(string text, string lang = "zho")
        {
            // Moderate the text
            // eng | zho
            var screenResult = _client.TextModeration.ScreenText("text/plain", 
                                                                 new MemoryStream(Encoding.UTF8.GetBytes(text)), 
                                                                 lang, 
                                                                 false,  // auto correct
                                                                 false,  // scan PII (Personally identifiable information)
                                                                 _customerTermListId, //  
                                                                 true); // classify, only available for english

            // ScreenText returns a Screen object, which has a Terms property that lists any terms that Content Moderator detected in the screening.
            // Note that if Content Moderator did not detect any terms during the screening, the Terms property has value null.
            return screenResult?.Terms != null && screenResult?.Terms.Count > 0;
        }
    }
}
