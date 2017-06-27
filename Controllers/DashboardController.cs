using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dashboards.Controllers
{
    public class DashboardController : Controller
    {
        // GET: Dashboard
        public ActionResult Sale()
        {
            return View();
        }
        public ActionResult TotalCost()
        {
            return View("Criteria", (object)"TotalCost");
        }
        public ActionResult Quantity()
        {
            return View("Criteria", (object)"Quantity");
        }

    }
}