using System.Web.Http;
using Dashboards.Models;

namespace Dashboards.Controllers.ApiControllers
{
    public class BaseApiController : ApiController
    {
        protected readonly BooksEntities Repository;

        public BaseApiController()
        {
            Repository = new BooksEntities();
        }
    }
}
