var myFunc = function (obj){var rtn=false;if(obj.val()<10){rtn='Value can not be less than 10 "[currVal]"'}return {msg:rtn,id:'cst2IErrId'}};
var myFunc1 = function (obj){var rtn=false;if(commonValidator.checkValids('num',obj)){rtn='"[currVal]" is not a numeric value'}return {msg:rtn,id:'cst2IErrId'}};
var commonErrList = {
	1001 : 'Required Field can not be left blank',
	1002 : 'Only alphabets are allowed in Alpha Field',
	1003 : '"[currVal]" is not valid. Only numbers are allowed in Numeric Field',
	1004 : 'Only alphanumerics are allowed in Alphanumeric Field',
	1005 : 'Only alphabets, dots and spaces are allowed. Must start with an alphabet',
	1006 : 'Please enter a valid Email Address',
	1007 : {msg:'Special characters are not allowed',regEx:/^[a-zA-Z\d\s@#]+$/},
	1008 : 'Characters in input field must be between [MinL] &amp; [MaxL]',
	1009 : 'Minimum [MinL] and Maximum [MaxL] characters are allowed in this Textarea',
	1010 : 'Please select an option',
	1011 : 'Please select a radio button',
	1012 : 'Please select the chechbox',
	1013 : 'Custom Field can not be left blank',
	1014 : 'Please enter numeric values only',
	1015 : 'This is a soft mandatory field',
	1016 : {msg:'Custom Numeric Only',id:'cst2IErrId'},
	1017 : {msg:'Custom Field can not be left blank',id:'cst2IErrId'},
	1018 : 'This is a soft mandatory field - 2',
	1019 : 'Integer and Float allowed',
	1020 : 'The value can not be less than [MinV] &amp; greater than [MaxV]',
	2001 : function(){if($('#cst1I').val()<10){return 'Value can not be less than 10'}else{return false}},
	2002 : function(){if($('#cst1I').val()>100){return 'Value can not be greater than 100'}else{return false}},
	2003 : function(){if($('#opt1I')[0].selectedIndex==1){return 'Please select option other than this'}else{return false}},
	2004 : function(){if($('#cst2I').val()<10){return 'Value can not be less than 10'}else{return false}},
	2005 : function(){if($('#cst2I').val()>100){return 'Value  can not be greater than 100'}else{return false}},
	//2006 : function(){if($('#opt2I').currObj().selectedIndex==1){return 'Please select option other than this','cstErrId'}else{return false}},
	2007 : function(){var rtn = false;if($('#opt2I')[0].selectedIndex==1){rtn='Please select option other than this'}return {msg:rtn,id:'cstErrId'}},
	2008 : myFunc1,
	2010 : {regEx:/^[a-zA-Z\d\s]+$/},
	2011 : function(obj){var o=obj[0].options,sOpt=[];for(var x=0;x<o.length;x++){if(o[x].selected){sOpt.push(o[x].value)}}if(sOpt.length>2){return 'Maximum 2 options are allowed'}else{return false}},
	2012 : function(obj){var rtn=false;if(obj.val()==-1){rtn="Custom Message"} return {msg:rtn,id:"optI_err"}},
	3001 : function(obj){
				var rtn=false;
				//if(obj.cInput.val()=='' || obj.cInput.val()==' ' || obj.cInput.val()=='<br>' || obj.cInput.val()=='<br> ')
				if(!obj.checkBlank())
				{rtn="Editor can not be left blank"};
				return rtn;
			},
	3002 : function (obj){var rtn=false;if(obj.val()<10){rtn='Value can not be less than 10 "[currVal]"'}return rtn},
	5001 : function(){console.log("12345");return false}
};