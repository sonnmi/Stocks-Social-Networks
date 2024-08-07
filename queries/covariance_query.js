export const covarianceQuery = (() => {
    "use strict";
    const module = {};

    module.getCovarianceQuery = () => {
        return `SELECT COVAR FROM covariance WHERE stock1 = $1 AND stock2 = $2 AND interval = $3`;
    };

    module.addCovarianceQuery = () => {
        return `
            INSERT INTO covariance (stock1, stock2, lastupdated, COVAR, interval)
            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
            ON CONFLICT (stock1, stock2, interval) DO UPDATE
            SET covar = $3, lastupdated = CURRENT_TIMESTAMP
            WHERE covariance.stock1 = $1 AND covariance.stock2 = $2 AND covariance.interval = $4;
        `;
    };

    module.isCached = () => {
        return `SELECT covar FROM covariance WHERE stock1 = $1 AND stock2 = $2 AND interval = $3 and LASTUPDATED >= NOW() - INTERVAL '1 day'`;
    };


    return module;
})();
