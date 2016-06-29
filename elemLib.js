var ElemLib = {};

ElemLibItem = function( def )//{tag,name,faClass,faUnicode,creator,noPropGroups} ) //tag,name,faClass,faUnicode, {creator,noPropGroups})
{
    if (!def) { return; }
    
    this.tag  = def.tag;
	this.name = def.name || def.tag;
	
	// If no Font Awesome symbol defined, use question mark
    this.faUnicode = def.faUnicode || '\f29c';
	var fac = def.faClass || 'fa-question-circle';
	this.faHTML = '<i class="fa ' + fac + '" aria-hidden="true"></i>';
    
    // Define prop groups and cancel ones listed in def.noPropGroups
	this.propGroups = {General:true,Position:true,Text:true};
	if (def.noPropGroups) {
		for (var i=0; i < def.noPropGroups.length; i++) {
			if (this.propGroups[def.noPropGroups[i]])
				this.propGroups[def.noPropGroups[i]] = false;
    }	}
    
    // Element initalization function
    if (def.init) 
        this.init = def.init;
    
    this.addTo = def.creator || function(target) 
	{
		if (target.tagName && document.createElement) {
			// target is a DOMElement and document is defined
            var elem = document.createElement(this.tag);
            
            if (this.init)
                this.init(elem);
                
			target.appendChild( elem );
			return true;
		}
		else {
			alert("problem adding "+this+" to "+target);
			return false;
		}
	}
};

// HTML element library
ElemLib = {
	
	// REGULAR TAG ELEMENTS
	body: 
        new ElemLibItem({tag: 'body', faClass: 'fa-object-group', faUnicode: '\f247', noPropGroups: ['General','Position','Text']}),
	p: 
        new ElemLibItem({tag: 'p', name: 'paragraph', faClass: 'fa-paragraph', faUnicode: '\f1dd', init: function(elem) { elem.textContent = "This is a paragraph"; } }),
	div: 
        new ElemLibItem({tag: 'div', name: 'container', faClass: 'fa-square-o', faUnicode: '\f096', noPropGroups: ['Text'],
                        init: function(elem) { elem.style.height = "50px"; elem.style.backgroundColor = "#4f4"; }}),
	canvas: 
        new ElemLibItem({tag: 'canvas', faClass: 'fa-pencil-square-o', faUnicode: '\f044', noPropGroups: ['Text']}),
	
	// CUSTOM ELEMENTS
	anchorpoint: 
        new ElemLibItem({tag: 'canvas', name: 'anchorpoint', faClass: 'fa-dot-circle-o', faUnicode: '\f192', noPropGroups: ['Text'],
			creator:
				function(target) {
					if (target.tagName && document.createElement && AnchorPoints.getNew) {
						
						var a = AnchorPoints.getNew(Math.floor(Math.rand*1000000));
						
						target.appendChild( a.canvas );
						target.appendChild( a.tooltip );
						
						return true;
					}
					else {
						alert("problem adding "+this+" to "+target);
						return false;
					}
				}
            }),

	// Category arrays (for toolbox)
//	categ: {
//		Fields: [ElemLib.div, ElemLib.canvas],
//		Text: [ElemLib.p],
//		Complex: [ElemLib.anchorpoint]
//	},
		
	// Fetch data for HTML element
	get: function(elem) {
		
        //todo: NO CLASS DEFINITONS, CHANGE TO data-elemType for custom element definitions --> simpler & cleaner
		if (elem.classList)
			var c = elem.classList;
		else // For IE9 and older
		{
			alert('shit');
			var c = [];
		}
		
		for (var i=0; i<c.length; i++) {
			if (ElemLib[c[i]] !== undefined)
				return ElemLib[c[i]];
		}
		
		var tag = elem.tagName.toLowerCase();
		
		console.log("tag_"+tag);
		
		if (ElemLib[tag]) {
			return ElemLib[tag];
		}
		else
			return new ElemLibItem({tag: '?' + tag});
	}
};

ElemLib.categ = {
		Fields: [ElemLib.div, ElemLib.canvas],
		Text: [ElemLib.p],
		Complex: [ElemLib.anchorpoint]
	};

Object.freeze(ElemLib);