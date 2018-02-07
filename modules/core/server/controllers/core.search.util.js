'use strict';

var _ = require ('lodash');

// Source: https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
// polyfill for RegExp.escape
if(!RegExp.escape){
  RegExp.escape = function(s){
    var rtn = String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    return rtn;
  };
}

/**
 * For a given item determine how relevant it is for the given search terms.
 * @param item
 * @param searchTerms
 * @param searchFields
 * @returns {number}
 */
exports.relevanceRanking = function (item, searchTerms, searchFields) {
  var composite = "";
  _.forEach(searchFields, function (fld) {
    composite += item[fld];
  });
  var hits = 0;
  _.forEach(searchTerms, function (term) {
    var re = new RegExp(term, "i");
    var matches = composite.match(re);
    hits += matches ? matches.length : 0;
  });
  return hits;
};

exports.composeQuery= function (projectId, terms, searchFields) {
  var query = {project: projectId};
  if (terms.searchTerms.length >= 1) {
    query.$or = composeQueryTerm(terms.searchTerms, searchFields);
  }
  if (terms.excludeTerms.length >= 1) {
    query.$nor = composeQueryTerm(terms.excludeTerms, searchFields);
  }
  return query;
};


/**
 * For the terms in the term array create an array of query terms for each search field.
 * @param termArray
 * @param searchFields
 * @returns {Array}
 */
function composeQueryTerm(termArray, searchFields) {
  var results = [];
  if (termArray.length === 1) {
    var term = termArray[0];
    term = term.replace(/\*/g,'\\*');
    var re = new RegExp('.*' + term + '.*', "i");
    _.forEach(searchFields, function (fld) {
      var x = {};
      x[fld] = re;
      results.push(x);
    });
  } else if (termArray.length > 1) {
    var reArray = [];
    _.forEach(termArray, function (term) {
      var re = new RegExp('.*' + term + '.*', "i");
      reArray.push(re);
    });
    _.forEach(searchFields, function (fld) {
      var x = {};
      var y = {$in: reArray};
      x[fld] = y;
      results.push(x);
    });
  }
  return results;
}

/**
 * Parse the searchText into two arrays: search and exclude terms
 * @param searchText
 * @returns {{searchTerms: Array, excludeTerms: Array}}
 */
exports.convertTextToTerms = function (searchText) {
  var searchTerms = [];
  var excludeTerms = [];

  if (!_.isString(searchText)) {
    return {searchTerms: searchTerms, excludeTerms: excludeTerms};
  }

  searchText = RegExp.escape(searchText);

  // Search for phrases:  searchText = 'apple "pear orange" -fig "rosemary and wine"';
  // phrases = [ '"pear orange"', '"rosemary and wine"' ]
  // searchTerms = [ 'pear orange', 'rosemary and wine' ]
  var re = /("[^"]*")/g;
  var phrases = searchText.match(re);
  _.forEach(phrases, function (v) {
    // eslint-disable-next-line no-useless-escape
    searchTerms.push(v.replace(/\"/g, ''));
  });

  // Remove phrases and extra spaces
  // remainder = 'apple -fig'
  var remainder = searchText.replace(re, '');
  remainder = remainder.trim();
  remainder = remainder.replace(/ {2}/g, ' ');

  // Collect any remaining search and/or exclude terms
  // searchTerms = [ 'pear orange', 'rosemary and wine', 'apple']
  // excludeTerms = [ 'fig' ]
  var parts = remainder.length > 0 ? remainder.split(' ') : [];
  _.forEach(parts, function (v) {
    if (v.startsWith('-')) {
      v = v.substr(1);
      excludeTerms.push(v);
    } else {
      searchTerms.push(v);
    }
  });
  var results = {searchTerms: searchTerms, excludeTerms: excludeTerms};
  return results;
};
