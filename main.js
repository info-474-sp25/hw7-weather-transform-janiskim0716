// SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container and group element for the chart
const svgLine = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// LOAD AND TRANSFORM DATA
d3.csv("weather.csv").then(data => {

    // === CASE 1: FLATTEN (commented out) ===
    /*
    // 1.1: Rename and reformat
    data.forEach(d => {
        d.year = new Date(d.date).getFullYear();
        d.precip = +d.average_precipitation;
        d.city = d.city;
    });

    // Check your work:
    console.log("=== CASE 1: FLATTEN ===");
    console.log("Raw data:", data);

    // 1.2: Filter
    const filteredData1 = data;
    console.log("Filtered data 1:", filteredData1);

    // 1.3: Group and aggregate
    const groupedData1 = d3.groups(filteredData1, d => d.city, d => d.year)
        .map(([city, yearGroups]) =>
            yearGroups.map(([year, entries]) => ({
                city,
                year,
                avgPrecip: d3.mean(entries, e => e.precip)
            }))
        ).flat();

    console.log("Grouped data 1:", groupedData1);

    // 1.4: Flatten
    const flattenedData = groupedData1;
    console.log("Final flattened data:", flattenedData);
    console.log("---------------------------------------------------------------------");
    */

    // === CASE 2: PIVOT ===

    // 2.1: Rename and reformat
    data.forEach(d => {
        d.year = new Date(d.date).getFullYear();        // Parse year
        d.month = new Date(d.date).getMonth() + 1;      // Parse month (0-based → +1)
        d.actualPrecip = +d.actual_precipitation;       // Convert to numeric
        d.avgPrecip = +d.average_precipitation;
        d.recordPrecip = +d.record_precipitation;
    });

    // Check your work:
    console.log("=== CASE 2: PIVOT ===");
    console.log("Raw data:", data);

    // 2.2: Filter to 2014
    const filteredData2 = data.filter(d => d.year === 2014);
    console.log("Filtered data 2:", filteredData2);

    // 2.3: Group and aggregate by month
    const groupedData2 = d3.groups(filteredData2, d => d.month)
        .map(([month, entries]) => ({
            month,
            actualPrecip: d3.mean(entries, e => e.actualPrecip),
            avgPrecip: d3.mean(entries, e => e.avgPrecip),
            recordPrecip: d3.mean(entries, e => e.recordPrecip)
        }));
    console.log("Grouped data 2:", groupedData2);

    // 2.4: Flatten into pivoted format
    const pivotedData = groupedData2.flatMap(d => [
        { month: d.month, precip: d.actualPrecip, type: "Actual" },
        { month: d.month, precip: d.avgPrecip, type: "Average" },
        { month: d.month, precip: d.recordPrecip, type: "Record" }
    ]);
    console.log("Final pivoted data:", pivotedData);
});
