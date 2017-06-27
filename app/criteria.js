function numberWithSpaces(x) {
    var parts = Number((x).toFixed(2)).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}
function numberWithSpacesInt(x) {
    console.log(x);
    return (x / 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "млн";
}
var Criteria = function (criteria) {
    var self = this,
        fields = 
            ["Телевизоры", "Холодильники", "Книги", "Обувь", "Компьютеры", "Техника"];
    SaleViewer.legend = new Legend(fields);
    var category = criteria,
        maxSalesValue = 0,
        maxUnitsValue = 0,
        chartOptions = {
            onIncidentOccurred: null,
            palette: "SaleViewPalette",
            dataSource: [],
            commonSeriesSettings: {
                argumentField: "Criteria",
                type: "bar",
                hoverMode: "onlyPoint",
                selectionMode: "onlyPoint",
                minBarSize: 5
            },
            legend: {
                visible: false
            },
            argumentAxis: {
                label: {
                    customizeText: function() {
                        return SaleViewer.legend.getShortFieldName(this.value);
                    }
                }
            },
            customizePoint: function() {
                if(this.seriesName == "Today" || this.seriesName == "ThisMonth")
                    return {
                        color: SaleViewer.legend.getColorByField(this.argument),
                        hoverStyle: {
                            color: SaleViewer.legend.getColorByField(this.argument),
                            hatching: {
                                opacity: 0
                            }
                        }
                    }
            },
            tooltip: {
                enabled: true,
                font: {
                    opacity: 1,
                    size: 22
                },
                paddingTopBottom: 8,
                customizeTooltip: function() {
                    return {
                        text: "<span style='font-size: 14px; color: " + SaleViewer.lightColor + ";'>" + this.argumentText.toUpperCase() + "</span><br />"
                            //+ "<span style='color: " + SaleViewer.legend.getColorByField(this.argumentText) + ";'>" + Globalize.format(this.originalValue, getFormatBySeriesName(this.seriesName)) + "</span><br />"
                            + "<span style='color: " + SaleViewer.legend.getColorByField(this.argumentText) + ";'>" + numberWithSpaces(this.originalValue) + "</span><br />"
                            + "<span style='font-size: 14px; color: " + SaleViewer.lightColor + ";'>" + getDateName(this.seriesName) + "</span>"
                    };
                },
                shadow: {
                    opacity: 0.15,
                    blur: 0,
                    color: "#000000",
                    offsetX: 3,
                    offsetY: 3
                }
            }
        },

        salesOptions = {
            series: [
                {
                    valueField: "YesterdaySales",
                    name: "Yesterday",
                    color: "rgba(175, 175, 175, 0.45)",
                    hoverStyle: {
                        color: "rgba(175, 175, 175, 0.45)",
                        hatching: {
                            opacity: 0
                        }
                    }
                },
                {
                    valueField: "TodaySales",
                    name: "Today"
                }
            ],
            valueAxis: {
                axisDivisionFactor: 40,
                placeholderSize: 45,
                //label: {
                //    format: 'thousands',
                //    customizeText: function () {
                //        if (this.value != maxSalesValue) {
                //            return this.valueText.replace('K', '').replace(',', ' ');
                //        }
                //        return "";
                //    }
                //}
            }

        },

        unitsOptions = {
            series: [
                {
                    valueField: "LastMonthUnits",
                    name: "LastMonth",
                    color: "rgba(175, 175, 175, 0.45)",
                    hoverStyle: {
                        color: "rgba(175, 175, 175, 0.45)",
                        hatching: {
                            opacity: 0
                        }
                    }
                },
                {
                    valueField: "ThisMonthUnits",
                    name: "ThisMonth"
                }
            ],
            valueAxis: {
                axisDivisionFactor: 40,
                placeholderSize: 40,
                label: {
                    format: 'thousands',
                    customizeText: function () {
                        if (this.value != maxSalesValue) {
                            return this.valueText.replace('K', '').replace(',', ' ');
                        }
                        return "";
                    }
                }
            }
        },

        getDateName = function (seriesName) {
            var dayDate = daySwitcher.getDate(),
                monthDate = monthSwitcher.getDate();
            switch (seriesName) {
                case "Yesterday":
                    return getCurrentDate().getDate() == dayDate.getDate() ?
                        "Вчера" :
                        Globalize.format(new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() - 1), "MM/dd/yyyy");
                    break;
                case "Today":
                    return (getCurrentDate().getDate() == dayDate.getDate()) ?
                        "Сегодня" :
                        (getCurrentDate().getDate() - 1 == dayDate.getDate()) ?
                        "Вчера" :
                        Globalize.format(dayDate, "MM/dd/yyyy");
                    break;
                case "LastMonth":
                    return Globalize.format(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1), "MMMM");
                    break;
                case "ThisMonth":
                    return Globalize.format(monthDate, "MMMM");
                    break;
            }
        },

        getFormatBySeriesName = function(seriesName) {
            if(seriesName == "Today" || seriesName == "Yesterday") return "n0";
            else if(seriesName == "ThisMonth" || seriesName == "LastMonth") return "n0";
        },

        salesChart = SaleViewer.sharedWidgets.initChart(category, $.extend({}, chartOptions, salesOptions), "chart", "sales"),
        unitsChart = SaleViewer.sharedWidgets.initChart(category, $.extend({}, chartOptions, unitsOptions), "chart", "units"),



        updateSales = function(date) {
            SaleViewer.loadData({
                twoDays: Globalize.format(date, "yyyy-MM-dd")
            }, function(data) {
                maxSalesValue = SaleViewer.sharedWidgets.getMaxAxisValue(data);
                salesChart.instance.option("valueAxis.max", maxSalesValue);
                salesChart.instance.option("dataSource", data);
            }, category);
        },
        updateUnits = function(date) {
            SaleViewer.loadData({
                twoMonths: Globalize.format(date, "yyyy-MM-dd")
            }, function(data) {
                maxUnitsValue = SaleViewer.sharedWidgets.getMaxAxisValue(data);
                unitsChart.instance.option("valueAxis.max", maxUnitsValue);
                unitsChart.instance.option("dataSource", data);
            }, category);
        },

        daySwitcher = new Switcher({
            container: "#daySwitcher",
            type: "day",
            onChange: function(date) {
                updateSales(date);
            },
            date: getCurrentDate()
        }),

        monthSwitcher = new Switcher({
            container: "#monthSwitcher",
            type: "month",
            onChange: function(date) {
                updateUnits(date);
            },
            date: getCurrentDate()
        });


    self.init = function() {
        SaleViewer.loadData({
            now: Globalize.format(getCurrentDate(), "yyyy-MM-dd HH:mm")
        }, function (data) {
            $.each(data, function (index, value) {
                var object = $("#" + index);
                if ((index.indexOf("Sales") == -1))
                    object.text(numberWithSpaces(value));
                    //object.text(Globalize.format(value, "n0"));
                else
                    object.text(numberWithSpaces(value));
                //object.text(Globalize.format(value / 1000, "n0") + "K");
            });
        }, category);
    }
};

$(function () {
    SaleViewer.criteriaModel = new Criteria(SaleViewer.criteria);
    SaleViewer.criteriaModel.init();
    SaleViewer.dashboard = new Dashboard(SaleViewer.criteria);
    SaleViewer.dashboard.init();
});