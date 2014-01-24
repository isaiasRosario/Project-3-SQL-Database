// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
var funct = require('save');

//database
var db = Titanium.Database.open('users');
db.execute('DELETE FROM user');
db.execute('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, fname TEXT, lname TEXT, age INTEGER)');

var data = getRowData();

var table = Titanium.UI.createTableView({
	data: data,
	editable: false
});

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

// create base UI tab and root window
var win1 = Titanium.UI.createWindow({  
    title:'Enter Information',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Form',
    window:win1
});

var fnameField = Ti.UI.createTextField({
  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  color: '#336699',
  top: 10, 
  width: 250, height: 60,
  hintText:"First Name",
  clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
});
var lnameField = Ti.UI.createTextField({
  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  color: '#336699',
  top: 80, 
  width: 250, height: 60,
  hintText:"Last Name",
  clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
});
var ageField = Ti.UI.createTextField({
  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  color: '#336699',
  top: 150, 
  width: 250, height: 60,
  hintText:"Age",
  clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
  keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD,
  maxLength: 3
});

var btn = Titanium.UI.createButton({
		title: "SAVE",
        color: "white",
        backgroundColor: "blue",
        top: 230,
        width: 250,
        height: 50,
        borderRadius: 5,
        opacity: 0.75,
        font: { fontSize: 20, fontWeight: "semibold" }
});



function getRowData(){
	var newData = [];
	var rows = db.execute('SELECT * FROM user');
	while(rows.isValidRow()){
		var age = rows.fieldByName('age');
		var fname = rows.fieldByName('fname');
		var lname = rows.fieldByName('lname');
		
		newData.push({
			title: fname + " " + lname +  " is Age: " + age,
			age: rows.fieldByName('age'),
			id: rows.fieldByName('id')
		});
		rows.next();
	};
	rows.close();
	return newData;
};

btn.addEventListener("click", funct.data);

win1.add(btn, fnameField, lnameField, ageField);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'SQL Database',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Data',
    window:win2
});

win2.add(table);

var editWin = Titanium.UI.createWindow({  
    title:'Edit User',
    backgroundColor:'#fff'
});

var fnameEdit = Ti.UI.createTextField({
  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  color: '#336699',
  top: 10, 
  width: 250, height: 60,
  hintText:"First Name",
  clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
});
var lnameEdit = Ti.UI.createTextField({
  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  color: '#336699',
  top: 80, 
  width: 250, height: 60,
  hintText:"Last Name",
  clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
});
var ageEdit = Ti.UI.createTextField({
  borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  color: '#336699',
  top: 150, 
  width: 250, height: 60,
  hintText:"Age",
  clearButtonMode: Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
  keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD,
  maxLength: 3
});

var saveBtn = Titanium.UI.createButton({
		title: "SAVE",
        color: "white",
        backgroundColor: "blue",
        top: 230,
        width: 250,
        height: 50,
        borderRadius: 5,
        opacity: 0.75,
        font: { fontSize: 20, fontWeight: "semibold" }
});

var cancelBtn = Titanium.UI.createButton({
		title: "CANCEL",
        color: "white",
        backgroundColor: "blue",
        top: 300,
        width: 250,
        height: 50,
        borderRadius: 5,
        opacity: 0.75,
        font: { fontSize: 20, fontWeight: "semibold" }
});

editWin.add(fnameEdit, lnameEdit, ageEdit, saveBtn, cancelBtn);

var opt = {
	cancel: 2,
	options: ['Edit', 'Delete', 'Cancel'],
	selectedIndex: 2,
	destructive: 1,
	title: 'Delete User?'
};

table.addEventListener('click', function(e){
	var id = e.rowData.id;
	var fname = e.rowData.fname;
	var lname = e.rowData.lname;
	var age = e.rowData.age;
	
	var dialog = Ti.UI.createOptionDialog(opt);
	
	dialog.addEventListener('click', function(e){
		if(e.index === 0){
			fnameEdit.text = fname;
			lnameEdit.text = lname;
			ageEdit.value = age;
			
			editWin.open();
			
			var saveIt = function(){
	
				if( fnameEdit.hasText() === false){
					alert("Missing First Name!");
				}else if( lnameEdit.hasText() === false){
					alert("Missing Last Name!");
				}else if( ageEdit.hasText() === false){
					alert("Missing Age!");
				}else{
					var fname = fnameEdit.value;
					var lname = lnameEdit.value;
					var age = ageEdit.value;
					
					db.execute('UPDATE user SET fname=?, SET lname?, SET age=?, WHERE id=?', fname, lname, age, id);
					
					fnameEdit.value = "";
					lnameEdit.value = "";
					ageEdit.value = "";
					
					fnameEdit.blur();
					lnameEdit.blur();
					ageEdit.blur();
					
					data = getRowData();
					table.setData(data);
					
					saveBtn.removeEventListener('click', saveIt);
					editWin.close();
					
					alert(fname + " " + lname +  " Age: " + age + " updated!");
				}
			};
			saveBtn.addEventListener('click', saveIt);
			
			var cancelIt = function(){
				cancelBtn.removeEventListener('click', cancelIt);
				editWin.close();
			};
			cancelBtn.addEventListener('click', cancelIt);
			editWin.open();
		} else if(e.index === 1){
			db.execute('DELETE FROM user WHERE id=?', id);
			
			data = getRowData();
			table.setData(data);
			
			alert('User Deleted');
		}
	});
	dialog.show();
});



//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2); 


// open tab group
tabGroup.open();
