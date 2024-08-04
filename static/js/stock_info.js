/**
 * Plots the stock data on a chart
 * @param {Array} data - Array of stock data objects
 */
function plotGraph(data) {
    // Log the data to inspect its structure
    console.log('Data received for plotting:', data);

    // Ensure data is an array
    if (!Array.isArray(data)) {
        console.error('Expected data to be an array, received:', typeof data);
        return;
    }

    // Map the data to dates and close prices
    const dates = data.map((d) => new Date(d.date).toLocaleDateString());
    const closePrices = data.map((d) => d.close);

    // Get the canvas context
    const ctx = document.getElementById("stockChart").getContext("2d");

    // Create a new chart
    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Close Price",
                    data: closePrices,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "category",
                    title: {
                        display: true,
                        text: 'Date',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)',
                    },
                },
            },
        },
    });
}
