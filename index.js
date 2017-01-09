const X_AXIS_KEY = 'rating'

var rawData = [
  {
    "rating": "*",
    "male": 2704659,
    "female": 4499890
  },
  {
    "rating": "**",
    "male": 2027307,
    "female": 3277946
  },
  {
    "rating": "***",
    "male": 1208495,
    "female": 2141490
  },
  {
    "rating": "****",
    "male": 1140516,
    "female": 1938695
  },
  {
    "rating": "*****",
    "male": 894368,
    "female": 1558919
  }
]

const prepareData = (data) => {
  const totalMaleVotes = data.reduce((memo, { male }) => memo + male , 0)
  const totalFemaleVotes = data.reduce((memo, { female }) => memo + female , 0)
  return data.map(({ rating, male, female}) => Object.assign({}, {
    rating,
    male: male / totalMaleVotes * 100,
    female: female / totalFemaleVotes * 100
  }))
}

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

const renderGraph = (data) => {
  var columns = Object.keys(data[0])

  var keys = columns.slice(1);

  x0.domain(data.map(function(d) { return d[X_AXIS_KEY]; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { console.log(d[key]); return d[key]; }); })]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d[X_AXIS_KEY]) + ",0)"; })
    .selectAll("rect")
    .data((d) => keys.map((key) => ({
      key, value: d[key]
    })))
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks())
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("% of Ratings");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
}

renderGraph(prepareData(rawData))