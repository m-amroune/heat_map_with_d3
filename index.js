// Chart dimensions

const width = 1200; 
const height = 500;  
const padding = 60;  

// svg selection
const svg = d3.select("#heatmap").attr("width", width).attr("height", height);

// Dataset URL containing global temperature data
const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Fetching data
d3.json(URL).then((data) => {
  const baseTemp = data.baseTemperature; 
  const dataset = data.monthlyVariance;  

  // SCALES 
  const years = dataset.map((d) => d.year); 
  const months = Array.from({ length: 12 }, (_, i) => i); 

  // YEARS
  const xScale = d3
    .scaleBand()  
    .domain(years.filter((v, i, a) => a.indexOf(v) === i)) 
    .range([padding, width - padding]); 

  // MONTHS
  const yScale = d3
    .scaleBand()  
    .domain(months)  
    .range([padding, height - padding]);  

  // color scale based on temperature
  const tempExtent = d3.extent(dataset, (d) => baseTemp + d.variance); 

  const colorScale = d3
    .scaleQuantize()  
    .domain(tempExtent) 
    .range([  
      "#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", 
      "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"
    ]);

 
  // Axis for years
  const xAxis = d3
    .axisBottom(xScale)  
    .tickValues(xScale.domain().filter((year) => year % 10 === 0))  // display every years
    .tickFormat(d3.format("d"));  

  // Axis for months
  const yAxis = d3.axisLeft(yScale).tickFormat((month) => {
    const date = new Date(0);  
    date.setUTCMonth(month);   
    return d3.timeFormat("%B")(date);  
  });

  // Création des axes dans le SVG
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)  
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`) 
    .call(yAxis);

  // TOOLTIP
  const tooltip = d3.select("#tooltip").style("opacity", 0);  

  // CELLS 
  svg
    .selectAll("rect")
    .data(dataset)  
    .enter()  
    .append("rect")  
    .attr("class", "cell") 
    .attr("data-month", (d) => d.month - 1)  
    .attr("data-year", (d) => d.year)  
    .attr("data-temp", (d) => baseTemp + d.variance)  
    .attr("x", (d) => xScale(d.year))  
    .attr("y", (d) => yScale(d.month - 1)) 
    .attr("width", xScale.bandwidth())  
    .attr("height", yScale.bandwidth())  
    .attr("fill", (d) => colorScale(baseTemp + d.variance))  
    .on("mouseover", (event, d) => {  
      tooltip
        .style("opacity", 0.9)  
        .attr("data-year", d.year)  
        .html(
          `
          ${d3.timeFormat("%B")(new Date(0, d.month - 1))} ${d.year}<br> 
          Temp: ${(baseTemp + d.variance).toFixed(2)}℃<br>  
          Variance: ${d.variance.toFixed(2)}℃  
        `
        )
        .style("left", event.pageX + 10 + "px")  
        .style("top", event.pageY - 28 + "px");  
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);  
    });

  // LEGEND 
  const legendWidth = 400;
  const legendHeight = 30;
  const legendColors = colorScale.range();  

  const legendX = d3.scaleLinear().domain(tempExtent).range([0, legendWidth]);  

  
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${(width - legendWidth) / 2}, ${height - padding + 40})`  
    );

 
  legend
    .selectAll("rect")
    .data(legendColors)  
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (legendWidth / legendColors.length))  
    .attr("y", 0) 
    .attr("width", legendWidth / legendColors.length)  
    .attr("height", legendHeight)  
    .attr("fill", (d) => d);  

  
  const legendAxis = d3
    .axisBottom(legendX)
    .tickValues(colorScale.quantiles())  
    .tickFormat(d3.format(".1f"));  


  legend
    .append("g")
    .attr("transform", `translate(0, ${legendHeight})`)  
    .call(legendAxis);
});
