using System;
using System.Collections.Generic;
using System.Linq;
using Dashboards.Models;
using System.Data.Entity;

namespace Dashboards.Controllers.ApiControllers
{
    public class CriteriaApiController : BaseApiController
    {
        private Func<historySales, string> _groupFunc;
        public CriteriaApiController(Func<historySales, string> groupFunc)
        {
            _groupFunc = groupFunc;
        }

        public IEnumerable<CriteriaSalesDto> GetDailySales(DateTime day) {
            var sales =
                Repository.historySales.Where(
                    s => s.date == day && s.date <= DateTime.Now);

            return (from sale in sales.GroupBy(_groupFunc)
                    select new CriteriaSalesDto {
                        Criteria = sale.Key,
                        Sales = sale.Sum(s => s.suma),
                        Units = sale.Sum(s => s.quantity)
                    }).OrderBy(x => x.Criteria);
        }

        public IEnumerable<CriteriaSalesDto> GetMonthlySales(DateTime month) {
            var sales =
                Repository.historySales.Where(
                    s => s.date.Year == month.Year && s.date.Month == month.Month && s.date <= DateTime.Now);

            return (from sale in sales.GroupBy(_groupFunc)
                    select new CriteriaSalesDto {
                        Criteria = sale.Key,
                        Sales = sale.Sum(s => s.suma),
                        Units = sale.Sum(s => s.quantity)
                    }).OrderBy(x => x.Criteria);
        }

        public IEnumerable<CriteriaSalesDto> GetSalesByRange(DateTime startDate, DateTime endDate) {
            var sales =
                Repository.historySales.Where(s => s.date >= startDate && s.date <= endDate);

            return (from sale in sales.GroupBy(_groupFunc)
                    select new CriteriaSalesDto {
                        Criteria = sale.Key,
                        Sales = sale.Sum(s => s.suma),
                        Units = sale.Sum(s => s.quantity)
                    }).OrderBy(x => x.Criteria);
        }

       
    }
}
