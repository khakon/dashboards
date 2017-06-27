using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dashboards.Models
{
    public class SalesModel
    {
        public DateTime date { get; set; }
        public DateTime week { get; set; }
        public string group { get; set; }
        public int count { get; set; }
        public decimal sum { get; set; }
        public int countLast { get; set; }
        public decimal sumLast { get; set; }
    }
}