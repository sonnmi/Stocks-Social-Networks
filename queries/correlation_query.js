// correlation_query.js
export const correlationQuery = (() => {
    "use strict";
    const module = {};

    module.getCorrelationQuery = () => {
        return `SELECT CORR FROM correlation WHERE stock1 = $1 AND stock2 = $2 AND interval = $3`;
    };

    module.addCorrelationQuery = () => {
        return `
            INSERT INTO correlation (stock1, stock2, lastupdated, corr, interval)
            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)
            ON CONFLICT (stock1, stock2, interval) DO UPDATE
            SET corr = $3, lastupdated = CURRENT_TIMESTAMP
            WHERE correlation.stock1 = $1 AND correlation.stock2 = $2 AND correlation.interval = $4;
        `;
    };

    module.isCached = () => {
        return `SELECT corr FROM correlation WHERE stock1 = $1 AND stock2 = $2 AND interval = $3 and LASTUPDATED >= NOW() - INTERVAL '1 day'`;
    };


    return module;
})();
