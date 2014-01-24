var save = function(){
	
	if( fnameField.hasText() === false){
		alert("Missing First Name!");
	}else if( lnameField.hasText() === false){
		alert("Missing Last Name!");
	}else if( ageField.hasText() === false){
		alert("Missing Age!");
	}else{
		var f = fnameField.value;
		var l = lnameField.value;
		var a = ageField.value;
		
		db.execute('INSERT INTO user (fname, lname, age) VALUES (?,?,?)', f, l, a);
		
		fnameField.value = "";
		lnameField.value = "";
		ageField.value = "";
		
		fnameField.blur();
		lnameField.blur();
		ageField.blur();
		
		data = getRowData();
		table.setData(data);
		
		alert(f + " " + l +  " Age: " + a + " saved!");
	};
};


exports.data = save;