if (AnchorPoints === undefined)
    var AnchorPoints = {};

var Timer = {
    
    timers: {},
    
    getPassedTime: function(id) {

        var date = new Date(); // Current date in milliseconds

        if (this.timers[id] === undefined)
        {
            this.timers[id] = date.getTime();
            return 0;
        }

        var newtime = date.getTime();

        // Passed time (in seconds) from last run of function
        var timePass = (newtime - this.timers[id]) * 0.001;
        this.timers[id] = newtime;

        return timePass;
    }
}

// Array of anchor drawing functions
AnchorPoints.drawTypes = [

    // Type 0
    function() {},

    // Type 1
    function(canvas,passedTime) 
    {		
        // Do nothing if no need to
        if (passedTime !== 0 && !canvas.hasAttribute("data-hoverOn") && !canvas.hasAttribute("data-hoverOff")) 
            return;

        var aniMax = 10,
            speed = 40;

        // Loop animation
        animateAnchor.call(canvas, speed * passedTime, aniMax);

        // Redraw
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 4;
        ctx.strokeStyle = ctx.fillStyle = canvas.style.color;

        var aniProgress = Number( $(canvas).attr("data-animation") ),
            x = canvas.width/2,
            y = canvas.height/2,
            radius = (canvas.width - aniMax + aniProgress)/2 - 2;

        //console.log("animating... ", aniProgress, x,y,radius);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // OUTER CIRCLE
        ctx.beginPath();
        //.arc param: x-center,y-center,radius,start angl(rad),end angl(rad),counterclckws=false
        ctx.arc( x, y, radius, 0, 2*Math.PI );
        ctx.stroke();

        // INNER FILLED CIRCLE
        radius = (canvas.width - aniMax)/2 - 2;
        ctx.beginPath();
        ctx.arc( x, y, radius, 0, 2*Math.PI );
        ctx.fill();
    }
];

var requestAnimationFrame =  
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
        return setTimeout(callback, 1);
    };

function animate() {

    var pTime = Timer.getPassedTime("anch");

    $( ".anchorpoint" ).each(function( index ) {
        
        if ($(this).attr("data-anchortype"))
            AnchorPoints.drawTypes[ $(this).attr("data-anchortype") ](this, pTime);
    });

    requestAnimationFrame(animate);
}

function animateAnchor(progress, aniMax)
{
    var hoverOn =  	  this.hasAttribute("data-hoverOn"),
        hoverOff = 	  this.hasAttribute("data-hoverOff"),
        aniProgress = Number(this.getAttribute("data-animation"));

    if (hoverOn === true) {
        aniProgress += progress;

        if (aniProgress >= aniMax) {
            aniProgress = aniMax;
            hoverOn = false;
        }
    }
    else {
        aniProgress -= progress;

        if (aniProgress <= 0) {
            aniProgress = 0;
            hoverOff = false;
        }
    }

    if (hoverOn)
        this.setAttribute("data-hoverOn","");
    else
        this.removeAttribute("data-hoverOn");

    if (hoverOff)
        this.setAttribute("data-hoverOff","");
    else
        this.removeAttribute("data-hoverOff");

    this.setAttribute("data-animation",aniProgress);
}
