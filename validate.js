/* 
 * validate.JS
 * 
 * Copyright (c) 2014 Naukri.com (http://www.naukri.com)
 * Licensed under the MIT.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version v8
 * @Author : Tarunjeet Saini
 */


commonValidator = function(){
	var prv = {
		validate : function(params){
			var c=prv;
			c.befSbt = params.beforeSubmit || null;
			c.disSbt = params.disableSubmit || null;
			c.lastErr=null;
			c.isVld=null;
			c.erArry={};
			c.noVld=false;
			c.errs=params.errors || commonErrList;
			c.cFocus=params.clearOnFocus || false;
			c.eFocus=(params.focusOnError!==false)?true:false;
			var inlineErr=(params.inlineErrors!==false)?true:false;
			if(params.messageBox){var mBoxId=params.messageBox.id || null, mBoxCnt=params.messageBox.content || null, mBoxHid=params.messageBox.hideOthers || false;}
			else{var mBoxId,mBoxCnt=null;}
			if(params.styles){
				var errClass=params.styles.errorClass || null,
					okClass=params.styles.okClass || null,
					sOkClass=params.styles.softMandClass || null;
				
					parentExist=params.styles.parentObjectClass||null;
					parentLevel=params.styles.maxLevel||1;
			}
			else{var errClass='err', okClass='ok', sOkClass='softMand',parentExist=null,parentLevel=1;}
			var fNames=params.formNames || null, dEvts=params.defaultEvents || null;
			var sBts=params.submitButton || null;
			var delay=params.fireDelay || 0;
			if(fNames.constructor===Array){for(var x=0;x<fNames.length;x++){c.validInit(fNames[x],sBts,errClass,okClass,sOkClass,parentExist,parentLevel,mBoxId,mBoxCnt,mBoxHid,inlineErr,dEvts,delay);}}
			else{c.validInit(fNames,sBts,errClass,okClass,sOkClass,parentExist,parentLevel,mBoxId,mBoxCnt,mBoxHid,inlineErr,dEvts,delay);}
	},
			
		validInit : function(fN,sB,eC,oC,soC,pE,pL,mBoxId,mBoxCnt,mBH,inErr,dEvts,delay){
			var c=prv,z,frmElm=$('form[name='+fN+']').get(0), sBtns, rStat, noVldSt=false, sbtFlg;
			if(!frmElm){var e = new Error(fN);e.name = "CommonValidator Form";throw e;}
			c.fName = fN;
			c[fN] = {pExist:pE,pLevel:pL};
			/*if(!c.supportPlaceholder()){
				c.setDefaultValues(frmElm);
			}*/
			c.checkEvents(frmElm,eC,oC,soC,inErr,dEvts);
			if(sB){
				sBtns=c.getSbtBtns($(frmElm),sB);
				for(z=0;z<sBtns.length;z++){
					if(sBtns[z].attr('type')!='submit'){
						if(sBtns[z].attr('rel')!='' && sBtns[z].attr('rel')=='noValidate'){
							sBtns[z].on('click',function(){
								c.noVld=true;
								$(frmElm).submit();
							});
						}
						else{
							sBtns[z].on('click',function(){
							setTimeout(function(){
								c.isVld=c.checkSubmit(frmElm,sB,eC,oC,soC,mBoxId,mBoxCnt,mBH,inErr);
							},parseInt(delay));
						});
					}
			}}}
			$(frmElm).submit(function(){
				if(parseInt(delay)===0){
					(c.noVld)?rStat=true:rStat=c.checkSubmit(frmElm,sB,eC,oC,soC,mBoxId,mBoxCnt,mBH,inErr);
					if(c.befSbt){c.befSbt()}
					return (c.disSbt)? false : rStat;
				}
				else{
					setTimeout(function(){
						(c.noVld)?rStat=true:rStat=c.checkSubmit(frmElm,sB,eC,oC,soC,mBoxId,mBoxCnt,mBH,inErr);
						if(c.befSbt){c.befSbt()}
						if(!c.disSbt && rStat){
							c.sanitizeDefaultValues(frmElm);
							$(frmElm).get(0).submit();
						}
					},parseInt(delay));
					return false;
				}
			});
		},
		
		setDefaultValues : function(fElm){
			var c=prv,obj=(fElm)?$(fElm):$('form[name='+c.fName+']'),x,fEls=c.getFrmElms($(obj),true);
			for(x=0;x<fEls.length;x++){
				if(fEls[x].val()=='' || fEls[x].val()==fEls[x].attr('placeholder')){
					fEls[x].val(fEls[x].attr('placeholder'));
					fEls[x].css({'color':'#a9a9a9'});
				}				
				fEls[x].on('focus blur',function(event){
					defTextFocus(event,$(this));
				});
			}
			var defTextFocus=function(e,obj){
				if(obj.val()==obj.attr('placeholder') && e.type=='focus'){
					obj.val('');obj.css({'color':''});
				}
				else if((obj.val()=='' || obj.val()==obj.attr('placeholder')) && e.type=='blur'){
					obj.val(obj.attr('placeholder'));
					obj.css({'color':'#a9a9a9'});
				}
			};
		},
		
		sanitizeDefaultValues : function(fElm){
			var c=prv, obj=(fElm)?$(fElm):$('form[name='+c.fName+']'),x,fEls=c.getFrmElms($(obj),true);
			for(x=0;x<fEls.length;x++){
				if(fEls[x].val()==fEls[x].attr('placeholder')){
					fEls[x].val('');
				}
			}
		},
		
		checkEvents : function(fElm,eC,oC,soC,inErr,dEvts){
			var c=prv,x,y,evts=null, fEls=c.getFrmElms($(fElm),false);
			for(x=0;x<fEls.length;x++){
				var valids=fEls[x].attr('rel').split('|')[0];
				if(fEls[x].attr('rel').split('|')[1] || dEvts){
					if(dEvts){
						(dEvts.constructor===Array) ? '' : dEvts=new Array(dEvts);
					}
					evts = (fEls[x].attr('rel').split('|')[1]) ? fEls[x].attr('rel').split('|')[1].split(',') : dEvts;
					if(evts){
						for(y=0;y<evts.length;y++){
							fEls[x].on(evts[y],function(vlds,obj,frm,eCp,oCp,soCp){
								return function(e){
									c.checkValids(vlds,obj,e,frm,eCp,oCp,soCp,inErr);
								};
							}(valids,fEls[x],fElm,eC,oC,soC));
						}
					}
				}
				if(c.cFocus){
					fEls[x].on('focus',function(vlds,obj,frm,eCp,oCp,soCp){
						return function(e){
							c.clearError(e,vlds,obj,frm,eCp,oCp,soCp,true);
						};
						}(valids,fEls[x],fElm,eC,oC,soC)
					);
				}
			}
		},
		
		checkSubmit : function(fElm,sB,eC,oC,soC,mBoxId,mBoxCnt,mBH,inErr){
				var c=prv,s,x,vlds,cV,chkVld=false,sbtCallB,fEls=c.getFrmElms($(fElm),false),sBtns=c.getSbtBtns($(fElm),sB);
				(mBH) ? $('.mgBox').hide() : '';
				$(fElm).attr('chk',false);
				c.erArry={};
				for(s=0;s<sBtns.length;s++){
					if(sBtns[s].attr('rel')!='' && $.trim(sBtns[s].attr('rel')).length && sBtns[s].attr('rel')!='noValidate'){
						sbtCallB = 'custom:'+sBtns[s].attr('rel').split('|')[0];
						cV = c.checkValids(sbtCallB,sBtns[s],'submit',fElm,eC,oC,soC,inErr);
						if(!chkVld){
							if(!cV){
								chkVld = true;
							}
						}
					}
				}
				for(x=fEls.length-1;x>=0;x--){
					vlds=fEls[x].attr('rel').split('|')[0];
						cV=c.checkValids(vlds,fEls[x],'submit',fElm,eC,oC,soC,inErr);
					if(!chkVld){if(!cV){chkVld=true}}
				}
				if(c.lastErr && $(fElm).attr('chk')=='true'){
					if(mBoxId){
						($('#'+mBoxId+'_cMsgCnt'))?$('#'+mBoxId+'_cMsgCnt').remove():'';
						if(mBoxCnt){
							var y,cVeR=[], msgDiv=$('<div>');
							msgDiv.attr('id',mBoxId+'_cMsgCnt');							
							for(y in c.erArry){cVeR.push(c.erArry[y]);}
							if(mBoxCnt.customContent){
								var cstMsg=mBoxCnt.customContent, cP=$('<p>');
								cP.html(cstMsg);
								msgDiv.append(cP);
							}
							if(mBoxCnt.errorMessages){
								var x,ul=$('<ul>');
								for(x=cVeR.length-1;x>=0;x--){
									var li=$('<li>');
									li.html(cVeR[x]);
									ul.append(li);
								}msgDiv.append(ul);
							}
							if(mBoxCnt.errorCount){
								var cntMsg=mBoxCnt.errorCount, p=$('<p>');
								if(cntMsg!=true){
																cntMsg = cntMsg.replace('[errCount]',cVeR.length);
															}
															else{
																cntMsg = 'Total '+cVeR.length+ ' errors found in the form.';
															}
								p.html(cntMsg);
								msgDiv.append(p);
							}$('#'+mBoxId).append(msgDiv);
						}
											$('#'+mBoxId).show();
					}
					if(c.eFocus){(c.lastErr.obj)?$(c.lastErr.objCont).focus():c.lastErr.focus();}
				}
				else{
								(mBoxId) ? $('#'+mBoxId).hide() : '';
							}
			return !chkVld;
		},
		
		clearError : function(e,vlds,obj,fElm,eC,oC,soC){
			var c=prv,x,vds=vlds.split(','), vCode='';
			for(x=0;x<vds.length;x++){
				vCode=c.errs[vds[x].split(':')[1]] || vds[x].split(':')[1];
				if(vCode.constructor === Function){vCode=vCode();}
				c.heighlightErrOk(vCode,obj,fElm,'rem',eC,oC,soC);
			}
		},
		
		isValid : function(id){
			var c=prv,obj=(id)?$('#'+id):$('form[name='+c.fName+']'),x,vlds,cV,chkVld=false;
			if(obj.get(0).nodeName.toLowerCase()=='form'){
				var fEls=c.getFrmElms(obj,false);
				for(x=fEls.length-1;x>=0;x--){				
					if(fEls[x].attr('type')!='button'&&fEls[x].attr('type')!='submit'&&fEls[x].attr('rel')!=''&&fEls[x].attr('rel').split('|')[0].indexOf('softReq')<0){					
						vlds=fEls[x].attr('rel').split('|')[0];
						if(!chkVld){
												if(c.checkValids(vlds,fEls[x])){chkVld=true;}
											}
				}}return !chkVld;
			}
			else{
				if(obj.attr('rel')!=''){
					var vldds=obj.attr('rel').split('|')[0];
					return !c.checkValids(vldds,obj);
				}
			}
		},
		
		isValidSrv : function(params){
			var c=prv,cV = c.validators;
			
			c.errs = params.custom || {};		
			c.errs.__proto__ = commonErrList;	
			
			function checkValid(typ,val,dVal,dSel,mnL,mxL,mnV,mxV,s,cst,fCod){
				switch (typ){
					case "required": {
						return cV.reqChk(val,fCod);
						break;
					}
					
					case "alphaDS": {
						return cV.alphadsChk(val,fCod);
						break;
					}
					
					case "alpha": {
						return cV.alphaChk(val,fCod);
						break;
					}
					
					case "num": {
						return cV.numChk(val,fCod);
						break;
					}
					
					case "float": {
						return cV.floatChk(val,fCod);
						break;
					}
					
					case "alphanum": {
						return cV.alphanumChk(val,fCod);
						break;
					}
					
					case "email": {
						return cV.emailChk(val,fCod);
						break;
					}
					
					case "specialChar": {
						return cV.splChk(val,fCod);
						break;
					}
					
					case "charRange": {
						return cV.rangeChk(val,mnL,mxL,s);
						break;
					}
					
					case "valRange": {
						return cV.rangeVChk(val,mnV,mxV,s);
						break;
					}
					
					case "checked": {
						return cV.checkedChkSrv(val);
						break;
					}
					
					case "selected": {
						return cV.selectedChkSrv(val,dSel);
						break;
					}
					
					case "custom": {
						var obj = c.errs[fCod];	
						fn = this[obj['func']];
						var value = fn.apply(this,obj['fields']);
						if(typeof value == 'object' && value.msg==false)
							value = '';
						return value;
					}
					
				}
			}
			var fName=params.name,val=params.val||'',cust=params.custom||null,
				vSts = "",
				o=arr[fName],
				rel=o.rel.split(','),
				dVal=o.defVal||null,
				dSel=o.defSelected||"-1",
				mnL=o.minL||null,
				mxL=o.maxL||null,
				mnV=o.minV||null,
				mxV=o.maxV||null,
				scp=o.scope||"in",
				i=0;
			while(i<rel.length){
				if(checkValid(rel[i].split(':')[0],val,dVal,dSel,mnL,mxL,mnV,mxV,scp,cust,rel[i].split(':')[1])){
					vSts+=fName+":"+rel[i].split(':')[0]+">"+rel[i].split(':')[1]+">";
					if(rel[i].split(':')[0]!="custom"){
						var erMsg = (c.errs[rel[i].split(':')[1]].msg) ? c.errs[rel[i].split(':')[1]].msg : c.errs[rel[i].split(':')[1]];
						vSts+=erMsg.replace('[currVal]',val).replace('[MinL]',mnL).replace('[MaxL]',mxL).replace('[MinV]',mnV).replace('[MaxV]',mxV);
					}
					else{
						vSts+=checkValid("custom",val,"","","","","","","",cust,rel[i].split(':')[1]);
					}
					i=rel.length+1;
					vSts+=",";
				}
				else{i++;}
			}
			vSts+=";";
			if(vSts.lastIndexOf(';')==0)
				vSts = '';
			return vSts;
		},
		
		checkValids : function(vlds,obj,e,fElm,eC,oC,soC,inErr){
			var c=prv,argChk=false,evtChk=0,argSts=false,obVal,sReq=false;
			if(arguments.length==2){argChk=true;evtChk=1;}
			else{if(e.keyCode!=9&&e.keyCode!=16&&e.keyCode!=17&&e.keyCode!=18&&e.keyCode!=35&&e.keyCode!=36&&e.keyCode!=27&&e.keyCode!=20&&e.keyCode!=13){evtChk=1}}
			if(evtChk==1){
				var x,vRet=false, vCode='', vds=vlds.split(',');
				for(x=0;x<vds.length;x++){if(!vRet){
						switch (vds[x].split(':')[0]){
							case 'softReq' :
								(obj.attr('placeholder') && obj.val()==obj.attr('placeholder'))?obVal='':obVal=obj.val();
								if(argChk){(argSts) ? '' : argSts=c.validators.reqChk(obVal,vds[x].split(':')[1]);}
								else{								
									vRet=c.validators.reqChk(obVal,vds[x].split(':')[1]);
									vCode=vds[x].split(':')[1];
									(vRet)?sReq=true:sReq=false;
								}
								break;
	
							case 'required' :
								(obj.attr('placeholder') && obj.val()==obj.attr('placeholder'))?obVal='':obVal=obj.val();
								if(argChk){(argSts) ? '' : argSts=c.validators.reqChk(obVal,vds[x].split(':')[1]);}
								else{
									vRet=c.validators.reqChk(obVal,vds[x].split(':')[1]);
									vCode=vds[x].split(':')[1];
								}
								break;
	
							case 'alphaDS' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
									if(argChk){(argSts) ? '' : argSts=c.validators.alphadsChk(obj.val(),vds[x].split(':')[1]);}
									else{
										vRet=c.validators.alphadsChk(obj.val(),vds[x].split(':')[1]);
										vCode=vds[x].split(':')[1];
									}}
								break;
	
							case 'alpha' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false}
								else{
								if(argChk){(argSts)?'':argSts=c.validators.alphaChk(obj.val(),vds[x].split(':')[1]);}
								else{
									vRet=c.validators.alphaChk(obj.val(),vds[x].split(':')[1]);
									vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'num' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
									if(argChk){(argSts)?'':argSts=c.validators.numChk(obj.val(),vds[x].split(':')[1]);}
									else{
										vRet=c.validators.numChk(obj.val(),vds[x].split(':')[1]);
										vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'float' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
								if(argChk){(argSts)?'':argSts=c.validators.floatChk(obj.val(),vds[x].split(':')[1]);}
								else{
									vRet=c.validators.floatChk(obj.val(),vds[x].split(':')[1]);
									vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'alphanum' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
								if(argChk){(argSts)?'':argSts=c.validators.alphanumChk(obj.val(),vds[x].split(':')[1]);}
								else{
									vRet=c.validators.alphanumChk(obj.val(),vds[x].split(':')[1]);
									vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'email' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
								if(argChk){(argSts)?'':argSts=c.validators.emailChk(obj.val(),vds[x].split(':')[1]);}
								else{
									vRet=c.validators.emailChk(obj.val(),vds[x].split(':')[1]);
									vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'specialChar' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
								if(argChk){(argSts)?'':argSts=c.validators.splChk(obj.val(),vds[x].split(':')[1]);}
								else{
									vRet=c.validators.splChk(obj.val(),vds[x].split(':')[1]);
									vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'charRange' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
								var o=obj, minL=(o.attr('minL'))?o.attr('minL'):o.attr('minlength'), maxL=(o.attr('maxL'))?o.attr('maxL'):o.attr('maxlength'), scop='';
															(!o.attr('scope') || o.attr('scope')=='')?scop='in':scop=o.attr('scope');
								if(argChk){(argSts)?'':argSts=c.validators.rangeChk(o.val(),minL,maxL,scop);}
								else{
									vRet=c.validators.rangeChk(o.val(),minL,maxL,scop);
									vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'valRange' :
								if(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')){vRet=false;}
								else{
								var o=obj, minV=(o.attr('minval'))?parseFloat(o.attr('minval')):parseFloat(o.attr('minV')), maxV=(o.attr('maxval'))?parseFloat(o.attr('maxval')):parseFloat(o.attr('maxV')), scop='';
								(!o.attr('scope') || o.attr('scope')=='')?scop='in':scop=o.attr('scope');
								if(argChk){(argSts)?'':argSts=c.validators.rangeVChk(o.val(),minV,maxV,scop);}
								else{
									vRet=c.validators.rangeVChk(o.val(),minV,maxV,scop);
									vCode=vds[x].split(':')[1];
								}}
								break;
	
							case 'checked' :
								if(argChk){
									if(obj.attr('type')=='checkbox'){
										var fElm,fPar=obj;
										while(fPar.get(0).nodeName.toLowerCase()!='form'){fPar=fPar.parent();}
										(argSts)?'':argSts=c.validators.checkedChk(obj,fPar.get(0));
									}
									else if(obj.attr('type')=='radio'){
										var fElm,fPar=obj;
										while(fPar.get(0).nodeName.toLowerCase()!='form'){fPar=fPar.parent();}
										(argSts)?'':argSts=c.validators.checkedRadChk(obj,fPar.get(0));
									}
								}
								else{
									if(obj.attr('type')=='checkbox'){vRet=c.validators.checkedChk(obj,fElm);}
									else if(obj.attr('type')=='radio'){vRet=c.validators.checkedRadChk(obj,fElm);}
									vCode=vds[x].split(':')[1];
								}
								break;
								
							case 'selected' :
								if(argChk){(argSts)?'':argSts=c.validators.selectedChk(obj);}
								else{
									vRet=c.validators.selectedChk(obj);
									vCode=vds[x].split(':')[1];
								}
								break;
	
							case 'custom' :
									(obj.attr('placeholder') && obj.val()==obj.attr('placeholder')) ? obVal='' : obVal=obj.val();
								if(argChk){
									var fnc = c.errs[vds[x].split(':')[1]],vR=fnc(obj,true);
									(vR.constructor===Object)?vR=vR.msg:'';
									(vR)?vR=true:vR;
									(argSts)?'':argSts=vR;
								}
								else if(c.errs[vds[x].split(':')[1]]){
																var fnc = c.errs[vds[x].split(':')[1]], vR=fnc(obj);
															}
								(vR&&vR.constructor===Object)?vRet=vR.msg:vRet=vR;
								vCode=vR;
								break;
								
							default :{break;}
				}}}
				if(argChk){return argSts;}
				else{
					if(vRet && !sReq){c.heighlightErrOk(vCode,obj,fElm,'err',eC,oC,soC,inErr);c.lastErr=obj;return false;}
					if(vRet && sReq){c.heighlightErrOk(vCode,obj,fElm,'sMnd',eC,oC,soC,inErr);c.lastErr=c.lastErr;return true;}
					else{c.heighlightErrOk(vCode,obj,fElm,'ok',eC,oC,soC,inErr);return true;}
				}
		}},
		
		heighlightErrOk : function(vCode,obj,fElm,hTyp,eC,oC,soC,inErr){
			var c=prv,x,errLbl=null, errM=c.errs[vCode] || vCode, errI=obj.attr('id')+'_err', errN=obj.attr('name')+'_err', frLbs=$(fElm).find('.erLbl'), eArrIndx=obj.attr('id') || obj.attr('name'),errF=null,fN=$(fElm).attr('name');
			
			if(vCode&&vCode.constructor === Object && !c.errs[vCode]){
				errM=vCode.msg;
				(vCode.id) ? errI=errN=vCode.id : '';
				(vCode.errorField) ? errF=vCode.errorField : '';
			}
			if(errM&&errM.constructor===Object){
				var eM = errM;
				errM = eM.msg;
				(eM.id) ? errI=errN=eM.id : '';
				(eM.errorField) ? errF=eM.errorField : '';
			}
			for(x=0;x<frLbs.length;x++){
				if(frLbs.eq(x).attr('id')==errI || frLbs.eq(x).attr('id')==errN){
					errLbl=frLbs.eq(x);
				}
			}
			
			var parent=null,i;
			if(c[fN].pExist){
			for(i=0;i<c[fN].pLevel;i++){
				if(obj.parents().eq(i).hasClass(c[fN].pExist)){
					parent=obj.parents().eq(i);
					break;
					}
				}
			}	
		
			if(hTyp=='err'){
				
				if(parent&&parent.length>0){
					parent.removeClass(eC+" "+oC+" "+soC).addClass(eC);
				}
				else{
				
					if(errF){
						var eF=$(fElm).find(errF);
						eF.removeClass(eC+" "+oC+" "+soC).addClass(eC);
					}
					else{
						obj.removeClass(eC+" "+oC+" "+soC).addClass(eC);
					}
					
					if(errLbl){
						errLbl.removeClass(oC+" "+soC);
						(!errLbl.hasClass(eC) && inErr)?errLbl.addClass(eC):'';
					}
				}
				if(errLbl){
					var minL=obj.attr('minL') || obj.attr('minlength'), maxL=obj.attr('maxL') || obj.attr('maxlength'), minV=obj.attr('minV') || obj.attr('minval'), maxV=obj.attr('maxV') || obj.attr('maxval'), errLblId=errLbl.attr('id');
					errM=errM.replace('[MinL]',minL).replace('[MaxL]',maxL).replace('[MinV]',minV).replace('[MaxV]',maxV).replace('[currVal]',(obj.val()) ? obj.val().toString().replace('<','&lt;').replace('>','&gt;') : '') ;
					(inErr) ? errLbl.html(errM) : '';
					c.erArry[eArrIndx] = errM;
				}
				
				$(fElm).attr('chk','true');
			}
			
			
			
			else if(hTyp=='ok'){
				if(parent&&parent.length>0){
					parent.removeClass(eC+" "+oC+" "+soC).addClass(oC);
				}	
				else{
					if(errF){
						var eF=$(fElm).find(errF);
						eF.removeClass(eC+" "+oC+" "+soC).addClass(oC);
					}
					else{
						obj.removeClass(eC+" "+oC+" "+soC).addClass(oC);
					}
			}
				if(errLbl){
					errLbl.html('');
					errLbl.removeClass(eC+" "+soC);
				}
			}
			
			else if(hTyp=='sMnd'){
				if(parent&&parent.length>0){
					parent.removeClass(eC+" "+oC+" "+soC).addClass(soC);
				}
				else{
					obj.removeClass(eC+" "+oC+" "+soC).addClass(soC);
					if(errLbl){
						errLbl.removeClass(eC+" "+oC);
						(!errLbl.hasClass(soC) && inErr)?errLbl.addClass(soC):'';
					}
				}
				if(errLbl){				
					var minL=obj.attr('minL') || obj.attr('minlength'), maxL=obj.attr('maxL') || obj.attr('maxlength'), minV=obj.attr('minV') || obj.attr('minval'), maxV=obj.attr('maxV') || obj.attr('maxval'),errLblId=errLbl.attr('id');
					errM=errM.toString().replace('[MinL]',minL).replace('[MaxL]',maxL).replace('[MinV]',minV).replace('[MaxV]',maxV).replace('[currVal]',obj.val().replace('<','&lt;').replace('>','&gt;'));
					(inErr)?errLbl.html(errM):'';
					c.erArry[eArrIndx]=errM;
				}
			}
			else if(hTyp=='rem'){
				if(parent&&parent.length>0){
					parent.removeClass(eC+" "+soC);
				}
				else{	
					obj.removeClass(eC+" "+soC);
					if(errLbl){
						errLbl.removeClass(eC+" "+soC);
					}
				}
				if(errLbl){
					errLbl.html('');
				}
			}
		},
			
		validators : {
			reqChk:function(val,vCd){
				var regX=/^\s*$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				return (regX.test(val))?true:false;
			},
			
			alphadsChk:function(val,vCd){
				var regX=/^[a-zA-Z.\s]+$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				if(val!=''){
					val=$.trim(val);
					if(val.indexOf('.')==0){return true;}
					else if(!regX.test(val)){return true;}
					else{return false;}
				}else{return false;}
			},
			
			alphaChk:function(val,vCd){
				var regX=/^[a-zA-Z]+$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				if(val!=''){
								if(!regX.test($.trim(val))){return true;}
								else{return false;}
							}
							else{return false;}
			},
			
			numChk:function(val,vCd){
				var regX=/^[-]?[0-9]+$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				if(val!=''){
								if(!regX.test($.trim(val))){return true;}
								else{return false;}
							}
							else{return false;}
			},
			
			floatChk:function(val,vCd){
				var regX=/^[-]?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				if(val!=''){
								if(!regX.test($.trim(val))){return true;}
								else{return false;}
							}
							else{return false;}
			},
			
			alphanumChk:function(val,vCd){
				var regX=/^[a-zA-Z0-9]+$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				if(val!=''){
								if(!regX.test($.trim(val))){return true;}
								else{return false;}
							}
							else{return false;}
			},
			
			emailChk:function(val,vCd){
				var regX=/^([0-9a-zA-Z]([\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,4})$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				if(val!=''){
								if(!regX.test($.trim(val))){return true;}
								else{return false;}
							}
							else{return false;}
			},
			
			splChk:function(val,vCd){
				var regX=/^[a-zA-Z\d\s]+$/;
				if(prv.errs[vCd]){regX=new RegExp(prv.errs[vCd].regEx || regX);}
				if(val!=''){
								if(!regX.test($.trim(val))){return true;}
								else{return false;}
							}
							else{return false;}
			},
			
			rangeChk:function(val,minL,maxL,scop){
				if(!maxL || maxL==''){maxL=val.length+1;}
				if(val!=''){
					var scop=scop||'in', val = new String(val);
					if(scop=='in'){
										if(val.length<minL || val.length>maxL){return minL+':'+maxL;}
										else{return false;}
									}
					else if(scop=='out'){
										if(val.length>minL){
											if(val.length<maxL){return minL+':'+maxL;}
										}
										else{return false;}
									}
				}else{return false;}
			},
			
			rangeVChk:function(val,minV,maxV,scop){
				if(val!=''){
					var scop=scop||'in';
					if(scop=='in'){
						if(parseFloat($.trim(val))<minV || parseFloat($.trim(val))>maxV){
							return minV+':'+maxV;
						}
						else{
							return false;
						}
					}
					else if(scop=='out'){
						if(parseFloat($.trim(val))>minV){
							if(parseFloat($.trim(val))<maxV){
								return minV+':'+maxV;
							}
						}
						else{
							return false;
						}
					}
				}
				else{
					return false;
				}
			},
			
			checkedRadChk:function(elm,frm){
				var x, f=false, fElm=$(frm).find("input[type=radio]");
				for(x=0;x<fElm.length;x++){
					if(fElm.eq(x).attr('name')==elm.attr('name')){
						(fElm.eq(x).is(':checked')) ? f=true : '';
					}
				}
				return (f) ? ret=false : ret=true;
			},
			
			checkedChk:function(elm,frm){
				var x, f=false, fElm=$(frm).find("input[type=checkbox]");
				for(x=0;x<fElm.length;x++){
					if(fElm.eq(x).attr('name')==elm.attr('name')){
						(fElm.eq(x).is(':checked')) ? f=true : '';
					}
				}
				return (f) ? ret=false : ret=true;
			},
			
			checkedChkSrv:function(val){
				return (val==null || val=="") ? true : false;
			},
					
			selectedChk:function(elm){
				return (elm.get(0).selectedIndex!=0) ? false : true;
			},
			
			selectedChkSrv:function(val,dVal){
				return (val==dVal) ? true : false;
			}
		},
		
		getFrmElms : function(frmElm,fg){
			var x, els=[], fElms=frmElm.get(0).elements;
			for(x=0;x<fElms.length;x++){
				var nodNam = fElms[x].nodeName.toLowerCase();
				if(fg){
					if((nodNam=='input' || nodNam=='select' || nodNam=='textarea') && $(fElms[x]).attr('type')!='submit' && $(fElms[x]).attr('placeholder')!=''){
						els.push($(fElms[x]));
					}
				}
				else{
					if((nodNam=='input' || nodNam=='select' || nodNam=='textarea') && $(fElms[x]).attr('type')!='submit' && $(fElms[x]).attr('rel') && $(fElms[x]).attr('rel')!=''){
						els.push($(fElms[x]));
					}
				}
			}
			return els;
		},
		
		getSbtBtns : function(frmElm,sB){
			var x, y, els=[],sBtns=frmElm.find("input[type=submit], button[type=submit]");
			if(sBtns.length>0){
				els.push(sBtns);
			}
			if(sB){
				if(sB.constructor===Array){
					for(y=0;y<sB.length;y++){
						els.push($('#'+sB[y]));
					}
				}
				else{
					els.push($('#'+sB));
				}
			}
			return els;
		},
		
		hideElement : function(elmIds){
			var c=prv,x,elmIds = elmIds || null;
			if(elmIds){
				if(elmIds.constructor===Array){
					for(x=0;x<elmIds.length;x++){
						c.processAltRel(elmIds[x],'h');
					}
				}
				else{
					c.processAltRel(elmIds,'h');
				}
			}
		},
		
		showElement : function(elmIds){
			var c=prv,x,elmIds = elmIds || null;
			if(elmIds){
				if(elmIds.constructor===Array){
					for(x=0;x<elmIds.length;x++){
						c.processAltRel(elmIds[x],'s');
					}
				}
				else{
					c.processAltRel(elmIds,'s');
				}
			}
		},
		
		processAltRel : function(eId,stat){
			if(stat=='s'){
				$('#'+eId).attr('rel',$('#'+eId).attr('altrel'));
			}
			else if(stat=='h'){
				($('#'+eId).attr('altrel')) ? '' : $('#'+eId).attr('altrel',$('#'+eId).attr('rel'));
				$('#'+eId).removeAttr('rel');
			}
		},
		
		supportPlaceholder : function(){var x = document.createElement('input');return ('placeholder' in x);},
		
		fillVal : function(arr){
			if(arr.constructor===Object){
				for(var x in arr){
					$('#'+x).val(arr[x]).css({'color':''});
				}
			}
		}
	}
	
	return {
			   validate : prv.validate,
			showElement	: prv.showElement,
			hideElement	: prv.hideElement,
				isValid	: prv.isValid,
			checkValids	: prv.checkValids,
				fillVal	: prv.fillVal,
	   setDefaultValues : prv.setDefaultValues,
  sanitizeDefaultValues : prv.sanitizeDefaultValues,
			 isValidSrv : prv.isValidSrv,
			 validators : prv.validators
	}
};