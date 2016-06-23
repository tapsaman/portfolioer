if (AnchorPoints === undefined)
    var AnchorPoints = {};

// For editor: create new anchor and tooltip DOM-elements (canvas and div)
AnchorPoints.getNew = function(id) {
    
    // Holder for DOM-elements
    var ret = {};
    
    ret['canvas'] = $("<canvas></canvas>")
        .attr("id","anchorpoint" + id)
        .attr("class","anchorpoint")
        .attr("width",42)
        .attr("height",42)
        .css("left",40 + id*50)
        .css("top", 40)
        .css("color","rgb(100,200,240)")
        .attr("data-anchortype",1)
        .attr("data-animation",0)
		.attr("data-hoverOff",""); // to draw immediately
    
    ret['tooltip'] = $("<div></div>")
        .attr("id","tooltip_anchorpoint" + id)
        .attr("class","tooltip")
        .text("testiboxi #"+id);
        
    return ret;
}
    
