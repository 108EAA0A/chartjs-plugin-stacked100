
(function(Chart) {
  var Stacked100Plugin = {
    beforeInit: function(chartInstance) {
      if (chartInstance.options.stacked !== '100%') return;

      var xAxes = chartInstance.options.scales.xAxes;
      var yAxes = chartInstance.options.scales.yAxes;

      [xAxes, yAxes].forEach(function(axes) {
        axes.forEach(function(hash) { hash.stacked = true });
      })
      xAxes.forEach(function(hash) { hash.ticks.min = 0; hash.ticks.max = 100 });

      chartInstance.options.tooltips.callbacks.label = function(tooltipItem, data) {
        var datasetIndex = tooltipItem.datasetIndex,
          index = tooltipItem.index,
          xLabel = tooltipItem.xLabel;
        var datasetLabel = data.datasets[datasetIndex].label || '';

        return '' + datasetLabel + ': ' + xLabel + '% (' + data.originalData[datasetIndex][index] + ')';
      };
    },

    beforeUpdate: function(chartInstance) {
      if (chartInstance.options.stacked !== '100%') return;

      var datasets = chartInstance.data.datasets;
      var allData = datasets.map(function(dataset) { return dataset.data });
      chartInstance.data.originalData = allData;

      var totals = Array.apply(null, new Array(allData[0].length)).map(function(el, i) {
        return allData.reduce(function(sum, data) { return sum + data[i] }, 0);
      });
      datasets.forEach(function(dataset) {
        dataset.data = dataset.data.map(function(val, i) {
          return Math.round(val * 1000 / totals[i]) / 10;
        });
      });
    }
  };

  Chart.pluginService.register(Stacked100Plugin);
}).call(this, Chart);