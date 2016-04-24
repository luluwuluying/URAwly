function drawLinechart(state1){
    
console.log(state1);    
//Dimensions and padding

var fullwidth = 900;
var fullheight = 600;
var margin = { top: 20, right: 150, bottom: 40, left: 100};


var width = fullwidth - margin.left - margin.right;
var height = fullheight - margin.top - margin.bottom;

//Set up date formatting and years
var dateFormat = d3.time.format("%Y");


var xScale = d3.time.scale()
            .range([ 0, width]);

var yScale = d3.scale.linear()
            .range([0, height]);


//Configure axis generators
var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(5)
            .tickFormat(function(d) {
            return dateFormat(d);
            })
            .innerTickSize([10]);

var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize([10]);



var line = d3.svg.line()
            .x(function(d) {
            return xScale(dateFormat.parse(d.year));
            })
            .y(function(d) {
            return yScale(+d.amount);
            })
            ;


// add a tooltip to the page - not to the svg itself!
var tooltip_line = d3.select("body")
            .append("div")
            .attr("class", "tooltip_line");

//Create the empty SVG image
var svg = d3.select("#linechart")
            .append("svg")
            .attr("width", fullwidth)
            .attr("height", fullheight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var years = d3.keys(state1[0]).slice(0, 6); //

var dataset = [];

state1.forEach(function (d, i) {

var deathrate = [];

years.forEach(function (y) {

            if (d[y]) {
            deathrate.push({
            state: d.statename,
            year: y,
            amount: d[y] 
            });
            }

            });

            dataset.push( {
            state: d.statename,
            death: deathrate  
            } );

console.log(d.statename);
            }); // end of the data.forEach loop

console.log(dataset);

            xScale.domain(
            d3.extent(years, function(d) {
            return dateFormat.parse(d);
            }));

            yScale.domain([
            d3.max(dataset, function(d) {
            return d3.max(d.death, function(d) {
            return +d.amount;
            });
            }),
            0
            ]);


var groups = svg.selectAll("g.lines")
            .data(dataset)
            .enter()
            .append("g")
            .attr("class", "lines");

groups.selectAll("path")
            .data(function(d) { 
            return [ d.death ]; 
            })
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("d", line); 

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    d3.selectAll("g.lines")
            .on("mouseover", mouseoverFunc)
            .on("mouseout", mouseoutFunc);

    svg.append("text")
            .attr("class", "xlabel")
            .attr("transform", "translate(" + width/2 + " ," +
            height + ")")
            .style("text-anchor", "middle")
            .attr("dy", "40")
            .text("Year");

    svg.append("text")
            .attr("class", "y label")
            .attr("x", -width/2+100)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .attr("dy", "-60")
            .text("Deaths per 100,000 population");

var circles = groups.selectAll("circle")
            .data(function(d) { 
            return d.death; 
            })
            .enter()
            .append("circle");

    circles.attr("cx",function(d){return xScale(dateFormat.parse(d.year));})
            .attr("cy", function(d) {
            return yScale(+d.amount);})
            .attr("r", 4)
            .style("opacity", 0);

        circles
            .on("mouseover", mouse1Func)
            .on("mouseout",	mouse2Func)  
            .on("mousemove", mousemoveFunc);
            

        groups.append("text")
            .attr("class","grouptext")
            .datum(function(d) { return {name: d.state, value: d.death[d.death.length - 1]}; })
            .attr("transform", function(d) { 
            return "translate(" + xScale(dateFormat.parse(d.value.year)) + "," + yScale(+d.value.amount) + ")"; 
            })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) {
            if (d.value && +d.value.amount > 21) {
            return d.name;
            }
            if (d.value && +d.value.amount < 3.2) {
            return d.name;
            }

            })


function mouseoverFunc(d) {

            d3.selectAll("path.line").classed("unfocused", true);
            d3.select(this).select("path.line").classed("unfocused", false).classed("focused", true);

            }
function mouseoutFunc(d) {

            d3.selectAll("path.line").classed("unfocused", false).classed("focused", false);
            tooltip_line.style("display", "none"); // this sets it to invisible!
            }

function mouse1Func(d){
            d3.select(this)
            .transition()
            .style("opacity", 1)
            .attr("r", 6);
    

            tooltip_line
            .style("display", null)
            .html("<p>State: <span style='color:#c08f8f'>" + d.state +
            "</span>" + "<br>Year: <span style='color:#c08f8f'>" + d.year +"</span>" + "<br>Deaths per 100,000 population:<span style='color:#c08f8f'> " + d.amount + "%"+"</span>" + "</p>"); 
            }
  
function mouse2Func(d) {
            d3.select(this)
            .transition()
            .style("opacity", 0)
            .attr("r", 4);
            tooltip_line.style("display", "none"); // this sets it to invisible!
            }

function mousemoveFunc(d) {

            tooltip_line
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
            }




} 


