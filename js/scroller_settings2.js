d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
});
};

var settings = {};
var vis = d3.select("#vis");
var mapchart = d3.select("#vis_state");
var barchart = d3.select("#barchart");
var scatterchart = d3.select("#scatterchart");

var update = function(value) {
        var state = null;
        var show_vis_map = true;
        var show_vis_bar = false;
        var show_vis_scatter = false;
    
        switch(value) {
        case 0:
            console.log("in case", value);
            show_vis_map = false;
            show_vis_bar = false;
            show_vis_scatter = false;
        break;
                
        case 1:
            console.log("in case", value);
            show_vis_map = true;
            show_vis_bar = false;
            show_vis_scatter = false;
        break;
                
        case 2:
            console.log("in case", value);
            show_vis_map = true;
            keepInProperLine();
            show_vis_bar = false;
            show_vis_scatter = false;
        break;
                
        case 3:
            console.log("in case", value);
            show_vis_map = true;
            rightOfWayColors();
            show_vis_bar = false;
            show_vis_scatter = false;
          break;
                
        case 4:
            console.log("in case", value);
            show_vis_map = true;
            recklessColors();
            show_vis_bar = false;
            show_vis_scatter = false;
          break;
                
        case 5:
           console.log("in case", value);
           show_vis = false;
           show_vis_map = false;
           show_vis_bar = true;
           show_vis_scatter = false;
          break;
        
        case 6:
           console.log("in case", value);
           show_vis = false;
           show_vis_map = false;
           show_vis_bar = false;
           show_vis_scatter = true;
          break;
                
        default:
          state = null;
          show_vis_map = false;
          show_vis_bar = false;
          show_vis_scatter = false;
        break;
        }
    console.log("show viz", show_vis_map, show_vis_bar, show_vis_scatter);
    
        if (show_vis_map) {
        mapchart.style("display", "inline-block");
        } else {
        mapchart.style("display", "none");
        }
        if (show_vis_bar) {
        barchart.style("display", "inline-block");
        } else {
        barchart.style("display", "none");
        }
        if (show_vis_scatter) {
        scatterchart.style("display", "inline-block");
        } else {
        scatterchart.style("display", "none");
        }
        };

/*
if(d.id==06){return "#f7e7b4"} // Improper turn
        if(d.id==02){return "#c69f9f"} // Not adjusting to road surface
        if(d.id==10){return "orange"}  // Not adjusting to road obstruction
        if(d.id==42){return "#e5c3c6"} // Driving on wrong side of road
        if(d.id==22){return "#ff8b94"} // Operating without required equipment
        if(d.id==53 || d.id==30 || d.id==38 || d.id==55 || d.id==20 || d.id==4 ){return "#b8dbd3"} //Failure to yield right of way
        if(d.id==08 || d.id==05 || d.id==12 || d.id==27 || d.id==37 || d.id==33 ){return "	#ffcd94"}//reckless or careless driving
        if(d.id==46 || d.id==21 || d.id==01 ){return "	#96ead7"} //overcorrecting
       else{
           return "#80b1d3" //Failure to keep in proper lane
        */
function keepInProperLine(){
    
     d3.selectAll("svg.vis_state path.states").transition()
    .style("fill", function (d) {
        if(d.id==3 || d.id==7 || d.id==9 || d.id==11 || d.id==13 || d.id==14 || d.id==15 || d.id==16 || d.id==17 || d.id==18 || d.id==19 || d.id==23  || d.id==24 || d.id==25 || d.id== 26|| d.id==28 || d.id==29 || d.id==31 || d.id== 32|| d.id==34 || d.id== 35|| d.id== 36|| d.id== 39|| d.id==40 || d.id==41 || d.id==43 || d.id==44 || d.id== 45|| d.id==47 || d.id==48 || d.id==49 || d.id== 50|| d.id==51 || d.id==52 || d.id== 54){
            return "#a6c9e1"; 
        } else {
            return "#e5e5e5";
        }
    });
    d3.selectAll("svg.vis_state circle.legend")
        .style("opacity", .1);
    d3.selectAll("svg.vis_state text.legend")
        .style("opacity", 0);
    d3.selectAll("svg.vis_state circle")
        .style("opacity",0);
    d3.selectAll("#properline").style("opacity", 1);
}

function rightOfWayColors() {
    d3.selectAll("svg.vis_state path.states").transition()
   .style("fill", function (d) {
        if(d.id==53 || d.id==30 || d.id==38 || d.id==55 || d.id==20 || d.id==4 ){
            return "#b8dbd3"; 
        } else {
            return "#e5e5e5";
        }
    });
    d3.selectAll("svg.vis_state circle.legend")
        .style("fill", .1);
    d3.selectAll("svg.vis_state text.legend")
        .style("opacity", 0);
    d3.selectAll("svg.vis_state circle")
        .style("opacity",0);
    d3.selectAll("#rightway").style("opacity", 1);
}

function recklessColors() {
    d3.selectAll("svg.vis_state path.states").transition()
    .style("fill", function (d) {
        if(d.id==08 || d.id==05 || d.id==12 || d.id==27 || d.id==37 || d.id==33 ) {
            return "#ffcd94"; 
        } else {
            return "#e5e5e5";
        }
    });
    d3.selectAll("svg.vis_state circle.legend")
        .style("opacity", .1);
    d3.selectAll("svg.vis_state text.legend")
        .style("opacity", 0);
    d3.selectAll("svg.vis_state circle")
        .style("opacity",0);
    d3.selectAll("#reckless").style("opacity", 1);
}
