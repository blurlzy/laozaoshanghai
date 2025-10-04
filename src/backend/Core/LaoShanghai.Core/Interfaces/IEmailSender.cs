
using LaoShanghai.Core.Emails;

namespace LaoShanghai.Core.Interfaces
{
    public interface IEmailSender
    {
        // send email 
        Task SendMessageAsync(string name, string userEmail, string message);
    }
   
}
