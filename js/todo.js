(function() {

  let data = "no data";
  let svgContainer = "";
  window.onload = function() {
    svgContainer = d3.select("body")
    .append("svg")
    .attr('width', 500)
    .attr('height', 500)
    d3.csv("data.csv")
    .then((data) => makeScatterPlot(data));
  }

  function makeScatterPlot(csvData) {
    data = csvData

    let fertility_rate_data = data.map((row) => parseFloat(row["fertility_rate"]));
    let life_expectancy_data = data.map((row) => parseFloat(row["life_expectancy"]));

    let minMaxData = findMinMax(fertility_rate_data, life_expectancy_data);

    let mapFunctions = drawAxes(minMaxData, fertility_rate_data, life_expectancy_data)
    plotData(mapFunctions)
  }

  function findMinMax(x, y) {    
    // get min/max x values
    let xMin = d3.min(x);
    let xMax = d3.max(x);

    // get min/max y values
    let yMin = d3.min(y);
    let yMax = d3.max(y);

    // return formatted min/max data as an object
    return {
      xMin : xMin,
      xMax : xMax,
      yMin : yMin,
      yMax : yMax
    }
  }

  function drawAxes(limits, x, y) {
    // return x value from a row of data
    let xValue = function(d) { return +d[x]; }

    // function to scale x value
    let xScale = d3.scaleLinear()
      .domain([limits.xMin - 0.5, limits.xMax + 0.5]) // give domain buffer room
      .range([50, 450]);

    // xMap returns a scaled x value from a row of data
    let xMap = function(d) { return xScale(xValue(d)); };

    // plot x-axis at bottom of SVG
    let xAxis = d3.axisBottom().scale(xScale);
    svgContainer.append("g")
      .attr('transform', 'translate(0, 450)')
      .call(xAxis);

    // return y value from a row of data
    let yValue = function(d) { return +d[y]}

    // function to scale y
    let yScale = d3.scaleLinear()
      .domain([limits.yMax + 5, limits.yMin - 5]) // give domain buffer
      .range([50, 450]);

    // yMap returns a scaled y value from a row of data
    let yMap = function (d) { return yScale(yValue(d)); };

    // plot y-axis at the left of SVG
    let yAxis = d3.axisLeft().scale(yScale);
    svgContainer.append('g')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis);

    // return mapping and scaling functions
    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale
    };
  }

  function plotData(mapFunctions) {
    let popData = data.map((row) => row["pop_mlns"])
    let pop_limits = d3.extent(pop_data);

    let pop_map_func = d3.scaleLinear()
    .domain([pop_limits[0], pop_limits[1]])
    .range([3, 20]);

    let xMap = mapFunctions.x
    let yMap = mapFunctions.y
    svgContainer.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr('cx', xMap)
    .attr('cy', yMap)
    .attr('r', ((d) => pop_map_func(d["pop_mlns"])))
    .attr('fill', 'steelblue')
    .on("mouseover", (d) => {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(d.location + "<br/>" + numberWithCommas(d["pop_mlns"]*1000000))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });
  }
    

})();
