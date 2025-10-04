using Microsoft.VisualStudio.TestPlatform.CommunicationUtilities;
using SendGrid;
using SendGrid.Helpers.Mail;
using SendGrid.Helpers.Mail.Model;
using System.Collections.Generic;

namespace LaoShanghai.Tests.Tests
{
    public class EmailTests
    {
        private readonly ITestOutputHelper _output;
        private readonly SendGridClient _sendGridClient;
        
        public EmailTests(ITestOutputHelper output)
        {
            _output = output;
            _sendGridClient = new SendGridClient(KeyVault.SendGridApiKey);
        }

        [Theory]
        [InlineData("zlwallpaper@gmail.com", "jli@e5workflow.com")]
        public async Task Send_Email_Test(string fromAddr, string toAddr)
        {
            var client = new SendGridClient(KeyVault.SendGridApiKey);
            var from = new EmailAddress(fromAddr, "Test email");
            var subject = "Testing email";
            var to = new EmailAddress(toAddr, "Justin Li");
            var plainTextContent = "测试邮件内容";
            var htmlContent = "<strong>来自用户的提问</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
        }

        [Theory]
        [InlineData("jli@e5workflow.com", "jli@e5workflow.com", "d-7b21076fa84147d4a66c1bc17932f8d8")]
        public async Task Send_Email_With_Template_Test(string fromAddr, string toAddr, string templateId)
        {

            var from = new EmailAddress(fromAddr, "e5 R&D");
            var to = new EmailAddress(toAddr);
            
            var templateData = new {
                subject = "This email is auto-generated.",
            };

            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, templateData);

            msg.AddTo(new EmailAddress(toAddr));

            // send email
            await _sendGridClient.SendEmailAsync(msg);
        }

        [Theory]
        [InlineData("jli@e5workflow.com", "jli@e5workflow.com", "d-fe4706e33993423bbe144aa4e0dae514")]
        public async Task Send_e5_Error_Test(string fromAddr, string toAddr, string templateId)
        {
            var from = new EmailAddress(fromAddr, "e5 R&D");
            var recipients = new List<EmailAddress>();

            foreach (var to in toAddr.Split(','))
            {
                recipients.Add(new EmailAddress(to.Trim()));
            }


            var templateData = new
            {
                subject = "Eml file was processed",
                message = "A new .eml file was processed 5 mins ago.",
                link = "https://e5workflow.com/"
            };

            var msg = MailHelper.CreateSingleTemplateEmailToMultipleRecipients(from, recipients, templateId, templateData);

            msg.AddTo(new EmailAddress(toAddr));

            // send email
            await _sendGridClient.SendEmailAsync(msg);
        }
        
        [Theory]
        [InlineData("jli@e5workflow.com", "jli@e5workflow.com,cwessels@e5workflow.com,mburns@e5workflow.com", "d-7b21076fa84147d4a66c1bc17932f8d8")]
        public async Task Send_Email_To_MultipleRecipients_Test(string fromAddr, string toAddr, string templateId)
        {
            var from = new EmailAddress(fromAddr, "e5Next Email Service");
            var recipients = new List<EmailAddress>();
            
            foreach(var to in toAddr.Split(','))
            {
                recipients.Add(new EmailAddress(to.Trim()));    
            }
            
            var templateData = new
            {
                subject = "This email is auto-generated.",
            };

            var msg = MailHelper.CreateSingleTemplateEmailToMultipleRecipients(from, recipients, templateId, templateData);

            msg.AddTo(new EmailAddress(toAddr));

            // send email
            await _sendGridClient.SendEmailAsync(msg);
        }
    }
}
