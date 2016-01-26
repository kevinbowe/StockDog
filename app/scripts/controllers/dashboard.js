'use strict';

angular.module('stockDogApp')
  .controller('DashboardCtrl', function ($scope, WatchlistService, QuoteService){
    // Initializations
    var unregisterHandlers = [];
    $scope.watchlists = WatchlistService.query();
    $scope.cssStyle = 'height:300px';
    var formatters = {
      number: [
        {
          columnNum: 1,
          prefix: 'S'
        }
      ]
    }; // END_Formatters
    
    // Helper: Update chart objects
    var updateCharts = function () {
      // Donut chart
      var donutChart = {
        type: 'PieChart',
        displayed: true,
        data: [['Watchlist', 'Market Value']],
        options: {
          title: 'Marke Value by Watchlist',
          legend: 'none',
          pieHole: 0.4
        }, // END_Options
        formatters: formatters
      }; // END_donutChart
      
      // Column chart
      var columnChart = {
        type: 'ColumnChart',
        displayed: true,
        data: [['Watchlist', 'Change', { role: 'style' }]],
        options: {
          title: 'Day Change by Watchlist',
          legent: 'none',
          animation: {
            duration: 1500,
            easing: 'linear'
          }, // END_Animation
          formatters: formatters
        } // END_Options
      }; // END_columnChart
      
      // Push data onto both chart objects
      _.each($scope.watchlists, function (watchlist){
        donutChart.data.push([watchlist.name, watchlist.marketValue]);
        columnChart.data.push([watchlist.name, watchlist.dayChange,
        watchlist.dayChange < 0 ? 'Red' : 'Green']);
      }); // END_each
      
      $scope.donutChart = donutChart;
      $scope.columnChart = columnChart;
    }; // END_UpdateCharts
    
    // Helper function for resetting controller state
    var reset = function () {
      // Clear QuoteService before registering new stocks
      QuoteService.clear();
      _.each($scope.watchlists, function (watchlist) {
        _.each(watchlist.stocks, function (stock) {
          QuoteService.register(stock);
        }); // END_Inner_Each 
      }); // END_Outer_Each
      
      // Unregister existing $watch listeners before creating new ones
      _.each(unregisterHandlers, function (unregister) {
        unregister();
      }); // END_Each
      
      _.each($scope.watchlists, function (watchlist) {
        var unregister = $scope.$watch(function () {
          return watchlist.marketValue;
        }, function () {
        recalculate();
        });
        unregisterHandlers.push(unregister);
      });
    }; // END_Reset
    
    // Compute the new total MarketValue and DayChange
    var recalculate = function () {
      $scope.marketValue = 0;
      $scope.dayChange = 0;
      
      _.each($scope.watchlists, function (watchlist) {
        $scope.marketValue += watchlist.marketValue ? watchlist.marketValue : 0;
        $scope.dayChange += watchlist.dayChange ? watchlist.dayChange : 0;
      }); // END_EACH
      
      updateCharts();
    }; // END_Recalculate 
    
    // Watch for changes to watchlists
    $scope.$watch('watchlists.length', function () {
      reset();
    }); //END_Watch
    
  }); // END_Controller
