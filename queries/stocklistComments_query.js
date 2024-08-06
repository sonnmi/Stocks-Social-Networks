export const stockListCommentQuery = (function () {
  "use strict";

  let module = {};

  module.getStockListCommentsQuery = () => {
    return `SELECT * FROM Reviews WHERE reviewed = $1 AND owner = $2`;
  };

  module.insertStockListCommentQuery = () => {
    return `INSERT INTO Reviews(owner, reviewer, comment, reviewed) VALUES ($1, $2, $3, $4)`;
  };

  module.deleteStockListCommentQuery = () => {
    return `DELETE FROM Reviews WHERE reviewed = $1 AND owner = $2 AND comment = $3 AND reviewer = $4`;
  };

  module.getStockListOwnCommentQuery = () => {
    return `SELECT * FROM Reviews WHERE owner = $1 AND reviewer = $2 AND reviewed = $3`;
  };

  module.updateStockListCommentQuery = () => {
    return `UPDATE Reviews SET comment = $1 WHERE reviewed = $2 AND owner = $3 AND comment = $4 AND reviewer = $5`;
  };

  return module;
})();
