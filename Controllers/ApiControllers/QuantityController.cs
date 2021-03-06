﻿using System;
using System.Collections.Generic;
using System.Linq;
using Dashboards.Models;
using System.Data.Entity;

namespace Dashboards.Controllers.ApiControllers
{
    public class QuantityController : CriteriaApiController
    {
        public QuantityController() : base(sale => sale.rootGroup.name) { }
        public CriteriaPerformanceDto GetCriteriaSalesPerformance()
        {
            return GetDefinedCriteriaSalesPerformance(DateTime.Now);
        }
        public CriteriaPerformanceDto GetDefinedCriteriaSalesPerformance(DateTime now)
        {
            var sales = Repository.historySales.Where(s => s.date <= now).ToList();
            var today = now.Date;
            var yesterday = today.AddDays(-1).Date;
            var prevWeekStart = today.AddDays(-7);
            while (prevWeekStart.DayOfWeek != DayOfWeek.Sunday)
            {
                prevWeekStart = prevWeekStart.AddDays(-1);
            }
            var prevWeekEnd = prevWeekStart.AddDays(7).AddSeconds(-1);
            var currentMonthStart = new DateTime(today.Year, today.Month, 1);
            var lastMonthStart = currentMonthStart.AddMonths(-1);
            var lastMonthEnd = currentMonthStart.AddSeconds(-1);
            var currentYearStart = new DateTime(today.Year, 1, 1);

            var ytdSales = sales.Where(s => s.date >= currentYearStart).Sum(s => s.quantity);

            return new CriteriaPerformanceDto
            {
                TodaySales = sales.Where(s => s.date == today).Sum(s => s.quantity),
                YesterdaySales = sales.Where(s => s.date == yesterday).Sum(s => s.quantity),
                LastWeekSales = sales.Where(s => s.date >= prevWeekStart && s.date <= prevWeekEnd).Sum(s => s.quantity),
                ThisMonthUnits = sales.Where(s => s.date >= currentMonthStart).Sum(s => s.quantity),
                LastMonthUnits = sales.Where(s => s.date >= lastMonthStart && s.date <= lastMonthEnd).Sum(s => s.quantity),
                YtdUnits = ytdSales
            };
        }
        public IEnumerable<CritariaSalesDaysDto> GetTwoDaysSales(DateTime twoDays)
        {

            List<CritariaSalesDaysDto> model = new List<CritariaSalesDaysDto>();
            var list = Repository.historySales.Where(s => s.date == DbFunctions.AddDays(twoDays, -1) || s.date == twoDays).ToList();//.GroupBy(s => s.shopGroupWares.name).Select(g => new CritariaSalesDaysDto
            foreach (var item in list.Select(s => s.rootGroup.name).Distinct().ToList())
            {
                var TodaySales = list.Where(s => s.date == twoDays && s.rootGroup.name == item).Sum(s => s.quantity);
                var YesterdaySales = list.Where(s => s.date == twoDays.AddDays(-1) && s.rootGroup.name == item).Sum(s => s.quantity);
                model.Add(new CritariaSalesDaysDto
                {
                    TodaySales = TodaySales,
                    YesterdaySales = YesterdaySales,
                    Criteria = item
                });
            }
            return model;
        }
        public IEnumerable<CritariaSalesDaysDto> GetTwoMonthUnits(DateTime twoMonths)
        {
            var month = twoMonths.Month;
            List<CritariaSalesDaysDto> model = new List<CritariaSalesDaysDto>();
            var list = Repository.historySales.Where(s => (s.date.Month == month - 1 || s.date.Month == month) && (s.date.Year == twoMonths.Year)).ToList();//.GroupBy(s => s.shopGroupWares.name).Select(g => new CritariaSalesDaysDto
            foreach (var item in list.Select(s => s.rootGroup.name).Distinct().ToList())
            {
                var ThisMonthUnits = list.Where(s => s.date.Month == twoMonths.Month && s.rootGroup.name == item).Sum(s => s.quantity);
                var LastMonthUnits = list.Where(s => s.date.Month == (month - 1) && s.rootGroup.name == item).Sum(s => s.quantity);
                model.Add(new CritariaSalesDaysDto
                {
                    ThisMonthUnits = ThisMonthUnits,
                    LastMonthUnits = LastMonthUnits,
                    Criteria = item
                });
            }
            return model;
        }
    }
}
