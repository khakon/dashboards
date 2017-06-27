using ReportsWeb.Areas.Dashboards.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Dashboards.Controllers.ApiControllers
{
    public class SaleController : ApiController
    {
        BooksEntities db = new BooksEntities();
        public IQueryable GetSale(DateTime day)
        {
            var maxDate = db.historySales.Where(s => s.week >= day).Min(s => s.week);
            var list = db.historySales.Where(s => s.date == maxDate).Select(s => new { group = s.rootGroup.name, sale = s.suma, saleLast = s.suma });
            return list;
        }
        public IQueryable GetSaleCount(DateTime dayCount)
        {
            var maxDate = db.historySales.Max(s => s.week);
            var list = db.historySales.Where(s => s.week == dayCount).Select(s => new { group = s.rootGroup.name, count = s.quantity, countLast = s.quantity });
            return list;
        }

        public SaleTotalModel GetBalanceTotal(DateTime dayTotal)
        {
            var maxDate = db.historySales.Max(s => s.week);
            var total = new SaleTotalModel
            {
                sum = (decimal)db.historySales.Where(s => s.week == maxDate).Sum(p => p.suma),
                sumLast = (decimal)db.historySales.Where(s => s.week == maxDate).Sum(p => p.suma),
                count = db.historySales.Where(s => s.week == maxDate).Sum(p => p.quantity),
                countLast = db.historySales.Where(s => s.week == maxDate).Sum(p => p.quantity)
            };
            return total;
        }

        public IQueryable GetSaleAll(DateTime startDate, DateTime endDate)
        {
            var balance = db.historySales.GroupBy(s => s.date).Select(t => new { SaleDate = t.Key, Sales = t.Sum(p => p.suma) }).OrderBy(s => s.SaleDate).AsQueryable();
            return balance;
        }
    }
}
