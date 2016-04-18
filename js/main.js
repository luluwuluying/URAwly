queue()
    .defer(d3.json, "json/countries.json")
    .defer(d3.csv, "data/world_death2013.csv", typeAndSet)
    .defer(d3.json, "json/us-states.json")
    .defer(d3.csv, "data/USstate_death2013.csv")
    .defer(d3.csv,"data/reason-car-death.csv")
    .defer(d3.csv,"data/Alcohol-Impaired-Driving-2008-2013.csv")
    .await(ready);

function ready(error, world, accidents, json, states, reason, alcohol) {
    
    
    drawWorldmap(world, accidents);
    
    drawStatemap(json, states);
    
    drawBarchart(reason);
    
    drawLinechart(alcohol);

    console.log(error, world, accidents);
    
    if (error) {console.log(error); } 

    var vis = d3.select("#vis");

    var scroll = scroller()
    .container(d3.select('#graphic'));

    scroll(d3.selectAll('.step'));

    scroll.update(update);

    var oldScroll = 0;
    $(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    console.log("scroll", scroll);
    if (scroll >= 3000 && scroll > oldScroll) {
    vis.style("display", "none");
    } else if (scroll >= 3000 && scroll < oldScroll) {
    vis.style("display", "inline-block"); // going backwards, turn it on.
    }
    oldScroll = scroll;
    });

 
} // end function ready



var countryById = d3.map(); 

function typeAndSet(d) {
    d.Amount = +d.Amount;
    countryById.set(d.MapCountry, d); // this is a d3.map, being given a key, value pair.
    return d;
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};