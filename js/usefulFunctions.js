const theHead = document.getElementById('head');

//useful functions ================================================
String.prototype.isEmpty = function(){
	return (this.length === 0 || !this.trim());
};
function addClass(element, theClass){
	if(!element.classList.contains(theClass)) element.classList.add(theClass);
}
function addClasses(element, classes){
	for (x in classes){
		if(!element.classList.contains(classes[x])) element.classList.add(classes[x]);
	}
}
HTMLElement.prototype.addClass = function(theClass){
	if(!this.classList.contains(theClass)) this.classList.add(theClass);
};
HTMLElement.prototype.addClasses = function(classes){
	for (x in classes){
		if(!this.classList.contains(classes[x])) this.classList.add(classes[x]);
	}
};
HTMLElement.prototype.switchClass = function(adding, removing){
	if(this.classList.contains(removing)) this.classList.remove(removing);
	if(this.classList.contains(adding)) this.classList.remove(adding);
	this.addClass(adding);
};
HTMLElement.prototype.removeClass = function(theClass){
	if(this.classList.contains(theClass)) this.classList.remove(theClass);
};
function switchClass(element, adding, removing){
	if(element.classList.contains(removing)) element.classList.remove(removing);
	if(element.classList.contains(adding)) element.classList.remove(adding);
	addClass(element, adding);
}
function removeClass(element, theClass){
	if(element.classList.contains(theClass)) element.classList.remove(theClass);
}
function htmlElement(type, id, innerHTML){
	var theElement = document.createElement(type);
	if(typeof id !== "undefined") theElement.id = id;
	if(typeof innerHTML !== "undefined") theElement.innerHTML = innerHTML;
	return theElement;
}
function addStylesheet(sheetName){
	var link = htmlElement('link');
	link.rel = "stylesheet";
	link.href = "../css/"+sheetName+".css";
	theHead.appendChild(link);
}
//=================================================================