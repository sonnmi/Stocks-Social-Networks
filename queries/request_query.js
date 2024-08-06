export const requestQuery = (function () {
  "use strict";
  let module = {};

  module.getRequestsQuery = () => {
    return  `SELECT r.sender
    FROM Requests r
    WHERE r.receiver = $1 AND r.requestStatus = $2`;
  };

  module.insertRequestQuery = () => {
    return `INSERT INTO Requests(sender, receiver, requestType, requestStatus, requestTime)
                VALUES ($1, $2, $3, $4, $5)`;
  };

  module.deleteRequestQuery = () => {
    return `DELETE FROM Requests WHERE sender = $1 AND receiver = $2`;
  };

  module.updateRequestQuery = () => {
    return `UPDATE Requests SET requestStatus = $1, requesttime = CURRENT_TIMESTAMP WHERE (sender = $2 AND receiver = $3) OR (sender = $3 AND receiver = $2)`;
  };

  module.checkIfRejectedFiveMinutesAgo = () => {
    return `SELECT * FROM Requests WHERE (sender = $1 AND receiver = $2 OR sender = $2 and receiver = $1) AND requestStatus = 'rejected' AND requesttime > CURRENT_TIMESTAMP - INTERVAL '5 minutes'`;
  };

  module.findRequestQuery = () => {
    return `SELECT * FROM Requests WHERE (sender = $1 AND receiver = $2 or sender = $2 AND receiver = $1) AND requestStatus = 'accepted'`;
  };


  return module;
})();
