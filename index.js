// CHART DIMENSIONS
const width = 1200;
const height = 500;
const padding = 60;

const svg = d3
  .select("#heatmap")
  .attr("width", width)
  .attr("height", height);

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";


  d3.json(URL).then(data => {
    const baseTemp = data.baseTemperature;
    const dataset = data.monthlyVariance;

      // SCALES
  const years = dataset.map(d => d.year);
  const months = Array.from({ length: 12 }, (_, i) => i);

 const xScale = d3.scaleBand()
    .domain(years.filter((v, i, a) => a.indexOf(v) === i))
    .range([padding, width - padding]);

  const yScale = d3.scaleBand()
    .domain(months)
    .range([padding, height - padding]);

  const tempExtent = d3.extent(dataset, d => baseTemp + d.variance);

  const colorScale = d3.scaleQuantize()
    .domain(tempExtent)
    .range([
      "#313695",
      "#4575b4",
      "#74add1",
      "#abd9e9",
      "#e0f3f8",
      "#ffffbf",
      "#fee090",
      "#fdae61",
      "#f46d43",
      "#d73027",
      "#a50026"
    ]);

    
  // AXIS
  const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(year => year % 10 === 0))
    .tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(month => {
      const date = new Date(0);
      date.setUTCMonth(month);
      return d3.timeFormat("%B")(date);
    });

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);


  });

