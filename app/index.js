var SaleViewer = function () {
    var self = this;

    self.loadData = function (data, callback, category) {
        $.ajax({
            url: self.baseApiUrl + category,
            data: data,
            success: callback
        });
    };

    self.lightColor = "#808080";
    self.darkColor = "#252525";
}


$(function () {
    window.SaleViewer = new SaleViewer();
    window.SaleViewer.sharedWidgets = new SharedWidgets();
    //window.SaleViewer.sharedWidgets.initPopup();

    DevExpress.viz.registerPalette("SaleViewPalette", {
        simpleSet: ["#da5859", "#f09777", "#fbc987", "#a5d7d0", "#a5bdd7", "#e97c82"],
        indicatingSet: ['#90ba58', '#eeba69', '#a37182'],
        gradientSet: ['#78b6d9', '#eeba69']
    });

});

