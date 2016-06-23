var Editor = {};
Editor.selectionOutline = "";
Editor.outlineSaveForSelection = "";

Editor.newData = function(tag,name,faClass,faUnicode,creator,doNotIncludde { from = 0, to = this.length } = {}) {)
{
    this.tag = tag;
	this.name = (name ? name : tag);
	
	var fac = (faClass ? faClass : 'fa-asterisk');
	this.faHTML = '<i class="fa ' + fac + '" aria-hidden="true"></i>';
	
	this.faUnicode = (faUnicode ? faUnicode : '\f060');
    
    this.create = (creator ? creator : function() {
        return document.createElement(tag);
    });
};

// HTML element library
Editor.elemData = {
	
	// REGULAR TAG ELEMENTS
	body: 
        new Editor.newData('body'),
	p: 
        new Editor.newData('p','paragraph','fa-paragraph','\f1dd'),
	div: 
        new Editor.newData('div','container','fa-square-o','\f096'),
	canvas: 
        new Editor.newData('canvas','canvas','fa-pencil-square-o','\f044'),
	
	// CUSTOM ELEMENTS DEFINED BY THEIR CLASS
	anchorpoint: 
        new Editor.newData('canvas','anchorpoint','fa-dot-circle-o','\f192',
        function() {
        
        }),

	// Fetch data for HTML element
	get: function(elem) {
		
		if (elem.classList)
			var c = elem.classList;
		else // For IE9 and older
		{
			alert('shit');
			var c = [];
		}
		
		for (var i=0; i<c.length; i++) {
			if (Editor.elemData[c[i]] !== undefined)
				return Editor.elemData[c[i]];
		}
		
		var tag = elem.tagName.toLowerCase();
		
		if (Editor.elemData[tag]) {
			return Editor.elemData[tag];
		}
		else
			return new Editor.newData(tag);	
	}
};

Object.freeze(Editor.elemData);

Editor.getElementTitle = function(elem, elemData) {

	var title = "";

    if (elem.id !== "") 
        title = '"' + elem.id + '"';
	else 
	{
		if (elemData === undefined)
			elemData = Editor.elemData.get(elem);
        
        title = '&lt;' + elemData.name + '&gt;';
    }
	
    return title;
}

Editor.propGroups = {
    General: 
    {
        width: {
            defValue: '100%',
        },
        height: { 	
            defValue: '100%',
        },
        visibility: {
            defValue: 'visible',
            opt: ['visible','hidden','collapse','inherit']
        },
        color: { 
            defValue: 'inherit' 
        },
        backgroundColor: { 
            defValue: 'inherit' 
        }
    },
Position: {
    position: {
        defValue: 'static',
        opt: ['static','relative','absolute','fixed']
    },
    top: {
        defValue: 'auto' 
    },
    right:{
        defValue: 'auto' 
    },
    bottom: {
        defValue: 'auto' 
    },
    left: {
        defValue: 'auto' 
    }
},
Text: {
    textContent: {
        defValue: '',
        elementAttr: true, // Not a style attribute
        validate: function(elem, property, input)
        {
            console.log(property, input.value);
            
            elem[property] = input.value;

            input.value = elem[property];
        }
    }
}};

Editor.validateCSSinput = function(elem, property, input) 
{
	if (input.value == elem.style[property]) 
		return false;
		
	console.log("property:"+property+" input.value:"+input.value);
	
	var success = false;
    
	var oldValue = elem.style[property];
	$(elem).css(property, input.value);
	var newValue = elem.style[property];
	
	// Property updated so input value is valid
	if (oldValue != newValue)
	{
		success = true;
		console.log("updated!");
	}
	else {
		// Try again with +'px'
		$(elem).css(property, input.value + 'px');
		var newValue = elem.style[property];
		
		if (oldValue != newValue) {
			success = true;
			console.log("updated!");
		}
		else
			console.log("wasn't updated... old value:" + oldValue + " input:" + input.value);
	}
	
	input.value = newValue;
	
	return success;
}