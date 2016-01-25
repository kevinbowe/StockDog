'use strict';

angular.module('stockDogApp')
  .service('QuoteService', function ($http, $interval) {
    var stocks = [];
    var BASE = 'http://query.yahooapis.com/v1/public/yql';

    // Handles updating stock model with appropriate data from quote
    var update = function (quotes) {
        console.log(quotes);
        // Ensure that the current quotes match registered stocks
        if (quotes.length === stocks.length) {
            _.each(quotes, function (quote, idx) {
                var stock = stocks[idx];
                /*stock.lastPrice = parseFloat(quote.LastTradePriceOnly);*/
                stock.lastPrice = parseFloat(quote.LastTradePriceOnly) + _.random(-.5, .5);
                stock.change = quote.Change;
                stock.percentChange = quote.ChangeinPercent;
                stock.marketValue = stock.shares * stock.lastPrice;
                stock.dayChange = stock.shares * parseFloat(stock.change);
                stock.save();
            });
        }
    };
      
    // Helper functions for managing which stocks to pull quotes for
    this.register = function (stock) {
        stocks.push(stock);
    };
    this.deregister = function (stock) {
        _.remove(stocks, stock);
    };
    this.clear = function () {
        stocks =[];
    };
      
    // Main processing function for communicating with Yahoo Finance API
    this.fetch = function () {
      var symbols = _.reduce(stocks, function (symbols, stock) {
        symbols.push(stock.company.symbol);
        return symbols;
      }, []); // END_Function_Fetch
      var query = encodeURIComponent('select * from yahoo.finance.quotes where symbol in (\'' + symbols.join(',') + '\')');
      var url = BASE + '?' + 'q=' + query + '&format=json&diagnostics=true &env=http://datatables.org/alltables.env';
      $http.jsonp(url + '&callback=JSON_CALLBACK')
        .success (function (data) {
          if (data.query.count) {
            var quotes = data.query.count > 1 ? data.query.results.quote : [data.query.results.quote];
            update(quotes);
          }
        }) // END_Function_Success
        .error (function (data) {
          console.log(data);
        }); // END_Function_Error
      // END_JSONP
    }; // END_Function_Fetch
    
    // Used to fetch new quote data every 5 seconds
    $interval(this.fetch, 5000);
      
  });
