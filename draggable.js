const ignoreDrag = ['Port'];



//Make all draggable elements work.
var draggableItems = Array.from(document.querySelectorAll('.DraggableItem'));
console.log(`There are ${draggableItems.length} draggable items.`);

//Loop over each draggable item and add the listeners
for (var i = 0; i < draggableItems.length; i++) {
	var element = draggableItems[i];
	dragElement(element);
}

function dragElement(ele) {
	//Listen for whenever the element is clicked
	ele.addEventListener('mousedown', dragMouseDown);

	//vars to hold the listeners after the mouse
	var mouseMoveListener;
	var mouseUpListener;

	//Save the mouse offset on the element, so it will not snap to top left corner when starting to drag
	var offsetX = 0, offsetY = 0;

	//Save the original position
	var initialLeft = 0, initialTop = 0;

	function dragMouseDown(e) {
		if (isOverIgnoreElement(e)) return;
		//Set the initial
		initialTop = ele.style.top;
		initialLeft = ele.style.left;
		//Set the offsets
		offsetX = e.offsetX;
		offsetY = e.offsetY;
		//Add the listeners
		mouseMoveListener = window.addEventListener('mousemove', elementDrag);
		mouseUpListener = window.addEventListener('mouseup', dragMouseUp);
	}
	function dragMouseUp(e) {
		if (isOverPlaceElement(e)) {
			console.log(`Dropped on correct element`);

		} else {
			console.log('Refused to drop on unacceptable element');
			//put back to original position
			ele.style.left = initialLeft;
			ele.style.top = initialTop;
		}
		//remove the listeners, which stops teh element from following the mouse
		mouseMoveListener = window.removeEventListener('mousemove', elementDrag);
		mouseUpListener = window.removeEventListener('mouseup', dragMouseUp);
	}
	function elementDrag(e) {
		//move the element
		ele.style.left = (e.clientX - offsetX) + 'px';
		ele.style.top = (e.clientY - offsetY) + 'px';
	}
	function isOverPlaceElement(e) {
		var x = e.clientX;
		var y = e.clientY;
		var hoverElements = document.elementsFromPoint(x, y);

		for (var i = 0; i < hoverElements.length; i++) {
			if (hoverElements[i].classList.contains(ele.dataset.placein)) {
				return true;
			}
		}
		return false;
	}
	function isOverIgnoreElement(e) {
		var x = e.clientX;
		var y = e.clientY;
		var hoverElements = document.elementsFromPoint(x, y);

		for (var i = 0; i < hoverElements.length; i++) {
			for (var j = 0; j < ignoreDrag.length; j++) {
				if (hoverElements[i].classList.contains(ignoreDrag[j])) {
					return true;
				}
			}
		}
		return false;
	}
}