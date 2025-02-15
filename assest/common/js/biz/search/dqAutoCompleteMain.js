	var dq_formId = "#search";
	var dq_searchTextId = "#query_main";
	
	var dq_resultDivID = "ark";               //자동완성레이어 ID
	var dq_hStartTag = "<font style=\"color:#CD271D;font-weight:bold\">";               //하이라이팅 시작 테그
	var dq_hEndTag = "</font>";                //하이라이팅 끝 테그
	var dq_bgColor = "#f3f3f3";                  //선택빽그라운드색
	var dq_intervalTime = 500;                   //자동완성 입력대기 시간

	var dq_acResult = new Object();              //결과값
	var dq_acLine = 0;                           //자동완성 키워드 선택  위치(순번)
	var dq_searchResultList = "";                //자동완성결과리스트
	var dq_searchKeyword = "";	                 //검색어(한영변환안된)
	var dq_ajaxReqObj = "";                      //ajax request object

	var dq_keyStatus = 1;                        //키상태구분값
	var dq_acuse = 1;                            //자동완성사용여부
	var dq_engFlag = 0;
	var dq_acDisplayFlag = 0;
	var dq_acArrowFlag = 0;
	var dq_acArrowOpenFlag = 0;
	var dq_acFormFlag = 0;
	var dq_acListFlag = 0;
	var dq_browserType = dqc_getBrowserType();
	var dq_keywordBak = "";
	var dq_keywordOld = "";
	
	$(document).ready(function() {
		dq_keywordBak = dq_keywordOld = $(dq_searchTextId).val();
	});
	
	function dq_handleEnter(kind,event)
	{
		var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;

		if (keyCode == 13)
		{
			fn_searchMain();
			return false;
		}
		else
		{
			return true;
		}
	}

	function dq_keywordSearch(keyword)
	{
		$(dq_searchTextId).val(keyword);
		//fn_doSearch();
		go_searchMain();
	}

	//setTextbox
	function dq_setTextbox(flag, ev)
	{
		var _event;
		var key;
		dq_stateChange();

		switch(dq_browserType)
		{
			case 1 : // IE
				_event = window.event;
				key = _event.keyCode;
				break;
			case 2 : // Netscape
				key = ev.which;
				break;
			default :
				key = _event.keyCode;
				break;
		}
		
		if(key == 38 || key == 40){
			dq_keyStatus = 1;
		}else if(dq_keyStatus == 1 && flag && key != 13){
			dq_keyStatus = 2;
		}
				
		//if(dq_keyStatus == 1 && flag && key != 13)
		//dq_keyStatus = 2;		
		
		
		if(dq_browserType == 1)
			dq_acKeywordTextViewIE(_event);
		else if(dq_browserType == 2)
			dq_acKeywordTextViewFF(ev);			
		
	}

	function dq_stateChange()
	{
		$(dq_searchTextId).onclick = dq_acDisplayView;
		$(dq_searchTextId).onblur = dq_acDisplayCheck;
		document.body.onclick = dq_acDisplayCheck;
	}

	function dq_acDisplayView()
 	{
		dq_acDisplayFlag = 1;
		dq_acFormFlag = 0;
		dq_reqAcResultShow();
 	}

 	function dq_acDisplayCheck()
 	{
		if(dq_acDisplayFlag)
		{
			dq_acDisplayFlag=0;
			return ;
		}

		if(dq_acArrowFlag)
			return;


		if(dq_acFormFlag)
			return;

		dq_acDisplayHide();
	}

 	function dq_acDisplayHide()
 	{
 		var resultDiv = document.getElementById(dq_resultDivID);

		if(resultDiv.style.display == "none")
			return ;

		dq_setDisplayStyle(0);
		dq_acListFlag = 0;
		dq_acLine = 0;
	}

 	function dq_setDisplayStyle(type)
 	{
 		var resultDiv = document.getElementById(dq_resultDivID);

 		if(type==0)
		{
			resultDiv.style.display = "none";
			dq_switchImage(0);
			$(".form-area").removeClass("on");
		}
		else if(type==1)
		{
			resultDiv.style.display = "block";
			dq_switchImage(1);
			$(".form-area").addClass("on");
		}
		else if(type==2)
		{
			resultDiv.style.display = "none";
			dq_switchImage(1);
			$(".form-area").removeClass("on");
		}
 	}

 	function dq_reqAcResultShow()
	{
 		var resultDiv = document.getElementById(dq_resultDivID);

		if($(dq_searchTextId).val() == "" || dq_acuse == 0)
			return ;

	 	if(dq_acListFlag && dq_acDisplayFlag)
	 	{
	 		dq_acDisplayHide();
			return;
		}

		var o = dq_getAcResult();

	 	if(o && o[1][0] != "")
	 		dq_acResultShow(o[0], o[1]);
	 	else
	 		dq_reqSearch();
 	}

 	function dq_getAcResult()
 	{
		var ke = dqc_trimSpace($(dq_searchTextId).val());

	 	return typeof(dq_acResult[ke])=="undefined" ? null : dq_acResult[ke];
 	}

 	function dq_setAcResult(aq, al)
 	{
 		dq_acResult[aq] = new Array(aq, al);
 	}

 	function dq_acResultShow(aq, al)
 	{
		if(aq != dqc_trimSpace($(dq_searchTextId).val()))
			dq_engFlag = 1;
 		else
			if(aq && aq != "" && aq != dqc_trimSpace($(dq_searchTextId).val()))
				return ;

	 	dq_searchKeyword = aq;
	 	dq_searchResultList = al;

	 	dq_printAcResult();

	 	if(dq_searchResultList.length)
		 	dq_acListFlag = 1;
	 	else
			dq_acListFlag = 0;

	 	if(dq_acListFlag)
	 	{
	 		dq_setAcPos(0);

			//if(dq_browserType == 1)
			//	$(dq_searchTextId).bind("keydown", dq_acKeywordTextViewIE(event));
			//else if(dq_browserType == 2)
			//	$(dq_searchTextId).bind("keydown", dq_acKeywordTextViewFF(event));			
		}
	}

 	function dq_setAcPos(v)
 	{
 		dq_acLine = v;
		setTimeout('dq_setAcLineBgColor();', 10);
 	}

 	function dq_printAcResult()
 	{
 		var resultDiv = document.getElementById(dq_resultDivID);

		if(dq_searchResultList[0] == "")
			resultDiv.innerHTML = dq_getAcNoResultList();
	 	else
	 		resultDiv.innerHTML = dq_getAcResultList();

		dq_setDisplayStyle(1);

	 	setTimeout('dq_setAcLineBgColor();', 10);
 	}

 	function dq_setAcLineBgColor()
 	{
 		var o1, o2, qs_ac_len;

		if(!dq_acListFlag)
			return;

		qs_ac_len = dq_searchResultList.length;

	 	for(i=0;i<qs_ac_len;i++)
	 	{
			o1 = document.getElementById('dq_ac' + (i+1));

			if(o1 != null)
			{
				if((i+1) == dq_acLine)
					o1.style.backgroundColor = dq_bgColor;
				else
					o1.style.backgroundColor = '';
			}
		}
 	}

 	function dq_acKeywordTextViewIE(e)
	{
		//var e = window.event;
 		console.log("keycode:" +e.keyCode);
		var ac, acq;
		var resultDiv = document.getElementById(dq_resultDivID);
		var qs_ac_len = dq_searchResultList.length;

	 	if(e.keyCode==39)
	 		dq_reqAcResultShow();

	 	if(e.keyCode==40 || (e.keyCode==9 && !e.shiftKey))
	 	{
		 	if(!dq_acListFlag)
		 	{
				dq_reqAcResultShow();
			 	return;
			}

			if(dq_acLine < qs_ac_len)
			{
				if(dq_acLine == 0)
					dq_keywordBak = $(dq_searchTextId).val();

				dq_acLine++;

			 	ac = eval('dq_ac' + dq_acLine);
			 	acq = eval('dq_acq' + dq_acLine);
			 	dq_keywordOld = $(dq_searchTextId).val(acq.outerText);
			 	$(dq_searchTextId).focus();
			 	dq_setAcLineBgColor();
			 	e.returnValue = false;
		 	}
	 	}

	 	if(dq_acListFlag && (e.keyCode==38 || (e.keyCode==9 && e.shiftKey)))
	 	{
			if(!dq_acListFlag)
				return;

		 	if(dq_acLine <= 1)
		 	{
		 		dq_acDisplayHide();
			 	dq_keywordOld = $(dq_searchTextId).val(dq_keywordBak);
		 	}
		 	else
		 	{
				dq_acLine--;

			 	ac = eval('dq_ac'+ dq_acLine);
			 	acq = eval('dq_acq' + dq_acLine);
			 	dq_keywordOld = $(dq_searchTextId).val(acq.outerText);
			 	$(dq_searchTextId).focus();
			 	dq_setAcLineBgColor();
			 	e.returnValue = false;
			}
		}
	}

 	function dq_acKeywordTextViewFF(fireFoxEvent)
	{
		var ac, acq;
		var resultDiv = document.getElementById(dq_resultDivID);
		var qs_ac_len = dq_searchResultList.length;

	 	if(fireFoxEvent.keyCode==39)
	 		dq_reqAcResultShow();

	 	if(fireFoxEvent.keyCode==40 || fireFoxEvent.keyCode==9)
	 	{
		 	if(!dq_acListFlag)
		 	{
		 		dq_reqAcResultShow();
			 	return;
			}

			if(dq_acLine < qs_ac_len)
			{
				if(dq_acLine == 0)
					dq_keywordBak = $(dq_searchTextId).val();

				dq_acLine++;

			 	ac = document.getElementById('dq_ac' + dq_acLine);
			 	acq = document.getElementById('dq_acqHidden' + dq_acLine);

			 	dq_keywordOld = $(dq_searchTextId).val(acq.value);

			 	$(dq_searchTextId).focus();
			 	dq_setAcLineBgColor();
			 	fireFoxEvent.preventDefault();
		 	}
	 	}

	 	if(dq_acListFlag && (fireFoxEvent.keyCode==38 || fireFoxEvent.keyCode==9))
	 	{
			if(!dq_acListFlag)
				return;

		 	if(dq_acLine <= 1)
		 	{
		 		dq_acDisplayHide();
			 	dq_keywordOld = $(dq_searchTextId).val(dq_keywordBak);
		 	}
		 	else
		 	{
		 		dq_acLine-- ;

			 	ac = document.getElementById('dq_ac' + dq_acLine);
			 	acq = document.getElementById('dq_acqHidden' + dq_acLine);

			 	dq_keywordOld = $(dq_searchTextId).val(acq.value);
			 	$(dq_searchTextId).focus() ;
			 	dq_setAcLineBgColor() ;
			 	fireFoxEvent.preventDefault();
			}
		}
	}

 	function dq_reqSearch()
 	{
		var sv;
		var ke = dqc_trimSpace($(dq_searchTextId).val());

		ke = ke.replace(/ /g, "%20");

		while(ke.indexOf("\\") != -1)
			ke = ke.replace(/ /g, "%20").replace("\\", "");

		while(ke.indexOf("\'") != -1)
			ke = ke.replace(/ /g, "%20").replace("\'", "");

	 	if(ke == "")
	 	{
	 		dq_acDisplayHide();
			return;
		}
//	 	sv = "/wbdy/autocomplete.xx?q=" + encodeURIComponent(ke);
		var params = {"searchTerm":encodeURIComponent(ke)};
		$.ajax({
			url     : "/nhis/etc/autocomplete.do",
			type    : 'POST',
			data    : params,
			dataType: 'json',
		    success : function(data){
//		    	alert("success="+JSON.stringify(data));
		    	dq_ajaxReqObj = data;
		    	dq_acShow();
		    } 
		    
		});
		
//	 	dq_ajaxReqObj = dqc_getXMLHTTP();
//
//	 	if(dq_ajaxReqObj)
//	 	{
//			dq_ajaxReqObj.open("POST", sv, true);
//		 	dq_ajaxReqObj.onreadystatechange = dq_acShow;
//	 	}
//
//	 	try
//	 	{
//			dq_ajaxReqObj.send(null);
//	 	}
//	 	catch(e)
//	 	{
//			return 0;
//		}
	}

 	function dq_acShow()
 	{
		if(dq_acuse == 1)
	 	{
//			if(dq_ajaxReqObj.readyState==4 && dq_ajaxReqObj.responseText && dq_ajaxReqObj.status==200)
			if(dq_ajaxReqObj.returnText)
			{
				eval(dq_ajaxReqObj.returnText);
				dq_setAcResult(dq_searchKeyword, dq_searchResultList);
				dq_acResultShow(dq_searchKeyword, dq_searchResultList);
			}
	 	}
	 	else
	 	{
	 		dq_setDisplayStyle(2);
	 	}
 	}

 	function dq_setAcInput(keyword)
 	{
		if(!dq_acListFlag)
			return;

	 	dq_keywordOld = $(dq_searchTextId).val(keyword);
	 	$(dq_searchTextId).focus();
	 	dq_acDisplayHide();
 	}

	function dq_acOff()
	{
		if($(dq_searchTextId).val() == "")
			dq_setDisplayStyle(0);
		else
			dq_acDisplayHide();

		dq_acuse = 0;
 	}

	function dq_acArrow(){
		var resultDiv = document.getElementById(dq_resultDivID);

		if(dq_acuse == 0)
		{
			dq_keywordOld = "";
			dq_acuse = 1;

			if($(dq_searchTextId).val() == "")
				resultDiv.innerHTML = dq_getAcOnNoKeyword();
		}
		else
		{
			if($(dq_searchTextId).val() == "")
				resultDiv.innerHTML = dq_getAcNoKeyword();
		}

		if($(dq_searchTextId).val() == "" && (resultDiv.style.display == "block"))
			dq_setDisplayStyle(0);
		else
			dq_setDisplayStyle(1);

		dq_acDisplayView();
		$(dq_searchTextId).focus();
		dq_wi();

		document.body.onclick=null;

		if(resultDiv.style.display == "block")
			$(".set_sugicn").find("img").attr("src", "images/btn_suggest01.gif");
		else
			$(".set_sugicn").find("img").attr("src", "images/btn_suggest.gif");
		

	}

	function dq_switchImage(type)
	{
		if(type==0)
		{
			//document.getElementById("imgIntro0").src = "";
			//document.getElementById("imgIntro0").title = "";
		}
		else if(type==1)
		{
			//document.getElementById("imgIntro0").src = "";
			//document.getElementById("imgIntro0").title = "";
		}
 	}

	function dq_setMouseon()
 	{
	 	dq_acFormFlag = 1;
 	}

 	function dq_setMouseoff()
 	{
	 	dq_acFormFlag = 0;
		$(dq_searchTextId).focus();
 	}

 	function dq_getAcResultList()
 	{
 		var keyword = "";
 		var keywordOrign = "";
 		var keywordLength = 0;
 		var lenValue = 40;
 		var text = "";

 		var pos = 0;

 		if(dq_searchResultList != null && dq_searchResultList.length > 0)
		{
		
		text += "<ul class='before'>";

		 	for(i=0;i<dq_searchResultList.length;i++)
		 	{
		 		keyword = keywordOrign = dq_searchResultList[i];

				keywordLength = dqc_strlen(keywordOrign);

				if(dq_engFlag == 0)
					pos = keywordOrign.indexOf($(dq_searchTextId).val());
				else if(dq_engFlag == 1)
					pos = keywordOrign.indexOf(dq_searchKeyword);

				if(pos >= 0)
				{
					if(pos == 0)
					{
						if(dq_engFlag == 0)
							keyword = dqc_highlight(keyword, $(dq_searchTextId).val(), 0, dq_hStartTag, dq_hEndTag);
						else if(dq_engFlag == 1)
							keyword = dqc_highlight(keyword, dq_searchKeyword, 0, dq_hStartTag, dq_hEndTag);
					}
					else if(pos == keywordOrign.length - 1)
					{
						if(dq_engFlag == 0)
							keyword = dqc_highlight(keyword, $(dq_searchTextId).val(), -1, dq_hStartTag, dq_hEndTag);
						else if(dq_engFlag == 1)
							keyword = dqc_highlight(keyword, dq_searchKeyword, -1, dq_hStartTag, dq_hEndTag);
					}
					else
					{
						if(dq_engFlag == 0)
							keyword = dqc_highlight(keyword, $(dq_searchTextId).val(), pos, dq_hStartTag, dq_hEndTag);
						else if(dq_engFlag == 1)
							keyword = dqc_highlight (keyword, dq_searchKeyword, pos, dq_hStartTag, dq_hEndTag);
					}
				}
				text += "<li id='dq_ac" + (i+1) + "' onmouseover=\"dq_setAcPos('" + (i+1) + "')\" onFocus=\"dq_setAcPos('" + (i+1) + "');\" onmouseout=\"dq_setAcPos(0);\"  onBlur=\"dq_setAcPos(0);\" onclick=\"dq_setAcInput('" + keywordOrign + "');dq_keywordSearch('" + keywordOrign + "');\" onkeypress=\"dq_setAcInput('" + keywordOrign + "');\"  >";
				text += "<a href='#' onclick='return false;' title='새창열림'>"+ keyword +"</a><input type=\"hidden\" id=\"dq_acqHidden" + (i+1) + "\" value=\"" + keywordOrign + "\"/>";
				text += "<span id='dq_acq" + (i+1) + "' style='display:none'>" + keywordOrign + "</span></li>";
		 	}
		 	
		text += "</ul>";
		//text += "<div class=\"search_close\"><a href=\"#\" onclick=\"dq_acOff();\" >자동완성 끄기</a></div>";
		}
	 	return text;
	}

 	function dq_getAcNoResultList()
 	{
 		var text = "";
 		var ment = "<span class='ment'>해당 단어로 시작하는 검색어가 없습니다.</span>";

 		text += "<div id=\"auto_word\" class=\"auto_word\">";
		text += "<ul>";
 		text += "<li>";
 		text += ment;
 		text += "</li>";
 		text += "</ul>";
	 	//text += "<div class=\"auto_word_off\">";
	 	//text += "<button type=\"button\" onclick=\"dq_acDisplayHide();\" ><span>자동완성 닫기</span></button>";
	 	//text += "</div>";
	 	text += "</div>";

		return text;
 	}

 	function dq_getAcNoKeyword()
 	{
 		var text = "";
 		var ment = "현재 자동완성 기능을 사용하고 계십니다.";

 		text += "<div id=\"keyword-list\" class=\"keyword-list\">";
		text += "<ul>";
 		text += "<li>";
 		text += ment;
 		text += "</li>";
 		text += "</ul>";
	 	text += "<div class=\"auto_word_off\">";
	 	text += "<button type=\"button\" class=\"keyword-close\" onclick=\"dq_acDisplayHide();\" ><span>자동완성 닫기</span></button>";
	 	text += "</div>";
	 	text += "</div>";

	 	return text;
 	}

 	function dq_getAcOnNoKeyword()
 	{
 		var text = "";
 		var ment = "자동완성기능이 활성화 되었습니다.";

 		text += "<div id=\"keyword-list\" class=\"keyword-list\">";
		text += "<ol>";
 		text += "<li>";
 		text += ment;
 		text += "</li>";
 		text += "</ol>";
	 	text += "<div class=\"l\">";
	 	text += "<button type=\"button\" class=\"keyword-close\" onclick=\"dq_acDisplayHide();\" ><span>자동완성 닫기</span></button>";
	 	text += "<button type=\"button\" class=\"keyword-list-false\" onclick=\"javascript:dq_acOff();\" onkeypress=\"this.onclick;\"><span>자동완성기능 끄기</span></button>";
	 	text += "</div>";
	 	text += "</div>";

	 	return text;
 	}

 	function dq_wi()
 	{
		if(dq_acuse==0)
			return;

		var keyword = $(dq_searchTextId).val();

	 	if(keyword == "" && keyword != dq_keywordOld)
	 		dq_acDisplayHide();

		if(keyword != "" && keyword != dq_keywordOld && dq_keyStatus != 1)
		{
			var o = null;

			o = dq_getAcResult();

			if(o && o[1][0] != "")
				dq_acResultShow(o[0], o[1]);
			else
				dq_reqSearch();
		}

		dq_keywordOld = keyword;
		setTimeout("dq_wi()", dq_intervalTime);
 	}

	setTimeout("dq_wi()", dq_intervalTime);
