

namespace LaoShanghai.Core.Interfaces
{
    public interface IContentModerator
    {
        // Scans text for offensive content, profanity, sensitive or censored terms in China
        // default languag code zho
        bool ContainsProfanity(string text, string lang = "zho");
    }
}
