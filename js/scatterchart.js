function drawScatterchart(data){

        var fullwidth = 650;
        var fullheight = 550;

        var margin = { top: 20, right: 10, bottom: 50, left: 50 };

        var width = fullwidth - margin.right - margin.left;
        var height = fullheight - margin.top - margin.bottom;

        var dotRadius = 4; 

        var xScale = d3.scale.linear()
        .range([ 0, width])
        .domain([-1, 100]);

        // top to bottom, padding just in case
        var yScale = d3.scale.linear()
        .range([ height, 0 ])
        .domain([-1, 100]);

        var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);  // fix this to a good number of ticks for your scale later.

        var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

        var svg = d3.select("#scatterchart")
        .append("svg")
        .attr("width", fullwidth)
        .attr("height", fullheight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

        var tooltip_scatter = d3.select("body")
        .append("div")
        .attr("class", "tooltip_scatter");

    // utility for label placement jitter
    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

        var menu = d3.select("#menu select")
        .on("change", filter);

    // Set the intial value of drop-down when page loads
        menu.property("value", "all");

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        svg.append("text")
        .attr("class", "xlabel")
        .attr("transform", "translate(" + (width / 2) + " ," +
        (height + 25) + ")")
        .style("text-anchor", "middle")
        .attr("dy", 12)
        .text("Woman deaths per 100,000 people by motor vehicle crash");

        svg.append("text")
        .attr("class", "ylabel")
        .attr("transform", "rotate(-90) translate(" + (-height/2)
        + ",0)")
        .style("text-anchor", "middle")
        .attr("dy", -30)
        .text("Man deaths per 100,000 people by motor vehicle crash");


        var curSelection = menu.property("value");
        render(data);

function filter() {
// Handle the menu change -- filter the data set if needed, rerender:

        curSelection = menu.property("value");

        if (curSelection === "all") {
        var newData = data; // set it equal to all the data
        } else if (curSelection === "woman") { //poorest 10
        var newData = data.sort(function(a,b) {
        return b.Female - a.Female;
        }).slice(0, 10);
        } else if (curSelection === "man") {  // descending
        var newData = data.sort(function(a,b) { // richest 10
        return b.Male - a.Male;
        }).slice(0, 10);
        }
        console.log(newData);
        render(newData);
        }


function render(mydata) {

        // Here we set domains, and draw the circles based on what data set it is.


        xScale.domain([
        d3.min(mydata, function(d) {
        return +d.Female;
        }) - 2,
        d3.max(mydata, function (d) {
        return +d.Female;
        }) + 2
        ]);

        yScale.domain([
        d3.min(mydata, function(d) {
        return +d.Male;
        }) - 2,
        d3.max(mydata, function (d) {
        return +d.Male;
        }) + 2
        ]);


        // data join
        var circles = svg.selectAll("circle")
        .data(mydata, function(d) {return d.Age;}); // key function!


        // enter and create new ones if needed
        circles
        .enter()
        .append("circle")
        // this section is to fix some of the animation direction problems
        .attr("cx", function (d) {
        if (curSelection == "woman") {
        return width - margin.right;
        }
        else if (curSelection == "man") {
        return margin.left;
        }
        })
        .attr("cy", function (d) {
        if (curSelection == "woman") {
        return margin.top;
        }
        else if (curSelection == "man") {
        return height - margin.bottom;
        }
        });  
        //            .attr("class", "dots")
        //            .append("title")
        //            .text(function(d) {
        //            return d.Age +":"+ " Man traffic death rate is" +" "+ d.Male  +"%" +" Woman traffic death rate is " +  d.Female +"%" ;
        //                });

        // transition of them
        circles
        .transition()
        .duration(2000)
        .attr("cx", function(d) {
        return xScale(+d.Female);
        // return the value to use for your x scale here
        })
        .attr("cy", function(d) {
        return yScale(+d.Male);
        })
        .attr("r", function() {
        if (curSelection !== "all") {
        return dotRadius * 2;
        }
        else {
        return dotRadius;
        }
        });


        // fade out the ones that aren't in the current data set
        circles
        .exit()
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();

        circles
        .on("mouseover", mouse1Func)
        .on("mouseout",	mouse2Func)  
        .on("mousemove", mousemoveFunc);

        // Update the axes - also animated. this is really easy.
        svg.select(".x.axis")
        .transition()
        .duration(1000)
        .call(xAxis);

        // Update Y Axis
        svg.select(".y.axis")
        .transition()
        .duration(1000)
        .call(yAxis);

        // label the dots if you're only showing 10.
        if (curSelection !== "all") {

        // data join with a key
        var labels = svg.selectAll("text.dotlabels")
        .data(mydata, function(d) {
        return d.Age;
        });

        // enter and create any news ones we need. Put minimal stuff here.
        labels
        .enter()
        .append("text")
        .attr("dx", 5)
        .attr("dy", function(d) {
        // adding some space for the overlapping ones
        if (d.Age == "Age group 30-34") {
        return 10;
        } else {
        return -4;
        }
        })
        .attr("class", "dotlabels")
        .style("opacity", 0)
        .text(function(d) {return d.Age});

        // transition them.
        labels.transition()
        .duration(2000)
        .attr("transform", function(d) {
        return "translate(" + xScale(+d.Female) + "," + yScale(+d.Male) + ")";
        })
        .style("opacity", 1);

        // remove ones that we don't have now
        labels.exit().remove(); // these could have a transition too...

        } else {
        // if we're showing "all countries" - fade out any labels.

        svg.selectAll("text.dotlabels")
        .transition()
        .duration(1000)
        .style("opacity", 0)
        .remove();

        }

function mouse1Func(d){
        d3.select(this)
        .transition()
        .style("opacity", 1);


        tooltip_scatter
        .style("display", null)
        .html("<p> Woman traffic death rate : <span style='color:#c08f8f'>" + d.Female + "%"+
        "</span>" +  "<br>Man traffic death rate:<span style='color:#c08f8f'> " + d.Male + "%"+"</span>" + "</p>"); 
}

function mouse2Func(d) {
        tooltip_scatter.style("display", "none"); // this sets it to invisible!
}

function mousemoveFunc(d) {

        tooltip_scatter
        .style("top", (d3.event.pageY - 10) + "px" )
        .style("left", (d3.event.pageX + 10) + "px");
        }

        } // end of render


}