using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dashboards.Models
{
    public class CritariaSalesDaysDto {
        public string Criteria { get; set; }
        public decimal TodaySales { get; set; }
        public decimal ThisMonthUnits { get; set; }
        public decimal YesterdaySales { get; set; }
        public decimal LastMonthUnits { get; set; }
    }
}