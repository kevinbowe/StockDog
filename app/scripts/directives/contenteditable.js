'use strict';

var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

angular.module('stockDogApp')
.directive('contenteditable', function($sce) { 
    return {
        restrict: 'A',
        require: 'ngModel', // Get a hold of NgModelController
        
        link: function($scope, $element, $attrs, ngModelCtrl) {
            
            if(!ngModelCtrl) { return; } // do nothing if no ng-model
            
            // Specify how UI should be updated
            ngModelCtrl.$render = function() {
                $element.html($sce.getTrustedHtml(ngModelCtrl.$viewValue || ''));
            }; //END_ngModelCtrl.$render
            
            // Read HTML value, and then write data to the model or reset the view
            var read = function () {
                var value = $element.html();
                if ($attrs.type === 'number' && !NUMBER_REGEXP.test(value)) {
                    ngModelCtrl.$render();
                } else {
                    ngModelCtrl.$setViewValue(value);
                }
            }; // END_Read
            
            // Add custom parser-based input input type (only 'number' supported)
            // This will be added to the $modelValue
            if ($attrs.type === 'number') {
                ngModelCtrl.$parsers.push(function (value) {
                    return parseFloat(value);
                });
            } // END_If
            
            // Listen for change events to enable binding
            $element.on('blur keyup change', function() {
                $scope.$apply(read);
            });
        } // END_Link
        
    }; // END_Directive_Return 
}) // END_Directive
; // END_Module