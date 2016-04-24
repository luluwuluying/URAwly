queue()
    .defer(d3.json, "json/countries.json")
    .defer(d3.csv, "data/world_death2013.csv", typeAndSet)
    .defer(d3.csv,"data/statedeathrate2008-2013.csv")
    .defer(d3.json,"json/us-states.json")
    .defer(d3.csv,"data/reason-car-death.csv")
    .defer(d3.csv,"data/death-by-age-group.csv")
    .await(ready);

function ready(error, world, accidents, state1, reason, live, data) {
    
        
    if (error) {console.log(error); } 
    
    drawWorldmap(world, accidents);
    
    drawLinechart(state1);
    
    drawStatemap(reason);
    
    drawBarchart(live);
    
    drawScatterchart(data);

    console.log(world, accidents);


    var scroll = scroller()
    .container(d3.select('#graphic'));

    scroll(d3.selectAll('.step'));

    scroll.update(update);
 
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