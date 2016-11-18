//Use globals, self-invoking functions etc.
'use strict';

(function (window) {

	window.geolocation = window.geolocation|| {};


	if(!window.selectText){
		window.selectText = function selectText(element) {
		 	var doc = document,
		        text = doc.getElementById(element),
		        range,
		        selection;
		    if (doc.body.createTextRange) {
		        range = document.body.createTextRange();
		        range.moveToElementText(text);
		        range.select();	
		    } else if (window.getSelection) {
		        selection = window.getSelection();        
		        range = document.createRange();
		        range.selectNodeContents(text);
		        selection.removeAllRanges();
		        selection.addRange(range);
		    }
		}
	}
	
	function init(){
	   navigator.geolocation.getCurrentPosition(success_cb, error_cb);
	};

	function success_cb(pos) {
		  var crd = pos.coords;

		  //store user's position when loading site first time
		  window.geolocation = {
		  	lat: crd.latitude,
		  	lon: crd.longitude
		  };

	};

	function error_cb(err) {
		  console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	init();

	$(document).ready(function(){

		if(!window.geolocation){
			console.log(window.geolocation);	
		}
		
		var elemCounter = 0;  //setup counter for embed button

	   $('form').on('click', '#submit-widget', function(e){
	   	  e.preventDefault();
	   	  
	   	  //our interested qs variables
	   	  var data = {
	   	  	  title: $('#title').val(),
	   	  	  units: $('#unit').val(),
	   	  	  showWind: $('#showWind').prop('checked'),
	   	  	  lat: window.geolocation.lat,
	   	  	  lon: window.geolocation.lon,
	   	  	  elemCounter: elemCounter++
	   	  }
	   	   
	   	  $.ajax({
	   	  	type: 'POST',
	   	  	url: '/',
	   	  	data: data,
	   	  	success: function(data){
	   	  		
	   	  		if(!$('.list-widgets-heading').hasClass('active')){
	   	  			$('.list-widgets-heading').toggleClass('active');	
	   	  		}
	   	  		
	   	  		$('#panel-widgets').append(data);

	   	  	},
	   	  	error: function (error) {
	   	  		 console.log(error);
	   	  	}
	   	  });
	   });

	   //Widget panel to highlight and copy
	   $('#panel-widgets').on('click', 'button[id^=embed-widget]', function(e){
	   		e.preventDefault(); 

	   		selectText($(this).prev().attr('id'));

	   		try {
			    // var successful = document.execCommand('copy');
			    var msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
			    console.log('Copying widget code was ' + msg + '. You may now paste into any html document. ');
			} catch (err) {
			    console.log('Oops, something\'s going wrong here...');
			}
	   });   
	   
	   
	})
})(window)
