queue()
    .defer(d3.json, "json/countries.json")
    .defer(d3.csv, "data/world_death2013.csv", typeAndSet)
    .defer(d3.json, "json/us-states.json")
    .defer(d3.csv, "data/USstate_death2013.csv")
    .await(ready);

function ready(error, world, accidents, json, states) {
    
    drawWorldmap(world, accidents);
    
    drawStatemap(json, states);

    console.log(error, world, accidents);

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