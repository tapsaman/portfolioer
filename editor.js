var Editor = {};
Editor.selection = null;
Editor.selectionOutline = "#55f dashed 2px";
Editor.outlineSaveForSelection = "";

Editor.setSelection = function(elem)
{
	// For previous selection: restore outline and remove class
	$("#ifr").contents().find(".editorselection")
        .css("outline",Editor.outlineSaveForSelection)
        .removeClass("editorselection");
		
	$("#mainNodeList .itemDiv.selected")
		.removeClass("selected");
	
	if (!elem.tagName) {
		// elem is not a DOMElement
		Editor.selection = null;
		EditorWindow.update();
		return false;
	}
	else {
		Editor.selection = elem;
		Editor.outlineSaveForSelection = elem.style.outline;
		elem.style.outline = Editor.selectionOutline;
		elem.class += " selected";
		
		EditorWindow.update();
		return true;
	}
}

Editor.getElementTitle = function(elem, elemData) {

	var title = "";

    if (elem.id !== "") 
        title = '"' + elem.id + '" ';
	else 
	{
		if (elemData === undefined)
			elemData = ElemLib.get(elem);
        
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