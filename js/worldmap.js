var width_world = 1000,
    height_world = 550;
    center = [width_world / 2, height_world / 2],
    defaultFill = "#e0e0e0";


var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", move);

var svg_world = d3.select("#vis_world").append("svg")
    .attr("width", width_world)
    .attr("height", height_world)
    .append("g")
    .call(zoom);

var colorScale = d3.scale.linear().range(["#e6f7ff", "#478ebf"]).interpolate(d3.interpolateLab); 

var countryById = d3.map(); 

var projection = d3.geo.mercator()
    .scale(150)
    .translate([width_world/2-20, height_world/2+30]);

var worldpath = d3.geo.path()
    .projection(projection);

svg_world.on("wheel.zoom", null);
svg_world.on("mousewheel.zoom", null);

svg_world.append("rect")
    .attr("class", "overlay")
    .attr("width", width_world)
    .attr("height", height_world);

svg_world.append("image")
    .attr("xlink:href", "progress-anim.gif")
    .attr("id", "progress-image")
    .attr("width", 43)
    .attr("height", 11)
    .attr("x",width_world / 2)
    .attr("y",height_world/ 2);

var gworld = svg_world.append("g").attr("class", "world");

var tooltip_world = d3.select("#mytooltip1")
 .attr("class", "tooltip_world")
 .style("opacity", 0);


queue()
    .defer(d3.json, "json/countries.json")
    .defer(d3.csv, "data/world_death2013.csv", typeAndSet)
    .await(ready);

function ready(error, world, accidents) {

  console.log(error, world, accidents);

  var domAmount = d3.extent(accidents, function(d) {return d.Amount;});

 
  colorScale.domain(domAmount);
  

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
          tooltip_world.transition().duration(300)
            .style("opacity", 0);
          });


  make_buttons(); // create the zoom buttons

  svg_world.select("#progress-image").remove(); // remove animation for loading
    
  svg_world.append("g")
    .attr("class", "legendColors")
    .attr("transform", "translate(20,400)"); // where we put it on the page!

  var legendColors = d3.legend.color()
    .shapeWidth(20)
    .shapePadding(0)
    .labelFormat(d3.format("1.1s"))
    .orient("vertical")
    .scale(colorScale); // our existing color scale

  svg_world.select(".legendColors")
    .call(legendColors);

} // end function ready

function make_buttons() {

    // Zoom buttons actually manually constructed, not images
  svg_world.selectAll(".scalebutton")
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
  svg_world.select("#zoom_in")
    .append("line")
      .attr({x1: 25, y1: 30, x2: 35, y2: 30 })
      .attr("stroke", "#fff")
      .attr("stroke-width", "2px");
  svg_world.select("#zoom_in")
    .append("line")
      .attr({x1: 30, y1: 25, x2: 30, y2: 35 })
      .attr("stroke", "#fff")
      .attr("stroke-width", "2px");
  // Minus button
  svg_world.select("#zoom_out")
    .append("line")
      .attr({x1: 25, y1: 55, x2: 35, y2: 55 })
      .attr("stroke", "#fff")
      .attr("stroke-width", "2px");


  svg_world.selectAll(".scalebutton")
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
                svg_world.call(zoom.event);
            };
        });
    });
}

function mouseover(d){

  d3.select(this).classed("selected", true);
  d3.select(this).moveToFront();

  tooltip_world.transition().duration(100)
   .style("opacity", 1);
 tooltip_world
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
  tooltip_world.selectAll(".symbol").style("opacity", "0");
  tooltip_world.selectAll(".val").style("font-weight", "normal");
  tooltip_world.selectAll(".val").style("color", "grey");
  tooltip_world.select(".symbol." + "Amount").style("opacity", "1");
  tooltip_world.select(".val." + "Amount").style({
      "color": "black"
  });

  if (countryById.get(d.properties.name) && countryById.get(d.properties.name)["Amount"]) {
     tooltip_world.select(".name").text(countryById.get(d.properties.name)['Country']);
     tooltip_world.select(".Amount.val").text(d3.round(countryById.get(d.properties.name)["Amount"]));
    
  } else {
    tooltip_world.select(".name").text("No data for " + d.properties.name);
    tooltip_world.select(".Amount.val").text("NA");
    
  }
} // end mouseover

function typeAndSet(d) {
    d.Amount = +d.Amount;
    countryById.set(d.MapCountry, d); // this is a d3.map, being given a key, value pair.
    return d;
}


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

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function zoomIn() {
    zoom.scale(zoom.scale()*2);
    move();
}

function move() {
  var t = d3.event.translate,
      s = d3.event.scale;
  t[0] = Math.min(width_world * (s - 1), Math.max(width_world * (1 - s), t[0]));
  t[1] = Math.min(height_world * (s - 1), Math.max(height_world * (1 - s), t[1]));
  zoom.translate(t);
  gworld.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}
