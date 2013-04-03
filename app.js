/*jslint maxerr:1000 */
var my = {
	mod : require('SlowAES/Ti.SlowAES')
};

(function () {
	    
    var win = Ti.UI.createWindow({
        backgroundColor: '#fff', title: 'AES Crypto Example', 
        barColor:'#000',layout:'vertical',fullscreen:false, exitOnClose:true
    });
      
	win.add(Ti.UI.createLabel({
		top:10, height:65, left:5, right:5,color:'#000',
		textAlign:'left',text:'Demonstration on how to use Ti.SlowAES for AES Encryption in JavaScript.', 
		font:{fontSize:14}
	}));

	win.add(Ti.UI.createLabel({
		top:10, height:25, left:5, right:5,color:'#000',
		textAlign:'left',text:'Enter Secret', 
		font:{fontSize:14}
	}));
	
	var txtSecret = Ti.UI.createTextField({
		value:'DoNotTell',hintText:'Enter Secret',
		height:45, left:5, right:5,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED	
	});	
	win.add(txtSecret);

	win.add(Ti.UI.createLabel({
		top:10, height:25, left:5, right:5,color:'#000',
		textAlign:'left',text:'Enter Info to Encrypt', 
		font:{fontSize:14}
	}));
	
	var txtToEncrypt = Ti.UI.createTextField({
		value:'some information we want to encrypt',
		hintText:'Enter information to encrypt',
	 	height:45, left:5, right:5,
	 	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED	
	});	
	win.add(txtToEncrypt);


	var encryptedLabel = Ti.UI.createLabel({
		top:10, height:65, left:5, right:5,color:'#000',
		textAlign:'left',font:{fontSize:14}
	});
	win.add(encryptedLabel);
			
	var btnEncrypt = Ti.UI.createButton({
		title:'Run Encryption Test', top:25, height:45, left:5, right:5	
	});
	win.add(btnEncrypt);
	
	btnEncrypt.addEventListener('click',function(x){
		
		encryptedLabel.text = '';
		
		//Create a new instance of the SlowAES module
		var crypto = new my.mod();
		
		//Demonstrate how to encrypt a value
		var encryptedValue = crypto.encrypt(txtToEncrypt.value,txtSecret.value);
		encryptedLabel.text = 'Encrypted:' + encryptedValue;
		
		//Demonstrate how to decrypt a value already encrypted
		var decryptedValue = crypto.decrypt(encryptedValue,txtSecret.value);
		
		alert((txtToEncrypt.value ===decryptedValue) ? 
				'Encryption Test successfully run, please check console for details.' : 
				'Test failed, please check console for details.');
		
		//The below test can also be run to verify the encryption process		
		crypto.passCryptoTest(txtToEncrypt.value,txtSecret.value);			
	});
	

    win.open({modal:true});
        
})();    
