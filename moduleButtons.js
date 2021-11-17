var MakeModuleParent = document.querySelector('.MakeModuleParent');
//create the groups
var groups = {};

for (var codecName in codecs) {

	var groupName = codecs[codecName].meta.group;
	//dont make button for codecs of group: 'static'
	if (groupName == 'static') { continue; }
	//check if the group its in exists, if not, make a new group
	if (groups[groupName] == null) {
		//make the header
		var h3 = document.createElement('div');
		h3.innerText = groupName + ':';
		MakeModuleParent.appendChild(h3);

		//put as group
		groups[groupName] = h3;
	}


	button = document.createElement('button');
	button.classList.add('Side');
	button.setAttribute('codec', codecName);
	//styling

	//click listener
	button.addEventListener('click', (e) => {
		console.log(e.target);
		new Module(e.target.getAttribute('codec'));
	})
	button.innerText = codecName;

	MakeModuleParent.insertBefore(button, groups[groupName].nextSibling);
}