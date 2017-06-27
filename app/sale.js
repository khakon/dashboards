var Sale = function(criteria) {
    var self = this,
        fields = ["Литература для детей и юношества", "Медицина", "Искусство", "Эзотерическая литература", "Информатика. Компьютерная литература", "Научно-популярная литература", "Энциклопедии", "Художественная литература", "Экономика. Управление. Бизнес", "Юридическая литература", "Прикладные науки.Техника", "Музыка. Нотные издания", "Литература для средней школы", "Педагогика", "Художественная лит-ра на иностр. языках", "Туризм. Картография", "Художественная лит-ра на украинском языке", "Естественные науки", "Филологические науки", "Психология", "Общественные и гуманитарные науки", "Дом. Быт. Досуг", "Аудиокниги", "Книги на СD и DVD"];
    SaleViewer.legend = new Legend(fields);
    var category = criteria,
        maxSalesValue = 0,
        maxUnitsValue = 0,
        chartOptions = {
            onIncidentOccurred: null,
            palette: "SaleViewPalette",
            dataSource: [],
            commonSeriesSettings: {
                argumentField: "group",
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
                    customizeText: function () {
                        return SaleViewer.legend.getShortFieldName(this.value);
                    }
                }
            },
            customizePoint: function () {
                if (this.seriesName == "Week")
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
                customizeTooltip: function () {
                    return {
                        text: "<span style='font-size: 14px; color: " + SaleViewer.lightColor + ";'>" + this.argumentText.toUpperCase() + "</span><br />"
                            + "<span style='color: " + SaleViewer.legend.getColorByField(this.argumentText) + ";'>" + Globalize.format(this.originalValue, getFormatBySeriesName(this.seriesName)) + "</span><br />"
                           // + "<span style='color: " + SaleViewer.legend.getColorByField(this.argument) + ";'>(грн) " + (this.originalValue / 1000000).toFixed(2) + "M</span><br />"
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
                    valueField: "saleLast",
                    name: "LastWeek",
                    color: "rgba(175, 175, 175, 0.45)",
                    hoverStyle: {
                        color: "rgba(175, 175, 175, 0.45)",
                        hatching: {
                            opacity: 0
                        }
                    }
                },
                {
                    valueField: "sale",
                    name: "Week"
                }
            ],
            valueAxis: {
                axisDivisionFactor: 40,
                placeholderSize: 45,
                label: {
                    //format: "thousands",
                    customizeText: function () {
                        if (this.value != maxSalesValue) {
                            return this.valueText;
                        }
                        return "";
                    }
                }
            }

        },

        unitsOptions = {
            series: [
                {
                    valueField: "countLast",
                    name: "LastWeekCount",
                    color: "rgba(175, 175, 175, 0.45)",
                    hoverStyle: {
                        color: "rgba(175, 175, 175, 0.45)",
                        hatching: {
                            opacity: 0
                        }
                    }
                },
                {
                    valueField: "count",
                    name: "WeekCount"
                }
            ],
            valueAxis: {
                axisDivisionFactor: 40,
                placeholderSize: 40,
                label: {
                   // format: "thousands",
                    customizeText: function () {
                        if (this.value != maxUnitsValue) {
                            return this.valueText;
                        }
                        return "";
                    }
                }
            }
        },

        getDateName = function (seriesName) {
            var saleDate = saleSwitcher.getDate(),
                countDate = countSwitcher.getDate();
            switch (seriesName) {
                case "LastWeek":
                    return getCurrentDayWeek().getDate() == saleDate.getDate() ?
                        "Прошлая неделя" :
                        Globalize.format(new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate() - 7), "dd/MM/yyyy");
                    break;
                case "Week":
                    return (getCurrentDayWeek().getDate() == saleDate.getDate()) ?
                        "Эта неделя" :
                        (getCurrentDayWeek().getDate() - 7 == saleDate.getDate()) ?
                        "Прошлая неделя" :
                        Globalize.format(saleDate, "dd/MM/yyyy");
                    break;
                case "LastWeekCount":
                    return getCurrentDayWeek().getDate() == countDate.getDate() ?
                        "Прошлая неделя" :
                        Globalize.format(new Date(countDate.getFullYear(), countDate.getMonth(), countDate.getDate() - 7), "dd/MM/yyyy");
                    break;
                case "WeekCount":
                    return (getCurrentDayWeek().getDate() == countDate.getDate()) ?
                        "Эта неделя" :
                        (getCurrentDayWeek().getDate() - 7 == countDate.getDate()) ?
                        "Прошлая неделя" :
                        Globalize.format(countDate, "dd/MM/yyyy");
                    break;
            }
        },

        getFormatBySeriesName = function (seriesName) {
            if (seriesName == "Week" || seriesName == "LastWeek") return "n0";
            else if (seriesName == "WeekCount" || seriesName == "LastWeekCount") return "n0";
        },

        saleChart = SaleViewer.sharedWidgets.initChart(category, $.extend({}, chartOptions, salesOptions), "chart", "sum"),
        countChart = SaleViewer.sharedWidgets.initChart(category, $.extend({}, chartOptions, unitsOptions), "chart", "count"),



        updateSale = function (date) {
            SaleViewer.loadData({
                day: Globalize.format(date, "yyyy-MM-dd")
            }, function (data) {
                maxSalesValue = SaleViewer.sharedWidgets.getMaxAxisValue(data);
                saleChart.instance.option("valueAxis.max", maxSalesValue);
                saleChart.instance.option("dataSource", data);
            }, category);
        },
        updateCount = function(date) {
            SaleViewer.loadData({
                dayCount: Globalize.format(date, "yyyy-MM-dd")
            }, function(data) {
                maxUnitsValue = SaleViewer.sharedWidgets.getMaxAxisValue(data);
                countChart.instance.option("valueAxis.max", maxUnitsValue);
                countChart.instance.option("dataSource", data);
            }, category);
        },

        countSwitcher = new SwitcherWeek({
            container: "#countSwitcher",
            type: "day",
            onChange: function(date) {
                updateCount(date);
            },
            date: getCurrentDayWeek()
        }),
        saleSwitcher = new SwitcherWeek({
            container: "#saleSwitcher",
            type: "day",
            onChange: function (date) {
                updateSale(date);
            },
            date: getCurrentDayWeek()
        });

    self.init = function() {
        SaleViewer.loadData({
            dayTotal: Globalize.format(getCurrentDayWeek(), "yyyy-MM-dd")
        }, function (data) {
            $.each(data, function(index, value) {
                var object = $("#" + index);
                if((index.indexOf("count") != -1))
                    object.text(Globalize.format(value, "n0"));
                else
                    object.text('(грн) ' + Globalize.format(value, "n0"));
            });
        }, category);
    }
};

$(function () {
    SaleViewer.criteriaModel = new Sale("sale");
    SaleViewer.criteriaModel.init();
    //SaleViewer.dashboard = new DashboardBalance("balance");
    //SaleViewer.dashboard.init();
});