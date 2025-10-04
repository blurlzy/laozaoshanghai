using SendGrid.Helpers.Mail;

namespace LaoShanghai.Infrastructure.Emails
{
    public class EmailSender: IEmailSender
    {
        private readonly ISendGridClient _sendGridClient;

        // we are using SendGrid to send user messages to LaozaoShanghai
        // it uses the zlwallpaper@gmail.com as the sender to send the message to the target email laozaoshanghai@gmail.com
        private readonly string _from = "zongyili1981@outlook.com";
        private readonly string _to = "laozaoshanghai@gmail.com";
        
        // ctor
        public EmailSender(ISendGridClient sendGridClient)
        {
            _sendGridClient = sendGridClient;
        }

        // send an email with the user message to laozaoshanghai email
        public async Task SendMessageAsync(string name, string userEmail, string message)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_from),
                Subject = $"[老早上海] 来自用户 - {name} ({userEmail}) 的消息"
            };

            msg.AddTo(new EmailAddress(_to));
            // email body
            msg.AddContent(MimeType.Html, $"{message}");

            // send email
            await _sendGridClient.SendEmailAsync(msg);
        }
    }
}
