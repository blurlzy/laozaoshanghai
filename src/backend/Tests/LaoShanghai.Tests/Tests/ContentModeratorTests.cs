using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Azure.CognitiveServices.ContentModerator;
using Microsoft.Azure.CognitiveServices.ContentModerator.Models;

namespace LaoShanghai.Tests
{
    public class ContentModeratorTests
    {

        // Create a text review client
        private static ContentModeratorClient _client;

        private readonly ITestOutputHelper _output;
        public ContentModeratorTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Theory]
        [InlineData("你好")]
        public void Content_Moderator_Test(string text)
        {
            // Create a text review client
            ContentModeratorClient client = Authenticate();

            // custom term list id 
            // string customerTermListId = "245";
            // Moderate the text
            // eng | zho
            var screenResult = client.TextModeration.ScreenText("text/plain", new MemoryStream(Encoding.UTF8.GetBytes(text)), "zho", false, false, null, true);

            if(screenResult.Terms?.Count > 0)
            {
                _output.WriteLine("Profane terms found!!");
            }

            // 
            
            _output.WriteLine(JsonSerializer.Serialize(screenResult));
        }


        [Theory]
        [InlineData("China Censored Word List", "This list contains terms that are sensitive in China.")]
        public void CreateTermList(string termListName, string description)
        {
            _output.WriteLine("Creating term list.");

            // Create a text review client
            ContentModeratorClient client = Authenticate();
            
            Body body = new Body(termListName, description);
            TermList list = client.ListManagementTermLists.Create("application/json", body);
            if (false == list.Id.HasValue)
            {
                throw new Exception("TermList.Id value missing.");
            }
            else
            {
                string list_id = list.Id.Value.ToString();
                _output.WriteLine("Term list created. ID: {0}.", list_id);
                
                Thread.Sleep(3000);

            }

            // get all term lists
            var termLists = client.ListManagementTermLists.GetAllTermLists();
            foreach(var termList in termLists)
            {
                _output.WriteLine(termList.Name);
            }
            
        }

        [Theory]
        [InlineData("245", "China Censored Word List", "This list contains terms that are sensitive or censored in China.")]
        public void UpdateTermList(string list_id, string name = null, string description = null)
        {
            // Create a text review client
            ContentModeratorClient client = Authenticate();
            
            Body body = new Body(name, description);
            client.ListManagementTermLists.Update(list_id, "application/json", body);

            // get all term lists
            var termLists = client.ListManagementTermLists.GetAllTermLists();
            foreach (var termList in termLists)
            {
                _output.WriteLine( $"Term list id: {termList.Id}, name: { termList.Name}.");
            }
        }
        
        [Theory]
        [InlineData("245", "your term", "zho")]
        public void AddTerm(string list_id, string term, string lang)
        {
            // Create a text review client
            ContentModeratorClient client = Authenticate();
            _output.WriteLine("Adding term \"{0}\" to term list with ID {1}.", term, list_id);
            client.ListManagementTerm.AddTerm(list_id, term, lang);
            Thread.Sleep(3000);
        }

        [Theory]
        [InlineData("245", "zho")]        
        public void ShowTermsInList(string listId, string language)
        {
            // Create a text review client
            ContentModeratorClient client = Authenticate();

            var pageIndex = 0;
            var limit = 10;
            // first page
            var terms = client.ListManagementTerm.GetAllTerms(listId, language, null, limit);

            foreach(var term in terms.Data.Terms)
            {
                _output.WriteLine(term.Term);
            }

            // read the data from the next page
            while (terms.Paging.Returned == limit)
            {
                pageIndex++;
                terms = client.ListManagementTerm.GetAllTerms(listId, language, pageIndex *  limit, limit);
                foreach (var term in terms.Data.Terms)
                {
                    _output.WriteLine(term.Term);
                }               
            }

        }
        
        private static ContentModeratorClient Authenticate()
        {
            if(_client == null)
            {
                _client = new ContentModeratorClient(new ApiKeyServiceClientCredentials(KeyVault.ContentModeratorSubKey));
                _client.Endpoint = KeyVault.ContentModeratorEndpoint;
            }
            
            return _client;
        }
    }
}
