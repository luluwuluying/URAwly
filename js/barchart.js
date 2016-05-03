function drawBarchart(live){
    console.log(live);
    
    var fullwidth = 400;
    var fullheight = 500;
    var selected;
    var margin = {top: 10, right: 20, bottom: 20, left: 10};

    var height = fullheight - margin.top - margin.bottom;
    var width = fullwidth - margin.left - margin.right;

    var format = d3.format("");

    //setup the svg

    var vis = d3.select("#barchart").append("svg");
    var svg = vis
        .attr("width", width+155)
        .attr("height", height+10); // adding some random padding
        svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "none");
    
    // load the data and do stuff
    
        var selected = "Total"; 
        var dataset = drawGraph(live,selected);
        redraw(dataset, selected);
        
        d3.select("button#Total").classed("selected,true");
    
        d3.select("#Total")
                  .on("click", function(d,i) {
                      selected = "Total"
                      dataset = drawGraph(live, selected);
                      redraw(dataset, selected);
                      var thisButton = d3.select(this);
                      d3.selectAll("#buttons_1 button").classed("selected", false);
                      thisButton.classed("selected", true);

                  });
    
        d3.select("#AlcoholRate")
              .on("click", function(d,i) {
                  selected = "AlcoholRate"
                  dataset = drawGraph(live, selected);
                  redraw(dataset, selected);
                  var thisButton = d3.select(this);
                  d3.selectAll("#buttons_1 button").classed("selected", false);
                  thisButton.classed("selected", true);

              });
         
          d3.select("#SpeedingRate")
              .on("click", function(d,i) {
                  selected = "SpeedingRate"
                  dataset = drawGraph(live, selected);
                  redraw(dataset, selected);
                  var thisButton = d3.select(this);
                  d3.selectAll("#buttons_1 button").classed("selected", false);
                  thisButton.classed("selected", true);
              });
        
        d3.select("#UnrestraintRate")
              .on("click", function(d,i) {
                  selected = "UnrestraintRate"
                  dataset = drawGraph(live, selected);
                  redraw(dataset, selected);
                  var thisButton = d3.select(this);
                  d3.selectAll("#buttons_1 button").classed("selected", false);
                  thisButton.classed("selected", true);
              });
      
function drawGraph(data, column) {
    
      return data.sort(function(a, b) {
        return b[column] - a[column];
      }).slice(0, 20); 
    }

function redraw(data, column) {

        var max = d3.max(data, function(d) {return +d[column];});

        xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);

        yScale = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeBands([0, height], .2);


        var bars = svg.selectAll("rect.bar")
            .data(data, function (d){ return d.state;})
       
        bars
            .attr("fill", "#80b1d3");

        
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", "#80b1d3");

        bars.exit()
            .transition()
            .duration(300)
            .attr("width", 0)
            .remove();
           
        bars
            .transition()
            .duration(300)
            .ease("quad")
            .attr("width", function(d) {
                return xScale(+d[column]); 
            })
            .attr("height", yScale.rangeBand())
            .attr("fill", "#80b1d3")
            .attr("transform", function(d,i) {
                return "translate(0," + yScale(i) + ")";
            });

        var labels = svg.selectAll("text.labels")
            .data(data, function (d) { 
                return d.state;})
                
        labels.enter()
            .append("text")
            .attr("class", "labels");

        labels.exit()
            .remove();

        labels.transition()
            .duration(300)
            .text(function(d) {
                return d.state +" " + format(d[column]);
            })
            .attr("transform", function(d,i) {
                    return "translate(" + xScale(+d[column]) + "," + yScale(i) + ")"
            })
            .attr("dy", "1.2em")
            .attr("dx", "20px")
            .attr("text-anchor", "begin");

        } 
}