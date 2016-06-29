var EditorWindow = {};
EditorWindow.selectionData = null;


EditorWindow.update = function(elem)
{
	var e = Editor.selection;
		eData = EditorWindow.selectionData;
		
	if (!e) {
		document.getElementById("edwiHead").innerHTML = "No element selected";
		document.getElementById("edwiInfo").innerHTML = "";
		return false;
	}
	if (!eData)
		EditorWindow.selectionData = eData = ElemLib.get(elem);
	
	document.getElementById("edwiHead").innerHTML = 
		"Edit " + Editor.getElementTitle(e, eData);
	document.getElementById("edwiInfo").innerHTML = 
		eData.faHTML + (e.id !== "" ? "<" + e.Data.name + ">" : "");
	
	$('#editorWindow .tblhead').each(function() {
		
		var propGroup = $(this).attr('data-headOf');
		
		if (eData.propGroups[propGroup]) 
		{
			$(this).css('visibility','');
			
			var open = EditorWindow.settings[ propGroup + '_open' ];
				
			if (open) {
				$(this).next().css('visibility','');
				
				$(this).children('.input').each(function()
				{
					this.value = (elem.style[propName] !== "" ? elem.style[propName] : $(elem).css(prop));
				});
			}
			else
				$(this).next().css('visibility','collapse');
			
			$(this).children().last()
				.html("<i class='fa fa-chevron-"+(open ? "down" : "up")+"' aria-hidden='true'></i>");
		}
	});
	
	return true;
}

EditorWindow.settings = {
	General_open: false,
	Position_open: false,
	Text_open: false
}

EditorWindow.setHandlers = function()
{
    $('#editorWindow').draggable({ handle: "#head", cursor: "move" });
    
	$('#editorWindow').on('click','.tblhead',function() {
                
		var prop_set = $(this).attr('data-headOf');
		
		EditorWindow.settings[ prop_set + '_open' ] = 
			!EditorWindow.settings[ prop_set + '_open' ];
		
		if ( !EditorWindow.settings[ prop_set + '_open' ] ) {
			$(this).next().css('visibility','collapse');
			$(this).children().last()
				.html("<i class='fa fa-chevron-up' aria-hidden='true'></i>");
		}
		else {
			$(this).next().css('visibility','');
			$(this).children().last()
				.html("<i class='fa fa-chevron-down' aria-hidden='true'></i>");   
		}
	});
    
	$('#editorWindow').on('blur','.prop_input',function()
	{
        if (!EditorWindow.settings.Element) {
            alert('no element selected...');
            return;
        }
        
		//alert(this);
        var group = $(this).attr('data-groupName'),
            prop = $(this).attr('name'),
            elem = EditorWindow.settings.Element;
        
        //alert(prop)
        //alert(group);
        /*
        alert(group);
        alert(Editor.propGroups[group]);
        alert(prop);
        alert(Editor.propGroups[group][prop]);*/
        
        
        
        
        if ( Editor.propGroups[group][prop].validate )
            // Run custom validation
            Editor.propGroups[group][prop].validate(elem,prop,this);
        else
            // Run default CSS validation
            Editor.validateCSSinput(elem, prop, this);
        
	});
}

EditorWindow.apply = function(elem)
{
	$('#editorWindow .tblrowgroup').each(function()
	{
		var groupName = this.id;
		
		if (EditorWindow.settings[groupName+'_open']) {
		
			console.log('applying '+groupName);
			
			$('#'+groupName + '.prop_input').each(function()
			{
				var prop = $(this).attr('name');
				
				if ( Editor.propGroups[groupName][prop].validate )
					Editor.propGroups[groupName][prop].validate(elem,prop,this);
				else
					Editor.validateCSSinput(elem, prop, this);
			});
		}
	});
}

EditorWindow.createPropTableHeader = function(groupName) 
{  
	var row = $("<div class='tblhead' data-headOf='" + groupName + "'></div>")
  
	var cell1 = $("<div class='tblcell'>" + groupName + "</div>");
	var cell2 = $("<div class='tblcell' style='text-align: right;'></div>")
		.html("<i class='fa fa-chevron-" 
		+ (EditorWindow.settings[groupName+'_open'] ? "down" : "up")
		+ "' aria-hidden='true'></i>")
	
	return row.append(cell1, cell2);
}

EditorWindow.createPropTableGroup = function(elem, groupName)
{
	var group = $("<div class='tblrowgroup' id='"+ groupName +"'></div>"),
		propList = Editor.propGroups[groupName];
		
	for (var i in propList)/*var i=0; i<propList.length; i++*/
	{
		var prop = propList[i],
            propName = i,
			row = $("<div class='tblrow'></div>"),
			cell1 = $("<div class='tblcell'>"+ i +":</div>"),
			cell2 = $("<div class='tblcell'></div>"),
			row = $("<div class='tblrow'></div>");
			input = null;
		
		if (prop.opt) {
			input = document.createElement("select");

			for (var o=0; o<prop.opt.length; o++) {
				
				var option = document.createElement("option");
				option.value = option.text = prop.opt[o];
				if (option.value === prop.defValue)
					option.style.color = '#777';
				input.add(option);
			}
			
			input.value = (elem.style[propName] !== "" ? elem.style[propName] : $(elem).css(prop));
		}
		else {
			input = document.createElement("input");
			$(input)
				.attr('type','text')
				.attr('value', (prop.elementAttr ? elem[propName] : elem.style[propName]))
				.attr('placeholder', $(elem).css(propName));//prop.defValue);
		}
		
		if (input) {
			$(input).addClass('prop_input')
                    .attr('data-groupName',groupName)
					.attr('name',propName)
					.appendTo( cell2 );
		}
		
		row	.append( cell1, cell2 )
			.appendTo( group );
	}
	
	return group;
}