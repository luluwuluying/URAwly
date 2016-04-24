function drawWorldmap(world,accidents){
 console.log(accidents);
    var width = 1000,
    height = 550;
    center = [width / 2, height / 2],
    defaultFill = "#e0e0e0";


    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var svg = d3.select("#vis_world").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .call(zoom);

    var colorScale = d3.scale.linear().range(["#e6f7ff", "#478ebf"]).interpolate(d3.interpolateLab); 


    var projection = d3.geo.mercator()
        .scale(150)
        .translate([width/2-20, height/2+30]);

    var worldpath = d3.geo.path()
        .projection(projection);
    
    var domAmount = d3.extent(accidents, function(d) {return +d.Amount;});

    colorScale.domain(domAmount);

    svg.on("wheel.zoom", null);
    svg.on("mousewheel.zoom", null);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height);

    svg.append("image")
        .attr("xlink:href", "progress-anim.gif")
        .attr("id", "progress-image")
        .attr("width", 43)
        .attr("height", 11)
        .attr("x",width / 2)
        .attr("y",height/ 2);

    var gworld = svg.append("g").attr("class", "world");

    var tooltip_world = d3.select("#mytooltip1")
     .attr("class", "tooltip_world")
     .style("opacity", 0);


    gworld.append("g")
    .attr("class", "countries")
    .selectAll("path")
      .data(topojson.feature(world, world.objects.units).features)
    .enter().append("path")
      .attr("d", function(d) {
        if (d.id !== "ATA") {
            return worldpath(d);
        }
    })
      .attr("fill", function(d) {
         return colorByCountry(d);
    })
      .on("mouseover", mouseover)
      .on("mouseout", function() {
          d3.select(this).classed("selected", false);
         d3.select(this).style("opacity", 1);
          tooltip_world.transition().duration(300)
            .style("opacity", 0);
          });


    make_buttons(); // create the zoom buttons

    svg.select("#progress-image").remove(); // remove animation for loading

    svg.append("g")
    .attr("class", "legendColors")
    .attr("transform", "translate(20,400)"); // where we put it on the page!

    var legendColors = d3.legend.color()
    .shapeWidth(20)
    .shapePadding(0)
    .labelFormat(d3.format("1.1s"))
    .orient("vertical")
    .scale(colorScale); // our existing color scale

    svg.select(".legendColors")
    .call(legendColors);
    
    function make_buttons() {

    // Zoom buttons actually manually constructed, not images
      svg.selectAll(".scalebutton")
          .data(['zoom_in', 'zoom_out'])
        .enter()
          .append("g")
            .attr("id", function(d){return d;})  // id is the zoom_in and zoom_out
            .attr("class", "scalebutton")
            .attr({x: 20, width: 20, height: 20})
          .append("rect")
              .attr("y", function(d,i) { return 20 + 25*i })
              .attr({x: 20, width: 20, height: 20})
      // Plus button
      svg.select("#zoom_in")
        .append("line")
          .attr({x1: 25, y1: 30, x2: 35, y2: 30 })
          .attr("stroke", "#fff")
          .attr("stroke-width", "2px");
      svg.select("#zoom_in")
        .append("line")
          .attr({x1: 30, y1: 25, x2: 30, y2: 35 })
          .attr("stroke", "#fff")
          .attr("stroke-width", "2px");
      // Minus button
      svg.select("#zoom_out")
        .append("line")
          .attr({x1: 25, y1: 55, x2: 35, y2: 55 })
          .attr("stroke", "#fff")
          .attr("stroke-width", "2px");


      svg.selectAll(".scalebutton")
        .on("click", function() {
          d3.event.preventDefault();

          var scale = zoom.scale(),
              extent = zoom.scaleExtent(),
              translate = zoom.translate(),
              x = translate[0], y = translate[1],
              factor = (this.id === 'zoom_in') ? 2 : 1/2,
              target_scale = scale * factor;

          var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
            if (clamped_target_scale != target_scale){
                target_scale = clamped_target_scale;
                factor = target_scale / scale;
            }

            // Center each vector, stretch, then put back
            x = (x - center[0]) * factor + center[0];
            y = (y - center[1]) * factor + center[1];

    //         Transition to the new view over 350ms
            d3.transition().duration(350).tween("zoom", function () {
                var interpolate_scale = d3.interpolate(scale, target_scale),
                    interpolate_trans = d3.interpolate(translate, [x,y]);
                return function (t) {
                    zoom.scale(interpolate_scale(t))
                        .translate(interpolate_trans(t));
                    svg.call(zoom.event);
                };
            });
        });
    }

    function mouseover(d){

          d3.select(this).classed("selected", true);
          d3.select(this).moveToFront();
         d3.select(this).style("opacity", 0.5);

          tooltip_world.transition().duration(100)
           .style("opacity", 1);
         tooltip_world
            .style("top", (d3.event.pageY - 10) + "px" )
            .style("left", (d3.event.pageX + 10) + "px");
          tooltip_world.selectAll(".symbol").style("opacity", "0");
          tooltip_world.selectAll(".val").style("font-weight", "normal");
          tooltip_world.selectAll(".val").style("color", "grey");
          tooltip_world.select(".symbol." + "Amount").style("opacity", "1").style({
              "color": "#6d819c"
          });
          tooltip_world.select(".val." + "Amount").style({
              "color": "#6d819c"
          });

          if (countryById.get(d.properties.name) && countryById.get(d.properties.name)["Amount"]) {
             tooltip_world.select(".name")
             .html("<p>Country: <span style='color:#c08f8f'>" + countryById.get(d.properties.name)['Country'] +
            "</span>" + "</p>"); 
             tooltip_world.select(".Amount.val")
             .html("<p>Death rate per 100000 population: <span style='color:#c08f8f'>" +countryById.get(d.properties.name)["Amount"] + "%" +
            "</span>" + "<br>" +"</span>" + "<br>Deaths population:<span style='color:#c08f8f'> " + countryById.get(d.properties.name)["Number"]+"</span>" + "</p>");
          } else {
            tooltip_world.select(".name").text("No data for " + d.properties.name);
            tooltip_world.select(".Amount.val").text("NA");

          }
        } // end mouseover

    function colorByCountry(d) {

        var countryObject = countryById.get(d.properties.name);

        if (typeof(countryObject) == "undefined") {
            console.log(d.properties.name, countryObject);
        }

        if (typeof(countryObject) !== "undefined") {
            return colorScale(countryObject.Amount);
        } else {
            return "lightgrey";
        }
    }

    function zoomIn() {
        zoom.scale(zoom.scale()*2);
        move();
    }

    function move() {
      var t = d3.event.translate,
          s = d3.event.scale;
      t[0] = Math.min(width * (s - 1), Math.max(width * (1 - s), t[0]));
      t[1] = Math.min(height * (s - 1), Math.max(height * (1 - s), t[1]));
      zoom.translate(t);
      gworld.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }
}