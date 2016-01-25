'use strict';

angular.module('stockDogApp')
  .directive('stkStockRow', function ($timeout, QuoteService) {
    return {
      // Use as element attribute and require stkStockTable controller
      restrict: 'A',
      require: '^stkStockTable',
      scope: {
        stock: '=',
        isLast: '='
      }, // END_scope

      // The required controller will be made available at the end
      link: function ($scope, $element, $attrs, stockTableCtrl) {

        // Create tooltip for stock-row
        $element.tooltip ({   
          placement: 'left',
          title: $scope.stock.company.name
        }); // END_tootip

        // Add this row to the TableCtrl
        stockTableCtrl.addRow($scope);

        // Register this stock with the QuoteService
        QuoteService.register($scope.stock);

        // Deregister company with the QuoteService on $destroy
        $scope.$on('$destroy', function () {
          stockTableCtrl.removeRow($scope);
          QuoteService.deregister($scope.stock);
        }); // END_$scope.$On_Destroy

        // If this is the last `stock-row`, fetch quotes immediately
        if ($scope.isLast) {
          $timeout(QuoteService.fetch);
        } // END_If

        // Watch for changes in share and recalulate fields
        $scope.$watch('stock.shares', function () {
          $scope.stock.marketValue = $scope.stock.shares * $scope.stock.lastPrice;
          $scope.stock.dayChange = $scope.stock.shares * parseFloat($scope.stock.change);
          $scope.stock.save();
        }); // END_$scope.$watch
      } // END_link
    }; // END_Directive_Return
  }); // END_Directive