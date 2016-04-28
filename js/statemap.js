function drawStatemap(reason) {
    
    //Width and height of map
    var width = 800;
    var height = 550;
    
    // D3 Projection
    var projection = d3.geo.albersUsa()
                       .translate([width/2, height/2])    // translate to center of screen
                       .scale([1000]);          // scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                 .projection(projection);  // tell path generator to use albersUsa projection

    //Create SVG element and append map to the SVG
    var svg = d3.select("#vis_state")
                .append("svg")
                .attr('class', 'vis_state')
                .attr("width", width)
                .attr("height",height);

    // Append Div for tooltip to SVG
    var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip_state")
                .style("display", "none");


    // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path.states")
        .data(reason.features)
        .enter()
        .append("path")
        .classed("states", true)
        .attr("d", path)
        .style("fill", function(d) {
        if(d.id==06){return "#f7e7b4"} // Improper turn
        if(d.id==02){return "#c69f9f"} // Not adjusting to road surface
        if(d.id==10){return "orange"}  // Not adjusting to road obstruction
        if(d.id==42){return "#e5c3c6"} // Driving on wrong side of road
        if(d.id==22){return "#ff8b94"} // Operating without required equipment
        if(d.id==53 || d.id==30 || d.id==38 || d.id==55 || d.id==20 || d.id==4 ){return "#b8dbd3"} //Failure to yield right of way
        if(d.id==08 || d.id==05 || d.id==12 || d.id==27 || d.id==37 || d.id==33 ){return "	#ffcd94"}//reckless or careless driving
        if(d.id==46 || d.id==21 || d.id==01 ){return "	#96ead7"} //overcorrecting
       else{
           return "#a6c9e1" //Failure to keep in proper lane
       }
    })
    .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("display", null);
            d3.select(this).style("opacity", 0.5);
        })
    .on("mousemove", function(d) {
        tooltip.html("<p>" + d.properties.name + "</p>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
            tooltip.transition()
               .duration(500)
               .style("display", "none");
        d3.select(this).style("opacity", 1)
                .style("stroke","white");
        });

    
svg.append("circle")
.attr("class", "legend")
.attr("id", "properline")
.attr("cx",660)
.attr("cy",350)
.style("fill","#a6c9e1")
.attr("r",6);

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "properline")
    .attr("x",670)
    .attr("y",356)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Failure to keep in proper line");

svg.append("circle")
.attr("class", "legend")
.attr("id", "rightway")
.attr("cx",660)
.attr("cy",370)
.style("fill","#b8dbd3")
.attr("r",6)

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "rightway")
    .attr("x",670)
    .attr("y",376)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Failure to yield right of way");

svg.append("circle")
.attr("class", "legend")
.attr("id", "reckless")
.attr("cx",660)
.attr("cy",390)
.attr("r",6)
.style("fill","	#ffcd94")

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "reckless")
    .attr("x",670)
    .attr("y",396)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Reckless or careless driving");

svg.append("circle")
.attr("class", "legend")
.attr("id", "over")
.attr("cx",660)
.attr("cy",410)
.attr("r",6)
.style("fill","#c8e0a6")

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "over")
    .attr("x",670)
    .attr("y",416)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Overcorrecting");

svg.append("circle")
.attr("class", "legend")
.attr("id", "adjusting")
.attr("cx",660)
.attr("cy",430)
.attr("r",6)
.style("fill","	orange")

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "adjusting")
    .attr("x",670)
    .attr("y",436)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Not adjusting to road surface");

svg.append("circle")
.attr("class", "legend")
.attr("id", "wrongroad")
.attr("cx",660)
.attr("cy",450)
.attr("r",6)
.style("fill","	#e5c3c6")

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "wrongroad")
    .attr("x",670)
    .attr("y",456)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Driving on wrong side of road");

svg.append("circle")
.attr("class", "legend")
.attr("id", "obstruction")
.attr("cx",660)
.attr("cy",470)
.attr("r",6)
.style("fill","	#c69f9f")

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "obstruction")
    .attr("x",670)
    .attr("y",476)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Not adjust to road obstruction");

svg.append("circle")
.attr("class", "legend")
.attr("id", "equipment")
.attr("cx",660)
.attr("cy",490)
.attr("r",6)
.style("fill","#ff8b94")

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "equipment")
    .attr("x",670)
    .attr("y",496)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Without required equipment");
    
svg.append("circle")
.attr("class", "legend")
.attr("id", "turn")
.attr("cx",660)
.attr("cy",510)
.attr("r",6)
.style("fill","	#f7e7b4")

    svg.append("text")
    .attr("class", "legend")
    .attr("id", "turn")
    .attr("x",670)
    .attr("y",516)
    .attr("font-size","9px")
    .style("text-anchor", "left")
    .text("Improper turn");


} // end ready function
