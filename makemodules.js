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
		h3.innerText = groupName;
		MakeModuleParent.appendChild(h3);

		//put as group
		groups[groupName] = h3;
	}


	button = document.createElement('button');
	button.setAttribute('codec', codecName);
	//styling
	button.style.display = 'block';
	button.style.width = '90%';
	button.style.margin = '3px auto';

	//click listener
	button.addEventListener('click', (e) => {
		console.log(e.target);
		CreateModule(e.target.getAttribute('codec'));
	})
	button.innerText = codecName;

	MakeModuleParent.insertBefore(button, groups[groupName].nextSibling);
}