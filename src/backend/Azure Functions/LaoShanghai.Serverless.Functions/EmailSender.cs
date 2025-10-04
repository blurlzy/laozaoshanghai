using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace LaoShanghai.Serverless.Functions
{
    internal static class EmailSender
    {
        // private readonly ISendGridClient _sendGridClient;

        // we are using SendGrid to send user messages to LaozaoShanghai
        // it uses the zlwallpaper@gmail.com as the sender to send the message to the target email laozaoshanghai@gmail.com
        private static readonly string _from = "zongyili1981@outlook.com";
        private static readonly string _to = "laozaoshanghai@gmail.com";

        private static readonly ISendGridClient _sendGridClient = new SendGridClient(SecretManager.SendGridApiKey);
        

        // send an email with the user message to laozaoshanghai email
        public static async Task SendMessageAsync(string message)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_from),
                Subject = $"[老早上海 - 新的留言]"
            };

            msg.AddTo(new EmailAddress(_to));
            // email body
            msg.AddContent(MimeType.Html, message);

            // send email
            await _sendGridClient.SendEmailAsync(msg);
        }
    }
}
