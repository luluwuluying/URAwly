d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
});
};

var settings = {};
var dataStory;
var vis = d3.select("#vis");
var barchart = d3.select("#barchart");
var linechart = d3.select("#linechart");

var update = function(value) {
var state = null;
var localdata =dataStory;
var show_vis = true;
var show_vis_bar = true;
var show_vis_line = false;
//  var show_vis_dot = true;
//  var show_vis_multiple = true;
    
        switch(value) {
        case 0:
        console.log("in case", value);
        show_vis = false;
        show_vis_bar = false;
        show_vis_line = false;
        //      show_vis_dot = false;
        //      show_vis_multiple = false;
        break;
        case 1:
        console.log("in case", value);
        localdata =dataStory;
        show_vis = true;
        show_vis_bar = true;
        show_vis_line = false;
        //      show_vis_dot = false;
        //      show_vis_multiple = false;
        break;
        case 2:
        console.log("in case", value);
        localdata =dataStory;
        show_vis = true;
        show_vis_bar = false;
        show_vis_line = true;
        //      show_vis_dot = false;
        //      show_vis_multiple = false;
        break;
        //    case 3:
        //      console.log("in case", value);
        //      localdata =dataStory;
        //      show_vis = false;
        //      show_vis_bar = false;
        //      show_vis_line = false;
        //      show_vis_dot = false;
        //      show_vis_multiple = false;
        //      break;
        //    case 4:
        //      console.log("in case", value);
        //      localdata =dataStory;
        //      show_vis = false;
        //      show_vis_bar = false;
        //      show_vis_line = false;
        //      show_vis_dot = false;
        //      show_vis_multiple = false;
        //      break;
        //    case 5:
        //      console.log("in case", value);
        //      show_vis = false;
        //      show_vis_bar = false;
        //      show_vis_line = false;
        //      show_vis_dot = false;
        //      show_vis_multiple = false;
        //      break;
        default:
        state = null;
        show_vis = false;
        show_vis_bar = false;
        show_vis_line = false;
        //      show_vis_dot = false;
        //      show_vis_multiple = false;
        break;
        }
console.log("show viz", show_vis);
    
        if (show_vis) {
        vis.style("display", "inline-block");
        } else {
        vis.style("display", "none");
        }
        console.log("show viz", show_vis);
        if (show_vis) {
        vis.style("display", "inline-block");
        } else {
        vis.style("display", "none");
        }
        if (show_vis_bar) {
        barchart.style("display", "inline-block");
        } else {
        barchart.style("display", "none");
        }
        if (show_vis_line) {
        linechart.style("display", "inline-block");
        } else {
        linechart.style("display", "none");
        }
        };

