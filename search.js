google.load("search", "1", {"nocs0s":true, "nooldnames":true, "language":"ru", "style":1});

$().ready(function(){
	C.search.init();
})

C.search={
	init: function(){
		C.search.createSearchEngine('000490722527879967040:guqel9um-yi');
		C.search.drawTagsAttachEvents('#searchBox');
	},
	createSearchEngine: function(site){
		C.search.google_web_search=new google.search.WebSearch();
		C.search.google_web_search.setSiteRestriction(site);
		C.search.google_web_search.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
		C.search.google_web_search.setSearchCompleteCallback(C.search, C.search.executeQuery);
	},
	drawTagsAttachEvents: function(selector){
		C.search.$search_box=$(selector).empty();
		C.search.$form=$(document.createElement('form')).attr({action:'./', method:'get'}).
			append($(document.createElement('p')).
				append($(document.createElement('input')).attr({className:'txt', name:'q'})).
				append($(document.createElement('input')).attr({className:'sbmt', type:'submit', value:'Найти'}))).
			appendTo(C.search.$search_box);
		if(C.search.initial_query){
			C.search.$form.find('input.txt')[0].value=C.search.initial_query;
			C.search.google_web_search.execute(C.search.initial_query);
		}
		C.search.$search_box.
			append($(document.createElement('div')).addClass('results')).
			append($(document.createElement('div')).addClass('pages')).
			append($(document.createElement('div')).addClass('branding'));
	},
	executeQuery: function(){
		// console.log('C.search.google_web_search.results.length='+ C.search.google_web_search.results.length);
		// console.log('cursor', C.search.google_web_search.cursor);
		var $results=C.search.$search_box.children('div.results').empty();
		var $pages=C.search.$search_box.children('div.pages').empty();
		var $branding=C.search.$search_box.children('div.branding');
		if(C.search.google_web_search.results && C.search.google_web_search.results.length){
			if( C.search.initial_page == 1+C.search.google_web_search.cursor.currentPageIndex ){
				var start = C.search.google_web_search.cursor.currentPageIndex*10+1
				var $ol=$(document.createElement('ol')).attr({start:start}).appendTo($results);
				for(var i=0; i<C.search.google_web_search.results.length; i++){
					var result=C.search.google_web_search.results[i];
					var $li=$(document.createElement('li')).
						append($(document.createElement('strong')).
							append($(document.createElement('a')).attr({href: result.url }).text( result.titleNoFormatting ))).appendTo($ol);
					if(result.content){
						$li.append($(document.createElement('p')).html( result.content ));
					}
				}
				if(C.search.google_web_search.cursor.pages && C.search.google_web_search.cursor.pages.length > 1){
					$pages.text('Страницы:');
					for(var i=0; i<C.search.google_web_search.cursor.pages.length; i++){
						var page=C.search.google_web_search.cursor.pages[i];
						if(i==C.search.google_web_search.cursor.currentPageIndex){
							$pages.append($(document.createElement('b')).text( page.label ));
						}else{
							var url = '?q='+ C.search.initial_query+ '&p='+ page.label;
							$pages.append($(document.createElement('a')).attr({href:url}).text( page.label ));
						}
					}
				}
			}else{
				if( 10*(C.search.initial_page-1) < C.search.google_web_search.cursor.estimatedResultCount ){
					C.search.google_web_search.gotoPage(C.search.initial_page - 1);
				}else{
					var url = '?q='+ C.search.initial_query+ '&p=1';
					location.replace(url);
				}
			}
			// показываем лого google
			if($branding.children().length==0){
				google.search.Search.getBranding($branding[0]);
			}
			if($branding[0].offsetHeight==0){
				$branding.show();
			}
		}else{
			// ничего не найдено
			if(C.search.initial_page==1){
				$results.append($(document.createElement('p')).html('По запросу «<b>'+ C.search.initial_query+ '</b>» ничего не найдено'))
				$branding.hide();
			}else{
				// если искали не на первой странице, попытаемся найти на первой
				var url = '?q='+ C.search.initial_query+ '&p=1';
				location.replace(url);
			}
		}
	}
}
