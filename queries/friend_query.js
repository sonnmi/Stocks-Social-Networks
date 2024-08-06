export const friendQuery = (function () {
  "use strict";
  let module = {};

  module.getUserFriendsQuery = () => {
    return `Select friend FROM (SELECT receiver as friend FROM requests WHERE sender = $1 and requestStatus = 'accepted'
    UNION
    SELECT sender as friend FROM requests WHERE receiver = $1 and requestStatus = 'accepted') as friends`;
  };

  module.insertUserFriendQuery = () => {
    return `Update requests SET requestStatus = 'accepted', requesttime = CURRENT_TIMESTAMP WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)`;
  };

  module.deleteUserFriendQuery = () => {
    return `Update requests SET requestStatus = 'rejected', requesttime = CURRENT_TIMESTAMP WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)`;
  };

  return module;
})();
