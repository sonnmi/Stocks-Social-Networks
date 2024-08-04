export const holdsQuery = (function () {
    "use strict";
    let module = {};

    module.getUserHoldsQuery = () => {
        return `SELECT * FROM holds WHERE portfolio = $1 AND owner = $2`;
    }

    module.insertUserHoldQuery = () => {
        return `INSERT INTO holds (portfolio, stock, owner) VALUES ($1, $2, $3)`;
    }

    module.deleteUserHoldQuery = () => {
        return `DELETE FROM holds WHERE portfolio = $1 AND stock = $2 AND owner = $3`;
    }

    return module;
})();