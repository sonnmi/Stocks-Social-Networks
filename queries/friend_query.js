export const friendQuery = (function () {
  "use strict";
  let module = {};

  module.getUserFriendsQuery = () => {
    return `Select Username From (SELECT receiver FROM requests WHERE sender = $1 and requestStatus = 'accepted'
    UNION
    SELECT sender FROM requests WHERE receiver = $1 and requestStatus = 'accepted') as friends
    JOIN users u ON u.userid = friends.receiver`;
  };

  module.insertUserFriendQuery = () => {
    return `Update requests SET requestStatus = 'accepted', requesttime = CURRENT_TIMESTAMP WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)`;
  };

  module.deleteUserFriendQuery = () => {
    return `Update requests SET requestStatus = 'rejected', requesttime = CURRENT_TIMESTAMP WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1)`;
  };

    return module;
})();
