/**
 * jQuery.EmbedSoundCloud
 * Convert SoundCloud URLs to Embedded Media
 *
 * @author      MarQuis Knox <hire@marquisknox.com>
 * @copyright   2015 MarQuis Knox
 * @link        http://marquisknox.com
 * @link		https://github.com/MarQuisKnox/jQuery.EmbedSoundCloud
 * @license     Public Domain
 *
 * @since  	    Friday, January 09, 2015, 05:07 AM GMT+1
 * @modified    $Date$ $Author$
 * @version     $Id$
 *
 * @category    JavaScript
 * @package     jQuery.EmbedSoundCloud
*/

(function($) {
    'use strict';

    $.fn.embedSoundCloud = function( options ) {
    	 var settings = $.extend({
    		// defaults
    	    width: '100%',
    	    height: 345,
    	    heightMobile: 166,
    	    format: 'json',
    	    callback: function() {},
    	    maxwidth: '100%',
    	    maxheight: '400',
    	    color: null,
    	    auto_play: false,
    	    show_comments: true,    	    
    	    iframe: true,
    	    mobile: false
    	 }, options );
    	 
        return this.each(function() {
            var $el				= $(this);
            var embeddedContent = _embed( $el, settings );

            $el.html( embeddedContent );
        });
    };
    
    function _str_replace(search, replace, subject, count) {
  	  //  discuss at: http://phpjs.org/functions/str_replace/
  	  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  	  // improved by: Gabriel Paderni
  	  // improved by: Philip Peterson
  	  // improved by: Simon Willison (http://simonwillison.net)
  	  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  	  // improved by: Onno Marsman
  	  // improved by: Brett Zamir (http://brett-zamir.me)
  	  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  	  // bugfixed by: Anton Ongson
  	  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  	  // bugfixed by: Oleg Eremeev
  	  //    input by: Onno Marsman
  	  //    input by: Brett Zamir (http://brett-zamir.me)
  	  //    input by: Oleg Eremeev
  	  //        note: The count parameter must be passed as a string in order
  	  //        note: to find a global variable in which the result will be given
  	  //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
  	  //   returns 1: 'Kevin.van.Zonneveld'
  	  //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
  	  //   returns 2: 'hemmo, mars'
  	  // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
  	  //   example 3: str_replace(Array('S','F'),'x','ASDFASDF');
  	  //   returns 3: 'AxDxAxDx'
  	  // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca) Corrected count
  	  //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , 'cnt');
  	  //   returns 4: 'xSyFxSyF' // cnt = 0 (incorrect before fix)
  	  //   returns 4: 'xSyFxSyF' // cnt = 4 (correct after fix)
  	  
  	  var i = 0,
  	    j = 0,
  	    temp = '',
  	    repl = '',
  	    sl = 0,
  	    fl = 0,
  	    f = [].concat(search),
  	    r = [].concat(replace),
  	    s = subject,
  	    ra = Object.prototype.toString.call(r) === '[object Array]',
  	    sa = Object.prototype.toString.call(s) === '[object Array]';
  	  s = [].concat(s);
  	  
  	  if(typeof(search) === 'object' && typeof(replace) === 'string' ) {
  	    temp = replace; 
  	    replace = new Array();
  	    for (i=0; i < search.length; i+=1) { 
  	      replace[i] = temp; 
  	    }
  	    temp = ''; 
  	    r = [].concat(replace); 
  	    ra = Object.prototype.toString.call(r) === '[object Array]';
  	  }
  	  
  	  if (count) {
  	    this.window[count] = 0;
  	  }

  	  for (i = 0, sl = s.length; i < sl; i++) {
  	    if (s[i] === '') {
  	      continue;
  	    }
  	    for (j = 0, fl = f.length; j < fl; j++) {
  	      temp = s[i] + '';
  	      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
  	      s[i] = (temp)
  	        .split(f[j])
  	        .join(repl);
  	      if (count) {
  	        this.window[count] += ((temp.split(f[j])).length - 1);
  	      } 
  	    }
  	  }
  	  
  	  return sa ? s : s[0];
    }    

    function _embed( $el, options ) {
    	var elContent	= $el.html();			
    	var urlRegEx	= /^https?:\/\/(m\.)?(soundcloud.com|snd.sc)\/(.*)$/;
    	var matches;
			
		// Embed URLs
	    matches = elContent.match( urlRegEx );
	    if ( matches ) {
	    	_getDetails( matches[0], options )
	        .then(function ( result ) {
    	    	elContent = _str_replace( matches[0], result.html, elContent );
    	    	$el.html( elContent );
	        });	    	
	    }
    } 
    
    // @link	https://developers.soundcloud.com/docs/oembed    
    function _getDetails( url, options ) {
        return $.ajax({
			type: 'GET',
			url: '//soundcloud.com/oembed',
			data: { 
				url: url,
				iframe: options.iframe,
				format: options.format,
				maxheight: options.maxheight,
				show_comments: options.show_comments
			},
			complete: function( jqXHR, textStatus ) {
				// ...
			},
			success: function( response, textStatus, jqXHRresponse ) {
				if( response.html && options.mobile ) {
					response.html = _str_replace( 'visual=true', '', response.html );
					response.html = _str_replace( 'show_artwork=true', '', response.html );
					response.html = _str_replace( 'show_comments=true', '', response.html );
					response.html = _str_replace( 'height='+ options.maxheight + '&', 'height=' + options.heightMobile, response.html );
					response.html = _str_replace( 'height="'+ options.maxheight +'"', 'height="'+ options.heightMobile +'"', response.html );
				}
			},
			error: function( jqXHR, textStatus, errorThrown ) {
				// ...
			},	
			dataType: 'json'
		});	
    }    
}(jQuery));
