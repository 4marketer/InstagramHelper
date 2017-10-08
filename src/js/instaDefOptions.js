/* exported instaDefOptions */
/* jshint -W106 */

var instaDefOptions = (function () {
  return {
    you: '<<YOU>>',
    defDelay: 1000,
    defFollowDelay: 3000,
    defPageSize: 20,
    gridPageSize: 500,
    noDelayForInit: true,
    requestsToSkipDelay: 200,
    retryInterval: 180000,
    regFindUser: /link rel="canonical" href="https:\/\/www.instagram.com\/([^"\/]*)\/?"/i,
    regCheckBox: /^\s*<\s*input.+type\s*=\s*"checkbox".+value\s*=\s*(?:"|')\s*(true|false)/i,
    regProfile: /^\s*<\s*a\s.*href\s*=\s*(?:"|')([^"']+)/i,
    regTestInfo: /^\s*id:/,
    cleanInfo: /<\/?.[^>]*>/g,
    newLine: /<br\s*\/>(?=.)/gi, //should be followed by at least one symbol
    queryId: {
      followed_by: '17851374694183129',
      follows: '17874545323001329'
    }
  };
}());
