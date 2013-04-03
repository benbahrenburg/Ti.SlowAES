/*jslint maxerr:1000 */

var DEFAULTS ={
	path:Ti.Filesystem.resourcesDirectory		
};

//Extend an object with the properties from another 
//(thanks Dojo - http://docs.dojocampus.org/dojo/mixin)
function mixin(/*Object*/ target, /*Object*/ source){
	var name, s, i,empty = {};
	for(name in source){
		s = source[name];
		if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
			target[name] = s;
		}
	}
	return target; // Object
};

function merge(inputValue,defaultValue){
	if((inputValue!=undefined) && (inputValue!=null)){
		return inputValue;
	}else{
		return defaultValue;
	}
};

var wrapper = function(options){
	
	var fOpts = mixin(DEFAULTS,options);
	Ti.include(fOpts.path +'SlowAES/jsHash.js');
	Ti.include(fOpts.path +'SlowAES/cryptoHelpers.js');
	Ti.include(fOpts.path +'SlowAES/aes.js');

    var keySizeInBits  = merge(fOpts.keySizeInBits,slowAES.aes.keySize.SIZE_256);
    var keySizeInBytes = merge(fOpts.keySizeInBytes,keySizeInBits/8);
    var mode           = merge(fOpts.mode,slowAES.modeOfOperation.CBC);
    var iv             = merge(fOpts.iv,"1234567890123456");
    var iterations     = merge(fOpts.iterations,2048);

  	 	
  function hexStringToByteArray(s){
    var r = Array(s.length/2);
    for (var i = 0; i < s.length; i+=2) {
        r[i/2] = parseInt(s.substr(i, 2), 16);
    }
    return r;
  };
  function encryptBytes(plainText, key, iv){
    var t = typeof plainText;
    if (t == "string") {
        plainText = hexStringToByteArray(plainText);
    }
    var result = slowAES.encrypt(plainText, slowAES.modeOfOperation.CBC, key, iv);
    return result;
  };
 
  function decryptBytes(encryptedByteArray, key, iv){
    var result = slowAES.decrypt(encryptedByteArray, slowAES.modeOfOperation.CBC, key, iv);
    return result;
  };
   
  function encryptString(plainText, key, iv){
    var bytesToEncrypt = cryptoHelpers.convertStringToByteArray(plainText);
    var encryptedBytes = encryptBytes(bytesToEncrypt, key, iv);
    var encryptedString = cryptoHelpers.convertByteArrayToString(encryptedBytes);
    return encryptedString;
  };
 
  function decryptString(encryptedByteArray, key, iv){
    var bytes = decryptBytes(encryptedByteArray, key, iv);
    var decryptedString = cryptoHelpers.convertByteArrayToString(bytes);
    return decryptedString;
  };
  
  this.generateKey = function(seed,callback){
  	var mypbkdf2 = new PBKDF2(seed, iv, iterations, keySizeInBytes);
  	mypbkdf2.deriveKey(function(){}, callback);
  };
  this.encrypt = function(plainText,secret){
	   var encryptedByteArray = encryptString(plainText, secret, iv);
	   Ti.API.debug('encrypted value: ' + encryptedByteArray);
	   return encryptedByteArray;  	
  };

  this.decrypt = function(encryptedText,secret){
  		var bytes = cryptoHelpers.convertStringToByteArray(encryptedText);
   		var decryptedString = decryptString(bytes, secret, iv);
   		Ti.API.debug('decrypted value: ' + decryptedString);
   		return decryptedString;
  };
  
  this.passCryptoTest = function(plainText, secret){
  		
  		Ti.API.info('plainText=' + plainText);
  		
  		var encryptedValue = this.encrypt(plainText, secret);  		
  		Ti.API.info('encryptedValue=' + encryptedValue);
  		
  		var decryptedValue = this.decrypt(encryptedValue,secret);
  		Ti.API.info('decryptedValue=' + decryptedValue);
  		
  		Ti.API.info('Crypto Test Passed? '  + (plainText === decryptedValue));  		
  		return (plainText === decryptedValue);
  };

};


module.exports = wrapper;


