'use strict';

angular.module('stockDogApp')
  .directive('stkSignColor', function () {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {

        $attrs.$observe('stkSignColor', function (newVal) {
          var newSign = parseFloat (newVal);

          if (newSign > 0) {
            $element[0].style.color = 'Green';
          } else {
            $element[0].style.color = 'Red';
          } // END_If
        }); // END_$Observe
      } // END_Link
    }; // END_Directive_Return
  }); // END_Directive
