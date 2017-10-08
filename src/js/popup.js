/* globals alert, chrome, _gaq, $, Promise */
/* globals PromiseChrome, instaDefOptions, instaMessages, instaUserInfo */
/* jshint -W106 */

$(function () {
  'use strict';

  var promiseChrome = new PromiseChrome();

  $('#liker').click(function () {

    promiseChrome.promiseQuery({
      active: true,
      currentWindow: true
    }).then(function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'open_liker',
        page: 'liker.html'
      });
    });
  });

  $('#instaUsers').click(function () {

    var userName = $('#username').val();
    if (!userName) {
      alert(instaMessages.getMessage('USERNAMEISREQ'));
      return;
    }

    promiseChrome.promiseCheckOpenTab({
      url: chrome.extension.getURL('instaUsers.html')
    }).then(function () {
      var promiseUserInfo = instaDefOptions.you === userName ? userName : instaUserInfo.getUserProfile({ username: userName });
      var promiseQueryActiveTab = promiseChrome.promiseQuery({
        active: true,
        currentWindow: true
      });
      Promise.all([promiseUserInfo, promiseQueryActiveTab]).then(values => {
        let [obj, tabs] = values;
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'get_insta_users',
          page: 'instaUsers.html',
          userName: userName,
          userId: obj.id,
          user_is_private: obj.is_private,
          user_followed_by_viewer: obj.followed_by_viewer,
          follows_count: obj.follows_count,
          followed_by_count: obj.followed_by_count,
          limit: 0 + +document.getElementById('first').value,
          relType: $('input[name=relType]:checked').attr('id')
        });
      });
    }, () => alert(instaMessages.getMessage('TABISOPEN')));
  });

  $('#findCommonUsers').click(function () {
    var userName_1 = $('#username_1').val();
    if (!userName_1) {
      alert(instaMessages.getMessage('USERNAMEISREQPAR', '1st'));
      return;
    }

    var userName_2 = $('#username_2').val();
    if (!userName_2) {
      alert(instaMessages.getMessage('USERNAMEISREQPAR', '2nd'));
      return;
    }

    if (userName_1 === userName_2) {
      alert(instaMessages.getMessage('THESAMEUSERS'));
      return;
    }

    promiseChrome.promiseCheckOpenTab({
      url: chrome.extension.getURL('commonUsers.html')
    }).then(function () {
      var promiseUserInfo1 = instaDefOptions.you === userName_1 ? userName_1 : instaUserInfo.getUserProfile({ username: userName_1 });
      var promiseUserInfo2 = instaDefOptions.you === userName_2 ? userName_2 : instaUserInfo.getUserProfile({ username: userName_2 });
      var promiseQueryActiveTab = promiseChrome.promiseQuery({
        active: true,
        currentWindow: true
      });
      Promise.all([promiseUserInfo1, promiseUserInfo2, promiseQueryActiveTab]).then(values => {
        let [obj1, obj2, tabs] = values;
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'get_common_users',
          page: 'commonUsers.html',
          user_1: {
            userName: userName_1,
            userId: obj1.id,
            user_is_private: obj1.is_private,
            user_followed_by_viewer: obj1.followed_by_viewer,
            follows_count: obj1.follows_count,
            followed_by_count: obj1.followed_by_count
          },
          user_2: {
            userName: userName_2,
            userId: obj2.id,
            user_is_private: obj2.is_private,
            user_followed_by_viewer: obj2.followed_by_viewer,
            follows_count: obj2.follows_count,
            followed_by_count: obj2.followed_by_count,
          },
          relType: 'All'
        });
      });
    }, () => alert(instaMessages.getMessage('TABISOPEN')));
  });
});

window.onload = function () {
  'use strict';

  _gaq.push(['_trackPageview']);

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {

    var arr = tabs[0].url.match(/(?:taken-by=|instagram.com\/)(.[^\/]+)/); //eslint-disable-line no-useless-escape

    if (arr) {
      instaUserInfo.getUserProfile({ username: arr[1] }).then(function (obj) {

        var $html = '';
        delete obj.profile_pic_url_hd;
        for (var key in obj) {
          if (obj[key] !== null) {
            if (('connected_fb_page' === key) || ('external_url' === key)) {
              $html += `${key}: <strong><a href='${obj[key]}' target='_blank'>${obj[key]}</a></strong><br/>`;
            } else {
              $html += `${key}: <strong>${obj[key]}</strong><br/>`;
            }
          }
        }
        $('#username').val(obj.username);
        $('#username_1').val(obj.username);
        $('#username_2').val(instaDefOptions.you);
        $('#details').html($html);
      });
    } else {
      $('#details').text('UserName is not found in URL');
      $('#username').val(instaDefOptions.you);
      $('#username_1').val(instaDefOptions.you);
    }
  });
};
