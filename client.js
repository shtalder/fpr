Cufon.replace('#menu0 span');
Cufon.replace('#papillon h3');
Cufon.replace('#papillon a');
Cufon.replace('#firstContent h4');
Cufon.replace('#regionSbox h5');
Cufon.replace('*.yanus');



$(window).bind('resize load',function(evt){
	if(window.__resize_timer__){
		clearTimeout(__resize_timer__);
	}
	window.__resize_timer__=setTimeout('C.other.doResize("'+evt.type+'")',25);
})

$(document).ready(function(){
	C.init();
$('#bayan li').click(function () {
		var text = $(this).children('div.panel');

		if (text.is(':hidden')) {
			text.slideDown("200");
		} else {
			text.slideUp("200");
		}
		
	});

})

var C={
	init: function(){
		C.style.init();
		C.other.menuEvents();
		Cufon.now();
		C.vacancies.init();
		C.faq.init();
		// инициализируем библиотечку Shadowbox
		if(typeof Shadowbox!="undefined"){
			Shadowbox.init({
				// players:["img","html","swf"],
				// skipSetup: true,
				handleOversize: 'drag',
				language: 'ru'
			}) 
		}
	},
	vacancies: {
		init: function(){
			var $vacancies_block=$('#vacanciesBlock');
			if($vacancies_block.length){
				$vacancies_block.find('div.vacancy>div').hide();
				$vacancies_block.find('h3').bind('click',function(){
					$(this).parent().children('div').slideToggle('fast');
				})
			}
		}
	},
	faq: {
		init: function(){
			var $faq=$('#faqBlock');
			if($faq.length){
				$faq.find('div.answer').hide();
				$faq.find('strong.caption').bind('click',function(){
					$(this).parent().children('div.answer').slideToggle('fast');
				})
			}
		},
		showForm: function(){
			$('#faqQuestion').show('fast');
			$('#faqSuccess').hide('fast');
		}
	},
	style: {
		init: function(){
			if($.browser.msie && $.browser.version<=6){
				var $main_td=$(document.createElement('td')).attr({id:'mainTd'}).
					appendTo($(document.createElement('tr')).
						appendTo($(document.createElement('table')).attr({id:'mainTbl'}).
							appendTo('body')));
				$('body').css({position:'absolute',width: '100%',height: '100%'}).children('div').appendTo($main_td);
				$('html').css({position:'static',width: '100%',height: '100%'})
			}
			$('.contentZone hr').wrap($(document.createElement('div')).addClass('hr'));
			C.style.parseTables();
		},
		parseTables: function(){
			$('.contentZone table').each(function(){//перебираем таблицы, расположенные внутри контейнера class="contentZone"
				if($(this).get(0).className.search(/no-parse/)<0){//пропускаем таблицы с классом no-parse
					C.style.parseTable(this);
				}
			});
		},
		parseTable: function(table){
			//
			// в первой части мы исследуем таблиц, 
			// узнаем ее параметры
			// в частности мы создаем матрицу таблицы -
			// одномерный массив, каждый элемент которого
			// это число, равное количеству ячеек в столбце
			//
			var matrix=[];//матрица ячеек
			var line=1;//текущая строка
			var mxc=1;//max colspan
			var mxr=1;//max rowspan
			$('tr',table).each(function(){//перебираем строки
				var cells=$('th,td',this).get();//получаем массив ячеек строки
				var index=0;//текущий столбец
				for(var i=0;i<cells.length;i++){//перебираем ячейки
					if(line==1)mxr=(mxr<rowspan)?rowspan:mxr;//отыскиваем максимальный rowspan в первой строке, чтобы знать высоту заголовка страницы
					var rowspan=( parseInt($(cells[i]).attr('rowspan')) || 1 );//устанавливаем rowspan ячейки или 1
					var colspan=( parseInt($(cells[i]).attr('colspan')) || 1 );//устанавливаем colspan ячейки или 1
					for(var j=0;j<colspan;j++){//перебираем colspan
						while((matrix[index] || 0)>=line)index++;//двигаемся по матрице вправо пока не найдем незанятую ячейку
						if(index==0)mxc=(mxc<colspan)?colspan:mxc;//отыскиваем максимальный colspan в первой колонке, чтобы знать ширину заголовка таблицы
						matrix[index]=(matrix[index] || 0) + rowspan;//заполняем матрицу ячейками
						index++;
					}
				}
				line++;
			})

			var matrix_height=0;//определяем высоту таблицы
			for(var i=0;i<matrix.length;i++)matrix_height=(matrix[i]>matrix_height)?matrix[i]:matrix_height;
			var matrix_width=matrix.length;//определяем ширину таблицы

			//
			// во второй части (которая идентична первой механизмом перебора строк и ячеек,
			// поэтому код не повторяет комментариев) мы устанавливаем ячейкам 
			// необходимые атрибуты на основе полученных о таблице сведений
			//
			var matrix=[];
			var line=1;
			$('tr',table).each(function(){
				var cells=$('th,td',this).get();
				var index=0;
				for(var i=0;i<cells.length;i++){
					var rowspan=( parseInt($(cells[i]).attr('rowspan')) || 1 );
					var colspan=( parseInt($(cells[i]).attr('colspan')) || 1 );
					$(this).addClass('row'+line);
					$(this).addClass((line%2==0)?'even':'odd');
					$(cells[i]).addClass('col'+(index+1));
					for(var j=0;j<colspan;j++){
						while((matrix[index] || 0)>=line)index++;
						matrix[index]=(matrix[index] || 0) + rowspan;
						if(line==1)$(cells[i]).addClass('top');//всем верхним ячейкам добавляем класс "top"
						if((index+1)==matrix_width)$(cells[i]).addClass('right');//всем правым "right"
						if(matrix[index]==matrix_height)$(cells[i]).addClass('bottom');//всем нижним "bottom"
						if(index==0)$(cells[i]).addClass('left');//всем левым ячейкам добавляем класс "left"
						if(matrix[index]<=mxr)$(cells[i]).addClass('headrow');//всем ячейкам в составе горизонтального (или верхнего) заголовка таблицы добавляем класс "headrow"
						if((index+colspan)<=mxc)$(cells[i]).addClass('headcol');//всем ячейкам в составе вертикального (или левого) заголовка таблицы - класс "headrow"
						index++;
					}
				}
				line++;
			})
		}
	},
	other: {
		menuEvents: function(){
			$('#menu1 li').bind('mouseover mouseout',function(evt){
				if(evt.type=='mouseover'){
					$(this).addClass('over');
				}else if(evt.type=='mouseout'){
					// console.log(this,$(evt.target).parents('li')[0],$(evt.target).parents('li')[0]==this);
					$(this).removeClass('over');
				}
			})
		},
		doResize: function(evt_type){
			if($.browser.msie && $.browser.version<=6){
				$('#rcolBg').height('auto');
				$('#rcolBg').height($('body')[0].offsetHeight);
			}
			// if(evt_type=='load'){
			// 	$('#footer').css({position:'absolute',left:0,bottom:0});
			// 	$('#rcolBg').show();
			// }
		}
	}
}


