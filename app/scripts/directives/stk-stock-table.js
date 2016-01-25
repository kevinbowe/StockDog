'use strict';

angular.module('stockDogApp')
  .directive('stkStockTable', function () {
    return {
      templateUrl: 'views/templates/stock-table.html',
      restrict: 'E',
      // Isolate scope
      scope: { 
        watchlist: '='
      }, // END_scope

      // Create a controller, whichserves as an API for this directive
      controller: function ($scope) {
        var rows = [];

        $scope.$watch('showPercent', function (showPercent) {
          if (showPercent) {
            _.each(rows, function (row) {
            row.showPercent = showPercent;
            });
          } // END_IF
        }); // END_$scope.$watch

        this.addRow = function (row) {
          rows.push(row);
        }; // END_this.addRow

        this.removeRow = function (row) {
          _.remove(rows, row);
        }; // END_this.removeRow
      }, // END_Controller

      // Standard link function implementation
      link: function ($scope) {
        $scope.showPercent = false;
        $scope.removeStock = function (stock) {
          $scope.watchlist.removeStock(stock);
        }; // END_$scope.removeStock
      } // END_link
    }; // END_Directive_return 
  }); // END_Directive