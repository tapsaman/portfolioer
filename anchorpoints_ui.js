if (AnchorPoints === undefined)
    var AnchorPoints = {};

AnchorPoints.renewHandlers = function(body)
{
	$(body).off('mouseenter');
	$(body).off('mouseleave');
	
	$(body).on('mouseenter','.anchorpoint, .tooltip',function() {
		
		AnchorPoints.activateAnchor.call(this);

        $(this).mouseleave( function() {
            AnchorPoints.deactivateAnchor.call(this);
        });
		
	});
}

// activate/deacvtivateAnchor can only be called by
// 1. anchor canvas element, 2. its tooltip element 

AnchorPoints.activateAnchor = function() {

	var anc, tt;

	if ( $(this).hasClass('anchorpoint') ) {
		anc = this;
		tt = document.getElementById('tooltip_' + $(this).attr("id"));
	}
	else if ( $(this).hasClass('tooltip') ) {
		anc = document.getElementById ( $(this).attr("id").substring( $(this).attr("id").indexOf('_')+1 ) );
		//console.log("anc: "+anc);
		
		tt = this;
	}
	else { alert("Wrongful invocation of activateAnchor()"); return; }
    
    if (tt) {
        //console.log("tooltip found", tt);
        $(tt)
            .css("top",$(anc).css("top"))
            .css("top","+=50px")
            .css("left",$(anc).css("left"))
            .css("left","+=50px")
            .fadeIn("fast");
    }
	
    anc.setAttribute("data-hoverOn","");
    anc.removeAttribute("data-hoverOff");
}

AnchorPoints.deactivateAnchor = function() {

	var anc, ancId, ttId;

	if ( $(this).hasClass('anchorpoint') ) 
		anc = this;
	
	else if ( $(this).hasClass('tooltip') )
		anc = document.getElementById ( $(this).attr("id").substring( $(this).attr("id").indexOf('_')+1 ) );
		
	else { alert("Wrongful invocation of deactivateAnchor()"); return; }
	
	ancId = '#' + $(anc).attr('id');
	ttId = '#tooltip_' + $(anc).attr('id');
		
    setTimeout( function() { 
	
		//console.log(ancId,ttId);
        // If mouse is not over element or its tooltip
        if ($(ancId +':hover').length == 0 && $(ttId +':hover').length == 0) {

            anc.removeAttribute("data-hoverOn");
            anc.setAttribute("data-hoverOff","");

            $(ttId).fadeOut('fast');
        }

    }, 300);
}