/*
var C={
	rcolbg_timer: null,//таймер

	init: function(){
		/*if(typeof sIFR == "function"){
			sIFR.replaceElement(named({sSelector:'.sifryanus', sFlashSrc:'/swf/yanus.swf', sColor:'#000000', sBgColor:'#FFFFFF',sWmode:''}));
		}* /
		//вешаем вызов afterResize 
		//вносим некоторые изменения в html-код .contentZone
		C.changeContentZoneHTML();
		//при ините выполняем то же, что и при ресайзе
		C.afterResize();
		C.parseTables();
		//скрываем вакансии, если это страница вакансий
		C.hideVacancies();
	},

	afterResize: function(){
		// //сбрасываем высоту #mainBox
		// var jq_mainbox=$('#mainBox').css({height: 'auto'});
		// //устанавливаем новую высоту #mainBox, если требуется
		// var maintbl_h=$('#mainTbl').get(0).offsetHeight;
		// if(jq_mainbox.get(0).offsetHeight < maintbl_h){
		// 	jq_mainbox.css({height: maintbl_h});
		// }
		// if($.browser.msie){
		// 	//сбрасываем высоту #rcolBg
		// 	$('#rcolBg').height(100);
		// 	//кроме того, для MSIE нужно сбросить ширину элементов форм
		// 	$('.formItemText').add('.formItemArea').width(100);
		// 	//сбрасываем ширину #licencesBlock и #credentialsBlock
		// 	//$('#licencesBlock').add('#credentialsBlock').css('width','');
		// 
		// 	//теперь пересчитываем размеры <BODY>
		// 	/*U.bodyTag().style.height='';
		// 	if(U.htmlTag().scrollHeight > U.htmlTag().offsetHeight)
		// 		U.bodyTag().style.height=U.htmlTag().scrollHeight+'px';* /
		// 	/*U.bodyTag().style.width='';
		// 	if(U.htmlTag().scrollWidth > U.htmlTag().offsetWidth)
		// 		U.bodyTag().style.width=U.htmlTag().scrollWidth+'px';* /
		// 	//а также пересчитываем ширину элементов форм
		// 	if($('.contentZone').add('.formItemText').add('.formItemArea').length){
		// 		var w=$('.contentZone').get(0).offsetWidth;
		// 		$('.formItemText').add('.formItemArea').width(w-12);//убираем паддинги 2*6px
		// 		//устанавливаем ширину #licencesBlock=.contentZone
		// 		//$('#licencesBlock').add('#credentialsBlock').width(w);
		// 	}
		// 	//в последнюю очередь устанавливаем новую высоту #rcolBg
		// 	if(C.rcolbg_timer){clearTimeout(C.rcolbg_timer)}
		// 	C.rcolbg_timer=setTimeout('C.rcolbgSetHeight()',25);
		// }

		/*
			//после ресайза повторно рисуем заголовок и пропускаем через sifr
			if(typeof sIFR == "function"){
				var title=$('#pageTitle .sIFR-alternate span').get(0).innerHTML;
				if(title){
					$('#pageTitle').removeClass('sIFR-replaced').empty().append('<span>'+title+'</span>');
					sIFR.replaceElement(named({sSelector:'.sifryanus', sFlashSrc:'/swf/yanus.swf', sColor:'#000000', sBgColor:'#FFFFFF',sWmode:''}));
				}
			}
		* /
	},

	rcolbgSetHeight: function(){
		var h=U.htmlTag().scrollHeight;
		$('#rcolBg').height(h);
	},

	changeContentZoneHTML: function(){
		$('.contentZone hr').wrap('<span class="hr"></span>');
	},

	/*feedbackInit: function(){
		var es=document.forms['fbmsgAdd'].elements; 				
		this.feedbackArray = [
			['feedback[author]', {t: 'Представьтесь', m: 'Вы не представились'}],
			['feedback[org]', { t: 'Название вашей организации'}],
			['feedback[address]', { t: 'Обратый адрес'}],
			['feedback[phone]', { t: 'Контактный телефон'}],
			['feedback[email]', { t: 'e-mail', m: 'Вы не ввели e-mail'}],
			['feedback[message]', {t: 'Ваш вопрос', m: 'Вы не задали вопрос'}]
		]

		$.each(this.feedbackArray, function(a,b){
			 b[1].el = es[b[0]]
			 var c = b[1]
			if(!c.el.value) 
				c.el.value = c.t
			c.el.onfocus = function(){
				C.feedbackFocus(this.name)
			}
			c.el.onblur = function(){
				C.feedbackBlur(this.name)
			}
		})
		document.forms['fbmsgAdd'].onsubmit = this.feedbackSubmit
		
	},

	feedbackFocus: function(el){
		$.each(this.feedbackArray, function(a,b){
			if(b[0] == el)
				if(b[1].el.value == b[1].t)
					b[1].el.value = ''
		})
	},

	feedbackBlur: function(el){
		$.each(this.feedbackArray, function(a,b){
			if(b[0] == el)
				if($.trim(b[1].el.value) == '')
					b[1].el.value = b[1].t
		})
	},

	feedbackSubmit: function(){
		var res = null
		$.each(C.feedbackArray, function(a,b){
			if(!res && b[1].m) 
				if(!b[1].el.value || (b[1].el.value == b[1].t)) 
					res = b[1]
		})
		if(res){
			alert(res.m); res.el.focus(); return false;
		}
		
		var emailItem = C.feedbackArray[4][1].el
		if(!U.validateEmail(emailItem.value)){
			alert('Не корректный e-mail'); emailItem.focus(); return false;
		}
		
		return true;
	},* /


	_f: function(){
	}
}
*/
