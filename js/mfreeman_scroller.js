function scroller() {
  var windowHeight;
  var container = d3.select('body');

  // Set height
  var height = $('.step:last').height()
  var marginBottom = parseInt($('.step:last').css('margin-bottom'))
  var newHeight = $(window).height() - height - marginBottom
  $('.step:last').height(newHeight)
  console.log('height ', height, ' new height ', newHeight)
  var dispatch = d3.dispatch("active", "progress");
  var sections = null;
  var sectionPositions = [];
  var currentIndex = -1;
  // y coordinate of
  var containerStart = 0;

  function scroll(els) {
    sections = els;
    
    d3.select(window)
      .on("scroll.scroller", position)
      .on("resize.scroller", resize);
    resize();

    d3.timer(function() {
      position();
      return true;
    });
  }

  function resize() {
    sectionPositions = [];
    var startPos;
    sections.each(function(d,i) {
      var top = this.getBoundingClientRect().top;
      if(i === 0) {
        startPos = top;
      }
      sectionPositions.push(top - startPos);
    });
    containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
  }

  function position() {
    var pos = window.pageYOffset - 10 - containerStart;
    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size() - 1, sectionIndex);

    if (currentIndex !== sectionIndex) {
      dispatch.active(sectionIndex);
      currentIndex = sectionIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
    dispatch.progress(currentIndex, progress);
  }

  scroll.container = function(value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  scroll.update = function(action) {
    if (arguments.length === 0) {
      return update;
    }
    scroll.on('active', function(index) {
      // highlight current step text
      d3.selectAll('.step')
        .style('opacity',  function(d,i) { return i == index ? 1 : 0.1; });
      action(index)
  });
    return scroll;
  };

  d3.rebind(scroll, dispatch, "on");

  return scroll;
}


