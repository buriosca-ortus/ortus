﻿/**
 * parser
 * 
 */

(function($){
	$.nestui = {
		/**
		 * Get the index of array item, return -1 when the item is not found.
		 */
		indexOfArray: function(a, o, id){
			for(var i=0,len=a.length; i<len; i++){
				if (id == undefined){
					if (a[i] == o){return i;}
				} else {
					if (a[i][o] == id){return i;}
				}
			}
			return -1;
		},
		/**
		 * Remove array item, 'o' parameter can be item object or id field name.
		 * When 'o' parameter is the id field name, the 'id' parameter is valid.
		 */
		removeArrayItem: function(a, o, id){
			if (typeof o == 'string'){
				for(var i=0,len=a.length; i<len; i++){
					if (a[i][o] == id){
						a.splice(i, 1);
						return;
					}
				}
			} else {
				var index = this.indexOfArray(a,o);
				if (index != -1){
					a.splice(index, 1);
				}
			}
		},
		/**
		 * Add un-duplicate array item, 'o' parameter is the id field name, if the 'r' object is exists, deny the action.
		 */
		addArrayItem: function(a, o, r){
			var index = this.indexOfArray(a, o, r ? r[o] : undefined);
			if (index == -1){
				a.push(r ? r : o);
			} else {
				a[index] = r ? r : o;
			}
		},
		getArrayItem: function(a, o, id){
			var index = this.indexOfArray(a, o, id);
			return index==-1 ? null : a[index];
		},
		forEach: function(data, deep, callback){
			var nodes = [];
			for(var i=0; i<data.length; i++){
				nodes.push(data[i]);
			}
			while(nodes.length){
				var node = nodes.shift();
				if (callback(node) == false){return;}
				if (deep && node.children){
					for(var i=node.children.length-1; i>=0; i--){
						nodes.unshift(node.children[i]);
					}
				}
			}
		}
	};

	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:['draggable','droppable','resizable','pagination','tooltip',
		         'linkbutton','menu','menubutton','splitbutton','switchbutton','progressbar',
				 'tree','textbox','passwordbox','filebox','combo','combobox','combotree','combogrid','combotreegrid','numberbox','validatebox','searchbox',
				 'spinner','numberspinner','timespinner','datetimespinner','calendar','datebox','datetimebox','slider',
				 'layout','panel','datagrid','propertygrid','treegrid','datalist','tabs','accordion','window','dialog','form'
		],
		parse: function(context){
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.nestui-' + name, context);
				if (r.length){
					if (r[name]){
						r.each(function(){
							$(this)[name]($.data(this, 'options')||{});
						});
					} else {
						aa.push({name:name,jq:r});
					}
				}
			}
			if (aa.length && window.easyloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				easyloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq.each(function(){
							$(this)[name]($.data(this, 'options')||{});
						});
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
		},
		
		parseValue: function(property, value, parent, delta){
			delta = delta || 0;
			var v = $.trim(String(value||''));
			var endchar = v.substr(v.length-1, 1);
			if (endchar == '%'){
				v = parseInt(v.substr(0, v.length-1));
				if (property.toLowerCase().indexOf('width') >= 0){
					v = Math.floor((parent.width()-delta) * v / 100.0);
				} else {
					v = Math.floor((parent.height()-delta) * v / 100.0);
				}
			} else {
				v = parseInt(v) || undefined;
			}
			return v;
		},
		
		/**
		 * parse options, including standard 'data-options' attribute.
		 * 
		 * calling examples:
		 * $.parser.parseOptions(target);
		 * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
		 */
		parseOptions: function(target, properties){
			var t = $(target);
			var options = {};
			
			var s = $.trim(t.attr('data-options'));
			if (s){
				if (s.substring(0, 1) != '{'){
					s = '{' + s + '}';
				}
				options = (new Function('return ' + s))();
			}
			$.map(['width','height','left','top','minWidth','maxWidth','minHeight','maxHeight'], function(p){
				var pv = $.trim(target.style[p] || '');
				if (pv){
					if (pv.indexOf('%') == -1){
						pv = parseInt(pv);
						if (isNaN(pv)){
							pv = undefined;
						}
					}
					options[p] = pv;
				}
			});
				
			if (properties){
				var opts = {};
				for(var i=0; i<properties.length; i++){
					var pp = properties[i];
					if (typeof pp == 'string'){
						opts[pp] = t.attr(pp);
					} else {
						for(var name in pp){
							var type = pp[name];
							if (type == 'boolean'){
								opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
							} else if (type == 'number'){
								opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
							}
						}
					}
				}
				$.extend(options, opts);
			}
			return options;
		}
	};
	$(function(){
		var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"></div>').appendTo('body');
		$._boxModel = d.outerWidth()!=100;
		d.remove();
		d = $('<div style="position:fixed"></div>').appendTo('body');
		$._positionFixed = (d.css('position') == 'fixed');
		d.remove();
		
		if (!window.easyloader && $.parser.auto){
			$.parser.parse();
		}
	});
	
	/**
	 * extend plugin to set box model width
	 */
	$.fn._outerWidth = function(width){
		if (width == undefined){
			if (this[0] == window){
				return this.width() || document.body.clientWidth;
			}
			return this.outerWidth()||0;
		}
		return this._size('width', width);
	};
	
	/**
	 * extend plugin to set box model height
	 */
	$.fn._outerHeight = function(height){
		if (height == undefined){
			if (this[0] == window){
				return this.height() || document.body.clientHeight;
			}
			return this.outerHeight()||0;
		}
		return this._size('height', height);
	};
	
	$.fn._scrollLeft = function(left){
		if (left == undefined){
			return this.scrollLeft();
		} else {
			return this.each(function(){$(this).scrollLeft(left)});
		}
	};
	
	$.fn._propAttr = $.fn.prop || $.fn.attr;
	
	$.fn._size = function(options, parent){
		if (typeof options == 'string'){
			if (options == 'clear'){
				return this.each(function(){
					$(this).css({width:'',minWidth:'',maxWidth:'',height:'',minHeight:'',maxHeight:''});
				});
			} else if (options == 'fit'){
				return this.each(function(){
					_fit(this, this.tagName=='BODY' ? $('body') : $(this).parent(), true);
				});
			} else if (options == 'unfit'){
				return this.each(function(){
					_fit(this, $(this).parent(), false);
				});
			} else {
				if (parent == undefined){
					return _css(this[0], options);
				} else {
					return this.each(function(){
						_css(this, options, parent);
					});
				}
			}
		} else {
			return this.each(function(){
				parent = parent || $(this).parent();
				$.extend(options, _fit(this, parent, options.fit)||{});
				var r1 = _setSize(this, 'width', parent, options);
				var r2 = _setSize(this, 'height', parent, options);
				if (r1 || r2){
					$(this).addClass('nestui-fluid');
				} else {
					$(this).removeClass('nestui-fluid');
				}
			});
		}
		
		function _fit(target, parent, fit){
			if (!parent.length){return false;}
			var t = $(target)[0];
			var p = parent[0];
			var fcount = p.fcount || 0;
			if (fit){
				if (!t.fitted){
					t.fitted = true;
					p.fcount = fcount + 1;
					$(p).addClass('panel-noscroll');
					if (p.tagName == 'BODY'){
						$('html').addClass('panel-fit');
					}
				}
				return {
					width: ($(p).width()||1),
					height: ($(p).height()||1)
				};
			} else {
				if (t.fitted){
					t.fitted = false;
					p.fcount = fcount - 1;
					if (p.fcount == 0){
						$(p).removeClass('panel-noscroll');
						if (p.tagName == 'BODY'){
							$('html').removeClass('panel-fit');
						}
					}
				}
				return false;
			}
		}
		function _setSize(target, property, parent, options){
			var t = $(target);
			var p = property;
			var p1 = p.substr(0,1).toUpperCase() + p.substr(1);
			var min = $.parser.parseValue('min'+p1, options['min'+p1], parent);// || 0;
			var max = $.parser.parseValue('max'+p1, options['max'+p1], parent);// || 99999;
			var val = $.parser.parseValue(p, options[p], parent);
			var fluid = (String(options[p]||'').indexOf('%') >= 0 ? true : false);
			
			if (!isNaN(val)){
				var v = Math.min(Math.max(val, min||0), max||99999);
				if (!fluid){
					options[p] = v;
				}
				t._size('min'+p1, '');
				t._size('max'+p1, '');
				t._size(p, v);
			} else {
				t._size(p, '');
				t._size('min'+p1, min);
				t._size('max'+p1, max);
			}
			return fluid || options.fit;
		}
		function _css(target, property, value){
			var t = $(target);
			if (value == undefined){
				value = parseInt(target.style[property]);
				if (isNaN(value)){return undefined;}
				if ($._boxModel){
					value += getDeltaSize();
				}
				return value;
			} else if (value === ''){
				t.css(property, '');
			} else {
				if ($._boxModel){
					value -= getDeltaSize();
					if (value < 0){value = 0;}
				}
				t.css(property, value+'px');
			}
			function getDeltaSize(){
				if (property.toLowerCase().indexOf('width') >= 0){
					return t.outerWidth() - t.width();
				} else {
					return t.outerHeight() - t.height();
				}
			}
		}
	};
	
})(jQuery);

/**
 * support for mobile devices
 */
(function($){
	var longTouchTimer = null;
	var dblTouchTimer = null;
	var isDblClick = false;
	
	function onTouchStart(e){
		if (e.touches.length != 1){return}
		if (!isDblClick){
			isDblClick = true;
			dblClickTimer = setTimeout(function(){
				isDblClick = false;
			}, 500);
		} else {
			clearTimeout(dblClickTimer);
			isDblClick = false;
			fire(e, 'dblclick');
//			e.preventDefault();
		}
		longTouchTimer = setTimeout(function(){
			fire(e, 'contextmenu', 3);
		}, 1000);
		fire(e, 'mousedown');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchMove(e){
		if (e.touches.length != 1){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mousemove');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchEnd(e){
//		if (e.touches.length > 0){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mouseup');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	
	function fire(e, name, which){
		var event = new $.Event(name);
		event.pageX = e.changedTouches[0].pageX;
		event.pageY = e.changedTouches[0].pageY;
		event.which = which || 1;
		$(e.target).trigger(event);
	}
	
	if (document.addEventListener){
		document.addEventListener("touchstart", onTouchStart, true);
		document.addEventListener("touchmove", onTouchMove, true);
		document.addEventListener("touchend", onTouchEnd, true);
	}
})(jQuery);

﻿/**
 * draggable
 * 
 */
(function($){
	function drag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		
		var dragData = e.data;
		var left = dragData.startLeft + e.pageX - dragData.startX;
		var top = dragData.startTop + e.pageY - dragData.startY;
		
		if (proxy){
			if (proxy.parent()[0] == document.body){
				if (opts.deltaX != null && opts.deltaX != undefined){
					left = e.pageX + opts.deltaX;
				} else {
					left = e.pageX - e.data.offsetWidth;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top = e.pageY + opts.deltaY;
				} else {
					top = e.pageY - e.data.offsetHeight;
				}
			} else {
				if (opts.deltaX != null && opts.deltaX != undefined){
					left += e.data.offsetWidth + opts.deltaX;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top += e.data.offsetHeight + opts.deltaY;
				}
			}
		}
		
		if (e.data.parent != document.body) {
			left += $(e.data.parent).scrollLeft();
			top += $(e.data.parent).scrollTop();
		}
		
		if (opts.axis == 'h') {
			dragData.left = left;
		} else if (opts.axis == 'v') {
			dragData.top = top;
		} else {
			dragData.left = left;
			dragData.top = top;
		}
	}
	
	function applyDrag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		if (!proxy){
			proxy = $(e.data.target);
		}
		proxy.css({
			left:e.data.left,
			top:e.data.top
		});
		$('body').css('cursor', opts.cursor);
	}
	
	function doDown(e){
		if (!$.fn.draggable.isDragging){return false;}
		
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;

		var droppables = $('.droppable:visible').filter(function(){
			return e.data.target != this;
		}).filter(function(){
			var accept = $.data(this, 'droppable').options.accept;
			if (accept){
				return $(accept).filter(function(){
					return this == e.data.target;
				}).length > 0;
			} else {
				return true;
			}
		});
		state.droppables = droppables;
		
		var proxy = state.proxy;
		if (!proxy){
			if (opts.proxy){
				if (opts.proxy == 'clone'){
					proxy = $(e.data.target).clone().insertAfter(e.data.target);
				} else {
					proxy = opts.proxy.call(e.data.target, e.data.target);
				}
				state.proxy = proxy;
			} else {
				proxy = $(e.data.target);
			}
		}
		
		proxy.css('position', 'absolute');
		drag(e);
		applyDrag(e);
		
		opts.onStartDrag.call(e.data.target, e);
		return false;
	}
	
	function doMove(e){
		if (!$.fn.draggable.isDragging){return false;}
		
		var state = $.data(e.data.target, 'draggable');
		drag(e);
		if (state.options.onDrag.call(e.data.target, e) != false){
			applyDrag(e);
		}
		
		var source = e.data.target;
		state.droppables.each(function(){
			var dropObj = $(this);
			if (dropObj.droppable('options').disabled){return;}
			
			var p2 = dropObj.offset();
			if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
					&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
				if (!this.entered){
					$(this).trigger('_dragenter', [source]);
					this.entered = true;
				}
				$(this).trigger('_dragover', [source]);
			} else {
				if (this.entered){
					$(this).trigger('_dragleave', [source]);
					this.entered = false;
				}
			}
		});
		
		return false;
	}
	
	function doUp(e){
		if (!$.fn.draggable.isDragging){
			clearDragging();
			return false;
		}
		
		doMove(e);
		
		var state = $.data(e.data.target, 'draggable');
		var proxy = state.proxy;
		var opts = state.options;
		if (opts.revert){
			if (checkDrop() == true){
				$(e.data.target).css({
					position:e.data.startPosition,
					left:e.data.startLeft,
					top:e.data.startTop
				});
			} else {
				if (proxy){
					var left, top;
					if (proxy.parent()[0] == document.body){
						left = e.data.startX - e.data.offsetWidth;
						top = e.data.startY - e.data.offsetHeight;
					} else {
						left = e.data.startLeft;
						top = e.data.startTop;
					}
					proxy.animate({
						left: left,
						top: top
					}, function(){
						removeProxy();
					});
				} else {
					$(e.data.target).animate({
						left:e.data.startLeft,
						top:e.data.startTop
					}, function(){
						$(e.data.target).css('position', e.data.startPosition);
					});
				}
			}
		} else {
			$(e.data.target).css({
				position:'absolute',
				left:e.data.left,
				top:e.data.top
			});
			checkDrop();
		}
		
		opts.onStopDrag.call(e.data.target, e);
		
		clearDragging();
		
		function removeProxy(){
			if (proxy){
				proxy.remove();
			}
			state.proxy = null;
		}
		
		function checkDrop(){
			var dropped = false;
			state.droppables.each(function(){
				var dropObj = $(this);
				if (dropObj.droppable('options').disabled){return;}
				
				var p2 = dropObj.offset();
				if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
						&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
					if (opts.revert){
						$(e.data.target).css({
							position:e.data.startPosition,
							left:e.data.startLeft,
							top:e.data.startTop
						});
					}
					$(this).trigger('_drop', [e.data.target]);
					removeProxy();
					dropped = true;
					this.entered = false;
					return false;
				}
			});
			if (!dropped && !opts.revert){
				removeProxy();
			}
			return dropped;
		}
		
		return false;
	}
	
	function clearDragging(){
		if ($.fn.draggable.timer){
			clearTimeout($.fn.draggable.timer);
			$.fn.draggable.timer = undefined;
		}
		$(document).unbind('.draggable');
		$.fn.draggable.isDragging = false;
		setTimeout(function(){
			$('body').css('cursor','');
		},100);
	}
	
	$.fn.draggable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.draggable.methods[options](this, param);
		}
		
		return this.each(function(){
			var opts;
			var state = $.data(this, 'draggable');
			if (state) {
				state.handle.unbind('.draggable');
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.draggable.defaults, $.fn.draggable.parseOptions(this), options || {});
			}
			var handle = opts.handle ? (typeof opts.handle=='string' ? $(opts.handle, this) : opts.handle) : $(this);
			
			$.data(this, 'draggable', {
				options: opts,
				handle: handle
			});
			
			if (opts.disabled) {
				$(this).css('cursor', '');
				return;
			}
			
			handle.unbind('.draggable').bind('mousemove.draggable', {target:this}, function(e){
				if ($.fn.draggable.isDragging){return}
				var opts = $.data(e.data.target, 'draggable').options;
				if (checkArea(e)){
					$(this).css('cursor', opts.cursor);
				} else {
					$(this).css('cursor', '');
				}
			}).bind('mouseleave.draggable', {target:this}, function(e){
				$(this).css('cursor', '');
			}).bind('mousedown.draggable', {target:this}, function(e){
				if (checkArea(e) == false) return;
				$(this).css('cursor', '');

				var position = $(e.data.target).position();
				var offset = $(e.data.target).offset();
				var data = {
					startPosition: $(e.data.target).css('position'),
					startLeft: position.left,
					startTop: position.top,
					left: position.left,
					top: position.top,
					startX: e.pageX,
					startY: e.pageY,
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					offsetWidth: (e.pageX - offset.left),
					offsetHeight: (e.pageY - offset.top),
					target: e.data.target,
					parent: $(e.data.target).parent()[0]
				};
				
				$.extend(e.data, data);
				var opts = $.data(e.data.target, 'draggable').options;
				if (opts.onBeforeDrag.call(e.data.target, e) == false) return;
				
				$(document).bind('mousedown.draggable', e.data, doDown);
				$(document).bind('mousemove.draggable', e.data, doMove);
				$(document).bind('mouseup.draggable', e.data, doUp);
				
				$.fn.draggable.timer = setTimeout(function(){
					$.fn.draggable.isDragging = true;
					doDown(e);
				}, opts.delay);
				return false;
			});
			
			// check if the handle can be dragged
			function checkArea(e) {
				var state = $.data(e.data.target, 'draggable');
				var handle = state.handle;
				var offset = $(handle).offset();
				var width = $(handle).outerWidth();
				var height = $(handle).outerHeight();
				var t = e.pageY - offset.top;
				var r = offset.left + width - e.pageX;
				var b = offset.top + height - e.pageY;
				var l = e.pageX - offset.left;
				
				return Math.min(t,r,b,l) > state.options.edge;
			}
			
		});
	};
	
	$.fn.draggable.methods = {
		options: function(jq){
			return $.data(jq[0], 'draggable').options;
		},
		proxy: function(jq){
			return $.data(jq[0], 'draggable').proxy;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:true});
			});
		}
	};
	
	$.fn.draggable.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, 
				$.parser.parseOptions(target, ['cursor','handle','axis',
				       {'revert':'boolean','deltaX':'number','deltaY':'number','edge':'number','delay':'number'}]), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.draggable.defaults = {
		proxy:null,	// 'clone' or a function that will create the proxy object, 
					// the function has the source parameter that indicate the source object dragged.
		revert:false,
		cursor:'move',
		deltaX:null,
		deltaY:null,
		handle: null,
		disabled: false,
		edge:0,
		axis:null,	// v or h
		delay:100,
		
		onBeforeDrag: function(e){},
		onStartDrag: function(e){},
		onDrag: function(e){},
		onStopDrag: function(e){}
	};
	
	$.fn.draggable.isDragging = false;
	
})(jQuery);
﻿/**
 * droppable
 * 
 */
(function($){
	function init(target){
		$(target).addClass('droppable');
		$(target).bind('_dragenter', function(e, source){
			$.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
		});
		$(target).bind('_dragleave', function(e, source){
			$.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
		});
		$(target).bind('_dragover', function(e, source){
			$.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
		});
		$(target).bind('_drop', function(e, source){
			$.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
		});
	}
	
	$.fn.droppable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.droppable.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'droppable');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'droppable', {
					options: $.extend({}, $.fn.droppable.defaults, $.fn.droppable.parseOptions(this), options)
				});
			}
		});
	};
	
	$.fn.droppable.methods = {
		options: function(jq){
			return $.data(jq[0], 'droppable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:true});
			});
		}
	};
	
	$.fn.droppable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},	$.parser.parseOptions(target, ['accept']), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.droppable.defaults = {
		accept:null,
		disabled:false,
		onDragEnter:function(e, source){},
		onDragOver:function(e, source){},
		onDragLeave:function(e, source){},
		onDrop:function(e, source){}
	};
})(jQuery);
﻿/**
 * resizable 
 * 
 */
(function($){
//	var isResizing = false;
	$.fn.resizable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.resizable.methods[options](this, param);
		}
		
		function resize(e){
			var resizeData = e.data;
			var options = $.data(resizeData.target, 'resizable').options;
			if (resizeData.dir.indexOf('e') != -1) {
				var width = resizeData.startWidth + e.pageX - resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
			}
			if (resizeData.dir.indexOf('s') != -1) {
				var height = resizeData.startHeight + e.pageY - resizeData.startY;
				height = Math.min(
						Math.max(height, options.minHeight),
						options.maxHeight
				);
				resizeData.height = height;
			}
			if (resizeData.dir.indexOf('w') != -1) {
				var width = resizeData.startWidth - e.pageX + resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
				resizeData.left = resizeData.startLeft + resizeData.startWidth - resizeData.width;
				
//				resizeData.width = resizeData.startWidth - e.pageX + resizeData.startX;
//				if (resizeData.width >= options.minWidth && resizeData.width <= options.maxWidth) {
//					resizeData.left = resizeData.startLeft + e.pageX - resizeData.startX;
//				}
			}
			if (resizeData.dir.indexOf('n') != -1) {
				var height = resizeData.startHeight - e.pageY + resizeData.startY;
				height = Math.min(
							Math.max(height, options.minHeight),
							options.maxHeight
						);
				resizeData.height = height;
				resizeData.top = resizeData.startTop + resizeData.startHeight - resizeData.height;
				
//				resizeData.height = resizeData.startHeight - e.pageY + resizeData.startY;
//				if (resizeData.height >= options.minHeight && resizeData.height <= options.maxHeight) {
//					resizeData.top = resizeData.startTop + e.pageY - resizeData.startY;
//				}
			}
		}
		
		function applySize(e){
			var resizeData = e.data;
			var t = $(resizeData.target);
			t.css({
				left: resizeData.left,
				top: resizeData.top
			});
			if (t.outerWidth() != resizeData.width){t._outerWidth(resizeData.width)}
			if (t.outerHeight() != resizeData.height){t._outerHeight(resizeData.height)}
//			t._outerWidth(resizeData.width)._outerHeight(resizeData.height);
		}
		
		function doDown(e){
//			isResizing = true;
			$.fn.resizable.isResizing = true;
			$.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e);
			return false;
		}
		
		function doMove(e){
			resize(e);
			if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false){
				applySize(e)
			}
			return false;
		}
		
		function doUp(e){
//			isResizing = false;
			$.fn.resizable.isResizing = false;
			resize(e, true);
			applySize(e);
			$.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e);
			$(document).unbind('.resizable');
			$('body').css('cursor','');
//			$('body').css('cursor','auto');
			return false;
		}
		
		return this.each(function(){
			var opts = null;
			var state = $.data(this, 'resizable');
			if (state) {
				$(this).unbind('.resizable');
				opts = $.extend(state.options, options || {});
			} else {
				opts = $.extend({}, $.fn.resizable.defaults, $.fn.resizable.parseOptions(this), options || {});
				$.data(this, 'resizable', {
					options:opts
				});
			}
			
			if (opts.disabled == true) {
				return;
			}
			
			// bind mouse event using namespace resizable
			$(this).bind('mousemove.resizable', {target:this}, function(e){
//				if (isResizing) return;
				if ($.fn.resizable.isResizing){return}
				var dir = getDirection(e);
				if (dir == '') {
					$(e.data.target).css('cursor', '');
				} else {
					$(e.data.target).css('cursor', dir + '-resize');
				}
			}).bind('mouseleave.resizable', {target:this}, function(e){
				$(e.data.target).css('cursor', '');
			}).bind('mousedown.resizable', {target:this}, function(e){
				var dir = getDirection(e);
				if (dir == '') return;
				
				function getCssValue(css) {
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val)) {
						return 0;
					} else {
						return val;
					}
				}
				
				var data = {
					target: e.data.target,
					dir: dir,
					startLeft: getCssValue('left'),
					startTop: getCssValue('top'),
					left: getCssValue('left'),
					top: getCssValue('top'),
					startX: e.pageX,
					startY: e.pageY,
					startWidth: $(e.data.target).outerWidth(),
					startHeight: $(e.data.target).outerHeight(),
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind('mousedown.resizable', data, doDown);
				$(document).bind('mousemove.resizable', data, doMove);
				$(document).bind('mouseup.resizable', data, doUp);
				$('body').css('cursor', dir+'-resize');
			});
			
			// get the resize direction
			function getDirection(e) {
				var tt = $(e.data.target);
				var dir = '';
				var offset = tt.offset();
				var width = tt.outerWidth();
				var height = tt.outerHeight();
				var edge = opts.edge;
				if (e.pageY > offset.top && e.pageY < offset.top + edge) {
					dir += 'n';
				} else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
					dir += 's';
				}
				if (e.pageX > offset.left && e.pageX < offset.left + edge) {
					dir += 'w';
				} else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
					dir += 'e';
				}
				
				var handles = opts.handles.split(',');
				for(var i=0; i<handles.length; i++) {
					var handle = handles[i].replace(/(^\s*)|(\s*$)/g, '');
					if (handle == 'all' || handle == dir) {
						return dir;
					}
				}
				return '';
			}
			
			
		});
	};
	
	$.fn.resizable.methods = {
		options: function(jq){
			return $.data(jq[0], 'resizable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:true});
			});
		}
	};
	
	$.fn.resizable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					'handles',{minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number',edge:'number'}
				]), {
			disabled: (t.attr('disabled') ? true : undefined)
		})
	};
	
	$.fn.resizable.defaults = {
		disabled:false,
		handles:'n, e, s, w, ne, se, sw, nw, all',
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,//$(document).width(),
		maxHeight: 10000,//$(document).height(),
		edge:5,
		onStartResize: function(e){},
		onResize: function(e){},
		onStopResize: function(e){}
	};
	
	$.fn.resizable.isResizing = false;
	
})(jQuery);
﻿/**
 * linkbutton
 * 
 */
(function($){
	function setSize(target, param){
		var opts = $.data(target, 'linkbutton').options;
		if (param){
			$.extend(opts, param);
		}
		if (opts.width || opts.height || opts.fit){
			var btn = $(target);
			var parent = btn.parent();
			var isVisible = btn.is(':visible');
			if (!isVisible){
				var spacer = $('<div style="display:none"></div>').insertBefore(target);
				var style = {
					position: btn.css('position'),
					display: btn.css('display'),
					left: btn.css('left')
				};
				btn.appendTo('body');
				btn.css({
					position: 'absolute',
					display: 'inline-block',
					left: -20000
				});
			}
			btn._size(opts, parent);
			var left = btn.find('.l-btn-left');
			left.css('margin-top', 0);
			left.css('margin-top', parseInt((btn.height()-left.height())/2)+'px');
			if (!isVisible){
				btn.insertAfter(spacer);
				btn.css(style);
				spacer.remove();
			}
		}
	}
	
	function createButton(target) {
		var opts = $.data(target, 'linkbutton').options;
		var t = $(target).empty();
		
		t.addClass('l-btn').removeClass('l-btn-plain l-btn-selected l-btn-plain-selected l-btn-outline');
		t.removeClass('l-btn-small l-btn-medium l-btn-large').addClass('l-btn-'+opts.size);
		if (opts.plain){t.addClass('l-btn-plain')}
		if (opts.outline){t.addClass('l-btn-outline')}
		if (opts.selected){
			t.addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
		}
		t.attr('group', opts.group || '');
		t.attr('id', opts.id || '');
		
		var inner = $('<span class="l-btn-left"></span>').appendTo(t);
		if (opts.text){
			$('<span class="l-btn-text"></span>').html(opts.text).appendTo(inner);
		} else {
			$('<span class="l-btn-text l-btn-empty">&nbsp;</span>').appendTo(inner);
		}
		if (opts.iconCls){
			$('<span class="l-btn-icon">&nbsp;</span>').addClass(opts.iconCls).appendTo(inner);
			inner.addClass('l-btn-icon-'+opts.iconAlign);
		}
		
		t.unbind('.linkbutton').bind('focus.linkbutton',function(){
			if (!opts.disabled){
				$(this).addClass('l-btn-focus');
			}
		}).bind('blur.linkbutton',function(){
			$(this).removeClass('l-btn-focus');
		}).bind('click.linkbutton',function(){
			if (!opts.disabled){
				if (opts.toggle){
					if (opts.selected){
						$(this).linkbutton('unselect');
					} else {
						$(this).linkbutton('select');
					}
				}
				opts.onClick.call(this);
			}
//			return false;
		});
//		if (opts.toggle && !opts.disabled){
//			t.bind('click.linkbutton', function(){
//				if (opts.selected){
//					$(this).linkbutton('unselect');
//				} else {
//					$(this).linkbutton('select');
//				}
//			});
//		}
		
		setSelected(target, opts.selected)
		setDisabled(target, opts.disabled);
	}
	
	function setSelected(target, selected){
		var opts = $.data(target, 'linkbutton').options;
		if (selected){
			if (opts.group){
				$('a.l-btn[group="'+opts.group+'"]').each(function(){
					var o = $(this).linkbutton('options');
					if (o.toggle){
						$(this).removeClass('l-btn-selected l-btn-plain-selected');
						o.selected = false;
					}
				});
			}
			$(target).addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
			opts.selected = true;
		} else {
			if (!opts.group){
				$(target).removeClass('l-btn-selected l-btn-plain-selected');
				opts.selected = false;
			}
		}
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'linkbutton');
		var opts = state.options;
		$(target).removeClass('l-btn-disabled l-btn-plain-disabled');
		if (disabled){
			opts.disabled = true;
			var href = $(target).attr('href');
			if (href){
				state.href = href;
				$(target).attr('href', 'javascript:void(0)');
			}
			if (target.onclick){
				state.onclick = target.onclick;
				target.onclick = null;
			}
			opts.plain ? $(target).addClass('l-btn-disabled l-btn-plain-disabled') : $(target).addClass('l-btn-disabled');
		} else {
			opts.disabled = false;
			if (state.href) {
				$(target).attr('href', state.href);
			}
			if (state.onclick) {
				target.onclick = state.onclick;
			}
		}
	}
	
	$.fn.linkbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.linkbutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'linkbutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'linkbutton', {
					options: $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
				$(this).bind('_resize', function(e, force){
					if ($(this).hasClass('nestui-fluid') || force){
						setSize(this);
					}
					return false;
				});
			}
			
			createButton(this);
			setSize(this);
		});
	};
	
	$.fn.linkbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'linkbutton').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		select: function(jq){
			return jq.each(function(){
				setSelected(this, true);
			});
		},
		unselect: function(jq){
			return jq.each(function(){
				setSelected(this, false);
			});
		}
	};
	
	$.fn.linkbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['id','iconCls','iconAlign','group','size','text',{plain:'boolean',toggle:'boolean',selected:'boolean',outline:'boolean'}]
		), {
			disabled: (t.attr('disabled') ? true : undefined),
			text: ($.trim(t.html()) || undefined),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		});
	};
	
	$.fn.linkbutton.defaults = {
		id: null,
		disabled: false,
		toggle: false,
		selected: false,
		outline: false,
		group: null,
		plain: false,
		text: '',
		iconCls: null,
		iconAlign: 'left',
		size: 'small',	// small,large
		onClick: function(){}
	};
	
})(jQuery);
﻿/**
 * pagination
 * 
 */
(function($){
function _1(_2){
var _3=$.data(_2,"pagination");
var _4=_3.options;
var bb=_3.bb={};
var _5=$(_2).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
var tr=_5.find("tr");
var aa=$.extend([],_4.layout);
if(!_4.showPageList){
_6(aa,"list");
}
if(!_4.showRefresh){
_6(aa,"refresh");
}
if(aa[0]=="sep"){
aa.shift();
}
if(aa[aa.length-1]=="sep"){
aa.pop();
}
for(var _7=0;_7<aa.length;_7++){
var _8=aa[_7];
if(_8=="list"){
var ps=$("<select class=\"pagination-page-list\"></select>");
ps.bind("change",function(){
_4.pageSize=parseInt($(this).val());
_4.onChangePageSize.call(_2,_4.pageSize);
_10(_2,_4.pageNumber);
});
for(var i=0;i<_4.pageList.length;i++){
$("<option></option>").text(_4.pageList[i]).appendTo(ps);
}
$("<td></td>").append(ps).appendTo(tr);
}else{
if(_8=="sep"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
if(_8=="first"){
bb.first=_9("first");
}else{
if(_8=="prev"){
bb.prev=_9("prev");
}else{
if(_8=="next"){
bb.next=_9("next");
}else{
if(_8=="last"){
bb.last=_9("last");
}else{
if(_8=="manual"){
$("<span style=\"padding-left:6px;\"></span>").html(_4.beforePageText).appendTo(tr).wrap("<td></td>");
bb.num=$("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
bb.num.unbind(".pagination").bind("keydown.pagination",function(e){
if(e.keyCode==13){
var _a=parseInt($(this).val())||1;
_10(_2,_a);
return false;
}
});
bb.after=$("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
}else{
if(_8=="refresh"){
bb.refresh=_9("refresh");
}else{
if(_8=="links"){
$("<td class=\"pagination-links\"></td>").appendTo(tr);
}
}
}
}
}
}
}
}
}
}
if(_4.buttons){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
if($.isArray(_4.buttons)){
for(var i=0;i<_4.buttons.length;i++){
var _b=_4.buttons[i];
if(_b=="-"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
a[0].onclick=eval(_b.handler||function(){
});
a.linkbutton($.extend({},_b,{plain:true}));
}
}
}else{
var td=$("<td></td>").appendTo(tr);
$(_4.buttons).appendTo(td).show();
}
}
$("<div class=\"pagination-info\"></div>").appendTo(_5);
$("<div style=\"clear:both;\"></div>").appendTo(_5);
function _9(_c){
var _d=_4.nav[_c];
var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
a.wrap("<td></td>");
a.linkbutton({iconCls:_d.iconCls,plain:true}).unbind(".pagination").bind("click.pagination",function(){
_d.handler.call(_2);
});
return a;
};
function _6(aa,_e){
var _f=$.inArray(_e,aa);
if(_f>=0){
aa.splice(_f,1);
}
return aa;
};
};
function _10(_11,_12){
var _13=$.data(_11,"pagination").options;
_14(_11,{pageNumber:_12});
_13.onSelectPage.call(_11,_13.pageNumber,_13.pageSize);
};
function _14(_15,_16){
var _17=$.data(_15,"pagination");
var _18=_17.options;
var bb=_17.bb;
$.extend(_18,_16||{});
var ps=$(_15).find("select.pagination-page-list");
if(ps.length){
ps.val(_18.pageSize+"");
_18.pageSize=parseInt(ps.val());
}
var _19=Math.ceil(_18.total/_18.pageSize)||1;
if(_18.pageNumber<1){
_18.pageNumber=1;
}
if(_18.pageNumber>_19){
_18.pageNumber=_19;
}
if(_18.total==0){
_18.pageNumber=0;
_19=0;
}
if(bb.num){
bb.num.val(_18.pageNumber);
}
if(bb.after){
bb.after.html(_18.afterPageText.replace(/{pages}/,_19));
}
var td=$(_15).find("td.pagination-links");
if(td.length){
td.empty();
var _1a=_18.pageNumber-Math.floor(_18.links/2);
if(_1a<1){
_1a=1;
}
var _1b=_1a+_18.links-1;
if(_1b>_19){
_1b=_19;
}
_1a=_1b-_18.links+1;
if(_1a<1){
_1a=1;
}
for(var i=_1a;i<=_1b;i++){
var a=$("<a class=\"pagination-link\" href=\"javascript:void(0)\"></a>").appendTo(td);
a.linkbutton({plain:true,text:i});
if(i==_18.pageNumber){
a.linkbutton("select");
}else{
a.unbind(".pagination").bind("click.pagination",{pageNumber:i},function(e){
_10(_15,e.data.pageNumber);
});
}
}
}
var _1c=_18.displayMsg;
_1c=_1c.replace(/{from}/,_18.total==0?0:_18.pageSize*(_18.pageNumber-1)+1);
_1c=_1c.replace(/{to}/,Math.min(_18.pageSize*(_18.pageNumber),_18.total));
_1c=_1c.replace(/{total}/,_18.total);
$(_15).find("div.pagination-info").html(_1c);
if(bb.first){
bb.first.linkbutton({disabled:((!_18.total)||_18.pageNumber==1)});
}
if(bb.prev){
bb.prev.linkbutton({disabled:((!_18.total)||_18.pageNumber==1)});
}
if(bb.next){
bb.next.linkbutton({disabled:(_18.pageNumber==_19)});
}
if(bb.last){
bb.last.linkbutton({disabled:(_18.pageNumber==_19)});
}
_1d(_15,_18.loading);
};
function _1d(_1e,_1f){
var _20=$.data(_1e,"pagination");
var _21=_20.options;
_21.loading=_1f;
if(_21.showRefresh&&_20.bb.refresh){
_20.bb.refresh.linkbutton({iconCls:(_21.loading?"pagination-loading":"pagination-load")});
}
};
$.fn.pagination=function(_22,_23){
if(typeof _22=="string"){
return $.fn.pagination.methods[_22](this,_23);
}
_22=_22||{};
return this.each(function(){
var _24;
var _25=$.data(this,"pagination");
if(_25){
_24=$.extend(_25.options,_22);
}else{
_24=$.extend({},$.fn.pagination.defaults,$.fn.pagination.parseOptions(this),_22);
$.data(this,"pagination",{options:_24});
}
_1(this);
_14(this);
});
};
$.fn.pagination.methods={options:function(jq){
return $.data(jq[0],"pagination").options;
},loading:function(jq){
return jq.each(function(){
_1d(this,true);
});
},loaded:function(jq){
return jq.each(function(){
_1d(this,false);
});
},refresh:function(jq,_26){
return jq.each(function(){
_14(this,_26);
});
},select:function(jq,_27){
return jq.each(function(){
_10(this,_27);
});
}};
$.fn.pagination.parseOptions=function(_28){
var t=$(_28);
return $.extend({},$.parser.parseOptions(_28,[{total:"number",pageSize:"number",pageNumber:"number",links:"number"},{loading:"boolean",showPageList:"boolean",showRefresh:"boolean"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined)});
};
$.fn.pagination.defaults={total:1,pageSize:10,pageNumber:1,pageList:[10,20,30,50],loading:false,buttons:null,showPageList:true,showRefresh:true,links:10,layout:["list","sep","first","prev","sep","manual","sep","next","last","sep","refresh"],onSelectPage:function(_29,_2a){
},onBeforeRefresh:function(_2b,_2c){
},onRefresh:function(_2d,_2e){
},onChangePageSize:function(_2f){
},beforePageText:"Page",afterPageText:"of {pages}",displayMsg:"Displaying {from} to {to} of {total} items",nav:{first:{iconCls:"pagination-first",handler:function(){
var _30=$(this).pagination("options");
if(_30.pageNumber>1){
$(this).pagination("select",1);
}
}},prev:{iconCls:"pagination-prev",handler:function(){
var _31=$(this).pagination("options");
if(_31.pageNumber>1){
$(this).pagination("select",_31.pageNumber-1);
}
}},next:{iconCls:"pagination-next",handler:function(){
var _32=$(this).pagination("options");
var _33=Math.ceil(_32.total/_32.pageSize);
if(_32.pageNumber<_33){
$(this).pagination("select",_32.pageNumber+1);
}
}},last:{iconCls:"pagination-last",handler:function(){
var _34=$(this).pagination("options");
var _35=Math.ceil(_34.total/_34.pageSize);
if(_34.pageNumber<_35){
$(this).pagination("select",_35);
}
}},refresh:{iconCls:"pagination-refresh",handler:function(){
var _36=$(this).pagination("options");
if(_36.onBeforeRefresh.call(this,_36.pageNumber,_36.pageSize)!=false){
$(this).pagination("select",_36.pageNumber);
_36.onRefresh.call(this,_36.pageNumber,_36.pageSize);
}
}}}};
})(jQuery);

﻿/**
 * tree
 */
(function($) {
	function _1(_2) {
		var _3 = $(_2);
		_3.addClass("tree");
		return _3;
	}
	;
	function _4(_5) {
		var _6 = $.data(_5, "tree").options;
		$(_5).unbind().bind("mouseover", function(e) {
			var tt = $(e.target);
			var _7 = tt.closest("div.tree-node");
			if (!_7.length) {
				return;
			}
			_7.addClass("tree-node-hover");
			if (tt.hasClass("tree-hit")) {
				if (tt.hasClass("tree-expanded")) {
					tt.addClass("tree-expanded-hover");
				} else {
					tt.addClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("mouseout", function(e) {
			var tt = $(e.target);
			var _8 = tt.closest("div.tree-node");
			if (!_8.length) {
				return;
			}
			_8.removeClass("tree-node-hover");
			if (tt.hasClass("tree-hit")) {
				if (tt.hasClass("tree-expanded")) {
					tt.removeClass("tree-expanded-hover");
				} else {
					tt.removeClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("click", function(e) {
			var tt = $(e.target);
			var _9 = tt.closest("div.tree-node");
			if (!_9.length) {
				return;
			}
			if (tt.hasClass("tree-hit")) {
				_85(_5, _9[0]);
				return false;
			} else {
				if (tt.hasClass("tree-checkbox")) {
					_34(_5, _9[0]);
					return false;
				} else {
					_d9(_5, _9[0]);
					_6.onClick.call(_5, _c(_5, _9[0]));
				}
			}
			e.stopPropagation();
		}).bind("dblclick", function(e) {
			var _a = $(e.target).closest("div.tree-node");
			if (!_a.length) {
				return;
			}
			_d9(_5, _a[0]);
			_6.onDblClick.call(_5, _c(_5, _a[0]));
			e.stopPropagation();
		}).bind("contextmenu", function(e) {
			var _b = $(e.target).closest("div.tree-node");
			if (!_b.length) {
				return;
			}
			_6.onContextMenu.call(_5, e, _c(_5, _b[0]));
			e.stopPropagation();
		});
	}
	;
	function _d(_e) {
		var _f = $.data(_e, "tree").options;
		_f.dnd = false;
		var _10 = $(_e).find("div.tree-node");
		_10.draggable("disable");
		_10.css("cursor", "pointer");
	}
	;
	function _11(_12) {
		var _13 = $.data(_12, "tree");
		var _14 = _13.options;
		var _15 = _13.tree;
		_13.disabledNodes = [];
		_14.dnd = true;
		_15
				.find("div.tree-node")
				.draggable(
						{
							disabled : false,
							revert : true,
							cursor : "pointer",
							proxy : function(_16) {
								var p = $(
										"<div class=\"tree-node-proxy\"></div>")
										.appendTo("body");
								p
										.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>"
												+ $(_16).find(".tree-title")
														.html());
								p.hide();
								return p;
							},
							deltaX : 15,
							deltaY : 15,
							onBeforeDrag : function(e) {
								if (_14.onBeforeDrag.call(_12, _c(_12, this)) == false) {
									return false;
								}
								if ($(e.target).hasClass("tree-hit")
										|| $(e.target)
												.hasClass("tree-checkbox")) {
									return false;
								}
								if (e.which != 1) {
									return false;
								}
								var _17 = $(this).find("span.tree-indent");
								if (_17.length) {
									e.data.offsetWidth -= _17.length
											* _17.width();
								}
							},
							onStartDrag : function(e) {
								$(this).next("ul").find("div.tree-node").each(
										function() {
											$(this).droppable("disable");
											_13.disabledNodes.push(this);
										});
								$(this).draggable("proxy").css({
									left : -10000,
									top : -10000
								});
								_14.onStartDrag.call(_12, _c(_12, this));
								var _18 = _c(_12, this);
								if (_18.id == undefined) {
									_18.id = "nestui_tree_node_id_temp";
									_60(_12, _18);
								}
								_13.draggingNodeId = _18.id;
							},
							onDrag : function(e) {
								var x1 = e.pageX, y1 = e.pageY, x2 = e.data.startX, y2 = e.data.startY;
								var d = Math.sqrt((x1 - x2) * (x1 - x2)
										+ (y1 - y2) * (y1 - y2));
								if (d > 3) {
									$(this).draggable("proxy").show();
								}
								this.pageY = e.pageY;
							},
							onStopDrag : function() {
								for (var i = 0; i < _13.disabledNodes.length; i++) {
									$(_13.disabledNodes[i]).droppable("enable");
								}
								_13.disabledNodes = [];
								var _19 = _d0(_12, _13.draggingNodeId);
								if (_19 && _19.id == "nestui_tree_node_id_temp") {
									_19.id = "";
									_60(_12, _19);
								}
								_14.onStopDrag.call(_12, _19);
							}
						})
				.droppable(
						{
							accept : "div.tree-node",
							onDragEnter : function(e, _1a) {
								if (_14.onDragEnter.call(_12, this, _1b(_1a)) == false) {
									_1c(_1a, false);
									$(this)
											.removeClass(
													"tree-node-append tree-node-top tree-node-bottom");
									$(this).droppable("disable");
									_13.disabledNodes.push(this);
								}
							},
							onDragOver : function(e, _1d) {
								if ($(this).droppable("options").disabled) {
									return;
								}
								var _1e = _1d.pageY;
								var top = $(this).offset().top;
								var _1f = top + $(this).outerHeight();
								_1c(_1d, true);
								$(this)
										.removeClass(
												"tree-node-append tree-node-top tree-node-bottom");
								if (_1e > top + (_1f - top) / 2) {
									if (_1f - _1e < 5) {
										$(this).addClass("tree-node-bottom");
									} else {
										$(this).addClass("tree-node-append");
									}
								} else {
									if (_1e - top < 5) {
										$(this).addClass("tree-node-top");
									} else {
										$(this).addClass("tree-node-append");
									}
								}
								if (_14.onDragOver.call(_12, this, _1b(_1d)) == false) {
									_1c(_1d, false);
									$(this)
											.removeClass(
													"tree-node-append tree-node-top tree-node-bottom");
									$(this).droppable("disable");
									_13.disabledNodes.push(this);
								}
							},
							onDragLeave : function(e, _20) {
								_1c(_20, false);
								$(this)
										.removeClass(
												"tree-node-append tree-node-top tree-node-bottom");
								_14.onDragLeave.call(_12, this, _1b(_20));
							},
							onDrop : function(e, _21) {
								var _22 = this;
								var _23, _24;
								if ($(this).hasClass("tree-node-append")) {
									_23 = _25;
									_24 = "append";
								} else {
									_23 = _26;
									_24 = $(this).hasClass("tree-node-top") ? "top"
											: "bottom";
								}
								if (_14.onBeforeDrop.call(_12, _22, _1b(_21),
										_24) == false) {
									$(this)
											.removeClass(
													"tree-node-append tree-node-top tree-node-bottom");
									return;
								}
								_23(_21, _22, _24);
								$(this)
										.removeClass(
												"tree-node-append tree-node-top tree-node-bottom");
							}
						});
		function _1b(_27, pop) {
			return $(_27).closest("ul.tree").tree(pop ? "pop" : "getData", _27);
		}
		;
		function _1c(_28, _29) {
			var _2a = $(_28).draggable("proxy").find("span.tree-dnd-icon");
			_2a.removeClass("tree-dnd-yes tree-dnd-no").addClass(
					_29 ? "tree-dnd-yes" : "tree-dnd-no");
		}
		;
		function _25(_2b, _2c) {
			if (_c(_12, _2c).state == "closed") {
				_79(_12, _2c, function() {
					_2d();
				});
			} else {
				_2d();
			}
			function _2d() {
				var _2e = _1b(_2b, true);
				$(_12).tree("append", {
					parent : _2c,
					data : [ _2e ]
				});
				_14.onDrop.call(_12, _2c, _2e, "append");
			}
			;
		}
		;
		function _26(_2f, _30, _31) {
			var _32 = {};
			if (_31 == "top") {
				_32.before = _30;
			} else {
				_32.after = _30;
			}
			var _33 = _1b(_2f, true);
			_32.data = _33;
			$(_12).tree("insert", _32);
			_14.onDrop.call(_12, _30, _33, _31);
		}
		;
	}
	;
	function _34(_35, _36, _37, _38) {
		var _39 = $.data(_35, "tree");
		var _3a = _39.options;
		if (!_3a.checkbox) {
			return;
		}
		var _3b = _c(_35, _36);
		if (!_3b.checkState) {
			return;
		}
		var ck = $(_36).find(".tree-checkbox");
		if (_37 == undefined) {
			if (ck.hasClass("tree-checkbox1")) {
				_37 = false;
			} else {
				if (ck.hasClass("tree-checkbox0")) {
					_37 = true;
				} else {
					if (_3b._checked == undefined) {
						_3b._checked = $(_36).find(".tree-checkbox").hasClass(
								"tree-checkbox1");
					}
					_37 = !_3b._checked;
				}
			}
		}
		_3b._checked = _37;
		if (_37) {
			if (ck.hasClass("tree-checkbox1")) {
				return;
			}
		} else {
			if (ck.hasClass("tree-checkbox0")) {
				return;
			}
		}
		if (!_38) {
			if (_3a.onBeforeCheck.call(_35, _3b, _37) == false) {
				return;
			}
		}
		if (_3a.cascadeCheck) {
			_3c(_35, _3b, _37);
			_3d(_35, _3b);
		} else {
			_3e(_35, _3b, _37 ? "1" : "0");
		}
		if (!_38) {
			_3a.onCheck.call(_35, _3b, _37);
		}
	}
	;
	function _3c(_3f, _40, _41) {
		var _42 = $.data(_3f, "tree").options;
		var _43 = _41 ? 1 : 0;
		_3e(_3f, _40, _43);
		if (_42.deepCheck) {
			$.nestui.forEach(_40.children || [], true, function(n) {
				_3e(_3f, n, _43);
			});
		} else {
			var _44 = [];
			if (_40.children && _40.children.length) {
				_44.push(_40);
			}
			$.nestui.forEach(_40.children || [], true, function(n) {
				if (!n.hidden) {
					_3e(_3f, n, _43);
					if (n.children && n.children.length) {
						_44.push(n);
					}
				}
			});
			for (var i = _44.length - 1; i >= 0; i--) {
				var _45 = _44[i];
				_3e(_3f, _45, _46(_45));
			}
		}
	}
	;
	function _3e(_47, _48, _49) {
		var _4a = $.data(_47, "tree").options;
		if (!_48.checkState || _49 == undefined) {
			return;
		}
		if (_48.hidden && !_4a.deepCheck) {
			return;
		}
		var ck = $("#" + _48.domId).find(".tree-checkbox");
		_48.checkState = [ "unchecked", "checked", "indeterminate" ][_49];
		_48.checked = (_48.checkState == "checked");
		ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
		ck.addClass("tree-checkbox" + _49);
	}
	;
	function _3d(_4b, _4c) {
		var pd = _4d(_4b, $("#" + _4c.domId)[0]);
		if (pd) {
			_3e(_4b, pd, _46(pd));
			_3d(_4b, pd);
		}
	}
	;
	function _46(row) {
		var c0 = 0;
		var c1 = 0;
		var len = 0;
		$.nestui.forEach(row.children || [], false, function(r) {
			if (r.checkState) {
				len++;
				if (r.checkState == "checked") {
					c1++;
				} else {
					if (r.checkState == "unchecked") {
						c0++;
					}
				}
			}
		});
		if (len == 0) {
			return undefined;
		}
		var _4e = 0;
		if (c0 == len) {
			_4e = 0;
		} else {
			if (c1 == len) {
				_4e = 1;
			} else {
				_4e = 2;
			}
		}
		return _4e;
	}
	;
	function _4f(_50, _51) {
		var _52 = $.data(_50, "tree").options;
		if (!_52.checkbox) {
			return;
		}
		var _53 = $(_51);
		var ck = _53.find(".tree-checkbox");
		var _54 = _c(_50, _51);
		if (_52.view.hasCheckbox(_50, _54)) {
			if (!ck.length) {
				_54.checkState = _54.checkState || "unchecked";
				$("<span class=\"tree-checkbox\"></span>").insertBefore(
						_53.find(".tree-title"));
			}
			if (_54.checkState == "checked") {
				_34(_50, _51, true, true);
			} else {
				if (_54.checkState == "unchecked") {
					_34(_50, _51, false, true);
				} else {
					var _55 = _46(_54);
					if (_55 === 0) {
						_34(_50, _51, false, true);
					} else {
						if (_55 === 1) {
							_34(_50, _51, true, true);
						}
					}
				}
			}
		} else {
			ck.remove();
			_54.checkState = undefined;
			_54.checked = undefined;
			_3d(_50, _54);
		}
	}
	;
	function _56(_57, ul, _58, _59, _5a) {
		var _5b = $.data(_57, "tree");
		var _5c = _5b.options;
		var _5d = $(ul).prevAll("div.tree-node:first");
		_58 = _5c.loadFilter.call(_57, _58, _5d[0]);
		var _5e = _5f(_57, "domId", _5d.attr("id"));
		if (!_59) {
			_5e ? _5e.children = _58 : _5b.data = _58;
			$(ul).empty();
		} else {
			if (_5e) {
				_5e.children ? _5e.children = _5e.children.concat(_58)
						: _5e.children = _58;
			} else {
				_5b.data = _5b.data.concat(_58);
			}
		}
		_5c.view.render.call(_5c.view, _57, ul, _58);
		if (_5c.dnd) {
			_11(_57);
		}
		if (_5e) {
			_60(_57, _5e);
		}
		for (var i = 0; i < _5b.tmpIds.length; i++) {
			_34(_57, $("#" + _5b.tmpIds[i])[0], true, true);
		}
		_5b.tmpIds = [];
		setTimeout(function() {
			_61(_57, _57);
		}, 0);
		if (!_5a) {
			_5c.onLoadSuccess.call(_57, _5e, _58);
		}
	}
	;
	function _61(_62, ul, _63) {
		var _64 = $.data(_62, "tree").options;
		if (_64.lines) {
			$(_62).addClass("tree-lines");
		} else {
			$(_62).removeClass("tree-lines");
			return;
		}
		if (!_63) {
			_63 = true;
			$(_62).find("span.tree-indent").removeClass(
					"tree-line tree-join tree-joinbottom");
			$(_62).find("div.tree-node").removeClass(
					"tree-node-last tree-root-first tree-root-one");
			var _65 = $(_62).tree("getRoots");
			if (_65.length > 1) {
				$(_65[0].target).addClass("tree-root-first");
			} else {
				if (_65.length == 1) {
					$(_65[0].target).addClass("tree-root-one");
				}
			}
		}
		$(ul).children("li").each(function() {
			var _66 = $(this).children("div.tree-node");
			var ul = _66.next("ul");
			if (ul.length) {
				if ($(this).next().length) {
					_67(_66);
				}
				_61(_62, ul, _63);
			} else {
				_68(_66);
			}
		});
		var _69 = $(ul).children("li:last").children("div.tree-node").addClass(
				"tree-node-last");
		_69.children("span.tree-join").removeClass("tree-join").addClass(
				"tree-joinbottom");
		function _68(_6a, _6b) {
			var _6c = _6a.find("span.tree-icon");
			_6c.prev("span.tree-indent").addClass("tree-join");
		}
		;
		function _67(_6d) {
			var _6e = _6d.find("span.tree-indent, span.tree-hit").length;
			_6d.next().find("div.tree-node").each(
					function() {
						$(this).children("span:eq(" + (_6e - 1) + ")")
								.addClass("tree-line");
					});
		}
		;
	}
	;
	function _6f(_70, ul, _71, _72) {
		var _73 = $.data(_70, "tree").options;
		_71 = $.extend({}, _73.queryParams, _71 || {});
		var _74 = null;
		if (_70 != ul) {
			var _75 = $(ul).prev();
			_74 = _c(_70, _75[0]);
		}
		if (_73.onBeforeLoad.call(_70, _74, _71) == false) {
			return;
		}
		var _76 = $(ul).prev().children("span.tree-folder");
		_76.addClass("tree-loading");
		var _77 = _73.loader.call(_70, _71, function(_78) {
			_76.removeClass("tree-loading");
			_56(_70, ul, _78);
			if (_72) {
				_72();
			}
		}, function() {
			_76.removeClass("tree-loading");
			_73.onLoadError.apply(_70, arguments);
			if (_72) {
				_72();
			}
		});
		if (_77 == false) {
			_76.removeClass("tree-loading");
		}
	}
	;
	function _79(_7a, _7b, _7c) {
		var _7d = $.data(_7a, "tree").options;
		var hit = $(_7b).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			return;
		}
		var _7e = _c(_7a, _7b);
		if (_7d.onBeforeExpand.call(_7a, _7e) == false) {
			return;
		}
		hit.removeClass("tree-collapsed tree-collapsed-hover").addClass(
				"tree-expanded");
		hit.next().addClass("tree-folder-open");
		var ul = $(_7b).next();
		if (ul.length) {
			if (_7d.animate) {
				ul.slideDown("normal", function() {
					_7e.state = "open";
					_7d.onExpand.call(_7a, _7e);
					if (_7c) {
						_7c();
					}
				});
			} else {
				ul.css("display", "block");
				_7e.state = "open";
				_7d.onExpand.call(_7a, _7e);
				if (_7c) {
					_7c();
				}
			}
		} else {
			var _7f = $("<ul style=\"display:none\"></ul>").insertAfter(_7b);
			_6f(_7a, _7f[0], {
				id : _7e.id
			}, function() {
				if (_7f.is(":empty")) {
					_7f.remove();
				}
				if (_7d.animate) {
					_7f.slideDown("normal", function() {
						_7e.state = "open";
						_7d.onExpand.call(_7a, _7e);
						if (_7c) {
							_7c();
						}
					});
				} else {
					_7f.css("display", "block");
					_7e.state = "open";
					_7d.onExpand.call(_7a, _7e);
					if (_7c) {
						_7c();
					}
				}
			});
		}
	}
	;
	function _80(_81, _82) {
		var _83 = $.data(_81, "tree").options;
		var hit = $(_82).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-collapsed")) {
			return;
		}
		var _84 = _c(_81, _82);
		if (_83.onBeforeCollapse.call(_81, _84) == false) {
			return;
		}
		hit.removeClass("tree-expanded tree-expanded-hover").addClass(
				"tree-collapsed");
		hit.next().removeClass("tree-folder-open");
		var ul = $(_82).next();
		if (_83.animate) {
			ul.slideUp("normal", function() {
				_84.state = "closed";
				_83.onCollapse.call(_81, _84);
			});
		} else {
			ul.css("display", "none");
			_84.state = "closed";
			_83.onCollapse.call(_81, _84);
		}
	}
	;
	function _85(_86, _87) {
		var hit = $(_87).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			_80(_86, _87);
		} else {
			_79(_86, _87);
		}
	}
	;
	function _88(_89, _8a) {
		var _8b = _8c(_89, _8a);
		if (_8a) {
			_8b.unshift(_c(_89, _8a));
		}
		for (var i = 0; i < _8b.length; i++) {
			_79(_89, _8b[i].target);
		}
	}
	;
	function _8d(_8e, _8f) {
		var _90 = [];
		var p = _4d(_8e, _8f);
		while (p) {
			_90.unshift(p);
			p = _4d(_8e, p.target);
		}
		for (var i = 0; i < _90.length; i++) {
			_79(_8e, _90[i].target);
		}
	}
	;
	function _91(_92, _93) {
		var c = $(_92).parent();
		while (c[0].tagName != "BODY" && c.css("overflow-y") != "auto") {
			c = c.parent();
		}
		var n = $(_93);
		var _94 = n.offset().top;
		if (c[0].tagName != "BODY") {
			var _95 = c.offset().top;
			if (_94 < _95) {
				c.scrollTop(c.scrollTop() + _94 - _95);
			} else {
				if (_94 + n.outerHeight() > _95 + c.outerHeight() - 18) {
					c.scrollTop(c.scrollTop() + _94 + n.outerHeight() - _95
							- c.outerHeight() + 18);
				}
			}
		} else {
			c.scrollTop(_94);
		}
	}
	;
	function _96(_97, _98) {
		var _99 = _8c(_97, _98);
		if (_98) {
			_99.unshift(_c(_97, _98));
		}
		for (var i = 0; i < _99.length; i++) {
			_80(_97, _99[i].target);
		}
	}
	;
	function _9a(_9b, _9c) {
		var _9d = $(_9c.parent);
		var _9e = _9c.data;
		if (!_9e) {
			return;
		}
		_9e = $.isArray(_9e) ? _9e : [ _9e ];
		if (!_9e.length) {
			return;
		}
		var ul;
		if (_9d.length == 0) {
			ul = $(_9b);
		} else {
			if (_9f(_9b, _9d[0])) {
				var _a0 = _9d.find("span.tree-icon");
				_a0.removeClass("tree-file").addClass(
						"tree-folder tree-folder-open");
				var hit = $("<span class=\"tree-hit tree-expanded\"></span>")
						.insertBefore(_a0);
				if (hit.prev().length) {
					hit.prev().remove();
				}
			}
			ul = _9d.next();
			if (!ul.length) {
				ul = $("<ul></ul>").insertAfter(_9d);
			}
		}
		_56(_9b, ul[0], _9e, true, true);
	}
	;
	function _a1(_a2, _a3) {
		var ref = _a3.before || _a3.after;
		var _a4 = _4d(_a2, ref);
		var _a5 = _a3.data;
		if (!_a5) {
			return;
		}
		_a5 = $.isArray(_a5) ? _a5 : [ _a5 ];
		if (!_a5.length) {
			return;
		}
		_9a(_a2, {
			parent : (_a4 ? _a4.target : null),
			data : _a5
		});
		var _a6 = _a4 ? _a4.children : $(_a2).tree("getRoots");
		for (var i = 0; i < _a6.length; i++) {
			if (_a6[i].domId == $(ref).attr("id")) {
				for (var j = _a5.length - 1; j >= 0; j--) {
					_a6.splice((_a3.before ? i : (i + 1)), 0, _a5[j]);
				}
				_a6.splice(_a6.length - _a5.length, _a5.length);
				break;
			}
		}
		var li = $();
		for (var i = 0; i < _a5.length; i++) {
			li = li.add($("#" + _a5[i].domId).parent());
		}
		if (_a3.before) {
			li.insertBefore($(ref).parent());
		} else {
			li.insertAfter($(ref).parent());
		}
	}
	;
	function _a7(_a8, _a9) {
		var _aa = del(_a9);
		$(_a9).parent().remove();
		if (_aa) {
			if (!_aa.children || !_aa.children.length) {
				var _ab = $(_aa.target);
				_ab.find(".tree-icon").removeClass("tree-folder").addClass(
						"tree-file");
				_ab.find(".tree-hit").remove();
				$("<span class=\"tree-indent\"></span>").prependTo(_ab);
				_ab.next().remove();
			}
			_60(_a8, _aa);
		}
		_61(_a8, _a8);
		function del(_ac) {
			var id = $(_ac).attr("id");
			var _ad = _4d(_a8, _ac);
			var cc = _ad ? _ad.children : $.data(_a8, "tree").data;
			for (var i = 0; i < cc.length; i++) {
				if (cc[i].domId == id) {
					cc.splice(i, 1);
					break;
				}
			}
			return _ad;
		}
		;
	}
	;
	function _60(_ae, _af) {
		var _b0 = $.data(_ae, "tree").options;
		var _b1 = $(_af.target);
		var _b2 = _c(_ae, _af.target);
		if (_b2.iconCls) {
			_b1.find(".tree-icon").removeClass(_b2.iconCls);
		}
		$.extend(_b2, _af);
		_b1.find(".tree-title").html(_b0.formatter.call(_ae, _b2));
		if (_b2.iconCls) {
			_b1.find(".tree-icon").addClass(_b2.iconCls);
		}
		_4f(_ae, _af.target);
	}
	;
	function _b3(_b4, _b5) {
		if (_b5) {
			var p = _4d(_b4, _b5);
			while (p) {
				_b5 = p.target;
				p = _4d(_b4, _b5);
			}
			return _c(_b4, _b5);
		} else {
			var _b6 = _b7(_b4);
			return _b6.length ? _b6[0] : null;
		}
	}
	;
	function _b7(_b8) {
		var _b9 = $.data(_b8, "tree").data;
		for (var i = 0; i < _b9.length; i++) {
			_ba(_b9[i]);
		}
		return _b9;
	}
	;
	function _8c(_bb, _bc) {
		var _bd = [];
		var n = _c(_bb, _bc);
		var _be = n ? (n.children || []) : $.data(_bb, "tree").data;
		$.nestui.forEach(_be, true, function(_bf) {
			_bd.push(_ba(_bf));
		});
		return _bd;
	}
	;
	function _4d(_c0, _c1) {
		var p = $(_c1).closest("ul").prevAll("div.tree-node:first");
		return _c(_c0, p[0]);
	}
	;
	function _c2(_c3, _c4) {
		_c4 = _c4 || "checked";
		if (!$.isArray(_c4)) {
			_c4 = [ _c4 ];
		}
		var _c5 = [];
		$.nestui.forEach($.data(_c3, "tree").data, true,
				function(n) {
					if (n.checkState
							&& $.nestui.indexOfArray(_c4, n.checkState) != -1) {
						_c5.push(_ba(n));
					}
				});
		return _c5;
	}
	;
	function _c6(_c7) {
		var _c8 = $(_c7).find("div.tree-node-selected");
		return _c8.length ? _c(_c7, _c8[0]) : null;
	}
	;
	function _c9(_ca, _cb) {
		var _cc = _c(_ca, _cb);
		if (_cc && _cc.children) {
			$.nestui.forEach(_cc.children, true, function(_cd) {
				_ba(_cd);
			});
		}
		return _cc;
	}
	;
	function _c(_ce, _cf) {
		return _5f(_ce, "domId", $(_cf).attr("id"));
	}
	;
	function _d0(_d1, id) {
		return _5f(_d1, "id", id);
	}
	;
	function _5f(_d2, _d3, _d4) {
		var _d5 = $.data(_d2, "tree").data;
		var _d6 = null;
		$.nestui.forEach(_d5, true, function(_d7) {
			if (_d7[_d3] == _d4) {
				_d6 = _ba(_d7);
				return false;
			}
		});
		return _d6;
	}
	;
	function _ba(_d8) {
		_d8.target = $("#" + _d8.domId)[0];
		return _d8;
	}
	;
	function _d9(_da, _db) {
		var _dc = $.data(_da, "tree").options;
		var _dd = _c(_da, _db);
		if (_dc.onBeforeSelect.call(_da, _dd) == false) {
			return;
		}
		$(_da).find("div.tree-node-selected").removeClass("tree-node-selected");
		$(_db).addClass("tree-node-selected");
		_dc.onSelect.call(_da, _dd);
	}
	;
	function _9f(_de, _df) {
		return $(_df).children("span.tree-hit").length == 0;
	}
	;
	function _e0(_e1, _e2) {
		var _e3 = $.data(_e1, "tree").options;
		var _e4 = _c(_e1, _e2);
		if (_e3.onBeforeEdit.call(_e1, _e4) == false) {
			return;
		}
		$(_e2).css("position", "relative");
		var nt = $(_e2).find(".tree-title");
		var _e5 = nt.outerWidth();
		nt.empty();
		var _e6 = $("<input class=\"tree-editor\">").appendTo(nt);
		_e6.val(_e4.text).focus();
		_e6.width(_e5 + 20);
		_e6._outerHeight(18);
		_e6.bind("click", function(e) {
			return false;
		}).bind("mousedown", function(e) {
			e.stopPropagation();
		}).bind("mousemove", function(e) {
			e.stopPropagation();
		}).bind("keydown", function(e) {
			if (e.keyCode == 13) {
				_e7(_e1, _e2);
				return false;
			} else {
				if (e.keyCode == 27) {
					_ed(_e1, _e2);
					return false;
				}
			}
		}).bind("blur", function(e) {
			e.stopPropagation();
			_e7(_e1, _e2);
		});
	}
	;
	function _e7(_e8, _e9) {
		var _ea = $.data(_e8, "tree").options;
		$(_e9).css("position", "");
		var _eb = $(_e9).find("input.tree-editor");
		var val = _eb.val();
		_eb.remove();
		var _ec = _c(_e8, _e9);
		_ec.text = val;
		_60(_e8, _ec);
		_ea.onAfterEdit.call(_e8, _ec);
	}
	;
	function _ed(_ee, _ef) {
		var _f0 = $.data(_ee, "tree").options;
		$(_ef).css("position", "");
		$(_ef).find("input.tree-editor").remove();
		var _f1 = _c(_ee, _ef);
		_60(_ee, _f1);
		_f0.onCancelEdit.call(_ee, _f1);
	}
	;
	function _f2(_f3, q) {
		var _f4 = $.data(_f3, "tree");
		var _f5 = _f4.options;
		var ids = {};
		$.nestui.forEach(_f4.data, true, function(_f6) {
			if (_f5.filter.call(_f3, q, _f6)) {
				$("#" + _f6.domId).removeClass("tree-node-hidden");
				ids[_f6.domId] = 1;
				_f6.hidden = false;
			} else {
				$("#" + _f6.domId).addClass("tree-node-hidden");
				_f6.hidden = true;
			}
		});
		for ( var id in ids) {
			_f7(id);
		}
		function _f7(_f8) {
			var p = $(_f3).tree("getParent", $("#" + _f8)[0]);
			while (p) {
				$(p.target).removeClass("tree-node-hidden");
				p.hidden = false;
				p = $(_f3).tree("getParent", p.target);
			}
		}
		;
	}
	;
	$.fn.tree = function(_f9, _fa) {
		if (typeof _f9 == "string") {
			return $.fn.tree.methods[_f9](this, _fa);
		}
		var _f9 = _f9 || {};
		return this.each(function() {
			var _fb = $.data(this, "tree");
			var _fc;
			if (_fb) {
				_fc = $.extend(_fb.options, _f9);
				_fb.options = _fc;
			} else {
				_fc = $.extend({}, $.fn.tree.defaults, $.fn.tree
						.parseOptions(this), _f9);
				$.data(this, "tree", {
					options : _fc,
					tree : _1(this),
					data : [],
					tmpIds : []
				});
				var _fd = $.fn.tree.parseData(this);
				if (_fd.length) {
					_56(this, this, _fd);
				}
			}
			_4(this);
			if (_fc.data) {
				_56(this, this, $.extend(true, [], _fc.data));
			}
			_6f(this, this);
		});
	};
	$.fn.tree.methods = {
		options : function(jq) {
			return $.data(jq[0], "tree").options;
		},
		loadData : function(jq, _fe) {
			return jq.each(function() {
				_56(this, this, _fe);
			});
		},
		getNode : function(jq, _ff) {
			return _c(jq[0], _ff);
		},
		getData : function(jq, _100) {
			return _c9(jq[0], _100);
		},
		reload : function(jq, _101) {
			return jq.each(function() {
				if (_101) {
					var node = $(_101);
					var hit = node.children("span.tree-hit");
					hit.removeClass("tree-expanded tree-expanded-hover")
							.addClass("tree-collapsed");
					node.next().remove();
					_79(this, _101);
				} else {
					$(this).empty();
					_6f(this, this);
				}
			});
		},
		getRoot : function(jq, _102) {
			return _b3(jq[0], _102);
		},
		getRoots : function(jq) {
			return _b7(jq[0]);
		},
		getParent : function(jq, _103) {
			return _4d(jq[0], _103);
		},
		getChildren : function(jq, _104) {
			return _8c(jq[0], _104);
		},
		getChecked : function(jq, _105) {
			return _c2(jq[0], _105);
		},
		getSelected : function(jq) {
			return _c6(jq[0]);
		},
		isLeaf : function(jq, _106) {
			return _9f(jq[0], _106);
		},
		find : function(jq, id) {
			return _d0(jq[0], id);
		},
		select : function(jq, _107) {
			return jq.each(function() {
				_d9(this, _107);
			});
		},
		check : function(jq, _108) {
			return jq.each(function() {
				_34(this, _108, true);
			});
		},
		uncheck : function(jq, _109) {
			return jq.each(function() {
				_34(this, _109, false);
			});
		},
		collapse : function(jq, _10a) {
			return jq.each(function() {
				_80(this, _10a);
			});
		},
		expand : function(jq, _10b) {
			return jq.each(function() {
				_79(this, _10b);
			});
		},
		collapseAll : function(jq, _10c) {
			return jq.each(function() {
				_96(this, _10c);
			});
		},
		expandAll : function(jq, _10d) {
			return jq.each(function() {
				_88(this, _10d);
			});
		},
		expandTo : function(jq, _10e) {
			return jq.each(function() {
				_8d(this, _10e);
			});
		},
		scrollTo : function(jq, _10f) {
			return jq.each(function() {
				_91(this, _10f);
			});
		},
		toggle : function(jq, _110) {
			return jq.each(function() {
				_85(this, _110);
			});
		},
		append : function(jq, _111) {
			return jq.each(function() {
				_9a(this, _111);
			});
		},
		insert : function(jq, _112) {
			return jq.each(function() {
				_a1(this, _112);
			});
		},
		remove : function(jq, _113) {
			return jq.each(function() {
				_a7(this, _113);
			});
		},
		pop : function(jq, _114) {
			var node = jq.tree("getData", _114);
			jq.tree("remove", _114);
			return node;
		},
		update : function(jq, _115) {
			return jq.each(function() {
				_60(this, $.extend({}, _115,
						{
							checkState : _115.checked ? "checked"
									: (_115.checked === false ? "unchecked"
											: undefined)
						}));
			});
		},
		enableDnd : function(jq) {
			return jq.each(function() {
				_11(this);
			});
		},
		disableDnd : function(jq) {
			return jq.each(function() {
				_d(this);
			});
		},
		beginEdit : function(jq, _116) {
			return jq.each(function() {
				_e0(this, _116);
			});
		},
		endEdit : function(jq, _117) {
			return jq.each(function() {
				_e7(this, _117);
			});
		},
		cancelEdit : function(jq, _118) {
			return jq.each(function() {
				_ed(this, _118);
			});
		},
		doFilter : function(jq, q) {
			return jq.each(function() {
				_f2(this, q);
			});
		}
	};
	$.fn.tree.parseOptions = function(_119) {
		var t = $(_119);
		return $.extend({}, $.parser.parseOptions(_119, [ "url", "method", {
			checkbox : "boolean",
			cascadeCheck : "boolean",
			onlyLeafCheck : "boolean"
		}, {
			animate : "boolean",
			lines : "boolean",
			dnd : "boolean"
		} ]));
	};
	$.fn.tree.parseData = function(_11a) {
		var data = [];
		_11b(data, $(_11a));
		return data;
		function _11b(aa, tree) {
			tree.children("li").each(
					function() {
						var node = $(this);
						var item = $.extend({}, $.parser.parseOptions(this, [
								"id", "iconCls", "state" ]), {
							checked : (node.attr("checked") ? true : undefined)
						});
						item.text = node.children("span").html();
						if (!item.text) {
							item.text = node.html();
						}
						var _11c = node.children("ul");
						if (_11c.length) {
							item.children = [];
							_11b(item.children, _11c);
						}
						aa.push(item);
					});
		}
		;
	};
	var _11d = 1;
	var _11e = {
		render : function(_11f, ul, data) {
			var _120 = $.data(_11f, "tree");
			var opts = _120.options;
			var _121 = $(ul).prev(".tree-node");
			var _122 = _121.length ? $(_11f).tree("getNode", _121[0]) : null;
			var _123 = _121.find("span.tree-indent, span.tree-hit").length;
			var cc = _124.call(this, _123, data);
			$(ul).append(cc.join(""));
			function _124(_125, _126) {
				var cc = [];
				for (var i = 0; i < _126.length; i++) {
					var item = _126[i];
					if (item.state != "open" && item.state != "closed") {
						item.state = "open";
					}
					item.domId = "_nestui_tree_" + _11d++;
					cc.push("<li>");
					cc.push("<div id=\"" + item.domId
							+ "\" class=\"tree-node\">");
					for (var j = 0; j < _125; j++) {
						cc.push("<span class=\"tree-indent\"></span>");
					}
					if (item.state == "closed") {
						cc
								.push("<span class=\"tree-hit tree-collapsed\"></span>");
						cc.push("<span class=\"tree-icon tree-folder "
								+ (item.iconCls ? item.iconCls : "")
								+ "\"></span>");
					} else {
						if (item.children && item.children.length) {
							cc
									.push("<span class=\"tree-hit tree-expanded\"></span>");
							cc
									.push("<span class=\"tree-icon tree-folder tree-folder-open "
											+ (item.iconCls ? item.iconCls : "")
											+ "\"></span>");
						} else {
							cc.push("<span class=\"tree-indent\"></span>");
							cc.push("<span class=\"tree-icon tree-file "
									+ (item.iconCls ? item.iconCls : "")
									+ "\"></span>");
						}
					}
					if (this.hasCheckbox(_11f, item)) {
						var flag = 0;
						if (_122 && _122.checkState == "checked"
								&& opts.cascadeCheck) {
							flag = 1;
							item.checked = true;
						} else {
							if (item.checked) {
								$.nestui.addArrayItem(_120.tmpIds, item.domId);
							}
						}
						item.checkState = flag ? "checked" : "unchecked";
						cc.push("<span class=\"tree-checkbox tree-checkbox"
								+ flag + "\"></span>");
					} else {
						item.checkState = undefined;
						item.checked = undefined;
					}
					cc.push("<span class=\"tree-title\">"
							+ opts.formatter.call(_11f, item) + "</span>");
					cc.push("</div>");
					if (item.children && item.children.length) {
						var tmp = _124.call(this, _125 + 1, item.children);
						cc.push("<ul style=\"display:"
								+ (item.state == "closed" ? "none" : "block")
								+ "\">");
						cc = cc.concat(tmp);
						cc.push("</ul>");
					}
					cc.push("</li>");
				}
				return cc;
			}
			;
		},
		hasCheckbox : function(_127, item) {
			var _128 = $.data(_127, "tree");
			var opts = _128.options;
			if (opts.checkbox) {
				if ($.isFunction(opts.checkbox)) {
					if (opts.checkbox.call(_127, item)) {
						return true;
					} else {
						return false;
					}
				} else {
					if (opts.onlyLeafCheck) {
						if (item.state == "open"
								&& !(item.children && item.children.length)) {
							return true;
						}
					} else {
						return true;
					}
				}
			}
			return false;
		}
	};
	$.fn.tree.defaults = {
		url : null,
		method : "post",
		animate : false,
		checkbox : false,
		cascadeCheck : true,
		onlyLeafCheck : false,
		lines : false,
		dnd : false,
		data : null,
		queryParams : {},
		formatter : function(node) {
			return node.text;
		},
		filter : function(q, node) {
			var qq = [];
			$.map($.isArray(q) ? q : [ q ], function(q) {
				q = $.trim(q);
				if (q) {
					qq.push(q);
				}
			});
			for (var i = 0; i < qq.length; i++) {
				var _129 = node.text.toLowerCase().indexOf(qq[i].toLowerCase());
				if (_129 >= 0) {
					return true;
				}
			}
			return !qq.length;
		},
		loader : function(_12a, _12b, _12c) {
			var opts = $(this).tree("options");
			if (!opts.url) {
				return false;
			}
			$.ajax({
				type : opts.method,
				url : opts.url,
				data : _12a,
				dataType : "json",
				success : function(data) {
					_12b(data);
				},
				error : function() {
					_12c.apply(this, arguments);
				}
			});
		},
		loadFilter : function(data, _12d) {
			return data;
		},
		view : _11e,
		onBeforeLoad : function(node, _12e) {
		},
		onLoadSuccess : function(node, data) {
		},
		onLoadError : function() {
		},
		onClick : function(node) {
		},
		onDblClick : function(node) {
		},
		onBeforeExpand : function(node) {
		},
		onExpand : function(node) {
		},
		onBeforeCollapse : function(node) {
		},
		onCollapse : function(node) {
		},
		onBeforeCheck : function(node, _12f) {
		},
		onCheck : function(node, _130) {
		},
		onBeforeSelect : function(node) {
		},
		onSelect : function(node) {
		},
		onContextMenu : function(e, node) {
		},
		onBeforeDrag : function(node) {
		},
		onStartDrag : function(node) {
		},
		onStopDrag : function(node) {
		},
		onDragEnter : function(_131, _132) {
		},
		onDragOver : function(_133, _134) {
		},
		onDragLeave : function(_135, _136) {
		},
		onBeforeDrop : function(_137, _138, _139) {
		},
		onDrop : function(_13a, _13b, _13c) {
		},
		onBeforeEdit : function(node) {
		},
		onAfterEdit : function(node) {
		},
		onCancelEdit : function(node) {
		}
	};
})(jQuery);
﻿/**
 * progressbar
 * 
 * Dependencies:
 * 	 none
 * 
 */
(function($){
	function init(target){
		$(target).addClass('progressbar');
		$(target).html('<div class="progressbar-text"></div><div class="progressbar-value"><div class="progressbar-text"></div></div>');
		$(target).bind('_resize', function(e,force){
			if ($(this).hasClass('nestui-fluid') || force){
				setSize(target);
			}
			return false;
		});
		return $(target);
	}
	
	function setSize(target,width){
		var opts = $.data(target, 'progressbar').options;
		var bar = $.data(target, 'progressbar').bar;
		if (width) opts.width = width;
		bar._size(opts);
		
		bar.find('div.progressbar-text').css('width', bar.width());
		bar.find('div.progressbar-text,div.progressbar-value').css({
			height: bar.height()+'px',
			lineHeight: bar.height()+'px'
		});
	}
	
	$.fn.progressbar = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.progressbar.methods[options];
			if (method){
				return method(this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'progressbar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'progressbar', {
					options: $.extend({}, $.fn.progressbar.defaults, $.fn.progressbar.parseOptions(this), options),
					bar: init(this)
				});
			}
			$(this).progressbar('setValue', state.options.value);
			setSize(this);
		});
	};
	
	$.fn.progressbar.methods = {
		options: function(jq){
			return $.data(jq[0], 'progressbar').options;
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		getValue: function(jq){
			return $.data(jq[0], 'progressbar').options.value;
		},
		setValue: function(jq, value){
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			return jq.each(function(){
				var opts = $.data(this, 'progressbar').options;
				var text = opts.text.replace(/{value}/, value);
				var oldValue = opts.value;
				opts.value = value;
				$(this).find('div.progressbar-value').width(value+'%');
				$(this).find('div.progressbar-text').html(text);
				if (oldValue != value){
					opts.onChange.call(this, value, oldValue);
				}
			});
		}
	};
	
	$.fn.progressbar.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['width','height','text',{value:'number'}]));
	};
	
	$.fn.progressbar.defaults = {
		width: 'auto',
		height: 22,
		value: 0,	// percentage value
		text: '{value}%',
		onChange:function(newValue,oldValue){}
	};
})(jQuery);
﻿/**
 * tooltip¨
 * 
 */
(function($){
function _1(_2){
$(_2).addClass("tooltip-f");
};
function _3(_4){
var _5=$.data(_4,"tooltip").options;
$(_4).unbind(".tooltip").bind(_5.showEvent+".tooltip",function(e){
$(_4).tooltip("show",e);
}).bind(_5.hideEvent+".tooltip",function(e){
$(_4).tooltip("hide",e);
}).bind("mousemove.tooltip",function(e){
if(_5.trackMouse){
_5.trackMouseX=e.pageX;
_5.trackMouseY=e.pageY;
$(_4).tooltip("reposition");
}
});
};
function _6(_7){
var _8=$.data(_7,"tooltip");
if(_8.showTimer){
clearTimeout(_8.showTimer);
_8.showTimer=null;
}
if(_8.hideTimer){
clearTimeout(_8.hideTimer);
_8.hideTimer=null;
}
};
function _9(_a){
var _b=$.data(_a,"tooltip");
if(!_b||!_b.tip){
return;
}
var _c=_b.options;
var _d=_b.tip;
var _e={left:-100000,top:-100000};
if($(_a).is(":visible")){
_e=_f(_c.position);
if(_c.position=="top"&&_e.top<0){
_e=_f("bottom");
}else{
if((_c.position=="bottom")&&(_e.top+_d._outerHeight()>$(window)._outerHeight()+$(document).scrollTop())){
_e=_f("top");
}
}
if(_e.left<0){
if(_c.position=="left"){
_e=_f("right");
}else{
$(_a).tooltip("arrow").css("left",_d._outerWidth()/2+_e.left);
_e.left=0;
}
}else{
if(_e.left+_d._outerWidth()>$(window)._outerWidth()+$(document)._scrollLeft()){
if(_c.position=="right"){
_e=_f("left");
}else{
var _10=_e.left;
_e.left=$(window)._outerWidth()+$(document)._scrollLeft()-_d._outerWidth();
$(_a).tooltip("arrow").css("left",_d._outerWidth()/2-(_e.left-_10));
}
}
}
}
_d.css({left:_e.left,top:_e.top,zIndex:(_c.zIndex!=undefined?_c.zIndex:($.fn.window?$.fn.window.defaults.zIndex++:""))});
_c.onPosition.call(_a,_e.left,_e.top);
function _f(_11){
_c.position=_11||"bottom";
_d.removeClass("tooltip-top tooltip-bottom tooltip-left tooltip-right").addClass("tooltip-"+_c.position);
var _12,top;
var _13=$.isFunction(_c.deltaX)?_c.deltaX.call(_a,_c.position):_c.deltaX;
var _14=$.isFunction(_c.deltaY)?_c.deltaY.call(_a,_c.position):_c.deltaY;
if(_c.trackMouse){
t=$();
_12=_c.trackMouseX+_13;
top=_c.trackMouseY+_14;
}else{
var t=$(_a);
_12=t.offset().left+_13;
top=t.offset().top+_14;
}
switch(_c.position){
case "right":
_12+=t._outerWidth()+12+(_c.trackMouse?12:0);
top-=(_d._outerHeight()-t._outerHeight())/2;
break;
case "left":
_12-=_d._outerWidth()+12+(_c.trackMouse?12:0);
top-=(_d._outerHeight()-t._outerHeight())/2;
break;
case "top":
_12-=(_d._outerWidth()-t._outerWidth())/2;
top-=_d._outerHeight()+12+(_c.trackMouse?12:0);
break;
case "bottom":
_12-=(_d._outerWidth()-t._outerWidth())/2;
top+=t._outerHeight()+12+(_c.trackMouse?12:0);
break;
}
return {left:_12,top:top};
};
};
function _15(_16,e){
var _17=$.data(_16,"tooltip");
var _18=_17.options;
var tip=_17.tip;
if(!tip){
tip=$("<div tabindex=\"-1\" class=\"tooltip\">"+"<div class=\"tooltip-content\"></div>"+"<div class=\"tooltip-arrow-outer\"></div>"+"<div class=\"tooltip-arrow\"></div>"+"</div>").appendTo("body");
_17.tip=tip;
_19(_16);
}
_6(_16);
_17.showTimer=setTimeout(function(){
$(_16).tooltip("reposition");
tip.show();
_18.onShow.call(_16,e);
var _1a=tip.children(".tooltip-arrow-outer");
var _1b=tip.children(".tooltip-arrow");
var bc="border-"+_18.position+"-color";
_1a.add(_1b).css({borderTopColor:"",borderBottomColor:"",borderLeftColor:"",borderRightColor:""});
_1a.css(bc,tip.css(bc));
_1b.css(bc,tip.css("backgroundColor"));
},_18.showDelay);
};
function _1c(_1d,e){
var _1e=$.data(_1d,"tooltip");
if(_1e&&_1e.tip){
_6(_1d);
_1e.hideTimer=setTimeout(function(){
_1e.tip.hide();
_1e.options.onHide.call(_1d,e);
},_1e.options.hideDelay);
}
};
function _19(_1f,_20){
var _21=$.data(_1f,"tooltip");
var _22=_21.options;
if(_20){
_22.content=_20;
}
if(!_21.tip){
return;
}
var cc=typeof _22.content=="function"?_22.content.call(_1f):_22.content;
_21.tip.children(".tooltip-content").html(cc);
_22.onUpdate.call(_1f,cc);
};
function _23(_24){
var _25=$.data(_24,"tooltip");
if(_25){
_6(_24);
var _26=_25.options;
if(_25.tip){
_25.tip.remove();
}
if(_26._title){
$(_24).attr("title",_26._title);
}
$.removeData(_24,"tooltip");
$(_24).unbind(".tooltip").removeClass("tooltip-f");
_26.onDestroy.call(_24);
}
};
$.fn.tooltip=function(_27,_28){
if(typeof _27=="string"){
return $.fn.tooltip.methods[_27](this,_28);
}
_27=_27||{};
return this.each(function(){
var _29=$.data(this,"tooltip");
if(_29){
$.extend(_29.options,_27);
}else{
$.data(this,"tooltip",{options:$.extend({},$.fn.tooltip.defaults,$.fn.tooltip.parseOptions(this),_27)});
_1(this);
}
_3(this);
_19(this);
});
};
$.fn.tooltip.methods={options:function(jq){
return $.data(jq[0],"tooltip").options;
},tip:function(jq){
return $.data(jq[0],"tooltip").tip;
},arrow:function(jq){
return jq.tooltip("tip").children(".tooltip-arrow-outer,.tooltip-arrow");
},show:function(jq,e){
return jq.each(function(){
_15(this,e);
});
},hide:function(jq,e){
return jq.each(function(){
_1c(this,e);
});
},update:function(jq,_2a){
return jq.each(function(){
_19(this,_2a);
});
},reposition:function(jq){
return jq.each(function(){
_9(this);
});
},destroy:function(jq){
return jq.each(function(){
_23(this);
});
}};
$.fn.tooltip.parseOptions=function(_2b){
var t=$(_2b);
var _2c=$.extend({},$.parser.parseOptions(_2b,["position","showEvent","hideEvent","content",{trackMouse:"boolean",deltaX:"number",deltaY:"number",showDelay:"number",hideDelay:"number"}]),{_title:t.attr("title")});
t.attr("title","");
if(!_2c.content){
_2c.content=_2c._title;
}
return _2c;
};
$.fn.tooltip.defaults={position:"bottom",content:null,trackMouse:false,deltaX:0,deltaY:0,showEvent:"mouseenter",hideEvent:"mouseleave",showDelay:200,hideDelay:100,onShow:function(e){
},onHide:function(e){
},onUpdate:function(_2d){
},onPosition:function(_2e,top){
},onDestroy:function(){
}};
})(jQuery);

﻿/**
 * panel
 * 
 * 
 */
/**
 * _3	resizePanel
 * _4	target
 * _5	param
 * _6	state
 * _7	opts
 * _8	panel
 * _9	header
 * _a	body
 * _b	footer
 * _f	movePanel
 * _10	target
 * _12	state
 * _15	getPanel
 * _16	target
 * _29	refreshContent
 * _2a	target
 * _2b	href
 * _31	clear
 * _35	open
 * _3b	maximizePanel
 * _3c	collapse 
 * _3d	close
 * _43	destroy
 * _44	target
 * _49	target
 * _4a	animate
 * _4f	expandContent
 * _50	target
 * _51	animate
 * _56	target
 * _57	opts
 * _5a	minimizePanel
 * _5b	target
 * _5e	restoreContent
 * _5f	target
 * _63	setTitle
 * _64	target
 * _65	title
 * _68	options
 * _69	param
 * _6a	state
 * _6c	title
 * _6d	forceOpen
 * _6e 	forceClose		
 * _6f	forceDestroy
 * _71	href
 * _72	panel
 * _73	opts
 * _79	opts
 * _7a	animate
 * _7b	animate
 * _7c	target
 * _7d	param 
 * _7e	success 
 * _7f	error
 * _80	opts
 * _82	data
 * _83	pattern
 * _84	matches
 * _85	param
 * _86	width 
 * _87	height
 * _88	left
 */
(function($) {
	$.fn._remove = function() {
		return this.each(function() {
			$(this).remove();
			try {
				this.outerHTML = "";
			} catch (err) {
			}
		});
	};
	function _1(_2) {
		_2._remove();
	};
	
	function resizePanel(target, param) {
		var state = $.data(target, "panel");
		var opts = state.options;
		var panel = state.panel;
		var header = panel.children(".panel-header");
		var body = panel.children(".panel-body");
		var footer = panel.children(".panel-footer");
		if (param) {
			$.extend(opts, {
				width : param.width,
				height : param.height,
				minWidth : param.minWidth,
				maxWidth : param.maxWidth,
				minHeight : param.minHeight,
				maxHeight : param.maxHeight,
				left : param.left,
				top : param.top
			});
		}
		panel._size(opts);
		header.add(body)._outerWidth(panel.width());
		if (!isNaN(parseInt(opts.height))) {
			body._outerHeight(panel.height() - header._outerHeight() - footer._outerHeight());
		} else {
			body.css("height", "");
			var _c = $.parser.parseValue("minHeight", opts.minHeight, panel.parent());
			var _d = $.parser.parseValue("maxHeight", opts.maxHeight, panel.parent());
			var _e = header._outerHeight() + footer._outerHeight() + panel._outerHeight() - panel.height();
			body._size("minHeight", _c ? (_c - _e) : "");
			body._size("maxHeight", _d ? (_d - _e) : "");
		}
		panel.css({
			height : "",
			minHeight : "",
			maxHeight : "",
			left : opts.left,
			top : opts.top
		});
		opts.onResize.apply(target, [ opts.width, opts.height ]);
		$(target).panel("doLayout");
	};
	
	function movePanel(target, _11) {
		var state = $.data(target, "panel");
		var _13 = state.options;
		var _14 = state.panel;
		if (_11) {
			if (_11.left != null) {
				_13.left = _11.left;
			}
			if (_11.top != null) {
				_13.top = _11.top;
			}
		}
		_14.css({
			left : _13.left,
			top : _13.top
		});
		_14.find(".tooltip-f").each(function() {
			$(this).tooltip("reposition");
		});
		_13.onMove.apply(target, [ _13.left, _13.top ]);
	};
	
	function getPanel(target) {
		$(target).addClass("panel-body")._size("clear");
		var _17 = $("<div class=\"panel\"></div>").insertBefore(target);
		_17[0].appendChild(target);
		_17.bind("_resize", function(e, _18) {
			if ($(this).hasClass("nestui-fluid") || _18) {
				resizePanel(target);
			}
			return false;
		});
		return _17;
	};
	
	function _19(_1a) {
		var _1b = $.data(_1a, "panel");
		var _1c = _1b.options;
		var _1d = _1b.panel;
		_1d.css(_1c.style);
		_1d.addClass(_1c.cls);
		_1e();
		_1f();
		var _20 = $(_1a).panel("header");
		var _21 = $(_1a).panel("body");
		var _22 = $(_1a).siblings(".panel-footer");
		if (_1c.border) {
			_20.removeClass("panel-header-noborder");
			_21.removeClass("panel-body-noborder");
			_22.removeClass("panel-footer-noborder");
		} else {
			_20.addClass("panel-header-noborder");
			_21.addClass("panel-body-noborder");
			_22.addClass("panel-footer-noborder");
		}
		_20.addClass(_1c.headerCls);
		_21.addClass(_1c.bodyCls);
		$(_1a).attr("id", _1c.id || "");
		if (_1c.content) {
			$(_1a).panel("clear");
			$(_1a).html(_1c.content);
			$.parser.parse($(_1a));
		}
		function _1e() {
			if (_1c.noheader || (!_1c.title && !_1c.header)) {
				_1(_1d.children(".panel-header"));
				_1d.children(".panel-body").addClass("panel-body-noheader");
			} else {
				if (_1c.header) {
					$(_1c.header).addClass("panel-header").prependTo(_1d);
				} else {
					var _23 = _1d.children(".panel-header");
					if (!_23.length) {
						_23 = $("<div class=\"panel-header\"></div>")
								.prependTo(_1d);
					}
					if (!$.isArray(_1c.tools)) {
						_23.find("div.panel-tool .panel-tool-a").appendTo(
								_1c.tools);
					}
					_23.empty();
					var _24 = $("<div class=\"panel-title\"></div>").html(
							_1c.title).appendTo(_23);
					if (_1c.iconCls) {
						_24.addClass("panel-with-icon");
						$("<div class=\"panel-icon\"></div>").addClass(
								_1c.iconCls).appendTo(_23);
					}
					var _25 = $("<div class=\"panel-tool\"></div>").appendTo(
							_23);
					_25.bind("click", function(e) {
						e.stopPropagation();
					});
					if (_1c.tools) {
						if ($.isArray(_1c.tools)) {
							$.map(_1c.tools, function(t) {
								_26(_25, t.iconCls, eval(t.handler));
							});
						} else {
							$(_1c.tools).children().each(
									function() {
										$(this).addClass(
												$(this).attr("iconCls"))
												.addClass("panel-tool-a")
												.appendTo(_25);
									});
						}
					}
					if (_1c.collapsible) {
						_26(_25, "panel-tool-collapse", function() {
							if (_1c.collapsed == true) {
								expandContent(_1a, true);
							} else {
								collapseContent(_1a, true);
							}
						});
					}
					if (_1c.minimizable) {
						_26(_25, "panel-tool-min", function() {
							minimizePanel(_1a);
						});
					}
					if (_1c.maximizable) {
						_26(_25, "panel-tool-max", function() {
							if (_1c.maximized == true) {
								restoreContent(_1a);
							} else {
								maximizePanel(_1a);
							}
						});
					}
					if (_1c.closable) {
						_26(_25, "panel-tool-close", function() {
							close(_1a);
						});
					}
				}
				_1d.children("div.panel-body").removeClass(
						"panel-body-noheader");
			}
		};
		
		function _26(c, _27, _28) {
			var a = $("<a href=\"javascript:void(0)\"></a>").addClass(_27)
					.appendTo(c);
			a.bind("click", _28);
		};
		
		function _1f() {
			if (_1c.footer) {
				$(_1c.footer).addClass("panel-footer").appendTo(_1d);
				$(_1a).addClass("panel-body-nobottom");
			} else {
				_1d.children(".panel-footer").remove();
				$(_1a).removeClass("panel-body-nobottom");
			}
		};
	};
	
	function refreshContent(target, href) {
		var _2c = $.data(target, "panel");
		var _2d = _2c.options;
		if (_2e) {
			_2d.queryParams = href;
		}
		if (!_2d.href) {
			return;
		}
		if (!_2c.isLoaded || !_2d.cache) {
			var _2e = $.extend({}, _2d.queryParams);
			if (_2d.onBeforeLoad.call(target, _2e) == false) {
				return;
			}
			_2c.isLoaded = false;
			if (_2d.loadingMessage) {
				$(target).panel("clear");
				$(target).html(
						$("<div class=\"panel-loading\"></div>").html(
								_2d.loadingMessage));
			}
			_2d.loader.call(target, _2e, function(_2f) {
				var _30 = _2d.extractor.call(target, _2f);
				$(target).panel("clear");
				$(target).html(_30);
				$.parser.parse($(target));
				_2d.onLoad.apply(target, arguments);
				_2c.isLoaded = true;
			}, function() {
				_2d.onLoadError.apply(target, arguments);
			});
		}
	};
	
	function clear(_32) {
		var t = $(_32);
		t.find(".combo-f").each(function() {
			$(this).combo("destroy");
		});
		t.find(".m-btn").each(function() {
			$(this).menubutton("destroy");
		});
		t.find(".s-btn").each(function() {
			$(this).splitbutton("destroy");
		});
		t.find(".tooltip-f").each(function() {
			$(this).tooltip("destroy");
		});
		t.children("div").each(function() {
			$(this)._size("unfit");
		});
		t.empty();
	};
	
	function _33(_34) {
		$(_34).panel("doLayout", true);
	};
	
	function open(_36, _37) {
		var _38 = $.data(_36, "panel").options;
		var _39 = $.data(_36, "panel").panel;
		if (_37 != true) {
			if (_38.onBeforeOpen.call(_36) == false) {
				return;
			}
		}
		_39.stop(true, true);
		if ($.isFunction(_38.openAnimation)) {
			_38.openAnimation.call(_36, cb);
		} else {
			switch (_38.openAnimation) {
			case "slide":
				_39.slideDown(_38.openDuration, cb);
				break;
			case "fade":
				_39.fadeIn(_38.openDuration, cb);
				break;
			case "show":
				_39.show(_38.openDuration, cb);
				break;
			default:
				_39.show();
				cb();
			}
		}
		function cb() {
			_38.closed = false;
			_38.minimized = false;
			var _3a = _39.children(".panel-header")
					.find("a.panel-tool-restore");
			if (_3a.length) {
				_38.maximized = true;
			}
			_38.onOpen.call(_36);
			if (_38.maximized == true) {
				_38.maximized = false;
				maximizePanel(_36);
			}
			if (_38.collapsed == true) {
				_38.collapsed = false;
				collapseContent(_36);
			}
			if (!_38.collapsed) {
				refreshContent(_36);
				_33(_36);
			}
		};
	};
	
	function close(_3e, _3f) {
		var _40 = $.data(_3e, "panel");
		var _41 = _40.options;
		var _42 = _40.panel;
		if (_3f != true) {
			if (_41.onBeforeClose.call(_3e) == false) {
				return;
			}
		}
		_42.find(".tooltip-f").each(function() {
			$(this).tooltip("hide");
		});
		_42.stop(true, true);
		_42._size("unfit");
		if ($.isFunction(_41.closeAnimation)) {
			_41.closeAnimation.call(_3e, cb);
		} else {
			switch (_41.closeAnimation) {
			case "slide":
				_42.slideUp(_41.closeDuration, cb);
				break;
			case "fade":
				_42.fadeOut(_41.closeDuration, cb);
				break;
			case "hide":
				_42.hide(_41.closeDuration, cb);
				break;
			default:
				_42.hide();
				cb();
			}
		}
		function cb() {
			_41.closed = true;
			_41.onClose.call(_3e);
		};
	};
	
	function destroy(target, _45) {
		var _46 = $.data(target, "panel");
		var _47 = _46.options;
		var _48 = _46.panel;
		if (_45 != true) {
			if (_47.onBeforeDestroy.call(target) == false) {
				return;
			}
		}
		$(target).panel("clear").panel("clear", "footer");
		_1(_48);
		_47.onDestroy.call(target);
	};
	
	function collapseContent(target, animate) {
		var _4b = $.data(target, "panel").options;
		var _4c = $.data(target, "panel").panel;
		var _4d = _4c.children(".panel-body");
		var _4e = _4c.children(".panel-header").find("a.panel-tool-collapse");
		if (_4b.collapsed == true) {
			return;
		}
		_4d.stop(true, true);
		if (_4b.onBeforeCollapse.call(target) == false) {
			return;
		}
		_4e.addClass("panel-tool-expand");
		if (animate == true) {
			_4d.slideUp("normal", function() {
				_4b.collapsed = true;
				_4b.onCollapse.call(target);
			});
		} else {
			_4d.hide();
			_4b.collapsed = true;
			_4b.onCollapse.call(target);
		}
	};
	
	function expandContent(target, animate) {
		var _52 = $.data(target, "panel").options;
		var _53 = $.data(target, "panel").panel;
		var _54 = _53.children(".panel-body");
		var _55 = _53.children(".panel-header").find("a.panel-tool-collapse");
		if (_52.collapsed == false) {
			return;
		}
		_54.stop(true, true);
		if (_52.onBeforeExpand.call(target) == false) {
			return;
		}
		_55.removeClass("panel-tool-expand");
		if (animate == true) {
			_54.slideDown("normal", function() {
				_52.collapsed = false;
				_52.onExpand.call(target);
				refreshContent(target);
				_33(target);
			});
		} else {
			_54.show();
			_52.collapsed = false;
			_52.onExpand.call(target);
			refreshContent(target);
			_33(target);
		}
	};
	
	function maximizePanel(target) {
		var opts = $.data(target, "panel").options;
		var _58 = $.data(target, "panel").panel;
		var _59 = _58.children(".panel-header").find("a.panel-tool-max");
		if (opts.maximized == true) {
			return;
		}
		_59.addClass("panel-tool-restore");
		if (!$.data(target, "panel").original) {
			$.data(target, "panel").original = {
				width : opts.width,
				height : opts.height,
				left : opts.left,
				top : opts.top,
				fit : opts.fit
			};
		}
		opts.left = 0;
		opts.top = 0;
		opts.fit = true;
		resizePanel(target);
		opts.minimized = false;
		opts.maximized = true;
		opts.onMaximize.call(target);
	};
	
	function minimizePanel(target) {
		var _5c = $.data(target, "panel").options;
		var _5d = $.data(target, "panel").panel;
		_5d._size("unfit");
		_5d.hide();
		_5c.minimized = true;
		_5c.maximized = false;
		_5c.onMinimize.call(target);
	};
	
	function restoreContent(target) {
		var _60 = $.data(target, "panel").options;
		var _61 = $.data(target, "panel").panel;
		var _62 = _61.children(".panel-header").find("a.panel-tool-max");
		if (_60.maximized == false) {
			return;
		}
		_61.show();
		_62.removeClass("panel-tool-restore");
		$.extend(_60, $.data(target, "panel").original);
		resizePanel(target);
		_60.minimized = false;
		_60.maximized = false;
		$.data(target, "panel").original = null;
		_60.onRestore.call(target);
	};
	
	function setTitle(target, title) {
		$.data(target, "panel").options.title = title;
		$(target).panel("header").find("div.panel-title").html(title);
	};
	
	var _66 = null;
	$(window).unbind(".panel").bind("resize.panel", function() {
		if (_66) {
			clearTimeout(_66);
		}
		_66 = setTimeout(function() {
			var _67 = $("body.layout");
			if (_67.length) {
				_67.layout("resize");
				$("body").children(".nestui-fluid:visible").each(function() {
					$(this).triggerHandler("_resize");
				});
			} else {
				$("body").panel("doLayout");
			}
			_66 = null;
		}, 100);
	});
	
	$.fn.panel = function(options, param) {
		if (typeof options == "string") {
			return $.fn.panel.methods[options](this, param);
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "panel");
			var _6b;
			if (state) {
				_6b = $.extend(state.options, options);
				state.isLoaded = false;
			} else {
				_6b = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), options);
				$(this).attr("title", "");
				state = $.data(this, "panel", {
					options : _6b,
					panel : getPanel(this),
					isLoaded : false
				});
			}
			_19(this);
			$(this).show();
			if (_6b.doSize == true) {
				state.panel.css("display", "block");
				resizePanel(this);
			}
			if (_6b.closed == true || _6b.minimized == true) {
				state.panel.hide();
			} else {
				open(this);
			}
		});
	};
	$.fn.panel.methods = {
		options : function(jq) {
			return $.data(jq[0], "panel").options;
		},
		panel : function(jq) {
			return $.data(jq[0], "panel").panel;
		},
		header : function(jq) {
			return $.data(jq[0], "panel").panel.children(".panel-header");
		},
		footer : function(jq) {
			return jq.panel("panel").children(".panel-footer");
		},
		body : function(jq) {
			return $.data(jq[0], "panel").panel.children(".panel-body");
		},
		setTitle : function(jq, title) {
			return jq.each(function() {
				setTitle(this, title);
			});
		},
		open : function(jq, forceOpen) {
			return jq.each(function() {
				open(this, forceOpen);
			});
		},
		close : function(jq, forceClose) {
			return jq.each(function() {
				close(this, forceClose);
			});
		},
		destroy : function(jq, forceDestroy) {
			return jq.each(function() {
				destroy(this, forceDestroy);
			});
		},
		clear : function(jq, _70) {
			return jq.each(function() {
				clear(_70 == "footer" ? $(this).panel("footer") : this);
			});
		},
		refresh : function(jq, href) {
			return jq.each(function() {
				var panel = $.data(this, "panel");
				panel.isLoaded = false;
				if (href) {
					if (typeof href == "string") {
						panel.options.href = href;
					} else {
						panel.options.queryParams = href;
					}
				}
				refreshContent(this);
			});
		},
		resize : function(jq, opts) {
			return jq.each(function() {
				resizePanel(this, opts);
			});
		},
		doLayout : function(jq, all) {
			return jq
					.each(function() {
						_74(this, "body");
						_74($(this).siblings(".panel-footer")[0], "footer");
						function _74(_75, _76) {
							if (!_75) {
								return;
							}
							var _77 = _75 == $("body")[0];
							var s = $(_75)
									.find(
											"div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.nestui-fluid:visible")
									.filter(
											function(_78, el) {
												var p = $(el).parents(
														".panel-" + _76
																+ ":first");
												return _77 ? p.length == 0
														: p[0] == _75;
											});
							s.each(function() {
								$(this).triggerHandler("_resize",
										[ all || false ]);
							});
						}
						;
					});
		},
		move : function(jq, opts) {
			return jq.each(function() {
				movePanel(this, opts);
			});
		},
		maximize : function(jq) {
			return jq.each(function() {
				maximizePanel(this);
			});
		},
		minimize : function(jq) {
			return jq.each(function() {
				minimizePanel(this);
			});
		},
		restore : function(jq) {
			return jq.each(function() {
				restoreContent(this);
			});
		},
		collapse : function(jq, animate) {
			return jq.each(function() {
				collapseContent(this, animate);
			});
		},
		expand : function(jq, animate) {
			return jq.each(function() {
				expandContent(this, animate);
			});
		}
	};
	$.fn.panel.parseOptions = function(target) {
		var t = $(target);
		var hh = t.children(".panel-header,header");
		var ff = t.children(".panel-footer,footer");
		return $.extend({}, $.parser.parseOptions(target, [ 
			"id", "width", "height", "left", "top", "title", "iconCls", "cls", "headerCls", "bodyCls", "tools", "href", "method", "header",
			"footer", {
				cache : "boolean",
				fit : "boolean",
				border : "boolean",
				noheader : "boolean"
			}, {
				collapsible : "boolean",
				minimizable : "boolean",
				maximizable : "boolean"
			}, {
				closable : "boolean",
				collapsed : "boolean",
				minimized : "boolean",
				maximized : "boolean",
				closed : "boolean"
			}, "openAnimation", "closeAnimation", {
				openDuration : "number",
				closeDuration : "number"
			}, 
		]), {
			loadingMessage : (t.attr("loadingMessage") != undefined ? t.attr("loadingMessage") : undefined),
			header : (hh.length ? hh.removeClass("panel-header") : undefined),
			footer : (ff.length ? ff.removeClass("panel-footer") : undefined)
		});
	};
	$.fn.panel.defaults = {
		id : null,
		title : null,
		iconCls : null,
		width : "auto",
		height : "auto",
		left : null,
		top : null,
		cls : null,
		headerCls : null,
		bodyCls : null,
		style : {},
		href : null,
		cache : true,
		fit : false,
		border : true,
		doSize : true,
		noheader : false,
		content : null,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closable : false,
		collapsed : false,
		minimized : false,
		maximized : false,
		closed : false,
		openAnimation : false,
		openDuration : 400,
		closeAnimation : false,
		closeDuration : 400,
		tools : null,
		footer : null,
		header : null,
		queryParams : {},
		method : "get",
		href : null,
		loadingMessage : "Loading...",
		loader : function(param, success, error) {
			var opts = $(this).panel("options");
			if (!opts.href) {
				return false;
			}
			$.ajax({
				type : opts.method,
				url : opts.href,
				cache : false,
				data : param,
				dataType : "html",
				success : function(data) {
					success(data);
				},
				error : function() {
					error.apply(this, arguments);
				}
			});
		},
		extractor : function(data) {
			var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var matches = pattern.exec(data);
			if (matches) {
				return matches[1];
			} else {
				return data;
			}
		},
		onBeforeLoad : function(param) {},
		onLoad : function() {},
		onLoadError : function() {},
		onBeforeOpen : function() {},
		onOpen : function() {},
		onBeforeClose : function() {},
		onClose : function() {},
		onBeforeDestroy : function() {},
		onDestroy : function() {},
		onResize : function(width, height) {},
		onMove : function(left, top) {},
		onMaximize : function() {},
		onRestore : function() {},
		onMinimize : function() {},
		onBeforeCollapse : function() {},
		onBeforeExpand : function() {},
		onCollapse : function() {},
		onExpand : function() {}
	};
})(jQuery);
﻿/**
 * window 
 * 
 * Dependencies:
 * 	 panel
 *   draggable
 *   resizable
 * 
 */
(function($){
	function moveWindow(target, param){
		var state = $.data(target, 'window');
		if (param){
			if (param.left != null) state.options.left = param.left;
			if (param.top != null) state.options.top = param.top;
		}
		$(target).panel('move', state.options);
		if (state.shadow){
			state.shadow.css({
				left: state.options.left,
				top: state.options.top
			});
		}
	}
	
	/**
	 *  center the window only horizontally
	 */
	function hcenter(target, tomove){
		var opts = $.data(target, 'window').options;
		var pp = $(target).window('panel');
		var width = pp._outerWidth();
		if (opts.inline){
			var parent = pp.parent();
			opts.left = Math.ceil((parent.width() - width) / 2 + parent.scrollLeft());
		} else {
			opts.left = Math.ceil(($(window)._outerWidth() - width) / 2 + $(document).scrollLeft());
		}
		if (tomove){moveWindow(target);}
	}
	
	/**
	 * center the window only vertically
	 */
	function vcenter(target, tomove){
		var opts = $.data(target, 'window').options;
		var pp = $(target).window('panel');
		var height = pp._outerHeight();
		if (opts.inline){
			var parent = pp.parent();
			opts.top = Math.ceil((parent.height() - height) / 2 + parent.scrollTop());
		} else {
			opts.top = Math.ceil(($(window)._outerHeight() - height) / 2 + $(document).scrollTop());
		}
		if (tomove){moveWindow(target);}
	}
	
	function create(target){
		var state = $.data(target, 'window');
		var opts = state.options;
		var win = $(target).panel($.extend({}, state.options, {
			border: false,
			doSize: true,	// size the panel, the property undefined in window component
			closed: true,	// close the panel
			cls: 'window ' + (!opts.border?'window-thinborder window-noborder ':(opts.border=='thin'?'window-thinborder ':'')) + (opts.cls || ''),
			headerCls: 'window-header ' + (opts.headerCls || ''),
			bodyCls: 'window-body ' + (opts.noheader ? 'window-body-noheader ' : ' ') + (opts.bodyCls||''),
			
			onBeforeDestroy: function(){
				if (opts.onBeforeDestroy.call(target) == false){return false;}
				if (state.shadow){state.shadow.remove();}
				if (state.mask){state.mask.remove();}
			},
			onClose: function(){
				if (state.shadow){state.shadow.hide();}
				if (state.mask){state.mask.hide();}
				opts.onClose.call(target);
			},
			onOpen: function(){
				if (state.mask){
					state.mask.css($.extend({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++
					}, $.fn.window.getMaskSize(target)));
				}
				if (state.shadow){
					state.shadow.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++,
						left: opts.left,
						top: opts.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				opts.onOpen.call(target);
			},
			onResize: function(width, height){
				var popts = $(this).panel('options');
				$.extend(opts, {
					width: popts.width,
					height: popts.height,
					left: popts.left,
					top: popts.top
				});
				if (state.shadow){
					state.shadow.css({
						left: opts.left,
						top: opts.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				opts.onResize.call(target, width, height);
			},
			onMinimize: function(){
				if (state.shadow){state.shadow.hide();}
				if (state.mask){state.mask.hide();}
				state.options.onMinimize.call(target);
			},
			onBeforeCollapse: function(){
				if (opts.onBeforeCollapse.call(target) == false){return false;}
				if (state.shadow){state.shadow.hide();}
			},
			onExpand: function(){
				if (state.shadow){state.shadow.show();}
				opts.onExpand.call(target);
			}
		}));
		
		state.window = win.panel('panel');
		
		// create mask
		if (state.mask){state.mask.remove();}
		if (opts.modal){
			state.mask = $('<div class="window-mask" style="display:none"></div>').insertAfter(state.window);
		}
		
		// create shadow
		if (state.shadow){state.shadow.remove();}
		if (opts.shadow){
			state.shadow = $('<div class="window-shadow" style="display:none"></div>').insertAfter(state.window);
		}
		
		// center and open the window
		var closed = opts.closed;
		if (opts.left == null){hcenter(target);}
		if (opts.top == null){vcenter(target);}
		moveWindow(target);
		if (!closed){win.window('open');}
	}

	function constrain(left, top, width, height){
		var target = this;
		var state = $.data(target, 'window');
		var opts = state.options;
		if (!opts.constrain){return {};}
		if ($.isFunction(opts.constrain)){
			return opts.constrain.call(target, left, top, width, height);
		}
		var win = $(target).window('window');
		var parent = opts.inline ? win.parent() : $(window);
		if (left < 0){left = 0;}
		if (top < parent.scrollTop()){top = parent.scrollTop();}
		if (left + width > parent.width()){
			if (width == win.outerWidth()){	// moving
				left = parent.width() - width;
			} else {	// resizing
				width = parent.width() - left;
			}
		}
		if (top - parent.scrollTop() + height > parent.height()){
			if (height == win.outerHeight()){	// moving
				top = parent.height() - height + parent.scrollTop();
			} else {	// resizing
				height = parent.height() - top + parent.scrollTop();
			}
		}

		return {
			left:left,
			top:top,
			width:width,
			height:height
		};
	}
	
	
	/**
	 * set window drag and resize property
	 */
	function setProperties(target){
		var state = $.data(target, 'window');
		
		state.window.draggable({
			handle: '>div.panel-header>div.panel-title',
			disabled: state.options.draggable == false,
			onBeforeDrag: function(e){
				if (state.mask) state.mask.css('z-index', $.fn.window.defaults.zIndex++);
				if (state.shadow) state.shadow.css('z-index', $.fn.window.defaults.zIndex++);
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
			},
			onStartDrag: function(e){
				start1(e);
			},
			onDrag: function(e){
				proc1(e);
				return false;
			},
			onStopDrag: function(e){
				stop1(e);
			}
		});
		
		state.window.resizable({
			disabled: state.options.resizable == false,
			onStartResize:function(e){
				start1(e);
			},
			onResize: function(e){
				proc1(e);
				return false;
			},
			onStopResize: function(e){
				stop1(e);
			}
		});

		function start1(e){
			if (state.pmask){state.pmask.remove();}
			state.pmask = $('<div class="window-proxy-mask"></div>').insertAfter(state.window);
			state.pmask.css({
				display: 'none',
				zIndex: $.fn.window.defaults.zIndex++,
				left: e.data.left,
				top: e.data.top,
				width: state.window._outerWidth(),
				height: state.window._outerHeight()
			});
			if (state.proxy){state.proxy.remove();}
			state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
			state.proxy.css({
				display: 'none',
				zIndex: $.fn.window.defaults.zIndex++,
				left: e.data.left,
				top: e.data.top
			});
			state.proxy._outerWidth(e.data.width)._outerHeight(e.data.height);
			state.proxy.hide();
			setTimeout(function(){
				if (state.pmask){state.pmask.show();}
				if (state.proxy){state.proxy.show();}
			}, 500);
		}
		function proc1(e){
			$.extend(e.data, constrain.call(target, e.data.left, e.data.top, e.data.width, e.data.height));
			state.pmask.show();
			state.proxy.css({
				display: 'block',
				left: e.data.left,
				top: e.data.top
			});
			state.proxy._outerWidth(e.data.width);
			state.proxy._outerHeight(e.data.height);
		}
		function stop1(e){
			$.extend(e.data, constrain.call(target, e.data.left, e.data.top, e.data.width+0.1, e.data.height+0.1));
			$(target).window('resize', e.data);
			state.pmask.remove();
			state.pmask = null;
			state.proxy.remove();
			state.proxy = null;
		}
	}
		
	// when window resize, reset the width and height of the window's mask
	$(function(){
		if (!$._positionFixed){
			$(window).resize(function(){
				$('body>div.window-mask:visible').css({
					width: '',
					height: ''
				});
				setTimeout(function(){
					$('body>div.window-mask:visible').css($.fn.window.getMaskSize());
				}, 50);
			});
		}
	});
	
	$.fn.window = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.window.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.panel(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'window');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'window', {
					options: $.extend({}, $.fn.window.defaults, $.fn.window.parseOptions(this), options)
				});
				if (!state.options.inline){
					document.body.appendChild(this);
				}
			}
			create(this);
			setProperties(this);
		});
	};
	
	$.fn.window.methods = {
		options: function(jq){
			var popts = jq.panel('options');
			var wopts = $.data(jq[0], 'window').options;
			return $.extend(wopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
		},
		window: function(jq){
			return $.data(jq[0], 'window').window;
		},
		move: function(jq, param){
			return jq.each(function(){
				moveWindow(this, param);
			});
		},
		hcenter: function(jq){
			return jq.each(function(){
				hcenter(this, true);
			});
		},
		vcenter: function(jq){
			return jq.each(function(){
				vcenter(this, true);
			});
		},
		center: function(jq){
			return jq.each(function(){
				hcenter(this);
				vcenter(this);
				moveWindow(this);
			});
		}
	};

	$.fn.window.getMaskSize = function(target){
		var state = $(target).data('window');
		if (state && state.options.inline){
			return {};
		} else if ($._positionFixed){
			return {position: 'fixed'};
		} else {
			return {
				width: $(document).width(),
				height: $(document).height()
			};
		}
	};
	
	$.fn.window.parseOptions = function(target){
		return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, [
			{draggable:'boolean',resizable:'boolean',shadow:'boolean',modal:'boolean',inline:'boolean'}
		]));
	};
	
	// Inherited from $.fn.panel.defaults
	$.fn.window.defaults = $.extend({}, $.fn.panel.defaults, {
		zIndex: 9000,
		draggable: true,
		resizable: true,
		shadow: true,
		modal: false,
		border: true,	// possible values are: true,false,'thin','thick'
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		
		// window's property which difference from panel
		title: 'New Window',
		collapsible: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		closed: false,
		constrain: false
		/*
		constrain: function(left,top,width,height){
			return {
				left:left,
				top:top,
				width:width,
				height:height
			};
		}
		*/
	});
})(jQuery);
﻿/**
 * dialog
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "dialog").options;
		_3.inited = false;
		$(_2).window($.extend({}, _3, {
			onResize : function(w, h) {
				if (_3.inited) {
					_b(this);
					_3.onResize.call(this, w, h);
				}
			}
		}));
		var _4 = $(_2).window("window");
		if (_3.toolbar) {
			if ($.isArray(_3.toolbar)) {
				$(_2).siblings("div.dialog-toolbar").remove();
				var _5 = $(
						"<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>")
						.appendTo(_4);
				var tr = _5.find("tr");
				for (var i = 0; i < _3.toolbar.length; i++) {
					var _6 = _3.toolbar[i];
					if (_6 == "-") {
						$(
								"<td><div class=\"dialog-tool-separator\"></div></td>")
								.appendTo(tr);
					} else {
						var td = $("<td></td>").appendTo(tr);
						var _7 = $("<a href=\"javascript:void(0)\"></a>")
								.appendTo(td);
						_7[0].onclick = eval(_6.handler || function() {
						});
						_7.linkbutton($.extend({}, _6, {
							plain : true
						}));
					}
				}
			} else {
				$(_3.toolbar).addClass("dialog-toolbar").appendTo(_4);
				$(_3.toolbar).show();
			}
		} else {
			$(_2).siblings("div.dialog-toolbar").remove();
		}
		if (_3.buttons) {
			if ($.isArray(_3.buttons)) {
				$(_2).siblings("div.dialog-button").remove();
				var _8 = $("<div class=\"dialog-button\"></div>").appendTo(_4);
				for (var i = 0; i < _3.buttons.length; i++) {
					var p = _3.buttons[i];
					var _9 = $("<a href=\"javascript:void(0)\"></a>").appendTo(
							_8);
					if (p.handler) {
						_9[0].onclick = p.handler;
					}
					_9.linkbutton(p);
				}
			} else {
				$(_3.buttons).addClass("dialog-button").appendTo(_4);
				$(_3.buttons).show();
			}
		} else {
			$(_2).siblings("div.dialog-button").remove();
		}
		_3.inited = true;
		var _a = _3.closed;
		_4.show();
		$(_2).window("resize");
		if (_a) {
			_4.hide();
		}
	}
	;
	function _b(_c, _d) {
		var t = $(_c);
		var _e = t.dialog("options");
		var _f = _e.noheader;
		var tb = t.siblings(".dialog-toolbar");
		var bb = t.siblings(".dialog-button");
		tb.insertBefore(_c).css({
			borderTopWidth : (_f ? 1 : 0),
			top : (_f ? tb.length : 0)
		});
		bb.insertAfter(_c);
		tb.add(bb)._outerWidth(t._outerWidth()).find(".nestui-fluid:visible")
				.each(function() {
					$(this).triggerHandler("_resize");
				});
		var _10 = tb._outerHeight() + bb._outerHeight();
		if (!isNaN(parseInt(_e.height))) {
			t._outerHeight(t._outerHeight() - _10);
		} else {
			var _11 = t._size("min-height");
			if (_11) {
				t._size("min-height", _11 - _10);
			}
			var _12 = t._size("max-height");
			if (_12) {
				t._size("max-height", _12 - _10);
			}
		}
		var _13 = $.data(_c, "window").shadow;
		if (_13) {
			var cc = t.panel("panel");
			_13.css({
				width : cc._outerWidth(),
				height : cc._outerHeight()
			});
		}
	}
	;
	$.fn.dialog = function(_14, _15) {
		if (typeof _14 == "string") {
			var _16 = $.fn.dialog.methods[_14];
			if (_16) {
				return _16(this, _15);
			} else {
				return this.window(_14, _15);
			}
		}
		_14 = _14 || {};
		return this.each(function() {
			var _17 = $.data(this, "dialog");
			if (_17) {
				$.extend(_17.options, _14);
			} else {
				$.data(this, "dialog", {
					options : $.extend({}, $.fn.dialog.defaults, $.fn.dialog
							.parseOptions(this), _14)
				});
			}
			_1(this);
		});
	};
	$.fn.dialog.methods = {
		options : function(jq) {
			var _18 = $.data(jq[0], "dialog").options;
			var _19 = jq.panel("options");
			$.extend(_18, {
				width : _19.width,
				height : _19.height,
				left : _19.left,
				top : _19.top,
				closed : _19.closed,
				collapsed : _19.collapsed,
				minimized : _19.minimized,
				maximized : _19.maximized
			});
			return _18;
		},
		dialog : function(jq) {
			return jq.window("window");
		}
	};
	$.fn.dialog.parseOptions = function(_1a) {
		var t = $(_1a);
		return $.extend({}, $.fn.window.parseOptions(_1a), $.parser
				.parseOptions(_1a, [ "toolbar", "buttons" ]), {
			toolbar : (t.children(".dialog-toolbar").length ? t.children(
					".dialog-toolbar").removeClass("dialog-toolbar")
					: undefined),
			buttons : (t.children(".dialog-button").length ? t.children(
					".dialog-button").removeClass("dialog-button") : undefined)
		});
	};
	$.fn.dialog.defaults = $.extend({}, $.fn.window.defaults, {
		title : "New Dialog",
		collapsible : false,
		minimizable : false,
		maximizable : false,
		resizable : false,
		toolbar : null,
		buttons : null
	});
})(jQuery);
﻿/**
 * messager
 * 
 */
(function($) {
	function _1() {
		$(document)
				.unbind(".messager")
				.bind(
						"keydown.messager",
						function(e) {
							if (e.keyCode == 27) {
								$("body").children("div.messager-window")
										.children("div.messager-body").each(
												function() {
													$(this).dialog("close");
												});
							} else {
								if (e.keyCode == 9) {
									var _2 = $("body").children(
											"div.messager-window");
									if (!_2.length) {
										return;
									}
									var _3 = _2
											.find(".messager-input,.messager-button .l-btn");
									for (var i = 0; i < _3.length; i++) {
										if ($(_3[i]).is(":focus")) {
											$(
													_3[i >= _3.length - 1 ? 0
															: i + 1]).focus();
											return false;
										}
									}
								} else {
									if (e.keyCode == 13) {
										var _4 = $(e.target).closest(
												"input.messager-input");
										if (_4.length) {
											var _5 = _4
													.closest(".messager-body");
											_6(_5, _4.val());
										}
									}
								}
							}
						});
	}
	;
	function _7() {
		$(document).unbind(".messager");
	}
	;
	function _8(_9) {
		var _a = $.extend({}, $.messager.defaults, {
			modal : false,
			shadow : false,
			draggable : false,
			resizable : false,
			closed : true,
			style : {
				left : "",
				top : "",
				right : 0,
				zIndex : $.fn.window.defaults.zIndex++,
				bottom : -document.body.scrollTop
						- document.documentElement.scrollTop
			},
			title : "",
			width : 250,
			height : 100,
			minHeight : 0,
			showType : "slide",
			showSpeed : 600,
			content : _9.msg,
			timeout : 4000
		}, _9);
		var _b = $("<div class=\"messager-body\"></div>").appendTo("body");
		_b.dialog($.extend({}, _a, {
			noheader : (_a.title ? false : true),
			openAnimation : (_a.showType),
			closeAnimation : (_a.showType == "show" ? "hide" : _a.showType),
			openDuration : _a.showSpeed,
			closeDuration : _a.showSpeed,
			onOpen : function() {
				_b.dialog("dialog").hover(function() {
					if (_a.timer) {
						clearTimeout(_a.timer);
					}
				}, function() {
					_c();
				});
				_c();
				function _c() {
					if (_a.timeout > 0) {
						_a.timer = setTimeout(function() {
							if (_b.length && _b.data("dialog")) {
								_b.dialog("close");
							}
						}, _a.timeout);
					}
				}
				;
				if (_9.onOpen) {
					_9.onOpen.call(this);
				} else {
					_a.onOpen.call(this);
				}
			},
			onClose : function() {
				if (_a.timer) {
					clearTimeout(_a.timer);
				}
				if (_9.onClose) {
					_9.onClose.call(this);
				} else {
					_a.onClose.call(this);
				}
				_b.dialog("destroy");
			}
		}));
		_b.dialog("dialog").css(_a.style);
		_b.dialog("open");
		return _b;
	}
	;
	function _d(_e) {
		_1();
		var _f = $("<div class=\"messager-body\"></div>").appendTo("body");
		_f.dialog($.extend({}, _e, {
			noheader : (_e.title ? false : true),
			onClose : function() {
				_7();
				if (_e.onClose) {
					_e.onClose.call(this);
				}
				setTimeout(function() {
					_f.dialog("destroy");
				}, 100);
			}
		}));
		var win = _f.dialog("dialog").addClass("messager-window");
		win.find(".dialog-button").addClass("messager-button").find("a:first")
				.focus();
		return _f;
	}
	;
	function _6(dlg, _10) {
		dlg.dialog("close");
		dlg.dialog("options").fn(_10);
	}
	;
	$.messager = {
		show : function(_11) {
			return _8(_11);
		},
		alert : function(_12, msg, _13, fn) {
			var _14 = typeof _12 == "object" ? _12 : {
				title : _12,
				msg : msg,
				icon : _13,
				fn : fn
			};
			var cls = _14.icon ? "messager-icon messager-" + _14.icon : "";
			_14 = $.extend({}, $.messager.defaults, {
				content : "<div class=\"" + cls + "\"></div>" + "<div>"
						+ _14.msg + "</div>" + "<div style=\"clear:both;\"/>"
			}, _14);
			if (!_14.buttons) {
				_14.buttons = [ {
					text : _14.ok,
					onClick : function() {
						_6(dlg);
					}
				} ];
			}
			var dlg = _d(_14);
			return dlg;
		},
		confirm : function(_15, msg, fn) {
			var _16 = typeof _15 == "object" ? _15 : {
				title : _15,
				msg : msg,
				fn : fn
			};
			_16 = $
					.extend(
							{},
							$.messager.defaults,
							{
								content : "<div class=\"messager-icon messager-question\"></div>"
										+ "<div>"
										+ _16.msg
										+ "</div>"
										+ "<div style=\"clear:both;\"/>"
							}, _16);
			if (!_16.buttons) {
				_16.buttons = [ {
					text : _16.ok,
					onClick : function() {
						_6(dlg, true);
					}
				}, {
					text : _16.cancel,
					onClick : function() {
						_6(dlg, false);
					}
				} ];
			}
			var dlg = _d(_16);
			return dlg;
		},
		prompt : function(_17, msg, fn) {
			var _18 = typeof _17 == "object" ? _17 : {
				title : _17,
				msg : msg,
				fn : fn
			};
			_18 = $
					.extend(
							{},
							$.messager.defaults,
							{
								content : "<div class=\"messager-icon messager-question\"></div>"
										+ "<div>"
										+ _18.msg
										+ "</div>"
										+ "<br/>"
										+ "<div style=\"clear:both;\"/>"
										+ "<div><input class=\"messager-input\" type=\"text\"/></div>"
							}, _18);
			if (!_18.buttons) {
				_18.buttons = [ {
					text : _18.ok,
					onClick : function() {
						_6(dlg, dlg.find(".messager-input").val());
					}
				}, {
					text : _18.cancel,
					onClick : function() {
						_6(dlg);
					}
				} ];
			}
			var dlg = _d(_18);
			dlg.find(".messager-input").focus();
			return dlg;
		},
		progress : function(_19) {
			var _1a = {
				bar : function() {
					return $("body>div.messager-window").find(
							"div.messager-p-bar");
				},
				close : function() {
					var dlg = $("body>div.messager-window>div.messager-body:has(div.messager-progress)");
					if (dlg.length) {
						dlg.dialog("close");
					}
				}
			};
			if (typeof _19 == "string") {
				var _1b = _1a[_19];
				return _1b();
			}
			_19 = _19 || {};
			var _1c = $.extend({}, {
				title : "",
				minHeight : 0,
				content : undefined,
				msg : "",
				text : undefined,
				interval : 300
			}, _19);
			var dlg = _d($
					.extend(
							{},
							$.messager.defaults,
							{
								content : "<div class=\"messager-progress\"><div class=\"messager-p-msg\">"
										+ _1c.msg
										+ "</div><div class=\"messager-p-bar\"></div></div>",
								closable : false,
								doSize : false
							}, _1c, {
								onClose : function() {
									if (this.timer) {
										clearInterval(this.timer);
									}
									if (_19.onClose) {
										_19.onClose.call(this);
									} else {
										$.messager.defaults.onClose.call(this);
									}
								}
							}));
			var bar = dlg.find("div.messager-p-bar");
			bar.progressbar({
				text : _1c.text
			});
			dlg.dialog("resize");
			if (_1c.interval) {
				dlg[0].timer = setInterval(function() {
					var v = bar.progressbar("getValue");
					v += 10;
					if (v > 100) {
						v = 0;
					}
					bar.progressbar("setValue", v);
				}, _1c.interval);
			}
			return dlg;
		}
	};
	$.messager.defaults = $.extend({}, $.fn.dialog.defaults, {
		ok : "Ok",
		cancel : "Cancel",
		width : 300,
		height : "auto",
		minHeight : 150,
		modal : true,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		resizable : false,
		fn : function() {
		}
	});
})(jQuery);
﻿/**
 * accordion
 * 
 * Dependencies:
 * 	 panel
 * 
 */
(function($){
	
	function setSize(container, param){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		var cc = $(container);
		
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		cc._size(opts);
		var headerHeight = 0;
		var bodyHeight = 'auto';
		var headers = cc.find('>.panel>.accordion-header');
		if (headers.length){
			headerHeight = $(headers[0]).css('height', '')._outerHeight();
		}
		if (!isNaN(parseInt(opts.height))){
			bodyHeight = cc.height() - headerHeight*headers.length;
		}
		
		_resize(true, bodyHeight - _resize(false) + 1);
		
		function _resize(collapsible, height){
			var totalHeight = 0;
			for(var i=0; i<panels.length; i++){
				var p = panels[i];
				var h = p.panel('header')._outerHeight(headerHeight);
				if (p.panel('options').collapsible == collapsible){
					var pheight = isNaN(height) ? undefined : (height+headerHeight*h.length);
					p.panel('resize', {
						width: cc.width(),
						height: (collapsible ? pheight : undefined)
					});
					totalHeight += p.panel('panel').outerHeight()-headerHeight*h.length;
				}
			}
			return totalHeight;
		}
	}
	
	/**
	 * find a panel by specified property, return the panel object or panel index.
	 */
	function findBy(container, property, value, all){
		var panels = $.data(container, 'accordion').panels;
		var pp = [];
		for(var i=0; i<panels.length; i++){
			var p = panels[i];
			if (property){
				if (p.panel('options')[property] == value){
					pp.push(p);
				}
			} else {
				if (p[0] == $(value)[0]){
					return i;
				}
			}
		}
		if (property){
			return all ? pp : (pp.length ? pp[0] : null);
		} else {
			return -1;
		}
	}
	
	function getSelections(container){
		return findBy(container, 'collapsed', false, true);
	}
	
	function getSelected(container){
		var pp = getSelections(container);
		return pp.length ? pp[0] : null;
	}
	
	/**
	 * get panel index, start with 0
	 */
	function getPanelIndex(container, panel){
		return findBy(container, null, panel);
	}
	
	/**
	 * get the specified panel.
	 */
	function getPanel(container, which){
		var panels = $.data(container, 'accordion').panels;
		if (typeof which == 'number'){
			if (which < 0 || which >= panels.length){
				return null;
			} else {
				return panels[which];
			}
		}
		return findBy(container, 'title', which);
	}
	
	function setProperties(container){
		var opts = $.data(container, 'accordion').options;
		var cc = $(container);
		if (opts.border){
			cc.removeClass('accordion-noborder');
		} else {
			cc.addClass('accordion-noborder');
		}
	}
	
	function init(container){
		var state = $.data(container, 'accordion');
		var cc = $(container);
		cc.addClass('accordion');
		
		state.panels = [];
		cc.children('div').each(function(){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			state.panels.push(pp);
			createPanel(container, pp, opts);
		});
		
		cc.bind('_resize', function(e,force){
			if ($(this).hasClass('nestui-fluid') || force){
				setSize(container);
			}
			return false;
		});
	}
	
	function createPanel(container, pp, options){
		var opts = $.data(container, 'accordion').options;
		pp.panel($.extend({}, {
			collapsible: true,
			minimizable: false,
			maximizable: false,
			closable: false,
			doSize: false,
			collapsed: true,
			headerCls: 'accordion-header',
			bodyCls: 'accordion-body'
		}, options, {
			onBeforeExpand: function(){
				if (options.onBeforeExpand){
					if (options.onBeforeExpand.call(this) == false){return false}
				}
				if (!opts.multiple){
					// get all selected panel
					var all = $.grep(getSelections(container), function(p){
						return p.panel('options').collapsible;
					});
					for(var i=0; i<all.length; i++){
						unselect(container, getPanelIndex(container, all[i]));
					}
				}
				var header = $(this).panel('header');
				header.addClass('accordion-header-selected');
				header.find('.accordion-collapse').removeClass('accordion-expand');
			},
			onExpand: function(){
				if (options.onExpand){options.onExpand.call(this)}
				opts.onSelect.call(container, $(this).panel('options').title, getPanelIndex(container, this));
			},
			onBeforeCollapse: function(){
				if (options.onBeforeCollapse){
					if (options.onBeforeCollapse.call(this) == false){return false}
				}
				var header = $(this).panel('header');
				header.removeClass('accordion-header-selected');
				header.find('.accordion-collapse').addClass('accordion-expand');
			},
			onCollapse: function(){
				if (options.onCollapse){options.onCollapse.call(this)}
				opts.onUnselect.call(container, $(this).panel('options').title, getPanelIndex(container, this));
			}
		}));
		
		var header = pp.panel('header');
		var tool = header.children('div.panel-tool');
		tool.children('a.panel-tool-collapse').hide();	// hide the old collapse button
		var t = $('<a href="javascript:void(0)"></a>').addClass('accordion-collapse accordion-expand').appendTo(tool);
		t.bind('click', function(){
			togglePanel(pp);
			return false;
		});
		pp.panel('options').collapsible ? t.show() : t.hide();
		
		header.click(function(){
			togglePanel(pp);
			return false;
		});
		
		function togglePanel(p){
			var popts = p.panel('options');
			if (popts.collapsible){
				var index = getPanelIndex(container, p);
				if (popts.collapsed){
					select(container, index);
				} else {
					unselect(container, index);
				}
			}
		}
	}
	
	/**
	 * select and set the specified panel active
	 */
	function select(container, which){
		var p = getPanel(container, which);
		if (!p){return}
		stopAnimate(container);
		var opts = $.data(container, 'accordion').options;
		p.panel('expand', opts.animate);
	}
	
	function unselect(container, which){
		var p = getPanel(container, which);
		if (!p){return}
		stopAnimate(container);
		var opts = $.data(container, 'accordion').options;
		p.panel('collapse', opts.animate);
	}
	
	function doFirstSelect(container){
		var opts = $.data(container, 'accordion').options;
		var p = findBy(container, 'selected', true);
		if (p){
			_select(getPanelIndex(container, p));
		} else {
			_select(opts.selected);
		}
		
		function _select(index){
			var animate = opts.animate;
			opts.animate = false;
			select(container, index);
			opts.animate = animate;
		}
	}
	
	/**
	 * stop the animation of all panels
	 */
	function stopAnimate(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			panels[i].stop(true,true);
		}
	}
	
	function add(container, options){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		if (options.selected == undefined) options.selected = true;

		stopAnimate(container);
		
		var pp = $('<div></div>').appendTo(container);
		panels.push(pp);
		createPanel(container, pp, options);
		setSize(container);
		
		opts.onAdd.call(container, options.title, panels.length-1);
		
		if (options.selected){
			select(container, panels.length-1);
		}
	}
	
	function remove(container, which){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		
		stopAnimate(container);
		
		var panel = getPanel(container, which);
		var title = panel.panel('options').title;
		var index = getPanelIndex(container, panel);
		
		if (!panel){return}
		if (opts.onBeforeRemove.call(container, title, index) == false){return}
		
		panels.splice(index, 1);
		panel.panel('destroy');
		if (panels.length){
			setSize(container);
			var curr = getSelected(container);
			if (!curr){
				select(container, 0);
			}
		}
		
		opts.onRemove.call(container, title, index);
	}
	
	$.fn.accordion = function(options, param){
		if (typeof options == 'string'){
			return $.fn.accordion.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'accordion');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'accordion', {
					options: $.extend({}, $.fn.accordion.defaults, $.fn.accordion.parseOptions(this), options),
					accordion: $(this).addClass('accordion'),
					panels: []
				});
				init(this);
			}
			
			setProperties(this);
			setSize(this);
			doFirstSelect(this);
		});
	};
	
	$.fn.accordion.methods = {
		options: function(jq){
			return $.data(jq[0], 'accordion').options;
		},
		panels: function(jq){
			return $.data(jq[0], 'accordion').panels;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getSelections: function(jq){
			return getSelections(jq[0]);
		},
		getSelected: function(jq){
			return getSelected(jq[0]);
		},
		getPanel: function(jq, which){
			return getPanel(jq[0], which);
		},
		getPanelIndex: function(jq, panel){
			return getPanelIndex(jq[0], panel);
		},
		select: function(jq, which){
			return jq.each(function(){
				select(this, which);
			});
		},
		unselect: function(jq, which){
			return jq.each(function(){
				unselect(this, which);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				add(this, options);
			});
		},
		remove: function(jq, which){
			return jq.each(function(){
				remove(this, which);
			});
		}
	};
	
	$.fn.accordion.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height',
			{fit:'boolean',border:'boolean',animate:'boolean',multiple:'boolean',selected:'number'}
		]));
	};
	
	$.fn.accordion.defaults = {
		width: 'auto',
		height: 'auto',
		fit: false,
		border: true,
		animate: true,
		multiple: false,
		selected: 0,
		
		onSelect: function(title, index){},
		onUnselect: function(title, index){},
		onAdd: function(title, index){},
		onBeforeRemove: function(title, index){},
		onRemove: function(title, index){}
	};
})(jQuery);
﻿/**
 * tabs 
 * 
 * Dependencies:
 * 	 panel
 *   linkbutton
 * 
 */
(function($){
	function getContentWidth(c){
		var w = 0;
		$(c).children().each(function(){
			w += $(this).outerWidth(true);
		});
		return w;
	}
	/**
	 * set the tabs scrollers to show or not,
	 * dependent on the tabs count and width
	 */
	function setScrollers(container) {
		var opts = $.data(container, 'tabs').options;
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right' || !opts.showHeader){return}
		
		var header = $(container).children('div.tabs-header');
		var tool = header.children('div.tabs-tool:not(.tabs-tool-hidden)');
		var sLeft = header.children('div.tabs-scroller-left');
		var sRight = header.children('div.tabs-scroller-right');
		var wrap = header.children('div.tabs-wrap');
		
		// set the tool height
		var tHeight = header.outerHeight();
		if (opts.plain){
			tHeight -= tHeight - header.height();
		}
		tool._outerHeight(tHeight);
		
		var tabsWidth = getContentWidth(header.find('ul.tabs'));
		var cWidth = header.width() - tool._outerWidth();
		
		if (tabsWidth > cWidth) {
			sLeft.add(sRight).show()._outerHeight(tHeight);
			if (opts.toolPosition == 'left'){
				tool.css({
					left: sLeft.outerWidth(),
					right: ''
				});
				wrap.css({
					marginLeft: sLeft.outerWidth() + tool._outerWidth(),
					marginRight: sRight._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			} else {
				tool.css({
					left: '',
					right: sRight.outerWidth()
				});
				wrap.css({
					marginLeft: sLeft.outerWidth(),
					marginRight: sRight.outerWidth() + tool._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			}
		} else {
			sLeft.add(sRight).hide();
			if (opts.toolPosition == 'left'){
				tool.css({
					left: 0,
					right: ''
				});
				wrap.css({
					marginLeft: tool._outerWidth(),
					marginRight: 0,
					width: cWidth
				});
			} else {
				tool.css({
					left: '',
					right: 0
				});
				wrap.css({
					marginLeft: 0,
					marginRight: tool._outerWidth(),
					width: cWidth
				});
			}
		}
	}
	
	function addTools(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		if (opts.tools) {
			if (typeof opts.tools == 'string'){
				$(opts.tools).addClass('tabs-tool').appendTo(header);
				$(opts.tools).show();
			} else {
				header.children('div.tabs-tool').remove();
				var tools = $('<div class="tabs-tool"><table cellspacing="0" cellpadding="0" style="height:100%"><tr></tr></table></div>').appendTo(header);
				var tr = tools.find('tr');
				for(var i=0; i<opts.tools.length; i++){
					var td = $('<td></td>').appendTo(tr);
					var tool = $('<a href="javascript:void(0);"></a>').appendTo(td);
					tool[0].onclick = eval(opts.tools[i].handler || function(){});
					tool.linkbutton($.extend({}, opts.tools[i], {
						plain: true
					}));
				}
			}
		} else {
			header.children('div.tabs-tool').remove();
		}
	}
	
	function setSize(container, param) {
		var state = $.data(container, 'tabs');
		var opts = state.options;
		var cc = $(container);
		
		if (!opts.doSize){return}
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		cc._size(opts);

		var header = cc.children('div.tabs-header');
		var panels = cc.children('div.tabs-panels');
		var wrap = header.find('div.tabs-wrap');
		var ul = wrap.find('.tabs');
		ul.children('li').removeClass('tabs-first tabs-last');
		ul.children('li:first').addClass('tabs-first');
		ul.children('li:last').addClass('tabs-last');
		
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right'){
			header._outerWidth(opts.showHeader ? opts.headerWidth : 0);
			panels._outerWidth(cc.width() - header.outerWidth());
			header.add(panels)._size('height', isNaN(parseInt(opts.height)) ? '' : cc.height());
			wrap._outerWidth(header.width());
			ul._outerWidth(wrap.width()).css('height','');
		} else {
			header.children('div.tabs-scroller-left,div.tabs-scroller-right,div.tabs-tool:not(.tabs-tool-hidden)').css('display', opts.showHeader?'block':'none');
			header._outerWidth(cc.width()).css('height','');
			if (opts.showHeader){
				header.css('background-color','');
				wrap.css('height','');
			} else {
				header.css('background-color','transparent');
				header._outerHeight(0);
				wrap._outerHeight(0);
			}
			ul._outerHeight(opts.tabHeight).css('width','');
			ul._outerHeight(ul.outerHeight()-ul.height()-1+opts.tabHeight).css('width','');
			
			panels._size('height', isNaN(parseInt(opts.height)) ? '' : (cc.height()-header.outerHeight()));
			panels._size('width', cc.width());
		}

		if (state.tabs.length){
			var d1 = ul.outerWidth(true) - ul.width();
			var li = ul.children('li:first');
			var d2 = li.outerWidth(true) - li.width();
			var hwidth = header.width() - header.children('.tabs-tool:not(.tabs-tool-hidden)')._outerWidth();
			var justifiedWidth = Math.floor((hwidth-d1-d2*state.tabs.length)/state.tabs.length);
			
			$.map(state.tabs, function(p){
				setTabSize(p, (opts.justified && $.inArray(opts.tabPosition,['top','bottom'])>=0) ? justifiedWidth : undefined);
			});
			if (opts.justified && $.inArray(opts.tabPosition,['top','bottom'])>=0){
				var deltaWidth = hwidth - d1 - getContentWidth(ul);
				setTabSize(state.tabs[state.tabs.length-1], justifiedWidth+deltaWidth);
			}
		}
		setScrollers(container);

		function setTabSize(p, width){
			var p_opts = p.panel('options');
			var p_t = p_opts.tab.find('a.tabs-inner');
			var width = width ? width : (parseInt(p_opts.tabWidth||opts.tabWidth||undefined));
			if (width){
				p_t._outerWidth(width);
			} else {
				p_t.css('width', '');
			}
			p_t._outerHeight(opts.tabHeight);
			p_t.css('lineHeight', p_t.height()+'px');
			p_t.find('.nestui-fluid:visible').triggerHandler('_resize');
		}
	}
	
	/**
	 * set selected tab panel size
	 */
	function setSelectedSize(container){
		var opts = $.data(container, 'tabs').options;
		var tab = getSelectedTab(container);
		if (tab){
			var panels = $(container).children('div.tabs-panels');
			var width = opts.width=='auto' ? 'auto' : panels.width();
			var height = opts.height=='auto' ? 'auto' : panels.height();
			tab.panel('resize', {
				width: width,
				height: height
			});
		}
	}
	
	/**
	 * wrap the tabs header and body
	 */
	function wrapTabs(container) {
		var tabs = $.data(container, 'tabs').tabs;
		var cc = $(container).addClass('tabs-container');
		var panels = $('<div class="tabs-panels"></div>').insertBefore(cc);
		cc.children('div').each(function(){
			panels[0].appendChild(this);
		});
		cc[0].appendChild(panels[0]);
		$('<div class="tabs-header">'
				+ '<div class="tabs-scroller-left"></div>'
				+ '<div class="tabs-scroller-right"></div>'
				+ '<div class="tabs-wrap">'
				+ '<ul class="tabs"></ul>'
				+ '</div>'
				+ '</div>').prependTo(container);
		
		cc.children('div.tabs-panels').children('div').each(function(i){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				disabled: ($(this).attr('disabled') ? true : undefined),
				selected: ($(this).attr('selected') ? true : undefined)
			});
			createTab(container, opts, $(this));
		});
		
		cc.children('div.tabs-header').find('.tabs-scroller-left, .tabs-scroller-right').hover(
				function(){$(this).addClass('tabs-scroller-over');},
				function(){$(this).removeClass('tabs-scroller-over');}
		);
		cc.bind('_resize', function(e,force){
			if ($(this).hasClass('nestui-fluid') || force){
				setSize(container);
				setSelectedSize(container);
			}
			return false;
		});
	}
	
	function bindEvents(container){
		var state = $.data(container, 'tabs')
		var opts = state.options;
		$(container).children('div.tabs-header').unbind().bind('click', function(e){
			if ($(e.target).hasClass('tabs-scroller-left')){
				$(container).tabs('scrollBy', -opts.scrollIncrement);
			} else if ($(e.target).hasClass('tabs-scroller-right')){
				$(container).tabs('scrollBy', opts.scrollIncrement);
			} else {
				var li = $(e.target).closest('li');
				if (li.hasClass('tabs-disabled')){return false;}
				var a = $(e.target).closest('a.tabs-close');
				if (a.length){
					closeTab(container, getLiIndex(li));
				} else if (li.length){
//					selectTab(container, getLiIndex(li));
					var index = getLiIndex(li);
					var popts = state.tabs[index].panel('options');
					if (popts.collapsible){
						popts.closed ? selectTab(container, index) : unselectTab(container, index);
					} else {
						selectTab(container, index);
					}
				}
				return false;
			}
		}).bind('contextmenu', function(e){
			var li = $(e.target).closest('li');
			if (li.hasClass('tabs-disabled')){return;}
			if (li.length){
				opts.onContextMenu.call(container, e, li.find('span.tabs-title').html(), getLiIndex(li));
			}
		});
		
		function getLiIndex(li){
			var index = 0;
			li.parent().children('li').each(function(i){
				if (li[0] == this){
					index = i;
					return false;
				}
			});
			return index;
		}
	}
	
	function setProperties(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		
		header.removeClass('tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right');
		panels.removeClass('tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right');
		if (opts.tabPosition == 'top'){
			header.insertBefore(panels);
		} else if (opts.tabPosition == 'bottom'){
			header.insertAfter(panels);
			header.addClass('tabs-header-bottom');
			panels.addClass('tabs-panels-top');
		} else if (opts.tabPosition == 'left'){
			header.addClass('tabs-header-left');
			panels.addClass('tabs-panels-right');
		} else if (opts.tabPosition == 'right'){
			header.addClass('tabs-header-right');
			panels.addClass('tabs-panels-left');
		}
		
		if (opts.plain == true) {
			header.addClass('tabs-header-plain');
		} else {
			header.removeClass('tabs-header-plain');
		}
		header.removeClass('tabs-header-narrow').addClass(opts.narrow?'tabs-header-narrow':'');
		var tabs = header.find('.tabs');
		tabs.removeClass('tabs-pill').addClass(opts.pill?'tabs-pill':'');
		tabs.removeClass('tabs-narrow').addClass(opts.narrow?'tabs-narrow':'');
		tabs.removeClass('tabs-justified').addClass(opts.justified?'tabs-justified':'');
		if (opts.border == true){
			header.removeClass('tabs-header-noborder');
			panels.removeClass('tabs-panels-noborder');
		} else {
			header.addClass('tabs-header-noborder');
			panels.addClass('tabs-panels-noborder');
		}
		opts.doSize = true;
	}
	
	function createTab(container, options, pp) {
		options = options || {};
		var state = $.data(container, 'tabs');
		var tabs = state.tabs;
		if (options.index == undefined || options.index > tabs.length){options.index = tabs.length}
		if (options.index < 0){options.index = 0}
		
		var ul = $(container).children('div.tabs-header').find('ul.tabs');
		var panels = $(container).children('div.tabs-panels');
		var tab = $(
				'<li>' +
				'<a href="javascript:void(0)" class="tabs-inner">' +
				'<span class="tabs-title"></span>' +
				'<span class="tabs-icon"></span>' +
				'</a>' +
				'</li>');
		if (!pp){pp = $('<div></div>');}
		if (options.index >= tabs.length){
			tab.appendTo(ul);
			pp.appendTo(panels);
			tabs.push(pp);
		} else {
			tab.insertBefore(ul.children('li:eq('+options.index+')'));
			pp.insertBefore(panels.children('div.panel:eq('+options.index+')'));
			tabs.splice(options.index, 0, pp);
		}

		// create panel
		pp.panel($.extend({}, options, {
			tab: tab,
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined),
			onLoad: function(){
				if (options.onLoad){
					options.onLoad.call(this, arguments);
				}
				state.options.onLoad.call(container, $(this));
			},
			onBeforeOpen: function(){
				if (options.onBeforeOpen){
					if (options.onBeforeOpen.call(this) == false){return false;}
				}
				var p = $(container).tabs('getSelected');
				if (p){
					if (p[0] != this){
						$(container).tabs('unselect', getTabIndex(container, p));
						p = $(container).tabs('getSelected');
						if (p){
							return false;
						}
					} else {
						setSelectedSize(container);
						return false;
					}
				}
				
				var popts = $(this).panel('options');
				popts.tab.addClass('tabs-selected');
				// scroll the tab to center position if required.
				var wrap = $(container).find('>div.tabs-header>div.tabs-wrap');
				var left = popts.tab.position().left;
				var right = left + popts.tab.outerWidth();
				if (left < 0 || right > wrap.width()){
					var deltaX = left - (wrap.width()-popts.tab.width()) / 2;
					$(container).tabs('scrollBy', deltaX);
				} else {
					$(container).tabs('scrollBy', 0);
				}
				
				var panel = $(this).panel('panel');
				panel.css('display','block');
				setSelectedSize(container);
				panel.css('display','none');
			},
			onOpen: function(){
				if (options.onOpen){
					options.onOpen.call(this);
				}
				var popts = $(this).panel('options');
				state.selectHis.push(popts.title);
				state.options.onSelect.call(container, popts.title, getTabIndex(container, this));
			},
			onBeforeClose: function(){
				if (options.onBeforeClose){
					if (options.onBeforeClose.call(this) == false){return false;}
				}
				$(this).panel('options').tab.removeClass('tabs-selected');
			},
			onClose: function(){
				if (options.onClose){
					options.onClose.call(this);
				}
				var popts = $(this).panel('options');
				state.options.onUnselect.call(container, popts.title, getTabIndex(container, this));
			}
		}));
		
		// only update the tab header
		$(container).tabs('update', {
			tab: pp,
			options: pp.panel('options'),
			type: 'header'
		});
	}
	
	function addTab(container, options) {
		var state = $.data(container, 'tabs');
		var opts = state.options;
		if (options.selected == undefined) options.selected = true;
		
		createTab(container, options);
		opts.onAdd.call(container, options.title, options.index);
		if (options.selected){
			selectTab(container, options.index);	// select the added tab panel
		}
	}
	
	/**
	 * update tab panel, param has following properties:
	 * tab: the tab panel to be updated
	 * options: the tab panel options
	 * type: the update type, possible values are: 'header','body','all'
	 */
	function updateTab(container, param){
		param.type = param.type || 'all';
		var selectHis = $.data(container, 'tabs').selectHis;
		var pp = param.tab;	// the tab panel
		var opts = pp.panel('options');	// get the tab panel options
		var oldTitle = opts.title;
		$.extend(opts, param.options, {
			iconCls: (param.options.icon ? param.options.icon : undefined)
		});

		if (param.type == 'all' || param.type == 'body'){
			pp.panel();
		}
		if (param.type == 'all' || param.type == 'header'){
			var tab = opts.tab;
			
			if (opts.header){
				tab.find('.tabs-inner').html($(opts.header));
			} else {
				var s_title = tab.find('span.tabs-title');
				var s_icon = tab.find('span.tabs-icon');
				s_title.html(opts.title);
				s_icon.attr('class', 'tabs-icon');
				
				tab.find('a.tabs-close').remove();
				if (opts.closable){
					s_title.addClass('tabs-closable');
					$('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
				} else{
					s_title.removeClass('tabs-closable');
				}
				if (opts.iconCls){
					s_title.addClass('tabs-with-icon');
					s_icon.addClass(opts.iconCls);
				} else {
					s_title.removeClass('tabs-with-icon');
				}
				if (opts.tools){
					var p_tool = tab.find('span.tabs-p-tool');
					if (!p_tool.length){
						var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(tab.find('a.tabs-inner'));
					}
					if ($.isArray(opts.tools)){
						p_tool.empty();
						for(var i=0; i<opts.tools.length; i++){
							var t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool);
							t.addClass(opts.tools[i].iconCls);
							if (opts.tools[i].handler){
								t.bind('click', {handler:opts.tools[i].handler}, function(e){
									if ($(this).parents('li').hasClass('tabs-disabled')){return;}
									e.data.handler.call(this);
								});
							}
						}
					} else {
						$(opts.tools).children().appendTo(p_tool);
					}
					var pr = p_tool.children().length * 12;
					if (opts.closable) {
						pr += 8;
					} else {
						pr -= 3;
						p_tool.css('right','5px');
					}
					s_title.css('padding-right', pr+'px');
				} else {
					tab.find('span.tabs-p-tool').remove();
					s_title.css('padding-right', '');
				}
			}
			if (oldTitle != opts.title){
				for(var i=0; i<selectHis.length; i++){
					if (selectHis[i] == oldTitle){
						selectHis[i] = opts.title;
					}
				}
			}
		}
		if (opts.disabled){
			opts.tab.addClass('tabs-disabled');
		} else {
			opts.tab.removeClass('tabs-disabled');
		}
		
		setSize(container);
		
		$.data(container, 'tabs').options.onUpdate.call(container, opts.title, getTabIndex(container, pp));
	}
	
	/**
	 * close a tab with specified index or title
	 */
	function closeTab(container, which) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (!exists(container, which)) return;
		
		var tab = getTab(container, which);
		var title = tab.panel('options').title;
		var index = getTabIndex(container, tab);
		
		if (opts.onBeforeClose.call(container, title, index) == false) return;
		
		var tab = getTab(container, which, true);
		tab.panel('options').tab.remove();
		tab.panel('destroy');
		
		opts.onClose.call(container, title, index);
		
//		setScrollers(container);
		setSize(container);
		
		// remove the select history item
		for(var i=0; i<selectHis.length; i++){
			if (selectHis[i] == title){
				selectHis.splice(i, 1);
				i --;
			}
		}
		
		// select the nearest tab panel
		var hisTitle = selectHis.pop();
		if (hisTitle){
			selectTab(container, hisTitle);
		} else if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	/**
	 * get the specified tab panel
	 */
	function getTab(container, which, removeit){
		var tabs = $.data(container, 'tabs').tabs;
		var tab = null;
		if (typeof which == 'number'){
			if (which >=0 && which < tabs.length){
				tab = tabs[which];
				if (removeit){
					tabs.splice(which, 1);
				}
			}
		} else {
			var tmp = $('<span></span>');
			for(var i=0; i<tabs.length; i++){
				var p = tabs[i];
				tmp.html(p.panel('options').title);
				if (tmp.text() == which){
					tab = p;
					if (removeit){
						tabs.splice(i, 1);
					}
					break;
				}
			}
			tmp.remove();
		}
		return tab;
	}
	
	function getTabIndex(container, tab){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i][0] == $(tab)[0]){
				return i;
			}
		}
		return -1;
	}
	
	function getSelectedTab(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').tab.hasClass('tabs-selected')){
				return tab;
			}
		}
		return null;
	}
	
	/**
	 * do first select action, if no tab is setted the first tab will be selected.
	 */
	function doFirstSelect(container){
		var state = $.data(container, 'tabs')
		var tabs = state.tabs;
		for(var i=0; i<tabs.length; i++){
			var opts = tabs[i].panel('options');
			if (opts.selected && !opts.disabled){
				selectTab(container, i);
				return;
			}
		}
		selectTab(container, state.options.selected);
	}
	
	function selectTab(container, which){
		var p = getTab(container, which);
		if (p && !p.is(':visible')){
			stopAnimate(container);
			if (!p.panel('options').disabled){
				p.panel('open');				
			}
		}
	}
	
	function unselectTab(container, which){
		var p = getTab(container, which);
		if (p && p.is(':visible')){
			stopAnimate(container);
			p.panel('close');
		}
	}

	function stopAnimate(container){
		$(container).children('div.tabs-panels').each(function(){
			$(this).stop(true, true);
		});
	}
	
	function exists(container, which){
		return getTab(container, which) != null;
	}
	
	function showHeader(container, visible){
		var opts = $.data(container, 'tabs').options;
		opts.showHeader = visible;
		$(container).tabs('resize');
	}
	
	function showTool(container, visible){
		var tool = $(container).find('>.tabs-header>.tabs-tool');
		if (visible){
			tool.removeClass('tabs-tool-hidden').show();
		} else {
			tool.addClass('tabs-tool-hidden').hide();
		}
		$(container).tabs('resize').tabs('scrollBy', 0);
	}
	
	
	$.fn.tabs = function(options, param){
		if (typeof options == 'string') {
			return $.fn.tabs.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tabs');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'tabs', {
					options: $.extend({},$.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
					tabs: [],
					selectHis: []
				});
				wrapTabs(this);
			}
			
			addTools(this);
			setProperties(this);
			setSize(this);
			bindEvents(this);
			
			doFirstSelect(this);
		});
	};
	
	$.fn.tabs.methods = {
		options: function(jq){
			var cc = jq[0];
			var opts = $.data(cc, 'tabs').options;
			var s = getSelectedTab(cc);
			opts.selected = s ? getTabIndex(cc, s) : -1;
			return opts;
		},
		tabs: function(jq){
			return $.data(jq[0], 'tabs').tabs;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
				setSelectedSize(this);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addTab(this, options);
			});
		},
		close: function(jq, which){
			return jq.each(function(){
				closeTab(this, which);
			});
		},
		getTab: function(jq, which){
			return getTab(jq[0], which);
		},
		getTabIndex: function(jq, tab){
			return getTabIndex(jq[0], tab);
		},
		getSelected: function(jq){
			return getSelectedTab(jq[0]);
		},
		select: function(jq, which){
			return jq.each(function(){
				selectTab(this, which);
			});
		},
		unselect: function(jq, which){
			return jq.each(function(){
				unselectTab(this, which);
			});
		},
		exists: function(jq, which){
			return exists(jq[0], which);
		},
		update: function(jq, options){
			return jq.each(function(){
				updateTab(this, options);
			});
		},
		enableTab: function(jq, which){
			return jq.each(function(){
				var opts = $(this).tabs('getTab', which).panel('options');
				opts.tab.removeClass('tabs-disabled');
				opts.disabled = false;
			});
		},
		disableTab: function(jq, which){
			return jq.each(function(){
				var opts = $(this).tabs('getTab', which).panel('options');
				opts.tab.addClass('tabs-disabled');
				opts.disabled = true;
			});
		},
		showHeader: function(jq){
			return jq.each(function(){
				showHeader(this, true);
			});
		},
		hideHeader: function(jq){
			return jq.each(function(){
				showHeader(this, false);
			});
		},
		showTool: function(jq){
			return jq.each(function(){
				showTool(this, true);
			});
		},
		hideTool: function(jq){
			return jq.each(function(){
				showTool(this, false);
			});
		},
		scrollBy: function(jq, deltaX){	// scroll the tab header by the specified amount of pixels
			return jq.each(function(){
				var opts = $(this).tabs('options');
				var wrap = $(this).find('>div.tabs-header>div.tabs-wrap');
				var pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth());
				wrap.animate({scrollLeft: pos}, opts.scrollDuration);
				
				function getMaxScrollWidth(){
					var w = 0;
					var ul = wrap.children('ul');
					ul.children('li').each(function(){
						w += $(this).outerWidth(true);
					});
					return w - wrap.width() + (ul.outerWidth() - ul.width());
				}
			});
		}
	};
	
	$.fn.tabs.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [
			'tools','toolPosition','tabPosition',
			{fit:'boolean',border:'boolean',plain:'boolean'},
			{headerWidth:'number',tabWidth:'number',tabHeight:'number',selected:'number'},
			{showHeader:'boolean',justified:'boolean',narrow:'boolean',pill:'boolean'}
		]));
	};
	
	$.fn.tabs.defaults = {
		width: 'auto',
		height: 'auto',
		headerWidth: 150,	// the tab header width, it is valid only when tabPosition set to 'left' or 'right' 
		tabWidth: 'auto',	// the tab width
		tabHeight: 27,		// the tab height
		selected: 0,		// the initialized selected tab index
		showHeader: true,
		plain: false,
		fit: false,
		border: true,
		justified: false,
		narrow: false,
		pill: false,
		tools: null,
		toolPosition: 'right',	// left,right
		tabPosition: 'top',		// possible values: top,bottom
		scrollIncrement: 100,
		scrollDuration: 400,
		onLoad: function(panel){},
		onSelect: function(title, index){},
		onUnselect: function(title, index){},
		onBeforeClose: function(title, index){},
		onClose: function(title, index){},
		onAdd: function(title, index){},
		onUpdate: function(title, index){},
		onContextMenu: function(e, title, index){}
	};
})(jQuery);
﻿/**
 * layout
 * 
 * Dependencies:
 *   panel
 *   
 */
(function($) {
	var _1 = false;
	function _2(_3, _4) {
		var _5 = $.data(_3, "layout");
		var _6 = _5.options;
		var _7 = _5.panels;
		var cc = $(_3);
		if (_4) {
			$.extend(_6, {
				width : _4.width,
				height : _4.height
			});
		}
		if (_3.tagName.toLowerCase() == "body") {
			cc._size("fit");
		} else {
			cc._size(_6);
		}
		var _8 = {
			top : 0,
			left : 0,
			width : cc.width(),
			height : cc.height()
		};
		_9(_a(_7.expandNorth) ? _7.expandNorth : _7.north, "n");
		_9(_a(_7.expandSouth) ? _7.expandSouth : _7.south, "s");
		_b(_a(_7.expandEast) ? _7.expandEast : _7.east, "e");
		_b(_a(_7.expandWest) ? _7.expandWest : _7.west, "w");
		_7.center.panel("resize", _8);
		function _9(pp, _c) {
			if (!pp.length || !_a(pp)) {
				return;
			}
			var _d = pp.panel("options");
			pp.panel("resize", {
				width : cc.width(),
				height : _d.height
			});
			var _e = pp.panel("panel").outerHeight();
			pp.panel("move", {
				left : 0, 
				top : (_c == "n" ? 0 : cc.height() - _e)
			});
			_8.height -= _e;
			if (_c == "n") {
				_8.top += _e;
				if (!_d.split && _d.border) {
					_8.top--;
				}
			}
			if (!_d.split && _d.border) {
				_8.height++;
			}
		};
		
		function _b(pp, _f) {
			if (!pp.length || !_a(pp)) {
				return;
			}
			var _10 = pp.panel("options");
			pp.panel("resize", {
				width : _10.width,
				height : _8.height
			});
			var _11 = pp.panel("panel").outerWidth();
			pp.panel("move", {
				left : (_f == "e" ? cc.width() - _11 : 0),
				top : _8.top
			});
			_8.width -= _11;
			if (_f == "w") {
				_8.left += _11;
				if (!_10.split && _10.border) {
					_8.left--;
				}
			}
			if (!_10.split && _10.border) {
				_8.width++;
			}
		};
	};
	
	function _12(_13) {
		var cc = $(_13);
		cc.addClass("layout");
		function _14(el) {
			var _15 = $.fn.layout.parsePanelOptions(el);
			if ("north,south,east,west,center".indexOf(_15.region) >= 0) {
				_19(_13, _15, el);
			}
		};
		var _16 = cc.layout("options");
		var _17 = _16.onAdd;
		_16.onAdd = function() {};
		cc.find(">div,>form>div").each(function() {
			_14(this);
		});
		_16.onAdd = _17;
		cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
		cc.bind("_resize", function(e, _18) {
			if ($(this).hasClass("nestui-fluid") || _18) {
				_2(_13);
			}
			return false;
		});
	};
	
	function _19(_1a, _1b, el) {
		_1b.region = _1b.region || "center";
		var _1c = $.data(_1a, "layout").panels;
		var cc = $(_1a);
		var dir = _1b.region;
		if (_1c[dir].length) {
			return;
		}
		var pp = $(el);
		if (!pp.length) {
			pp = $("<div></div>").appendTo(cc);
		}
		var _1d = $.extend({}, $.fn.layout.paneldefaults, {
			width : (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : "auto"),
			height : (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : "auto"),
			doSize : false,
			collapsible : true,
			onOpen : function() {
				var _1e = $(this).panel("header").children("div.panel-tool");
				_1e.children("a.panel-tool-collapse").hide();
				var _1f = {
					north : "up",
					south : "down",
					east : "right",
					west : "left"
				};
				if (!_1f[dir]) {
					return;
				}
				var _20 = "layout-button-" + _1f[dir];
				var t = _1e.children("a." + _20);
				if (!t.length) {
					t = $("<a href=\"javascript:void(0)\"></a>").addClass(_20).appendTo(_1e);
					t.bind("click", { dir : dir }, function(e) {
						_2d(_1a, e.data.dir);
						return false;
					});
				}
				$(this).panel("options").collapsible ? t.show() : t.hide();
			}
		}, 
		_1b, {
			cls : ((_1b.cls || "") + " layout-panel layout-panel-" + dir),
			bodyCls : ((_1b.bodyCls || "") + " layout-body")
		});
		pp.panel(_1d);
		_1c[dir] = pp;
		var _21 = {
			north : "s",
			south : "n",
			east : "w",
			west : "e"
		};
		var _22 = pp.panel("panel");
		if (pp.panel("options").split) {
			_22.addClass("layout-split-" + dir);
		}
		_22.resizable($.extend({}, {
			handles : (_21[dir] || ""),
			disabled : (!pp.panel("options").split),
			onStartResize : function(e) {
				_1 = true;
				if (dir == "north" || dir == "south") {
					var _23 = $(">div.layout-split-proxy-v", _1a);
				} else {
					var _23 = $(">div.layout-split-proxy-h", _1a);
				}
				var top = 0, _24 = 0, _25 = 0, _26 = 0;
				var pos = { display : "block" };
				if (dir == "north") {
					pos.top = parseInt(_22.css("top")) + _22.outerHeight() - _23.height();
					pos.left = parseInt(_22.css("left"));
					pos.width = _22.outerWidth();
					pos.height = _23.height();
				} else {
					if (dir == "south") {
						pos.top = parseInt(_22.css("top"));
						pos.left = parseInt(_22.css("left"));
						pos.width = _22.outerWidth();
						pos.height = _23.height();
					} else {
						if (dir == "east") {
							pos.top = parseInt(_22.css("top")) || 0;
							pos.left = parseInt(_22.css("left")) || 0;
							pos.width = _23.width();
							pos.height = _22.outerHeight();
						} else {
							if (dir == "west") {
								pos.top = parseInt(_22.css("top")) || 0;
								pos.left = _22.outerWidth() - _23.width();
								pos.width = _23.width();
								pos.height = _22.outerHeight();
							}
						}
					}
				}
				_23.css(pos);
				$("<div class=\"layout-mask\"></div>").css({
					left : 0,
					top : 0,
					width : cc.width(),
					height : cc.height()
				}).appendTo(cc);
			},
			onResize : function(e) {
				if (dir == "north" || dir == "south") {
					var _27 = $(">div.layout-split-proxy-v", _1a);
					_27.css("top", e.pageY - $(_1a).offset().top - _27.height() / 2);
				} else {
					var _27 = $(">div.layout-split-proxy-h", _1a);
					_27.css("left", e.pageX - $(_1a).offset().left - _27.width() / 2);
				}
				return false;
			},
			onStopResize : function(e) {
				cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
				pp.panel("resize", e.data);
				_2(_1a);
				_1 = false;
				cc.find(">div.layout-mask").remove();
			}
		}, _1b));
		cc.layout("options").onAdd.call(_1a, dir);
	};
	
	function _28(_29, _2a) {
		var _2b = $.data(_29, "layout").panels;
		if (_2b[_2a].length) {
			_2b[_2a].panel("destroy");
			_2b[_2a] = $();
			var _2c = "expand" + _2a.substring(0, 1).toUpperCase() + _2a.substring(1);
			if (_2b[_2c]) {
				_2b[_2c].panel("destroy");
				_2b[_2c] = undefined;
			}
			$(_29).layout("options").onRemove.call(_29, _2a);
		}
	};
	
	function _2d(_2e, _2f, _30) {
		if (_30 == undefined) {
			_30 = "normal";
		}
		var _31 = $.data(_2e, "layout").panels;
		var p = _31[_2f];
		var _32 = p.panel("options");
		if (_32.onBeforeCollapse.call(p) == false) {
			return;
		}
		var _33 = "expand" + _2f.substring(0, 1).toUpperCase() + _2f.substring(1);
		if (!_31[_33]) {
			_31[_33] = _34(_2f);
			var ep = _31[_33].panel("panel");
			if (!_32.expandMode) {
				ep.css("cursor", "default");
			} else {
				ep.bind("click", function() {
					if (_32.expandMode == "dock") {
						_41(_2e, _2f);
					} else {
						p.panel("expand", false).panel("open");
						var _35 = _36();
						p.panel("resize", _35.collapse);
						p.panel("panel").animate(_35.expand, function() {
							$(this).unbind(".layout").bind("mouseleave.layout", { region : _2f }, function(e) {
								if (_1 == true) {
									return;
								}
								if ($("body>div.combo-p>div.combo-panel:visible").length) {
									return;
								}
								_2d(_2e, e.data.region);
							});
							$(_2e).layout("options").onExpand.call(_2e, _2f);
						});
					}
					return false;
				});
			}
		}
		var _37 = _36();
		if (!_a(_31[_33])) {
			_31.center.panel("resize", _37.resizeC);
		}
		p.panel("panel").animate(_37.collapse, _30, function() {
			p.panel("collapse", false).panel("close");
			_31[_33].panel("open").panel("resize", _37.expandP);
			$(this).unbind(".layout");
			$(_2e).layout("options").onCollapse.call(_2e, _2f);
		});
		function _34(dir) {
			var _38 = {
				"east" : "left",
				"west" : "right",
				"north" : "down",
				"south" : "up"
			};
			var _39 = (_32.region == "north" || _32.region == "south");
			var _3a = "layout-button-" + _38[dir];
			var p = $("<div></div>").appendTo(_2e);
			p.panel($.extend({}, $.fn.layout.paneldefaults, {
				cls : ("layout-expand layout-expand-" + dir),
				title : "&nbsp;",
				iconCls : (_32.hideCollapsedContent ? null : _32.iconCls),
				closed : true,
				minWidth : 0,
				minHeight : 0,
				doSize : false,
				region : _32.region,
				collapsedSize : _32.collapsedSize,
				noheader : (!_39 && _32.hideExpandTool),
				tools : ((_39 && _32.hideExpandTool) ? null : [ {
					iconCls : _3a,
					handler : function() {
						_41(_2e, _2f);
						return false;
					}
				} ])
			}));
			if (!_32.hideCollapsedContent) {
				var _3b = typeof _32.collapsedContent == "function" ? _32.collapsedContent.call(p[0], _32.title) : _32.collapsedContent;
				_39 ? p.panel("setTitle", _3b) : p.html(_3b);
			}
			p.panel("panel").hover(function() { $(this).addClass("layout-expand-over"); }, function() { $(this).removeClass("layout-expand-over"); });
			return p;
		};
		
		function _36() {
			var cc = $(_2e);
			var _3c = _31.center.panel("options");
			var _3d = _32.collapsedSize;
			if (_2f == "east") {
				var _3e = p.panel("panel")._outerWidth();
				var _3f = _3c.width + _3e - _3d;
				if (_32.split || !_32.border) {
					_3f++;
				}
				return {
					resizeC : {
						width : _3f
					},
					expand : {
						left : cc.width() - _3e
					},
					expandP : {
						top : _3c.top,
						left : cc.width() - _3d,
						width : _3d,
						height : _3c.height
					},
					collapse : {
						left : cc.width(),
						top : _3c.top,
						height : _3c.height
					}
				};
			} else {
				if (_2f == "west") {
					var _3e = p.panel("panel")._outerWidth();
					var _3f = _3c.width + _3e - _3d;
					if (_32.split || !_32.border) {
						_3f++;
					}
					return {
						resizeC : {
							width : _3f,
							left : _3d - 1
						},
						expand : {
							left : 0
						},
						expandP : {
							left : 0,
							top : _3c.top,
							width : _3d,
							height : _3c.height
						},
						collapse : {
							left : -_3e,
							top : _3c.top,
							height : _3c.height
						}
					};
				} else {
					if (_2f == "north") {
						var _40 = p.panel("panel")._outerHeight();
						var hh = _3c.height;
						if (!_a(_31.expandNorth)) {
							hh += _40 - _3d + ((_32.split || !_32.border) ? 1 : 0);
						}
						_31.east.add(_31.west).add(_31.expandEast).add(_31.expandWest).panel("resize", { top : _3d - 1, height : hh });
						return {
							resizeC : {
								top : _3d - 1,
								height : hh
							},
							expand : {
								top : 0
							},
							expandP : {
								top : 0,
								left : 0,
								width : cc.width(),
								height : _3d
							},
							collapse : {
								top : -_40,
								width : cc.width()
							}
						};
					} else {
						if (_2f == "south") {
							var _40 = p.panel("panel")._outerHeight();
							var hh = _3c.height;
							if (!_a(_31.expandSouth)) {
								hh += _40 - _3d + ((_32.split || !_32.border) ? 1 : 0);
							}
							_31.east.add(_31.west).add(_31.expandEast).add(_31.expandWest).panel("resize", { height : hh });
							return {
								resizeC : {
									height : hh
								},
								expand : {
									top : cc.height() - _40
								},
								expandP : {
									top : cc.height() - _3d,
									left : 0,
									width : cc.width(),
									height : _3d
								},
								collapse : {
									top : cc.height(),
									width : cc.width()
								}
							};
						}
					}
				}
			}
		};
	};
	function _41(_42, _43) {
		var _44 = $.data(_42, "layout").panels;
		var p = _44[_43];
		var _45 = p.panel("options");
		if (_45.onBeforeExpand.call(p) == false) {
			return;
		}
		var _46 = "expand" + _43.substring(0, 1).toUpperCase() + _43.substring(1);
		if (_44[_46]) {
			_44[_46].panel("close");
			p.panel("panel").stop(true, true);
			p.panel("expand", false).panel("open");
			var _47 = _48();
			p.panel("resize", _47.collapse);
			p.panel("panel").animate(_47.expand, function() {
				_2(_42);
				$(_42).layout("options").onExpand.call(_42, _43);
			});
		}
		function _48() {
			var cc = $(_42);
			var _49 = _44.center.panel("options");
			if (_43 == "east" && _44.expandEast) {
				return {
					collapse : {
						left : cc.width(),
						top : _49.top,
						height : _49.height
					},
					expand : {
						left : cc.width() - p.panel("panel")._outerWidth()
					}
				};
			} else {
				if (_43 == "west" && _44.expandWest) {
					return {
						collapse : {
							left : -p.panel("panel")._outerWidth(),
							top : _49.top,
							height : _49.height
						},
						expand : {
							left : 0
						}
					};
				} else {
					if (_43 == "north" && _44.expandNorth) {
						return {
							collapse : {
								top : -p.panel("panel")._outerHeight(),
								width : cc.width()
							},
							expand : {
								top : 0
							}
						};
					} else {
						if (_43 == "south" && _44.expandSouth) {
							return {
								collapse : {
									top : cc.height(),
									width : cc.width()
								},
								expand : {
									top : cc.height() - p.panel("panel")._outerHeight()
								}
							};
						}
					}
				}
			}
		};
	};
	
	function _a(pp) {
		if (!pp) {
			return false;
		}
		if (pp.length) {
			return pp.panel("panel").is(":visible");
		} else {
			return false;
		}
	};
	
	function _4a(_4b) {
		var _4c = $.data(_4b, "layout");
		var _4d = _4c.options;
		var _4e = _4c.panels;
		var _4f = _4d.onCollapse;
		_4d.onCollapse = function() {};
		_50("east");
		_50("west");
		_50("north");
		_50("south");
		_4d.onCollapse = _4f;
		function _50(_51) {
			var p = _4e[_51];
			if (p.length && p.panel("options").collapsed) {
				_2d(_4b, _51, 0);
			}
		};
	};
	
	function _52(_53, _54, _55) {
		var p = $(_53).layout("panel", _54);
		p.panel("options").split = _55;
		var cls = "layout-split-" + _54;
		var _56 = p.panel("panel").removeClass(cls);
		if (_55) {
			_56.addClass(cls);
		}
		_56.resizable({
			disabled : (!_55)
		});
		_2(_53);
	}
	;
	$.fn.layout = function(_57, _58) {
		if (typeof _57 == "string") {
			return $.fn.layout.methods[_57](this, _58);
		}
		_57 = _57 || {};
		return this.each(function() {
			var _59 = $.data(this, "layout");
			if (_59) {
				$.extend(_59.options, _57);
			} else {
				var _5a = $.extend({}, $.fn.layout.defaults, $.fn.layout.parseOptions(this), _57);
				$.data(this, "layout", {
					options : _5a,
					panels : {
						center : $(),
						north : $(),
						south : $(),
						east : $(),
						west : $()
					}
				});
				_12(this);
			}
			_2(this);
			_4a(this);
		});
	};
	$.fn.layout.methods = {
		options : function(jq) {
			return $.data(jq[0], "layout").options;
		},
		resize : function(jq, _5b) {
			return jq.each(function() {
				_2(this, _5b);
			});
		},
		panel : function(jq, _5c) {
			return $.data(jq[0], "layout").panels[_5c];
		},
		collapse : function(jq, _5d) {
			return jq.each(function() {
				_2d(this, _5d);
			});
		},
		expand : function(jq, _5e) {
			return jq.each(function() {
				_41(this, _5e);
			});
		},
		add : function(jq, _5f) {
			return jq.each(function() {
				_19(this, _5f);
				_2(this);
				if ($(this).layout("panel", _5f.region).panel("options").collapsed) {
					_2d(this, _5f.region, 0);
				}
			});
		},
		remove : function(jq, _60) {
			return jq.each(function() {
				_28(this, _60);
				_2(this);
			});
		},
		split : function(jq, _61) {
			return jq.each(function() {
				_52(this, _61, true);
			});
		},
		unsplit : function(jq, _62) {
			return jq.each(function() {
				_52(this, _62, false);
			});
		}
	};
	$.fn.layout.parseOptions = function(_63) {
		return $.extend({}, $.parser.parseOptions(_63, [ {
			fit : "boolean"
		} ]));
	};
	$.fn.layout.defaults = {
		fit : false,
		onExpand : function(_64) {},
		onCollapse : function(_65) {},
		onAdd : function(_66) {},
		onRemove : function(_67) {}
	};
	$.fn.layout.parsePanelOptions = function(_68) {
		var t = $(_68);
		return $.extend({}, $.fn.panel.parseOptions(_68), $.parser.parseOptions(_68, [ "region", {
			split : "boolean",
			collpasedSize : "number",
			minWidth : "number",
			minHeight : "number",
			maxWidth : "number",
			maxHeight : "number"
		} ]));
	};
	$.fn.layout.paneldefaults = $.extend({}, $.fn.panel.defaults, {
		region : null,
		split : false,
		collapsedSize : 28,
		expandMode : "float",
		hideExpandTool : false,
		hideCollapsedContent : true,
		collapsedContent : function(_69) {
			var p = $(this);
			var _6a = p.panel("options");
			if (_6a.region == "north" || _6a.region == "south") {
				return _69;
			}
			var _6b = _6a.collapsedSize - 2;
			var _6c = (_6b - 16) / 2;
			_6c = _6b - _6c;
			var cc = [];
			if (_6a.iconCls) {
				cc.push("<div class=\"panel-icon " + _6a.iconCls + "\"></div>");
			}
			cc.push("<div class=\"panel-title layout-expand-title");
			cc.push(_6a.iconCls ? " layout-expand-with-icon" : "");
			cc.push("\" style=\"left:" + _6c + "px\">");
			cc.push(_69);
			cc.push("</div>");
			return cc.join("");
		},
		minWidth : 10,
		minHeight : 10,
		maxWidth : 10000,
		maxHeight : 10000
	});
})(jQuery);
﻿/**
 * menu
 * 
 */
(function($){
	$(function(){
		$(document).unbind('.menu').bind('mousedown.menu', function(e){
			var m = $(e.target).closest('div.menu,div.combo-p');
			if (m.length){return}
			$('body>div.menu-top:visible').not('.menu-inline').menu('hide');
			hideMenu($('body>div.menu:visible').not('.menu-inline'));
		});
	});
	
	/**
	 * initialize the target menu, the function can be invoked only once
	 */
	function init(target){
		var opts = $.data(target, 'menu').options;
		$(target).addClass('menu-top');	// the top menu
		opts.inline ? $(target).addClass('menu-inline') : $(target).appendTo('body');
		$(target).bind('_resize', function(e, force){
			if ($(this).hasClass('nestui-fluid') || force){
				$(target).menu('resize', target);
			}
			return false;
		});
		
		var menus = splitMenu($(target));
		for(var i=0; i<menus.length; i++){
			createMenu(target, menus[i]);
		}
		
		function splitMenu(menu){
			var menus = [];
			menu.addClass('menu');
			menus.push(menu);
			if (!menu.hasClass('menu-content')){
				menu.children('div').each(function(){
					var submenu = $(this).children('div');
					if (submenu.length){
						submenu.appendTo('body');
						this.submenu = submenu;		// point to the sub menu
						var mm = splitMenu(submenu);
						menus = menus.concat(mm);
					}
				});
			}
			return menus;
		}
	}

	function createMenu(target, div){
		var menu = $(div).addClass('menu');
		if (!menu.data('menu')){
			menu.data('menu', {
				options: $.parser.parseOptions(menu[0], ['width','height'])
			});
		}
		if (!menu.hasClass('menu-content')){
			menu.children('div').each(function(){
				createItem(target, this);
			});
			$('<div class="menu-line"></div>').prependTo(menu);
		}
		setMenuSize(target, menu);
		if (!menu.hasClass('menu-inline')){
			menu.hide();
		}
		bindMenuEvent(target, menu);
	}

	/**
	 * create the menu item
	 */
	function createItem(target, div, options){
		var item = $(div);
		var itemOpts = $.extend({}, $.parser.parseOptions(item[0], ['id','name','iconCls','href',{separator:'boolean'}]), {
			disabled: (item.attr('disabled') ? true : undefined),
			text: $.trim(item.html()),
			onclick: item[0].onclick
		}, options||{});
		itemOpts.onclick = itemOpts.onclick || itemOpts.handler || null;
		item.data('menuitem', {
			options: itemOpts
		});
		if (itemOpts.separator){
			item.addClass('menu-sep');
		}
		if (!item.hasClass('menu-sep')){
			item.addClass('menu-item');
			item.empty().append($('<div class="menu-text"></div>').html(itemOpts.text));
			if (itemOpts.iconCls){
				$('<div class="menu-icon"></div>').addClass(itemOpts.iconCls).appendTo(item);
			}
			if (itemOpts.id){
				item.attr('id', itemOpts.id);
			}
			if (itemOpts.onclick){
				if (typeof itemOpts.onclick == 'string'){
					item.attr('onclick', itemOpts.onclick);
				} else {
					item[0].onclick = eval(itemOpts.onclick);
				}
			}
			if (itemOpts.disabled){
				setDisabled(target, item[0], true);
			}
			if (item[0].submenu){
				$('<div class="menu-rightarrow"></div>').appendTo(item);	// has sub menu
			}
		}
	}
	
	function setMenuSize(target, menu){
		var opts = $.data(target, 'menu').options;
		var style = menu.attr('style') || '';
		var isVisible = menu.is(':visible');
		menu.css({
			display: 'block',
			left: -10000,
			height: 'auto',
			overflow: 'hidden'
		});
		menu.find('.menu-item').each(function(){
			$(this)._outerHeight(opts.itemHeight);
			$(this).find('.menu-text').css({
				height: (opts.itemHeight-2)+'px',
				lineHeight: (opts.itemHeight-2)+'px'
			});
		});
		menu.removeClass('menu-noline').addClass(opts.noline?'menu-noline':'');
		
		var mopts = menu.data('menu').options;
		var width = mopts.width;
		var height = mopts.height;
		if (isNaN(parseInt(width))){
			width = 0;
			menu.find('div.menu-text').each(function(){
				if (width < $(this).outerWidth()){
					width = $(this).outerWidth();
				}
			});
			// width += 40;
			width = width ? width+40 : '';
		}
		var autoHeight = menu.outerHeight();
		if (isNaN(parseInt(height))){
			height = autoHeight;
			if (menu.hasClass('menu-top') && opts.alignTo){
				var at = $(opts.alignTo);
				var h1 = at.offset().top - $(document).scrollTop();
				var h2 = $(window)._outerHeight() + $(document).scrollTop() - at.offset().top - at._outerHeight();
				height = Math.min(height, Math.max(h1, h2));
			} else if (height > $(window)._outerHeight()){
				height = $(window).height();
			}
		}

		menu.attr('style', style);	// restore the original style
		menu.show();
		menu._size($.extend({}, mopts, {
			width: width,
			height: height,
			minWidth: mopts.minWidth || opts.minWidth,
			maxWidth: mopts.maxWidth || opts.maxWidth
		}));
		menu.find('.nestui-fluid').triggerHandler('_resize', [true]);
		menu.css('overflow', menu.outerHeight() < autoHeight ? 'auto' : 'hidden');
		menu.children('div.menu-line')._outerHeight(autoHeight-2);
		if (!isVisible){
			menu.hide();
		}
	}
	
	/**
	 * bind menu event
	 */
	function bindMenuEvent(target, menu){
		var state = $.data(target, 'menu');
		var opts = state.options;
		menu.unbind('.menu');
		for(var event in opts.events){
			menu.bind(event+'.menu', {target:target}, opts.events[event]);
		}
	}
	function mouseenterHandler(e){
		var target = e.data.target;
		var state = $.data(target, 'menu');
		if (state.timer){
			clearTimeout(state.timer);
			state.timer = null;
		}
	}
	function mouseleaveHandler(e){
		var target = e.data.target;
		var state = $.data(target, 'menu');
		if (state.options.hideOnUnhover){
			state.timer = setTimeout(function(){
				hideAll(target, $(target).hasClass('menu-inline'));
			}, state.options.duration);
		}
	}
	function mouseoverHandler(e){
		var target = e.data.target;
		var item = $(e.target).closest('.menu-item');
		if (item.length){
			item.siblings().each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
			// show this menu
			item.addClass('menu-active');
			
			if (item.hasClass('menu-item-disabled')){
				item.addClass('menu-active-disabled');
				return;
			}
			
			var submenu = item[0].submenu;
			if (submenu){
				$(target).menu('show', {
					menu: submenu,
					parent: item
				});
			}
		}
	}
	function mouseoutHandler(e){
		var item = $(e.target).closest('.menu-item');
		if (item.length){
			item.removeClass('menu-active menu-active-disabled');
			var submenu = item[0].submenu;
			if (submenu){
				if (e.pageX>=parseInt(submenu.css('left'))){
					item.addClass('menu-active');
				} else {
					hideMenu(submenu);
				}
			} else {
				item.removeClass('menu-active');
			}
		}
	}
	function clickHandler(e){
		var target = e.data.target;
		var item = $(e.target).closest('.menu-item');
		if (item.length){
			var opts = $(target).data('menu').options;
			var itemOpts = item.data('menuitem').options;
			if (itemOpts.disabled){return;}
			if (!item[0].submenu){
				hideAll(target, opts.inline);
				if (itemOpts.href){
					location.href = itemOpts.href;
				}
			}
			item.trigger('mouseenter');
			opts.onClick.call(target, $(target).menu('getItem', item[0]));
		}
	}
	
	/**
	 * hide top menu and it's all sub menus
	 */
	function hideAll(target, inline){
		var state = $.data(target, 'menu');
		if (state){
			if ($(target).is(':visible')){
				hideMenu($(target));
				if (inline){
					$(target).show();
				} else {
					state.options.onHide.call(target);
				}
			}
		}
		return false;
	}
	
	/**
	 * show the menu, the 'param' object has one or more properties:
	 * left: the left position to display
	 * top: the top position to display
	 * menu: the menu to display, if not defined, the 'target menu' is used
	 * parent: the parent menu item to align to
	 * alignTo: the element object to align to
	 */
	function showMenu(target, param){
		param = param || {};
		var left,top;
		var opts = $.data(target, 'menu').options;
		var menu = $(param.menu || target);
		$(target).menu('resize', menu[0]);
		if (menu.hasClass('menu-top')){
			$.extend(opts, param);
			left = opts.left;
			top = opts.top;
			if (opts.alignTo){
				var at = $(opts.alignTo);
				left = at.offset().left;
				top = at.offset().top + at._outerHeight();
				if (opts.align == 'right'){
					left += at.outerWidth() - menu.outerWidth();
				}
			}
			if (left + menu.outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - menu.outerWidth() - 5;
			}
			if (left < 0){left = 0;}
			top = _fixTop(top, opts.alignTo);
		} else {
			var parent = param.parent;	// the parent menu item
			left = parent.offset().left + parent.outerWidth() - 2;
			if (left + menu.outerWidth() + 5 > $(window)._outerWidth() + $(document).scrollLeft()){
				left = parent.offset().left - menu.outerWidth() + 2;
			}
			top = _fixTop(parent.offset().top - 3);
		}
		
		function _fixTop(top, alignTo){
			if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				if (alignTo){
					top = $(alignTo).offset().top - menu._outerHeight();
				} else {
					top = $(window)._outerHeight() + $(document).scrollTop() - menu.outerHeight();
				}
			}
			if (top < 0){top = 0;}
			return top;
		}
		
		menu.css(opts.position.call(target, menu[0], left, top));
		menu.show(0, function(){
			if (!menu[0].shadow){
				menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
			}
			menu[0].shadow.css({
				display:(menu.hasClass('menu-inline')?'none':'block'),
				zIndex:$.fn.menu.defaults.zIndex++,
				left:menu.css('left'),
				top:menu.css('top'),
				width:menu.outerWidth(),
				height:menu.outerHeight()
			});
			menu.css('z-index', $.fn.menu.defaults.zIndex++);
			if (menu.hasClass('menu-top')){
				opts.onShow.call(target);
			}
		});
	}
	
	function hideMenu(menu){
		if (menu && menu.length){
			hideit(menu);
			menu.find('div.menu-item').each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
		}
		
		function hideit(m){
			m.stop(true,true);
			if (m[0].shadow){
				m[0].shadow.hide();
			}
			m.hide();
		}
	}
	
	function findItem(target, text){
		var result = null;
		var tmp = $('<div></div>');
		function find(menu){
			menu.children('div.menu-item').each(function(){
				var item = $(target).menu('getItem', this);
				var s = tmp.empty().html(item.text).text();
				if (text == $.trim(s)) {
					result = item;
				} else if (this.submenu && !result){
					find(this.submenu);
				}
			});
		}
		find($(target));
		tmp.remove();
		return result;
	}
	
	function setDisabled(target, itemEl, disabled){
		var t = $(itemEl);
		if (t.hasClass('menu-item')){
			var opts = t.data('menuitem').options;
			opts.disabled = disabled;
			if (disabled){
				t.addClass('menu-item-disabled');
				t[0].onclick = null;
			} else {
				t.removeClass('menu-item-disabled');
				t[0].onclick = opts.onclick;
			}
		}
	}
	
	function appendItem(target, param){
		var opts = $.data(target, 'menu').options;
		var menu = $(target);
		if (param.parent){
			if (!param.parent.submenu){
				var submenu = $('<div></div>').appendTo('body');
				param.parent.submenu = submenu;
				$('<div class="menu-rightarrow"></div>').appendTo(param.parent);
				createMenu(target, submenu);
			}
			menu = param.parent.submenu;
		}
		var div = $('<div></div>').appendTo(menu);
		createItem(target, div, param);
	}
	
	function removeItem(target, itemEl){
		function removeit(el){
			if (el.submenu){
				el.submenu.children('div.menu-item').each(function(){
					removeit(this);
				});
				var shadow = el.submenu[0].shadow;
				if (shadow) shadow.remove();
				el.submenu.remove();
			}
			$(el).remove();
		}
		removeit(itemEl);
	}
	
	function setVisible(target, itemEl, visible){
		var menu = $(itemEl).parent();
		if (visible){
			$(itemEl).show();
		} else {
			$(itemEl).hide();
		}
		setMenuSize(target, menu);
	}
	
	function destroyMenu(target){
		$(target).children('div.menu-item').each(function(){
			removeItem(target, this);
		});
		if (target.shadow) target.shadow.remove();
		$(target).remove();
	}
	
	$.fn.menu = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menu.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menu');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'menu', {
					options: $.extend({}, $.fn.menu.defaults, $.fn.menu.parseOptions(this), options)
				});
				init(this);
			}
			$(this).css({
				left: state.options.left,
				top: state.options.top
			});
		});
	};
	
	$.fn.menu.methods = {
		options: function(jq){
			return $.data(jq[0], 'menu').options;
		},
		show: function(jq, pos){
			return jq.each(function(){
				showMenu(this, pos);
			});
		},
		hide: function(jq){
			return jq.each(function(){
				hideAll(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyMenu(this);
			});
		},
		/**
		 * set the menu item text
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	text: string, the new text
		 * }
		 */
		setText: function(jq, param){
			return jq.each(function(){
				var item = $(param.target).data('menuitem').options;
				item.text = param.text;
				$(param.target).children('div.menu-text').html(param.text);
			});
		},
		/**
		 * set the menu icon class
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	iconCls: the menu item icon class
		 * }
		 */
		setIcon: function(jq, param){
			return jq.each(function(){
				var item = $(param.target).data('menuitem').options;
				item.iconCls = param.iconCls;
				$(param.target).children('div.menu-icon').remove();
				if (param.iconCls){
					$('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
				}
			});
		},
		/**
		 * get the menu item data that contains the following property:
		 * {
		 * 	target: DOM object, the menu item
		 *  id: the menu id
		 * 	text: the menu item text
		 * 	iconCls: the icon class
		 *  href: a remote address to redirect to
		 *  onclick: a function to be called when the item is clicked
		 * }
		 */
		getItem: function(jq, itemEl){
			var item = $(itemEl).data('menuitem').options;
			return $.extend({}, item, {
				target: $(itemEl)[0]
			});
		},
		findItem: function(jq, text){
			return findItem(jq[0], text);
		},
		/**
		 * append menu item, the param contains following properties:
		 * parent,id,text,iconCls,href,onclick
		 * when parent property is assigned, append menu item to it
		 */
		appendItem: function(jq, param){
			return jq.each(function(){
				appendItem(this, param);
			});
		},
		removeItem: function(jq, itemEl){
			return jq.each(function(){
				removeItem(this, itemEl);
			});
		},
		enableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, false);
			});
		},
		disableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, true);
			});
		},
		showItem: function(jq, itemEl){
			return jq.each(function(){
				setVisible(this, itemEl, true);
			});
		},
		hideItem: function(jq, itemEl){
			return jq.each(function(){
				setVisible(this, itemEl, false);
			});
		},
		resize: function(jq, menuEl){
			return jq.each(function(){
				setMenuSize(this, menuEl ? $(menuEl) : $(this));
			});
		}
	};
	
	$.fn.menu.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [
		     {minWidth:'number',itemHeight:'number',duration:'number',hideOnUnhover:'boolean'},
		     {fit:'boolean',inline:'boolean',noline:'boolean'}
		]));
	};
	
	$.fn.menu.defaults = {
		zIndex:110000,
		left: 0,
		top: 0,
		alignTo: null,
		align: 'left',
		minWidth: 120,
		itemHeight: 22,
		duration: 100,	// Defines duration time in milliseconds to hide when the mouse leaves the menu.
		hideOnUnhover: true,	// Automatically hides the menu when mouse exits it
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		fit: false,
		noline: false,
		events: {
			mouseenter: mouseenterHandler,
			mouseleave: mouseleaveHandler,
			mouseover: mouseoverHandler,
			mouseout: mouseoutHandler,
			click: clickHandler
		},
		position: function(target, left, top){
			return {left:left,top:top}
		},
		onShow: function(){},
		onHide: function(){},
		onClick: function(item){}
	};
})(jQuery);
﻿/**
 * menubutton
 * 
 */
(function($){
function _1(_2){
var _3=$.data(_2,"menubutton").options;
var _4=$(_2);
_4.linkbutton(_3);
if(_3.hasDownArrow){
_4.removeClass(_3.cls.btn1+" "+_3.cls.btn2).addClass("m-btn");
_4.removeClass("m-btn-small m-btn-medium m-btn-large").addClass("m-btn-"+_3.size);
var _5=_4.find(".l-btn-left");
$("<span></span>").addClass(_3.cls.arrow).appendTo(_5);
$("<span></span>").addClass("m-btn-line").appendTo(_5);
}
$(_2).menubutton("resize");
if(_3.menu){
$(_3.menu).menu({duration:_3.duration});
var _6=$(_3.menu).menu("options");
var _7=_6.onShow;
var _8=_6.onHide;
$.extend(_6,{onShow:function(){
var _9=$(this).menu("options");
var _a=$(_9.alignTo);
var _b=_a.menubutton("options");
_a.addClass((_b.plain==true)?_b.cls.btn2:_b.cls.btn1);
_7.call(this);
},onHide:function(){
var _c=$(this).menu("options");
var _d=$(_c.alignTo);
var _e=_d.menubutton("options");
_d.removeClass((_e.plain==true)?_e.cls.btn2:_e.cls.btn1);
_8.call(this);
}});
}
};
function _f(_10){
var _11=$.data(_10,"menubutton").options;
var btn=$(_10);
var t=btn.find("."+_11.cls.trigger);
if(!t.length){
t=btn;
}
t.unbind(".menubutton");
var _12=null;
t.bind("click.menubutton",function(){
if(!_13()){
_14(_10);
return false;
}
}).bind("mouseenter.menubutton",function(){
if(!_13()){
_12=setTimeout(function(){
_14(_10);
},_11.duration);
return false;
}
}).bind("mouseleave.menubutton",function(){
if(_12){
clearTimeout(_12);
}
$(_11.menu).triggerHandler("mouseleave");
});
function _13(){
return $(_10).linkbutton("options").disabled;
};
};
function _14(_15){
var _16=$(_15).menubutton("options");
if(_16.disabled||!_16.menu){
return;
}
$("body>div.menu-top").menu("hide");
var btn=$(_15);
var mm=$(_16.menu);
if(mm.length){
mm.menu("options").alignTo=btn;
mm.menu("show",{alignTo:btn,align:_16.menuAlign});
}
btn.blur();
};
$.fn.menubutton=function(_17,_18){
if(typeof _17=="string"){
var _19=$.fn.menubutton.methods[_17];
if(_19){
return _19(this,_18);
}else{
return this.linkbutton(_17,_18);
}
}
_17=_17||{};
return this.each(function(){
var _1a=$.data(this,"menubutton");
if(_1a){
$.extend(_1a.options,_17);
}else{
$.data(this,"menubutton",{options:$.extend({},$.fn.menubutton.defaults,$.fn.menubutton.parseOptions(this),_17)});
$(this).removeAttr("disabled");
}
_1(this);
_f(this);
});
};
$.fn.menubutton.methods={options:function(jq){
var _1b=jq.linkbutton("options");
return $.extend($.data(jq[0],"menubutton").options,{toggle:_1b.toggle,selected:_1b.selected,disabled:_1b.disabled});
},destroy:function(jq){
return jq.each(function(){
var _1c=$(this).menubutton("options");
if(_1c.menu){
$(_1c.menu).menu("destroy");
}
$(this).remove();
});
}};
$.fn.menubutton.parseOptions=function(_1d){
var t=$(_1d);
return $.extend({},$.fn.linkbutton.parseOptions(_1d),$.parser.parseOptions(_1d,["menu",{plain:"boolean",hasDownArrow:"boolean",duration:"number"}]));
};
$.fn.menubutton.defaults=$.extend({},$.fn.linkbutton.defaults,{plain:true,hasDownArrow:true,menu:null,menuAlign:"left",duration:100,cls:{btn1:"m-btn-active",btn2:"m-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn"}});
})(jQuery);

﻿/**
 * splitbutton
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "splitbutton").options;
		$(_2).menubutton(_3);
		$(_2).addClass("s-btn");
	}
	;
	$.fn.splitbutton = function(_4, _5) {
		if (typeof _4 == "string") {
			var _6 = $.fn.splitbutton.methods[_4];
			if (_6) {
				return _6(this, _5);
			} else {
				return this.menubutton(_4, _5);
			}
		}
		_4 = _4 || {};
		return this.each(function() {
			var _7 = $.data(this, "splitbutton");
			if (_7) {
				$.extend(_7.options, _4);
			} else {
				$.data(this, "splitbutton", {
					options : $.extend({}, $.fn.splitbutton.defaults,
							$.fn.splitbutton.parseOptions(this), _4)
				});
				$(this).removeAttr("disabled");
			}
			_1(this);
		});
	};
	$.fn.splitbutton.methods = {
		options : function(jq) {
			var _8 = jq.menubutton("options");
			var _9 = $.data(jq[0], "splitbutton").options;
			$.extend(_9, {
				disabled : _8.disabled,
				toggle : _8.toggle,
				selected : _8.selected
			});
			return _9;
		}
	};
	$.fn.splitbutton.parseOptions = function(_a) {
		var t = $(_a);
		return $.extend({}, $.fn.linkbutton.parseOptions(_a), $.parser
				.parseOptions(_a, [ "menu", {
					plain : "boolean",
					duration : "number"
				} ]));
	};
	$.fn.splitbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain : true,
		menu : null,
		duration : 100,
		cls : {
			btn1 : "m-btn-active s-btn-active",
			btn2 : "m-btn-plain-active s-btn-plain-active",
			arrow : "m-btn-downarrow",
			trigger : "m-btn-line"
		}
	});
})(jQuery);
﻿/**
 * switchbutton
 * 
 */
(function($){
function _1(_2){
var _3=$("<span class=\"switchbutton\">"+"<span class=\"switchbutton-inner\">"+"<span class=\"switchbutton-on\"></span>"+"<span class=\"switchbutton-handle\"></span>"+"<span class=\"switchbutton-off\"></span>"+"<input class=\"switchbutton-value\" type=\"checkbox\">"+"</span>"+"</span>").insertAfter(_2);
var t=$(_2);
t.addClass("switchbutton-f").hide();
var _4=t.attr("name");
if(_4){
t.removeAttr("name").attr("switchbuttonName",_4);
_3.find(".switchbutton-value").attr("name",_4);
}
_3.bind("_resize",function(e,_5){
if($(this).hasClass("nestui-fluid")||_5){
_6(_2);
}
return false;
});
return _3;
};
function _6(_7,_8){
var _9=$.data(_7,"switchbutton");
var _a=_9.options;
var _b=_9.switchbutton;
if(_8){
$.extend(_a,_8);
}
var _c=_b.is(":visible");
if(!_c){
_b.appendTo("body");
}
_b._size(_a);
var w=_b.width();
var h=_b.height();
var w=_b.outerWidth();
var h=_b.outerHeight();
var _d=parseInt(_a.handleWidth)||_b.height();
var _e=w*2-_d;
_b.find(".switchbutton-inner").css({width:_e+"px",height:h+"px",lineHeight:h+"px"});
_b.find(".switchbutton-handle")._outerWidth(_d)._outerHeight(h).css({marginLeft:-_d/2+"px"});
_b.find(".switchbutton-on").css({width:(w-_d/2)+"px",textIndent:(_a.reversed?"":"-")+_d/2+"px"});
_b.find(".switchbutton-off").css({width:(w-_d/2)+"px",textIndent:(_a.reversed?"-":"")+_d/2+"px"});
_a.marginWidth=w-_d;
_f(_7,_a.checked,false);
if(!_c){
_b.insertAfter(_7);
}
};
function _10(_11){
var _12=$.data(_11,"switchbutton");
var _13=_12.options;
var _14=_12.switchbutton;
var _15=_14.find(".switchbutton-inner");
var on=_15.find(".switchbutton-on").html(_13.onText);
var off=_15.find(".switchbutton-off").html(_13.offText);
var _16=_15.find(".switchbutton-handle").html(_13.handleText);
if(_13.reversed){
off.prependTo(_15);
on.insertAfter(_16);
}else{
on.prependTo(_15);
off.insertAfter(_16);
}
_14.find(".switchbutton-value")._propAttr("checked",_13.checked);
_14.removeClass("switchbutton-disabled").addClass(_13.disabled?"switchbutton-disabled":"");
_14.removeClass("switchbutton-reversed").addClass(_13.reversed?"switchbutton-reversed":"");
_f(_11,_13.checked);
_17(_11,_13.readonly);
$(_11).switchbutton("setValue",_13.value);
};
function _f(_18,_19,_1a){
var _1b=$.data(_18,"switchbutton");
var _1c=_1b.options;
_1c.checked=_19;
var _1d=_1b.switchbutton.find(".switchbutton-inner");
var _1e=_1d.find(".switchbutton-on");
var _1f=_1c.reversed?(_1c.checked?_1c.marginWidth:0):(_1c.checked?0:_1c.marginWidth);
var dir=_1e.css("float").toLowerCase();
var css={};
css["margin-"+dir]=-_1f+"px";
_1a?_1d.animate(css,200):_1d.css(css);
var _20=_1d.find(".switchbutton-value");
var ck=_20.is(":checked");
$(_18).add(_20)._propAttr("checked",_1c.checked);
if(ck!=_1c.checked){
_1c.onChange.call(_18,_1c.checked);
}
};
function _21(_22,_23){
var _24=$.data(_22,"switchbutton");
var _25=_24.options;
var _26=_24.switchbutton;
var _27=_26.find(".switchbutton-value");
if(_23){
_25.disabled=true;
$(_22).add(_27).attr("disabled","disabled");
_26.addClass("switchbutton-disabled");
}else{
_25.disabled=false;
$(_22).add(_27).removeAttr("disabled");
_26.removeClass("switchbutton-disabled");
}
};
function _17(_28,_29){
var _2a=$.data(_28,"switchbutton");
var _2b=_2a.options;
_2b.readonly=_29==undefined?true:_29;
_2a.switchbutton.removeClass("switchbutton-readonly").addClass(_2b.readonly?"switchbutton-readonly":"");
};
function _2c(_2d){
var _2e=$.data(_2d,"switchbutton");
var _2f=_2e.options;
_2e.switchbutton.unbind(".switchbutton").bind("click.switchbutton",function(){
if(!_2f.disabled&&!_2f.readonly){
_f(_2d,_2f.checked?false:true,true);
}
});
};
$.fn.switchbutton=function(_30,_31){
if(typeof _30=="string"){
return $.fn.switchbutton.methods[_30](this,_31);
}
_30=_30||{};
return this.each(function(){
var _32=$.data(this,"switchbutton");
if(_32){
$.extend(_32.options,_30);
}else{
_32=$.data(this,"switchbutton",{options:$.extend({},$.fn.switchbutton.defaults,$.fn.switchbutton.parseOptions(this),_30),switchbutton:_1(this)});
}
_32.options.originalChecked=_32.options.checked;
_10(this);
_6(this);
_2c(this);
});
};
$.fn.switchbutton.methods={options:function(jq){
var _33=jq.data("switchbutton");
return $.extend(_33.options,{value:_33.switchbutton.find(".switchbutton-value").val()});
},resize:function(jq,_34){
return jq.each(function(){
_6(this,_34);
});
},enable:function(jq){
return jq.each(function(){
_21(this,false);
});
},disable:function(jq){
return jq.each(function(){
_21(this,true);
});
},readonly:function(jq,_35){
return jq.each(function(){
_17(this,_35);
});
},check:function(jq){
return jq.each(function(){
_f(this,true);
});
},uncheck:function(jq){
return jq.each(function(){
_f(this,false);
});
},clear:function(jq){
return jq.each(function(){
_f(this,false);
});
},reset:function(jq){
return jq.each(function(){
var _36=$(this).switchbutton("options");
_f(this,_36.originalChecked);
});
},setValue:function(jq,_37){
return jq.each(function(){
$(this).val(_37);
$.data(this,"switchbutton").switchbutton.find(".switchbutton-value").val(_37);
});
}};
$.fn.switchbutton.parseOptions=function(_38){
var t=$(_38);
return $.extend({},$.parser.parseOptions(_38,["onText","offText","handleText",{handleWidth:"number",reversed:"boolean"}]),{value:(t.val()||undefined),checked:(t.attr("checked")?true:undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined)});
};
$.fn.switchbutton.defaults={handleWidth:"auto",width:60,height:26,checked:false,disabled:false,readonly:false,reversed:false,onText:"ON",offText:"OFF",handleText:"",value:"on",onChange:function(_39){
}};
})(jQuery);﻿/**
 * validatebox
 * 
 */
(function($) {
	function _1(_2) {
		$(_2).addClass("validatebox-text");
	}
	;
	function _3(_4) {
		var _5 = $.data(_4, "validatebox");
		_5.validating = false;
		if (_5.timer) {
			clearTimeout(_5.timer);
		}
		$(_4).tooltip("destroy");
		$(_4).unbind();
		$(_4).remove();
	}
	;
	function _6(_7) {
		var _8 = $.data(_7, "validatebox").options;
		$(_7).unbind(".validatebox");
		if (_8.novalidate || _8.disabled) {
			return;
		}
		for ( var _9 in _8.events) {
			$(_7).bind(_9 + ".validatebox", {
				target : _7
			}, _8.events[_9]);
		}
	}
	;
	function _a(e) {
		var _b = e.data.target;
		var _c = $.data(_b, "validatebox");
		var _d = _c.options;
		if ($(_b).attr("readonly")) {
			return;
		}
		_c.validating = true;
		_c.value = _d.val(_b);
		(function() {
			if (!$(_b).is(":visible")) {
				_c.validating = false;
			}
			if (_c.validating) {
				var _e = _d.val(_b);
				if (_c.value != _e) {
					_c.value = _e;
					if (_c.timer) {
						clearTimeout(_c.timer);
					}
					_c.timer = setTimeout(function() {
						$(_b).validatebox("validate");
					}, _d.delay);
				} else {
					if (_c.message) {
						_d.err(_b, _c.message);
					}
				}
				setTimeout(arguments.callee, _d.interval);
			}
		})();
	}
	;
	function _f(e) {
		var _10 = e.data.target;
		var _11 = $.data(_10, "validatebox");
		var _12 = _11.options;
		_11.validating = false;
		if (_11.timer) {
			clearTimeout(_11.timer);
			_11.timer = undefined;
		}
		if (_12.validateOnBlur) {
			$(_10).validatebox("validate");
		}
		_12.err(_10, _11.message, "hide");
	}
	;
	function _13(e) {
		var _14 = e.data.target;
		var _15 = $.data(_14, "validatebox");
		_15.options.err(_14, _15.message, "show");
	}
	;
	function _16(e) {
		var _17 = e.data.target;
		var _18 = $.data(_17, "validatebox");
		if (!_18.validating) {
			_18.options.err(_17, _18.message, "hide");
		}
	}
	;
	function _19(_1a, _1b, _1c) {
		var _1d = $.data(_1a, "validatebox");
		var _1e = _1d.options;
		var t = $(_1a);
		if (_1c == "hide" || !_1b) {
			t.tooltip("hide");
		} else {
			if ((t.is(":focus") && _1d.validating) || _1c == "show") {
				t.tooltip($.extend({}, _1e.tipOptions, {
					content : _1b,
					position : _1e.tipPosition,
					deltaX : _1e.deltaX
				})).tooltip("show");
			}
		}
	}
	;
	function _1f(_20) {
		var _21 = $.data(_20, "validatebox");
		var _22 = _21.options;
		var box = $(_20);
		_22.onBeforeValidate.call(_20);
		var _23 = _24();
		_23 ? box.removeClass("validatebox-invalid") : box
				.addClass("validatebox-invalid");
		_22.err(_20, _21.message);
		_22.onValidate.call(_20, _23);
		return _23;
		function _25(msg) {
			_21.message = msg;
		}
		;
		function _26(_27, _28) {
			var _29 = _22.val(_20);
			var _2a = /([a-zA-Z_]+)(.*)/.exec(_27);
			var _2b = _22.rules[_2a[1]];
			if (_2b && _29) {
				var _2c = _28 || _22.validParams || eval(_2a[2]);
				if (!_2b["validator"].call(_20, _29, _2c)) {
					var _2d = _2b["message"];
					if (_2c) {
						for (var i = 0; i < _2c.length; i++) {
							_2d = _2d.replace(
									new RegExp("\\{" + i + "\\}", "g"), _2c[i]);
						}
					}
					_25(_22.invalidMessage || _2d);
					return false;
				}
			}
			return true;
		}
		;
		function _24() {
			_25("");
			if (!_22._validateOnCreate) {
				setTimeout(function() {
					_22._validateOnCreate = true;
				}, 0);
				return true;
			}
			if (_22.novalidate || _22.disabled) {
				return true;
			}
			if (_22.required) {
				if (_22.val(_20) == "") {
					_25(_22.missingMessage);
					return false;
				}
			}
			if (_22.validType) {
				if ($.isArray(_22.validType)) {
					for (var i = 0; i < _22.validType.length; i++) {
						if (!_26(_22.validType[i])) {
							return false;
						}
					}
				} else {
					if (typeof _22.validType == "string") {
						if (!_26(_22.validType)) {
							return false;
						}
					} else {
						for ( var _2e in _22.validType) {
							var _2f = _22.validType[_2e];
							if (!_26(_2e, _2f)) {
								return false;
							}
						}
					}
				}
			}
			return true;
		}
		;
	}
	;
	function _30(_31, _32) {
		var _33 = $.data(_31, "validatebox").options;
		if (_32 != undefined) {
			_33.disabled = _32;
		}
		if (_33.disabled) {
			$(_31).addClass("validatebox-disabled")
					.attr("disabled", "disabled");
		} else {
			$(_31).removeClass("validatebox-disabled").removeAttr("disabled");
		}
	}
	;
	function _34(_35, _36) {
		var _37 = $.data(_35, "validatebox").options;
		_37.readonly = _36 == undefined ? true : _36;
		if (_37.readonly || !_37.editable) {
			$(_35).triggerHandler("blur.validatebox");
			$(_35).addClass("validatebox-readonly")
					.attr("readonly", "readonly");
		} else {
			$(_35).removeClass("validatebox-readonly").removeAttr("readonly");
		}
	}
	;
	$.fn.validatebox = function(_38, _39) {
		if (typeof _38 == "string") {
			return $.fn.validatebox.methods[_38](this, _39);
		}
		_38 = _38 || {};
		return this.each(function() {
			var _3a = $.data(this, "validatebox");
			if (_3a) {
				$.extend(_3a.options, _38);
			} else {
				_1(this);
				_3a = $.data(this, "validatebox", {
					options : $.extend({}, $.fn.validatebox.defaults,
							$.fn.validatebox.parseOptions(this), _38)
				});
			}
			_3a.options._validateOnCreate = _3a.options.validateOnCreate;
			_30(this, _3a.options.disabled);
			_34(this, _3a.options.readonly);
			_6(this);
			_1f(this);
		});
	};
	$.fn.validatebox.methods = {
		options : function(jq) {
			return $.data(jq[0], "validatebox").options;
		},
		destroy : function(jq) {
			return jq.each(function() {
				_3(this);
			});
		},
		validate : function(jq) {
			return jq.each(function() {
				_1f(this);
			});
		},
		isValid : function(jq) {
			return _1f(jq[0]);
		},
		enableValidation : function(jq) {
			return jq.each(function() {
				$(this).validatebox("options").novalidate = false;
				_6(this);
				_1f(this);
			});
		},
		disableValidation : function(jq) {
			return jq.each(function() {
				$(this).validatebox("options").novalidate = true;
				_6(this);
				_1f(this);
			});
		},
		resetValidation : function(jq) {
			return jq.each(function() {
				var _3b = $(this).validatebox("options");
				_3b._validateOnCreate = _3b.validateOnCreate;
				_1f(this);
			});
		},
		enable : function(jq) {
			return jq.each(function() {
				_30(this, false);
				_6(this);
				_1f(this);
			});
		},
		disable : function(jq) {
			return jq.each(function() {
				_30(this, true);
				_6(this);
				_1f(this);
			});
		},
		readonly : function(jq, _3c) {
			return jq.each(function() {
				_34(this, _3c);
				_6(this);
				_1f(this);
			});
		}
	};
	$.fn.validatebox.parseOptions = function(_3d) {
		var t = $(_3d);
		return $.extend({}, $.parser.parseOptions(_3d, [ "validType",
				"missingMessage", "invalidMessage", "tipPosition", {
					delay : "number",
					interval : "number",
					deltaX : "number"
				}, {
					editable : "boolean",
					validateOnCreate : "boolean",
					validateOnBlur : "boolean"
				} ]), {
			required : (t.attr("required") ? true : undefined),
			disabled : (t.attr("disabled") ? true : undefined),
			readonly : (t.attr("readonly") ? true : undefined),
			novalidate : (t.attr("novalidate") != undefined ? true : undefined)
		});
	};
	$.fn.validatebox.defaults = {
		required : false,
		validType : null,
		validParams : null,
		delay : 200,
		interval : 200,
		missingMessage : "This field is required.",
		invalidMessage : null,
		tipPosition : "right",
		deltaX : 0,
		novalidate : false,
		editable : true,
		disabled : false,
		readonly : false,
		validateOnCreate : true,
		validateOnBlur : false,
		events : {
			focus : _a,
			blur : _f,
			mouseenter : _13,
			mouseleave : _16,
			click : function(e) {
				var t = $(e.data.target);
				if (t.attr("type") == "checkbox" || t.attr("type") == "radio") {
					t.focus().validatebox("validate");
				}
			}
		},
		val : function(_3e) {
			return $(_3e).val();
		},
		err : function(_3f, _40, _41) {
			_19(_3f, _40, _41);
		},
		tipOptions : {
			showEvent : "none",
			hideEvent : "none",
			showDelay : 0,
			hideDelay : 0,
			zIndex : "",
			onShow : function() {
				$(this).tooltip("tip").css({
					color : "#000",
					borderColor : "#CC9933",
					backgroundColor : "#FFFFCC"
				});
			},
			onHide : function() {
				$(this).tooltip("destroy");
			}
		},
		rules : {
			email : {
				validator : function(_42) {
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
							.test(_42);
				},
				message : "Please enter a valid email address."
			},
			url : {
				validator : function(_43) {
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
							.test(_43);
				},
				message : "Please enter a valid URL."
			},
			length : {
				validator : function(_44, _45) {
					var len = $.trim(_44).length;
					return len >= _45[0] && len <= _45[1];
				},
				message : "Please enter a value between {0} and {1}."
			},
			remote : {
				validator : function(_46, _47) {
					var _48 = {};
					_48[_47[1]] = _46;
					var _49 = $.ajax({
						url : _47[0],
						dataType : "json",
						data : _48,
						async : false,
						cache : false,
						type : "post"
					}).responseText;
					return _49 == "true";
				},
				message : "Please fix this field."
			}
		},
		onBeforeValidate : function() {
		},
		onValidate : function(_4a) {
		}
	};
})(jQuery);
﻿/**
 * textbox
 * 
 */
(function($){
var _1=0;
function _2(_3){
$(_3).addClass("textbox-f").hide();
var _4=$("<span class=\"textbox\">"+"<input class=\"textbox-text\" autocomplete=\"off\">"+"<input type=\"hidden\" class=\"textbox-value\">"+"</span>").insertAfter(_3);
var _5=$(_3).attr("name");
if(_5){
_4.find("input.textbox-value").attr("name",_5);
$(_3).removeAttr("name").attr("textboxName",_5);
}
return _4;
};
function _6(_7){
var _8=$.data(_7,"textbox");
var _9=_8.options;
var tb=_8.textbox;
var _a="_nestui_textbox_input"+(++_1);
tb.find(".textbox-text").remove();
if(_9.multiline){
$("<textarea id=\""+_a+"\" class=\"textbox-text\" autocomplete=\"off\"></textarea>").prependTo(tb);
}else{
$("<input id=\""+_a+"\" type=\""+_9.type+"\" class=\"textbox-text\" autocomplete=\"off\">").prependTo(tb);
}
$("#"+_a).attr("tabindex",$(_7).attr("tabindex")||"").css("text-align",$(_7).css("text-align"));
tb.find(".textbox-addon").remove();
var bb=_9.icons?$.extend(true,[],_9.icons):[];
if(_9.iconCls){
bb.push({iconCls:_9.iconCls,disabled:true});
}
if(bb.length){
var bc=$("<span class=\"textbox-addon\"></span>").prependTo(tb);
bc.addClass("textbox-addon-"+_9.iconAlign);
for(var i=0;i<bb.length;i++){
bc.append("<a href=\"javascript:void(0)\" class=\"textbox-icon "+bb[i].iconCls+"\" icon-index=\""+i+"\" tabindex=\"-1\"></a>");
}
}
tb.find(".textbox-button").remove();
if(_9.buttonText||_9.buttonIcon){
var _b=$("<a href=\"javascript:void(0)\" class=\"textbox-button\"></a>").prependTo(tb);
_b.addClass("textbox-button-"+_9.buttonAlign).linkbutton({text:_9.buttonText,iconCls:_9.buttonIcon,onClick:function(){
var t=$(this).parent().prev();
t.textbox("options").onClickButton.call(t[0]);
}});
}
if(_9.label){
if(typeof _9.label=="object"){
_8.label=$(_9.label);
_8.label.attr("for",_a);
}else{
$(_8.label).remove();
_8.label=$("<label class=\"textbox-label\"></label>").html(_9.label);
_8.label.css("textAlign",_9.labelAlign).attr("for",_a);
if(_9.labelPosition=="after"){
_8.label.insertAfter(tb);
}else{
_8.label.insertBefore(_7);
}
_8.label.removeClass("textbox-label-left textbox-label-right textbox-label-top");
_8.label.addClass("textbox-label-"+_9.labelPosition);
}
}else{
$(_8.label).remove();
}
_c(_7);
_d(_7,_9.disabled);
_e(_7,_9.readonly);
};
function _f(_10){
var tb=$.data(_10,"textbox").textbox;
tb.find(".textbox-text").validatebox("destroy");
tb.remove();
$(_10).remove();
};
function _11(_12,_13){
var _14=$.data(_12,"textbox");
var _15=_14.options;
var tb=_14.textbox;
var _16=tb.parent();
if(_13){
if(typeof _13=="object"){
$.extend(_15,_13);
}else{
_15.width=_13;
}
}
if(isNaN(parseInt(_15.width))){
var c=$(_12).clone();
c.css("visibility","hidden");
c.insertAfter(_12);
_15.width=c.outerWidth();
c.remove();
}
var _17=tb.is(":visible");
if(!_17){
tb.appendTo("body");
}
var _18=tb.find(".textbox-text");
var btn=tb.find(".textbox-button");
var _19=tb.find(".textbox-addon");
var _1a=_19.find(".textbox-icon");
if(_15.height=="auto"){
_18.css({margin:"",paddingTop:"",paddingBottom:"",height:"",lineHeight:""});
}
tb._size(_15,_16);
if(_15.label&&_15.labelPosition){
if(_15.labelPosition=="top"){
_14.label._size({width:_15.labelWidth=="auto"?tb.outerWidth():_15.labelWidth},tb);
if(_15.height!="auto"){
tb._size("height",tb.outerHeight()-_14.label.outerHeight());
}
}else{
_14.label._size({width:_15.labelWidth,height:tb.outerHeight()},tb);
if(!_15.multiline){
_14.label.css("lineHeight",_14.label.height()+"px");
}
tb._size("width",tb.outerWidth()-_14.label.outerWidth());
}
}
if(_15.buttonAlign=="left"||_15.buttonAlign=="right"){
btn.linkbutton("resize",{height:tb.height()});
}else{
btn.linkbutton("resize",{width:"100%"});
}
var _1b=tb.width()-_1a.length*_15.iconWidth-_1c("left")-_1c("right");
var _1d=_15.height=="auto"?_18.outerHeight():(tb.height()-_1c("top")-_1c("bottom"));
_19.css(_15.iconAlign,_1c(_15.iconAlign)+"px");
_19.css("top",_1c("top")+"px");
_1a.css({width:_15.iconWidth+"px",height:_1d+"px"});
_18.css({paddingLeft:(_12.style.paddingLeft||""),paddingRight:(_12.style.paddingRight||""),marginLeft:_1e("left"),marginRight:_1e("right"),marginTop:_1c("top"),marginBottom:_1c("bottom")});
if(_15.multiline){
_18.css({paddingTop:(_12.style.paddingTop||""),paddingBottom:(_12.style.paddingBottom||"")});
_18._outerHeight(_1d);
}else{
_18.css({paddingTop:0,paddingBottom:0,height:_1d+"px",lineHeight:_1d+"px"});
}
_18._outerWidth(_1b);
if(!_17){
tb.insertAfter(_12);
}
_15.onResize.call(_12,_15.width,_15.height);
function _1e(_1f){
return (_15.iconAlign==_1f?_19._outerWidth():0)+_1c(_1f);
};
function _1c(_20){
var w=0;
btn.filter(".textbox-button-"+_20).each(function(){
if(_20=="left"||_20=="right"){
w+=$(this).outerWidth();
}else{
w+=$(this).outerHeight();
}
});
return w;
};
};
function _c(_21){
var _22=$(_21).textbox("options");
var _23=$(_21).textbox("textbox");
_23.validatebox($.extend({},_22,{deltaX:function(_24){
return $(_21).textbox("getTipX",_24);
},onBeforeValidate:function(){
_22.onBeforeValidate.call(_21);
var box=$(this);
if(!box.is(":focus")){
if(box.val()!==_22.value){
_22.oldInputValue=box.val();
box.val(_22.value);
}
}
},onValidate:function(_25){
var box=$(this);
if(_22.oldInputValue!=undefined){
box.val(_22.oldInputValue);
_22.oldInputValue=undefined;
}
var tb=box.parent();
if(_25){
tb.removeClass("textbox-invalid");
}else{
tb.addClass("textbox-invalid");
}
_22.onValidate.call(_21,_25);
}}));
};
function _26(_27){
var _28=$.data(_27,"textbox");
var _29=_28.options;
var tb=_28.textbox;
var _2a=tb.find(".textbox-text");
_2a.attr("placeholder",_29.prompt);
_2a.unbind(".textbox");
$(_28.label).unbind(".textbox");
if(!_29.disabled&&!_29.readonly){
if(_28.label){
$(_28.label).bind("click.textbox",function(e){
if(!_29.hasFocusMe){
_2a.focus();
$(_27).textbox("setSelectionRange",{start:0,end:_2a.val().length});
}
});
}
_2a.bind("blur.textbox",function(e){
if(!tb.hasClass("textbox-focused")){
return;
}
_29.value=$(this).val();
if(_29.value==""){
$(this).val(_29.prompt).addClass("textbox-prompt");
}else{
$(this).removeClass("textbox-prompt");
}
tb.removeClass("textbox-focused");
}).bind("focus.textbox",function(e){
_29.hasFocusMe=true;
if(tb.hasClass("textbox-focused")){
return;
}
if($(this).val()!=_29.value){
$(this).val(_29.value);
}
$(this).removeClass("textbox-prompt");
tb.addClass("textbox-focused");
});
for(var _2b in _29.inputEvents){
_2a.bind(_2b+".textbox",{target:_27},_29.inputEvents[_2b]);
}
}
var _2c=tb.find(".textbox-addon");
_2c.unbind().bind("click",{target:_27},function(e){
var _2d=$(e.target).closest("a.textbox-icon:not(.textbox-icon-disabled)");
if(_2d.length){
var _2e=parseInt(_2d.attr("icon-index"));
var _2f=_29.icons[_2e];
if(_2f&&_2f.handler){
_2f.handler.call(_2d[0],e);
}
_29.onClickIcon.call(_27,_2e);
}
});
_2c.find(".textbox-icon").each(function(_30){
var _31=_29.icons[_30];
var _32=$(this);
if(!_31||_31.disabled||_29.disabled||_29.readonly){
_32.addClass("textbox-icon-disabled");
}else{
_32.removeClass("textbox-icon-disabled");
}
});
var btn=tb.find(".textbox-button");
btn.linkbutton((_29.disabled||_29.readonly)?"disable":"enable");
tb.unbind(".textbox").bind("_resize.textbox",function(e,_33){
if($(this).hasClass("nestui-fluid")||_33){
_11(_27);
}
return false;
});
};
function _d(_34,_35){
var _36=$.data(_34,"textbox");
var _37=_36.options;
var tb=_36.textbox;
var _38=tb.find(".textbox-text");
var ss=$(_34).add(tb.find(".textbox-value"));
_37.disabled=_35;
if(_37.disabled){
_38.blur();
_38.validatebox("disable");
tb.addClass("textbox-disabled");
ss.attr("disabled","disabled");
$(_36.label).addClass("textbox-label-disabled");
}else{
_38.validatebox("enable");
tb.removeClass("textbox-disabled");
ss.removeAttr("disabled");
$(_36.label).removeClass("textbox-label-disabled");
}
};
function _e(_39,_3a){
var _3b=$.data(_39,"textbox");
var _3c=_3b.options;
var tb=_3b.textbox;
var _3d=tb.find(".textbox-text");
_3c.readonly=_3a==undefined?true:_3a;
if(_3c.readonly){
_3d.triggerHandler("blur.textbox");
}
_3d.validatebox("readonly",_3c.readonly);
tb.removeClass("textbox-readonly").addClass(_3c.readonly?"textbox-readonly":"");
};
$.fn.textbox=function(_3e,_3f){
if(typeof _3e=="string"){
var _40=$.fn.textbox.methods[_3e];
if(_40){
return _40(this,_3f);
}else{
return this.each(function(){
var _41=$(this).textbox("textbox");
_41.validatebox(_3e,_3f);
});
}
}
_3e=_3e||{};
return this.each(function(){
var _42=$.data(this,"textbox");
if(_42){
$.extend(_42.options,_3e);
if(_3e.value!=undefined){
_42.options.originalValue=_3e.value;
}
}else{
_42=$.data(this,"textbox",{options:$.extend({},$.fn.textbox.defaults,$.fn.textbox.parseOptions(this),_3e),textbox:_2(this)});
_42.options.originalValue=_42.options.value;
}
_6(this);
_26(this);
if(_42.options.doSize){
_11(this);
}
var _43=_42.options.value;
_42.options.value="";
$(this).textbox("initValue",_43);
});
};
$.fn.textbox.methods={options:function(jq){
return $.data(jq[0],"textbox").options;
},cloneFrom:function(jq,_44){
return jq.each(function(){
var t=$(this);
if(t.data("textbox")){
return;
}
if(!$(_44).data("textbox")){
$(_44).textbox();
}
var _45=$.extend(true,{},$(_44).textbox("options"));
var _46=t.attr("name")||"";
t.addClass("textbox-f").hide();
t.removeAttr("name").attr("textboxName",_46);
var _47=$(_44).next().clone().insertAfter(t);
var _48="_nestui_textbox_input"+(++_1);
_47.find(".textbox-value").attr("name",_46);
_47.find(".textbox-text").attr("id",_48);
var _49=$($(_44).textbox("label")).clone();
if(_49.length){
_49.attr("for",_48);
if(_45.labelPosition=="after"){
_49.insertAfter(t.next());
}else{
_49.insertBefore(t);
}
}
$.data(this,"textbox",{options:_45,textbox:_47,label:(_49.length?_49:undefined)});
var _4a=$(_44).textbox("button");
if(_4a.length){
t.textbox("button").linkbutton($.extend(true,{},_4a.linkbutton("options")));
}
_26(this);
_c(this);
});
},textbox:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-text");
},button:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-button");
},label:function(jq){
return $.data(jq[0],"textbox").label;
},destroy:function(jq){
return jq.each(function(){
_f(this);
});
},resize:function(jq,_4b){
return jq.each(function(){
_11(this,_4b);
});
},disable:function(jq){
return jq.each(function(){
_d(this,true);
_26(this);
});
},enable:function(jq){
return jq.each(function(){
_d(this,false);
_26(this);
});
},readonly:function(jq,_4c){
return jq.each(function(){
_e(this,_4c);
_26(this);
});
},isValid:function(jq){
return jq.textbox("textbox").validatebox("isValid");
},clear:function(jq){
return jq.each(function(){
$(this).textbox("setValue","");
});
},setText:function(jq,_4d){
return jq.each(function(){
var _4e=$(this).textbox("options");
var _4f=$(this).textbox("textbox");
_4d=_4d==undefined?"":String(_4d);
if($(this).textbox("getText")!=_4d){
_4f.val(_4d);
}
_4e.value=_4d;
if(!_4f.is(":focus")){
if(_4d){
_4f.removeClass("textbox-prompt");
}else{
_4f.val(_4e.prompt).addClass("textbox-prompt");
}
}
$(this).textbox("validate");
});
},initValue:function(jq,_50){
return jq.each(function(){
var _51=$.data(this,"textbox");
$(this).textbox("setText",_50);
_51.textbox.find(".textbox-value").val(_50);
$(this).val(_50);
});
},setValue:function(jq,_52){
return jq.each(function(){
var _53=$.data(this,"textbox").options;
var _54=$(this).textbox("getValue");
$(this).textbox("initValue",_52);
if(_54!=_52){
_53.onChange.call(this,_52,_54);
$(this).closest("form").trigger("_change",[this]);
}
});
},getText:function(jq){
var _55=jq.textbox("textbox");
if(_55.is(":focus")){
return _55.val();
}else{
return jq.textbox("options").value;
}
},getValue:function(jq){
return jq.data("textbox").textbox.find(".textbox-value").val();
},reset:function(jq){
return jq.each(function(){
var _56=$(this).textbox("options");
$(this).textbox("setValue",_56.originalValue);
});
},getIcon:function(jq,_57){
return jq.data("textbox").textbox.find(".textbox-icon:eq("+_57+")");
},getTipX:function(jq,_58){
var _59=jq.data("textbox");
var _5a=_59.options;
var tb=_59.textbox;
var _5b=tb.find(".textbox-text");
var _5c=tb.find(".textbox-addon")._outerWidth();
var _5d=tb.find(".textbox-button")._outerWidth();
var _58=_58||_5a.tipPosition;
if(_58=="right"){
return (_5a.iconAlign=="right"?_5c:0)+(_5a.buttonAlign=="right"?_5d:0)+1;
}else{
if(_58=="left"){
return (_5a.iconAlign=="left"?-_5c:0)+(_5a.buttonAlign=="left"?-_5d:0)-1;
}else{
return _5c/2*(_5a.iconAlign=="right"?1:-1)+_5d/2*(_5a.buttonAlign=="right"?1:-1);
}
}
},getSelectionStart:function(jq){
return jq.textbox("getSelectionRange").start;
},getSelectionRange:function(jq){
var _5e=jq.textbox("textbox")[0];
var _5f=0;
var end=0;
if(typeof _5e.selectionStart=="number"){
_5f=_5e.selectionStart;
end=_5e.selectionEnd;
}else{
if(_5e.createTextRange){
var s=document.selection.createRange();
var _60=_5e.createTextRange();
_60.setEndPoint("EndToStart",s);
_5f=_60.text.length;
end=_5f+s.text.length;
}
}
return {start:_5f,end:end};
},setSelectionRange:function(jq,_61){
return jq.each(function(){
var _62=$(this).textbox("textbox")[0];
var _63=_61.start;
var end=_61.end;
if(_62.setSelectionRange){
_62.setSelectionRange(_63,end);
}else{
if(_62.createTextRange){
var _64=_62.createTextRange();
_64.collapse();
_64.moveEnd("character",end);
_64.moveStart("character",_63);
_64.select();
}
}
});
}};
$.fn.textbox.parseOptions=function(_65){
var t=$(_65);
return $.extend({},$.fn.validatebox.parseOptions(_65),$.parser.parseOptions(_65,["prompt","iconCls","iconAlign","buttonText","buttonIcon","buttonAlign","label","labelPosition","labelAlign",{multiline:"boolean",iconWidth:"number",labelWidth:"number"}]),{value:(t.val()||undefined),type:(t.attr("type")?t.attr("type"):undefined)});
};
$.fn.textbox.defaults=$.extend({},$.fn.validatebox.defaults,{doSize:true,width:"auto",height:"auto",prompt:"",value:"",type:"text",multiline:false,icons:[],iconCls:null,iconAlign:"right",iconWidth:18,buttonText:"",buttonIcon:null,buttonAlign:"right",label:null,labelWidth:"auto",labelPosition:"before",labelAlign:"left",inputEvents:{blur:function(e){
var t=$(e.data.target);
var _66=t.textbox("options");
if(t.textbox("getValue")!=_66.value){
t.textbox("setValue",_66.value);
}
},keydown:function(e){
if(e.keyCode==13){
var t=$(e.data.target);
t.textbox("setValue",t.textbox("getText"));
}
}},onChange:function(_67,_68){
},onResize:function(_69,_6a){
},onClickButton:function(){
},onClickIcon:function(_6b){
}});
})(jQuery);

﻿/**
 * passwordbox
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "passwordbox");
		var _4 = _3.options;
		var _5 = $.extend(true, [], _4.icons);
		if (_4.showEye) {
			_5.push({
				iconCls : "passwordbox-open",
				handler : function(e) {
					_4.revealed = !_4.revealed;
					_6(_2);
				}
			});
		}
		$(_2).addClass("passwordbox-f").textbox($.extend({}, _4, {
			icons : _5
		}));
		_6(_2);
	}
	;
	function _7(_8, _9, _a) {
		var t = $(_8);
		var _b = t.passwordbox("options");
		if (_b.revealed) {
			t.textbox("setValue", _9);
			return;
		}
		var _c = unescape(_b.passwordChar);
		var cc = _9.split("");
		var vv = t.passwordbox("getValue").split("");
		for (var i = 0; i < cc.length; i++) {
			var c = cc[i];
			if (c != vv[i]) {
				if (c != _c) {
					vv.splice(i, 0, c);
				}
			}
		}
		var _d = t.passwordbox("getSelectionStart");
		if (cc.length < vv.length) {
			vv.splice(_d, vv.length - cc.length, "");
		}
		for (var i = 0; i < cc.length; i++) {
			if (_a || i != _d - 1) {
				cc[i] = _c;
			}
		}
		t.textbox("setValue", vv.join(""));
		t.textbox("setText", cc.join(""));
		t.textbox("setSelectionRange", {
			start : _d,
			end : _d
		});
	}
	;
	function _6(_e, _f) {
		var t = $(_e);
		var _10 = t.passwordbox("options");
		var _11 = t.next().find(".passwordbox-open");
		var _12 = unescape(_10.passwordChar);
		_f = _f == undefined ? t.textbox("getValue") : _f;
		t.textbox("setValue", _f);
		t.textbox("setText", _10.revealed ? _f : _f.replace(/./ig, _12));
		_10.revealed ? _11.addClass("passwordbox-close") : _11
				.removeClass("passwordbox-close");
	}
	;
	function _13(e) {
		var _14 = e.data.target;
		var t = $(e.data.target);
		var _15 = t.data("passwordbox");
		var _16 = t.data("passwordbox").options;
		_15.checking = true;
		_15.value = t.passwordbox("getText");
		(function() {
			if (_15.checking) {
				var _17 = t.passwordbox("getText");
				if (_15.value != _17) {
					_15.value = _17;
					if (_15.lastTimer) {
						clearTimeout(_15.lastTimer);
						_15.lastTimer = undefined;
					}
					_7(_14, _17);
					_15.lastTimer = setTimeout(function() {
						_7(_14, t.passwordbox("getText"), true);
						_15.lastTimer = undefined;
					}, _16.lastDelay);
				}
				setTimeout(arguments.callee, _16.checkInterval);
			}
		})();
	}
	;
	function _18(e) {
		var _19 = e.data.target;
		var _1a = $(_19).data("passwordbox");
		_1a.checking = false;
		if (_1a.lastTimer) {
			clearTimeout(_1a.lastTimer);
			_1a.lastTimer = undefined;
		}
		_6(_19);
	}
	;
	$.fn.passwordbox = function(_1b, _1c) {
		if (typeof _1b == "string") {
			var _1d = $.fn.passwordbox.methods[_1b];
			if (_1d) {
				return _1d(this, _1c);
			} else {
				return this.textbox(_1b, _1c);
			}
		}
		_1b = _1b || {};
		return this.each(function() {
			var _1e = $.data(this, "passwordbox");
			if (_1e) {
				$.extend(_1e.options, _1b);
			} else {
				_1e = $.data(this, "passwordbox", {
					options : $.extend({}, $.fn.passwordbox.defaults,
							$.fn.passwordbox.parseOptions(this), _1b)
				});
			}
			_1(this);
		});
	};
	$.fn.passwordbox.methods = {
		options : function(jq) {
			return $.data(jq[0], "passwordbox").options;
		},
		setValue : function(jq, _1f) {
			return jq.each(function() {
				_6(this, _1f);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				_6(this, "");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				$(this).textbox("reset");
				_6(this);
			});
		},
		showPassword : function(jq) {
			return jq.each(function() {
				var _20 = $(this).passwordbox("options");
				_20.revealed = true;
				_6(this);
			});
		},
		hidePassword : function(jq) {
			return jq.each(function() {
				var _21 = $(this).passwordbox("options");
				_21.revealed = false;
				_6(this);
			});
		}
	};
	$.fn.passwordbox.parseOptions = function(_22) {
		return $.extend({}, $.fn.textbox.parseOptions(_22), $.parser
				.parseOptions(_22, [ "passwordChar", {
					checkInterval : "number",
					lastDelay : "number",
					revealed : "boolean",
					showEye : "boolean"
				} ]));
	};
	$.fn.passwordbox.defaults = $.extend({}, $.fn.textbox.defaults, {
		passwordChar : "%u25CF",
		checkInterval : 200,
		lastDelay : 500,
		revealed : false,
		showEye : true,
		inputEvents : {
			focus : _13,
			blur : _18
		},
		val : function(_23) {
			return $(_23).parent().prev().passwordbox("getValue");
		}
	});
})(jQuery);
﻿/**
 * filebox
 * 
 */
(function($) {
	var _1 = 0;
	function _2(_3) {
		var _4 = $.data(_3, "filebox");
		var _5 = _4.options;
		_5.fileboxId = "filebox_file_id_" + (++_1);
		$(_3).addClass("filebox-f").textbox(_5);
		$(_3).textbox("textbox").attr("readonly", "readonly");
		_4.filebox = $(_3).next().addClass("filebox");
		var _6 = _7(_3);
		var _8 = $(_3).filebox("button");
		if (_8.length) {
			$(
					"<label class=\"filebox-label\" for=\"" + _5.fileboxId
							+ "\"></label>").appendTo(_8);
			if (_8.linkbutton("options").disabled) {
				_6.attr("disabled", "disabled");
			} else {
				_6.removeAttr("disabled");
			}
		}
	}
	;
	function _7(_9) {
		var _a = $.data(_9, "filebox");
		var _b = _a.options;
		_a.filebox.find(".textbox-value").remove();
		_b.oldValue = "";
		var _c = $("<input type=\"file\" class=\"textbox-value\">").appendTo(
				_a.filebox);
		_c.attr("id", _b.fileboxId).attr("name",
				$(_9).attr("textboxName") || "");
		_c.attr("accept", _b.accept);
		if (_b.multiple) {
			_c.attr("multiple", "multiple");
		}
		_c.change(function() {
			var _d = this.value;
			if (this.files) {
				_d = $.map(this.files, function(_e) {
					return _e.name;
				}).join(_b.separator);
			}
			$(_9).filebox("setText", _d);
			_b.onChange.call(_9, _d, _b.oldValue);
			_b.oldValue = _d;
		});
		return _c;
	}
	;
	$.fn.filebox = function(_f, _10) {
		if (typeof _f == "string") {
			var _11 = $.fn.filebox.methods[_f];
			if (_11) {
				return _11(this, _10);
			} else {
				return this.textbox(_f, _10);
			}
		}
		_f = _f || {};
		return this.each(function() {
			var _12 = $.data(this, "filebox");
			if (_12) {
				$.extend(_12.options, _f);
			} else {
				$.data(this, "filebox", {
					options : $.extend({}, $.fn.filebox.defaults, $.fn.filebox
							.parseOptions(this), _f)
				});
			}
			_2(this);
		});
	};
	$.fn.filebox.methods = {
		options : function(jq) {
			var _13 = jq.textbox("options");
			return $.extend($.data(jq[0], "filebox").options, {
				width : _13.width,
				value : _13.value,
				originalValue : _13.originalValue,
				disabled : _13.disabled,
				readonly : _13.readonly
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).textbox("clear");
				_7(this);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				$(this).filebox("clear");
			});
		},
		setValue : function(jq) {
			return jq;
		},
		setValues : function(jq) {
			return jq;
		}
	};
	$.fn.filebox.parseOptions = function(_14) {
		var t = $(_14);
		return $.extend({}, $.fn.textbox.parseOptions(_14), $.parser
				.parseOptions(_14, [ "accept", "separator" ]), {
			multiple : (t.attr("multiple") ? true : undefined)
		});
	};
	$.fn.filebox.defaults = $.extend({}, $.fn.textbox.defaults, {
		buttonIcon : null,
		buttonText : "Choose File",
		buttonAlign : "right",
		inputEvents : {},
		accept : "",
		separator : ",",
		multiple : false
	});
})(jQuery);
﻿/**
 * searchbox
 * 
 */
(function($){
function _1(_2){
var _3=$.data(_2,"searchbox");
var _4=_3.options;
var _5=$.extend(true,[],_4.icons);
_5.push({iconCls:"searchbox-button",handler:function(e){
var t=$(e.data.target);
var _6=t.searchbox("options");
_6.searcher.call(e.data.target,t.searchbox("getValue"),t.searchbox("getName"));
}});
_7();
var _8=_9();
$(_2).addClass("searchbox-f").textbox($.extend({},_4,{icons:_5,buttonText:(_8?_8.text:"")}));
$(_2).attr("searchboxName",$(_2).attr("textboxName"));
_3.searchbox=$(_2).next();
_3.searchbox.addClass("searchbox");
_a(_8);
function _7(){
if(_4.menu){
_3.menu=$(_4.menu).menu();
var _b=_3.menu.menu("options");
var _c=_b.onClick;
_b.onClick=function(_d){
_a(_d);
_c.call(this,_d);
};
}else{
if(_3.menu){
_3.menu.menu("destroy");
}
_3.menu=null;
}
};
function _9(){
if(_3.menu){
var _e=_3.menu.children("div.menu-item:first");
_3.menu.children("div.menu-item").each(function(){
var _f=$.extend({},$.parser.parseOptions(this),{selected:($(this).attr("selected")?true:undefined)});
if(_f.selected){
_e=$(this);
return false;
}
});
return _3.menu.menu("getItem",_e[0]);
}else{
return null;
}
};
function _a(_10){
if(!_10){
return;
}
$(_2).textbox("button").menubutton({text:_10.text,iconCls:(_10.iconCls||null),menu:_3.menu,menuAlign:_4.buttonAlign,plain:false});
_3.searchbox.find("input.textbox-value").attr("name",_10.name||_10.text);
$(_2).searchbox("resize");
};
};
$.fn.searchbox=function(_11,_12){
if(typeof _11=="string"){
var _13=$.fn.searchbox.methods[_11];
if(_13){
return _13(this,_12);
}else{
return this.textbox(_11,_12);
}
}
_11=_11||{};
return this.each(function(){
var _14=$.data(this,"searchbox");
if(_14){
$.extend(_14.options,_11);
}else{
$.data(this,"searchbox",{options:$.extend({},$.fn.searchbox.defaults,$.fn.searchbox.parseOptions(this),_11)});
}
_1(this);
});
};
$.fn.searchbox.methods={options:function(jq){
var _15=jq.textbox("options");
return $.extend($.data(jq[0],"searchbox").options,{width:_15.width,value:_15.value,originalValue:_15.originalValue,disabled:_15.disabled,readonly:_15.readonly});
},menu:function(jq){
return $.data(jq[0],"searchbox").menu;
},getName:function(jq){
return $.data(jq[0],"searchbox").searchbox.find("input.textbox-value").attr("name");
},selectName:function(jq,_16){
return jq.each(function(){
var _17=$.data(this,"searchbox").menu;
if(_17){
_17.children("div.menu-item").each(function(){
var _18=_17.menu("getItem",this);
if(_18.name==_16){
$(this).triggerHandler("click");
return false;
}
});
}
});
},destroy:function(jq){
return jq.each(function(){
var _19=$(this).searchbox("menu");
if(_19){
_19.menu("destroy");
}
$(this).textbox("destroy");
});
}};
$.fn.searchbox.parseOptions=function(_1a){
var t=$(_1a);
return $.extend({},$.fn.textbox.parseOptions(_1a),$.parser.parseOptions(_1a,["menu"]),{searcher:(t.attr("searcher")?eval(t.attr("searcher")):undefined)});
};
$.fn.searchbox.defaults=$.extend({},$.fn.textbox.defaults,{inputEvents:$.extend({},$.fn.textbox.defaults.inputEvents,{keydown:function(e){
if(e.keyCode==13){
e.preventDefault();
var t=$(e.data.target);
var _1b=t.searchbox("options");
t.searchbox("setValue",$(this).val());
_1b.searcher.call(e.data.target,t.searchbox("getValue"),t.searchbox("getName"));
return false;
}
}}),buttonAlign:"left",menu:null,searcher:function(_1c,_1d){
}});
})(jQuery);

﻿/**
 * form
 * 
 */
(function($){
	/**
	 * submit the form
	 */
	function ajaxSubmit(target, options){
		var opts = $.data(target, 'form').options;
		$.extend(opts, options||{});
		
		var param = $.extend({}, opts.queryParams);
		if (opts.onSubmit.call(target, param) == false){return;}

		// $(target).find('.textbox-text:focus').blur();
		var input = $(target).find('.textbox-text:focus');
		input.triggerHandler('blur');
		input.focus();

		var disabledFields = null;	// the fields to be disabled
		if (opts.dirty){
			var ff = [];	// all the dirty fields
			$.map(opts.dirtyFields, function(f){
				if ($(f).hasClass('textbox-f')){
					$(f).next().find('.textbox-value').each(function(){
						ff.push(this);
					});
				} else {
					ff.push(f);
				}
			});
			disabledFields = $(target).find('input[name]:enabled,textarea[name]:enabled,select[name]:enabled').filter(function(){
				return $.inArray(this, ff) == -1;
			});
			disabledFields.attr('disabled', 'disabled');
		}

		if (opts.ajax){
			if (opts.iframe){
				submitIframe(target, param);
			} else {
				if (window.FormData !== undefined){
					submitXhr(target, param);
				} else {
					submitIframe(target, param);
				}
			}
		} else {
			$(target).submit();
		}

		if (opts.dirty){
			disabledFields.removeAttr('disabled');
		}
	}

	function submitIframe(target, param){
		var opts = $.data(target, 'form').options;
		var frameId = 'nestui_frame_' + (new Date().getTime());
		var frame = $('<iframe id='+frameId+' name='+frameId+'></iframe>').appendTo('body')
		frame.attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank');
		frame.css({
			position:'absolute',
			top:-1000,
			left:-1000
		});
		frame.bind('load', cb);
		
		submit(param);
		
		function submit(param){
			var form = $(target);
			if (opts.url){
				form.attr('action', opts.url);
			}
			var t = form.attr('target'), a = form.attr('action');
			form.attr('target', frameId);
			var paramFields = $();
			try {
				for(var n in param){
					var field = $('<input type="hidden" name="' + n + '">').val(param[n]).appendTo(form);
					paramFields = paramFields.add(field);
				}
				checkState();
				form[0].submit();
			} finally {
				form.attr('action', a);
				t ? form.attr('target', t) : form.removeAttr('target');
				paramFields.remove();
			}
		}
		
		function checkState(){
			var f = $('#'+frameId);
			if (!f.length){return}
			try{
				var s = f.contents()[0].readyState;
				if (s && s.toLowerCase() == 'uninitialized'){
					setTimeout(checkState, 100);
				}
			} catch(e){
				cb();
			}
		}
		
		var checkCount = 10;
		function cb(){
			var f = $('#'+frameId);
			if (!f.length){return}
			f.unbind();
			var data = '';
			try{
				var body = f.contents().find('body');
				data = body.html();
				if (data == ''){
					if (--checkCount){
						setTimeout(cb, 100);
						return;
					}
				}
				var ta = body.find('>textarea');
				if (ta.length){
					data = ta.val();
				} else {
					var pre = body.find('>pre');
					if (pre.length){
						data = pre.html();
					}
				}
			} catch(e){
			}
			opts.success.call(target, data);
			setTimeout(function(){
				f.unbind();
				f.remove();
			}, 100);
		}
	}

	function submitXhr(target, param){
		var opts = $.data(target, 'form').options;
		var formData = new FormData($(target)[0]);
		for(var name in param){
			formData.append(name, param[name]);
		}
		$.ajax({
			url: opts.url,
			type: 'post',
			xhr: function(){
				var xhr = $.ajaxSettings.xhr();
				if (xhr.upload) {
					xhr.upload.addEventListener('progress', function(e){
						if (e.lengthComputable) {
							var total = e.total;
							var position = e.loaded || e.position;
							var percent = Math.ceil(position * 100 / total);
							opts.onProgress.call(target, percent);
						}
					}, false);
				}
				return xhr;
			},
			data: formData,
			dataType: 'html',
			cache: false,
			contentType: false,
			processData: false,
			complete: function(res){
				opts.success.call(target, res.responseText);
			}
		});
	}
	
	
	/**
	 * load form data
	 * if data is a URL string type load from remote site, 
	 * otherwise load from local data object. 
	 */
	function load(target, data){
		var opts = $.data(target, 'form').options;
		
		if (typeof data == 'string'){
			var param = {};
			if (opts.onBeforeLoad.call(target, param) == false) return;
			
			$.ajax({
				url: data,
				data: param,
				dataType: 'json',
				success: function(data){
					_load(data);
				},
				error: function(){
					opts.onLoadError.apply(target, arguments);
				}
			});
		} else {
			_load(data);
		}
		
		function _load(data){
			var form = $(target);
			for(var name in data){
				var val = data[name];
				if (!_checkField(name, val)){
					if (!_loadBox(name, val)){
						form.find('input[name="'+name+'"]').val(val);
						form.find('textarea[name="'+name+'"]').val(val);
						form.find('select[name="'+name+'"]').val(val);
					}
				}
			}
			opts.onLoadSuccess.call(target, data);
			form.form('validate');
		}
		
		/**
		 * check the checkbox and radio fields
		 */
		function _checkField(name, val){
			var cc = $(target).find('[switchbuttonName="'+name+'"]');
			if (cc.length){
				cc.switchbutton('uncheck');
				cc.each(function(){
					if (_isChecked($(this).switchbutton('options').value, val)){
						$(this).switchbutton('check');
					}
				});
				return true;
			}
			cc = $(target).find('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]');
			if (cc.length){
				cc._propAttr('checked', false);
				cc.each(function(){
					if (_isChecked($(this).val(), val)){
						$(this)._propAttr('checked', true);
					}
				});
				return true;
			}
			return false;
		}
		function _isChecked(v, val){
			if (v == String(val) || $.inArray(v, $.isArray(val)?val:[val]) >= 0){
				return true;
			} else {
				return false;
			}
		}
		
		function _loadBox(name, val){
			var field = $(target).find('[textboxName="'+name+'"],[sliderName="'+name+'"]');
			if (field.length){
				for(var i=0; i<opts.fieldTypes.length; i++){
					var type = opts.fieldTypes[i];
					var state = field.data(type);
					if (state){
						if (state.options.multiple || state.options.range){
							field[type]('setValues', val);
						} else {
							field[type]('setValue', val);
						}
						return true;
					}
				}
			}
			return false;
		}
	}
	
	/**
	 * clear the form fields
	 */
	function clear(target){
		$('input,select,textarea', target).each(function(){
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea'){
				this.value = '';
			} else if (t == 'file'){
				var file = $(this);
				if (!file.hasClass('textbox-value')){
					var newfile = file.clone().val('');
					newfile.insertAfter(file);
					if (file.data('validatebox')){
						file.validatebox('destroy');
						newfile.validatebox();
					} else {
						file.remove();
					}
				}
			} else if (t == 'checkbox' || t == 'radio'){
				this.checked = false;
			} else if (tag == 'select'){
				this.selectedIndex = -1;
			}
			
		});
		
		var form = $(target);
		var opts = $.data(target, 'form').options;
		for(var i=opts.fieldTypes.length-1; i>=0; i--){
			var type = opts.fieldTypes[i];
			var field = form.find('.'+type+'-f');
			if (field.length && field[type]){
				field[type]('clear');
			}
		}
		form.form('validate');
	}
	
	function reset(target){
		target.reset();
		var form = $(target);
		var opts = $.data(target, 'form').options;
		for(var i=opts.fieldTypes.length-1; i>=0; i--){
			var type = opts.fieldTypes[i];
			var field = form.find('.'+type+'-f');
			if (field.length && field[type]){
				field[type]('reset');
			}
		}
		form.form('validate');
	}
	
	/**
	 * set the form to make it can submit with ajax.
	 */
	function setForm(target){
		var options = $.data(target, 'form').options;
		$(target).unbind('.form');
		if (options.ajax){
			$(target).bind('submit.form', function(){
				setTimeout(function(){
					ajaxSubmit(target, options);
				}, 0);
				return false;
			});
		}
		$(target).bind('_change.form', function(e, t){
			if ($.inArray(t, options.dirtyFields) == -1){
				options.dirtyFields.push(t);
			}
			options.onChange.call(this, t);
		}).bind('change.form', function(e){
			var t = e.target;
			if (!$(t).hasClass('textbox-text')){
				if ($.inArray(t, options.dirtyFields) == -1){
					options.dirtyFields.push(t);
				}
				options.onChange.call(this, t);
			}
		});
		setValidation(target, options.novalidate);
	}
	
	function initForm(target, options){
		options = options || {};
		var state = $.data(target, 'form');
		if (state){
			$.extend(state.options, options);
		} else {
			$.data(target, 'form', {
				options: $.extend({}, $.fn.form.defaults, $.fn.form.parseOptions(target), options)
			});
		}
	}
	
	function validate(target){
		if ($.fn.validatebox){
			var t = $(target);
			t.find('.validatebox-text:not(:disabled)').validatebox('validate');
			var invalidbox = t.find('.validatebox-invalid');
			invalidbox.filter(':not(:disabled):first').focus();
			return invalidbox.length == 0;
		}
		return true;
	}
	
	function setValidation(target, novalidate){
		var opts = $.data(target, 'form').options;
		opts.novalidate = novalidate;
		$(target).find('.validatebox-text:not(:disabled)').validatebox(novalidate ? 'disableValidation' : 'enableValidation');
	}
	
	$.fn.form = function(options, param){
		if (typeof options == 'string'){
			this.each(function(){
				initForm(this);
			});
			return $.fn.form.methods[options](this, param);
		}
		
		return this.each(function(){
			initForm(this, options);
			setForm(this);
		});
	};
	
	$.fn.form.methods = {
		options: function(jq){
			return $.data(jq[0], 'form').options;
		},
		submit: function(jq, options){
			return jq.each(function(){
				ajaxSubmit(this, options);
			});
		},
		load: function(jq, data){
			return jq.each(function(){
				load(this, data);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				reset(this);
			});
		},
		validate: function(jq){
			return validate(jq[0]);
		},
		disableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, true);
			});
		},
		enableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, false);
			});
		},
		resetValidation: function(jq){
			return jq.each(function(){
				$(this).find('.validatebox-text:not(:disabled)').validatebox('resetValidation');
			});
		},
		resetDirty: function(jq){
			return jq.each(function(){
				$(this).form('options').dirtyFields = [];
			});
		}
	};
	
	$.fn.form.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			{ajax:'boolean',dirty:'boolean'}
		]), {
			url: (t.attr('action') ? t.attr('action') : undefined)
		});
	};
	
	$.fn.form.defaults = {
		fieldTypes: ['combobox','combotree','combogrid','combotreegrid','datetimebox','datebox','combo',
		        'datetimespinner','timespinner','numberspinner','spinner',
		        'slider','searchbox','numberbox','passwordbox','filebox','textbox','switchbutton'],
		novalidate: false,
		ajax: true,
		iframe: true,
		dirty: false,
		dirtyFields: [],
		url: null,
		queryParams: {},
		onSubmit: function(param){return $(this).form('validate');},
		onProgress: function(percent){},
		success: function(data){},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(data){},
		onLoadError: function(){},
		onChange: function(target){}
	};
})(jQuery);
﻿/**
 * numberbox
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "numberbox");
		var _4 = _3.options;
		$(_2).addClass("numberbox-f").textbox(_4);
		$(_2).textbox("textbox").css({
			imeMode : "disabled"
		});
		$(_2).attr("numberboxName", $(_2).attr("textboxName"));
		_3.numberbox = $(_2).next();
		_3.numberbox.addClass("numberbox");
		var _5 = _4.parser.call(_2, _4.value);
		var _6 = _4.formatter.call(_2, _5);
		$(_2).numberbox("initValue", _5).numberbox("setText", _6);
	}
	;
	function _7(_8, _9) {
		var _a = $.data(_8, "numberbox");
		var _b = _a.options;
		var _9 = _b.parser.call(_8, _9);
		var _c = _b.formatter.call(_8, _9);
		_b.value = _9;
		$(_8).textbox("setText", _c).textbox("setValue", _9);
		_c = _b.formatter.call(_8, $(_8).textbox("getValue"));
		$(_8).textbox("setText", _c);
	}
	;
	$.fn.numberbox = function(_d, _e) {
		if (typeof _d == "string") {
			var _f = $.fn.numberbox.methods[_d];
			if (_f) {
				return _f(this, _e);
			} else {
				return this.textbox(_d, _e);
			}
		}
		_d = _d || {};
		return this.each(function() {
			var _10 = $.data(this, "numberbox");
			if (_10) {
				$.extend(_10.options, _d);
			} else {
				_10 = $.data(this, "numberbox", {
					options : $.extend({}, $.fn.numberbox.defaults,
							$.fn.numberbox.parseOptions(this), _d)
				});
			}
			_1(this);
		});
	};
	$.fn.numberbox.methods = {
		options : function(jq) {
			var _11 = jq.data("textbox") ? jq.textbox("options") : {};
			return $.extend($.data(jq[0], "numberbox").options, {
				width : _11.width,
				originalValue : _11.originalValue,
				disabled : _11.disabled,
				readonly : _11.readonly
			});
		},
		fix : function(jq) {
			return jq.each(function() {
				$(this).numberbox("setValue", $(this).numberbox("getText"));
			});
		},
		setValue : function(jq, _12) {
			return jq.each(function() {
				_7(this, _12);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).textbox("clear");
				$(this).numberbox("options").value = "";
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				$(this).textbox("reset");
				$(this).numberbox("setValue", $(this).numberbox("getValue"));
			});
		}
	};
	$.fn.numberbox.parseOptions = function(_13) {
		var t = $(_13);
		return $.extend({}, $.fn.textbox.parseOptions(_13), $.parser
				.parseOptions(_13, [ "decimalSeparator", "groupSeparator",
						"suffix", {
							min : "number",
							max : "number",
							precision : "number"
						} ]), {
			prefix : (t.attr("prefix") ? t.attr("prefix") : undefined)
		});
	};
	$.fn.numberbox.defaults = $
			.extend(
					{},
					$.fn.textbox.defaults,
					{
						inputEvents : {
							keypress : function(e) {
								var _14 = e.data.target;
								var _15 = $(_14).numberbox("options");
								return _15.filter.call(_14, e);
							},
							blur : function(e) {
								var _16 = e.data.target;
								$(_16).numberbox("setValue",
										$(_16).numberbox("getText"));
							},
							keydown : function(e) {
								if (e.keyCode == 13) {
									var _17 = e.data.target;
									$(_17).numberbox("setValue",
											$(_17).numberbox("getText"));
								}
							}
						},
						min : null,
						max : null,
						precision : 0,
						decimalSeparator : ".",
						groupSeparator : "",
						prefix : "",
						suffix : "",
						filter : function(e) {
							var _18 = $(this).numberbox("options");
							var s = $(this).numberbox("getText");
							if (e.metaKey || e.ctrlKey) {
								return true;
							}
							if ($.inArray(String(e.which), [ "46", "8", "13",
									"0" ]) >= 0) {
								return true;
							}
							var tmp = $("<span></span>");
							tmp.html(String.fromCharCode(e.which));
							var c = tmp.text();
							tmp.remove();
							if (!c) {
								return true;
							}
							if (c == "-" || c == _18.decimalSeparator) {
								return (s.indexOf(c) == -1) ? true : false;
							} else {
								if (c == _18.groupSeparator) {
									return true;
								} else {
									if ("0123456789".indexOf(c) >= 0) {
										return true;
									} else {
										return false;
									}
								}
							}
						},
						formatter : function(_19) {
							if (!_19) {
								return _19;
							}
							_19 = _19 + "";
							var _1a = $(this).numberbox("options");
							var s1 = _19, s2 = "";
							var _1b = _19.indexOf(".");
							if (_1b >= 0) {
								s1 = _19.substring(0, _1b);
								s2 = _19.substring(_1b + 1, _19.length);
							}
							if (_1a.groupSeparator) {
								var p = /(\d+)(\d{3})/;
								while (p.test(s1)) {
									s1 = s1.replace(p, "$1"
											+ _1a.groupSeparator + "$2");
								}
							}
							if (s2) {
								return _1a.prefix + s1 + _1a.decimalSeparator
										+ s2 + _1a.suffix;
							} else {
								return _1a.prefix + s1 + _1a.suffix;
							}
						},
						parser : function(s) {
							s = s + "";
							var _1c = $(this).numberbox("options");
							if (parseFloat(s) != s) {
								if (_1c.prefix) {
									s = $.trim(s.replace(new RegExp("\\"
											+ $.trim(_1c.prefix), "g"), ""));
								}
								if (_1c.suffix) {
									s = $.trim(s.replace(new RegExp("\\"
											+ $.trim(_1c.suffix), "g"), ""));
								}
								if (_1c.groupSeparator) {
									s = $.trim(s.replace(new RegExp("\\"
											+ _1c.groupSeparator, "g"), ""));
								}
								if (_1c.decimalSeparator) {
									s = $.trim(s.replace(new RegExp("\\"
											+ _1c.decimalSeparator, "g"), "."));
								}
								s = s.replace(/\s/g, "");
							}
							var val = parseFloat(s).toFixed(_1c.precision);
							if (isNaN(val)) {
								val = "";
							} else {
								if (typeof (_1c.min) == "number"
										&& val < _1c.min) {
									val = _1c.min.toFixed(_1c.precision);
								} else {
									if (typeof (_1c.max) == "number"
											&& val > _1c.max) {
										val = _1c.max.toFixed(_1c.precision);
									}
								}
							}
							return val;
						}
					});
})(jQuery);
﻿/**
 * calendar
 * 
 */
(function($){
	
	function setSize(target, param){
		var opts = $.data(target, 'calendar').options;
		var t = $(target);
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		t._size(opts, t.parent());
		t.find('.calendar-body')._outerHeight(t.height() - t.find('.calendar-header')._outerHeight());
		if (t.find('.calendar-menu').is(':visible')){
			showSelectMenus(target);
		}
	}
	
	function init(target){
		$(target).addClass('calendar').html(
				'<div class="calendar-header">' +
					'<div class="calendar-nav calendar-prevmonth"></div>' +
					'<div class="calendar-nav calendar-nextmonth"></div>' +
					'<div class="calendar-nav calendar-prevyear"></div>' +
					'<div class="calendar-nav calendar-nextyear"></div>' +
					'<div class="calendar-title">' +
						'<span class="calendar-text"></span>' +
					'</div>' +
				'</div>' +
				'<div class="calendar-body">' +
					'<div class="calendar-menu">' +
						'<div class="calendar-menu-year-inner">' +
							'<span class="calendar-nav calendar-menu-prev"></span>' +
							'<span><input class="calendar-menu-year" type="text"></input></span>' +
							'<span class="calendar-nav calendar-menu-next"></span>' +
						'</div>' +
						'<div class="calendar-menu-month-inner">' +
						'</div>' +
					'</div>' +
				'</div>'
		);
		
		
		$(target).bind('_resize', function(e,force){
			if ($(this).hasClass('nestui-fluid') || force){
				setSize(target);
			}
			return false;
		});
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'calendar').options;
		var menu = $(target).find('.calendar-menu');
		menu.find('.calendar-menu-year').unbind('.calendar').bind('keypress.calendar', function(e){
			if (e.keyCode == 13){
				setDate(true);
			}
		});
		$(target).unbind('.calendar').bind('mouseover.calendar', function(e){
			var t = toTarget(e.target);
			if (t.hasClass('calendar-nav') || t.hasClass('calendar-text') || (t.hasClass('calendar-day') && !t.hasClass('calendar-disabled'))){
				t.addClass('calendar-nav-hover');
			}
		}).bind('mouseout.calendar', function(e){
			var t = toTarget(e.target);
			if (t.hasClass('calendar-nav') || t.hasClass('calendar-text') || (t.hasClass('calendar-day') && !t.hasClass('calendar-disabled'))){
				t.removeClass('calendar-nav-hover');
			}
		}).bind('click.calendar', function(e){
			var t = toTarget(e.target);
			if (t.hasClass('calendar-menu-next') || t.hasClass('calendar-nextyear')){
				showYear(1);
			} else if (t.hasClass('calendar-menu-prev') || t.hasClass('calendar-prevyear')){
				showYear(-1);
			} else if (t.hasClass('calendar-menu-month')){
				menu.find('.calendar-selected').removeClass('calendar-selected');
				t.addClass('calendar-selected');
				setDate(true);
			} else if (t.hasClass('calendar-prevmonth')){
				showMonth(-1);
			} else if (t.hasClass('calendar-nextmonth')){
				showMonth(1);
			} else if (t.hasClass('calendar-text')){
				if (menu.is(':visible')){
					menu.hide();
				} else {
					showSelectMenus(target);
				}
			} else if (t.hasClass('calendar-day')){
				if (t.hasClass('calendar-disabled')){return}
				var oldValue = opts.current;
				t.closest('div.calendar-body').find('.calendar-selected').removeClass('calendar-selected');
				t.addClass('calendar-selected');
				var parts = t.attr('abbr').split(',');
				var y = parseInt(parts[0]);
				var m = parseInt(parts[1]);
				var d = parseInt(parts[2]);
				opts.current = new Date(y, m-1, d);
				opts.onSelect.call(target, opts.current);
				if (!oldValue || oldValue.getTime() != opts.current.getTime()){
					opts.onChange.call(target, opts.current, oldValue);
				}
				if (opts.year != y || opts.month != m){
					opts.year = y;
					opts.month = m;
					show(target);
				}
			}
		});
		function toTarget(t){
			var day = $(t).closest('.calendar-day');
			if (day.length){
				return day;
			} else {
				return $(t);
			}
		}
		function setDate(hideMenu){
			var menu = $(target).find('.calendar-menu');
			var year = menu.find('.calendar-menu-year').val();
			var month = menu.find('.calendar-selected').attr('abbr');
			if (!isNaN(year)){
				opts.year = parseInt(year);
				opts.month = parseInt(month);
				show(target);
			}
			if (hideMenu){menu.hide()}
		}
		function showYear(delta){
			opts.year += delta;
			show(target);
			menu.find('.calendar-menu-year').val(opts.year);
		}
		function showMonth(delta){
			opts.month += delta;
			if (opts.month > 12){
				opts.year++;
				opts.month = 1;
			} else if (opts.month < 1){
				opts.year--;
				opts.month = 12;
			}
			show(target);
			
			menu.find('td.calendar-selected').removeClass('calendar-selected');
			menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
		}
	}
	
	/**
	 * show the select menu that can change year or month, if the menu is not be created then create it.
	 */
	function showSelectMenus(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-menu').show();
		
		if ($(target).find('.calendar-menu-month-inner').is(':empty')){
			$(target).find('.calendar-menu-month-inner').empty();
			var t = $('<table class="calendar-mtable"></table>').appendTo($(target).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-nav calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
		}
		
		var body = $(target).find('.calendar-body');
		var sele = $(target).find('.calendar-menu');
		var seleYear = sele.find('.calendar-menu-year-inner');
		var seleMonth = sele.find('.calendar-menu-month-inner');
		
		seleYear.find('input').val(opts.year).focus();
		seleMonth.find('td.calendar-selected').removeClass('calendar-selected');
		seleMonth.find('td:eq('+(opts.month-1)+')').addClass('calendar-selected');
		
		sele._outerWidth(body._outerWidth());
		sele._outerHeight(body._outerHeight());
		seleMonth._outerHeight(sele.height() - seleYear._outerHeight());
	}
	
	/**
	 * get weeks data.
	 */
	function getWeeks(target, year, month){
		var opts = $.data(target, 'calendar').options;
		var dates = [];
		var lastDay = new Date(year, month, 0).getDate();
		for(var i=1; i<=lastDay; i++) dates.push([year,month,i]);
		
		// group date by week
		var weeks = [], week = [];
		var memoDay = -1;
		while(dates.length > 0){
			var date = dates.shift();
			week.push(date);
			var day = new Date(date[0],date[1]-1,date[2]).getDay();
			if (memoDay == day){
				day = 0;
			} else if (day == (opts.firstDay==0 ? 7 : opts.firstDay) - 1){
				weeks.push(week);
				week = [];
			}
			memoDay = day;
		}
		if (week.length){
			weeks.push(week);
		}
		
		var firstWeek = weeks[0];
		if (firstWeek.length < 7){
			while(firstWeek.length < 7){
				var firstDate = firstWeek[0];
				var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
				firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
		} else {
			var firstDate = firstWeek[0];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
				week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.unshift(week);
		}
		
		var lastWeek = weeks[weeks.length-1];
		while(lastWeek.length < 7){
			var lastDate = lastWeek[lastWeek.length-1];
			var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
			lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
		}
		if (weeks.length < 6){
			var lastDate = lastWeek[lastWeek.length-1];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
				week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.push(week);
		}
		
		return weeks;
	}
	
	/**
	 * show the calendar day.
	 */
	function show(target){
		var opts = $.data(target, 'calendar').options;
		if (opts.current && !opts.validator.call(target, opts.current)){
			opts.current = null;
		}
		
		var now = new Date();
		var todayInfo = now.getFullYear()+','+(now.getMonth()+1)+','+now.getDate();
		var currentInfo = opts.current ? (opts.current.getFullYear()+','+(opts.current.getMonth()+1)+','+opts.current.getDate()) : '';
		// calulate the saturday and sunday index
		var saIndex = 6 - opts.firstDay;
		var suIndex = saIndex + 1;
		if (saIndex >= 7) saIndex -= 7;
		if (suIndex >= 7) suIndex -= 7;
		
		$(target).find('.calendar-title span').html(opts.months[opts.month-1] + ' ' + opts.year);
		
		var body = $(target).find('div.calendar-body');
		body.children('table').remove();
		
		var data = ['<table class="calendar-dtable" cellspacing="0" cellpadding="0" border="0">'];
		data.push('<thead><tr>');
		if (opts.showWeek){
			data.push('<th class="calendar-week">'+opts.weekNumberHeader+'</th>');
		}
		for(var i=opts.firstDay; i<opts.weeks.length; i++){
			data.push('<th>'+opts.weeks[i]+'</th>');
		}
		for(var i=0; i<opts.firstDay; i++){
			data.push('<th>'+opts.weeks[i]+'</th>');
		}
		data.push('</tr></thead>');
		
		data.push('<tbody>');
		var weeks = getWeeks(target, opts.year, opts.month);
		for(var i=0; i<weeks.length; i++){
			var week = weeks[i];
			var cls = '';
			if (i == 0){cls = 'calendar-first';}
			else if (i == weeks.length - 1){cls = 'calendar-last';}
			data.push('<tr class="' + cls + '">');
			if (opts.showWeek){
				var weekNumber = opts.getWeekNumber(new Date(week[0][0], parseInt(week[0][1])-1, week[0][2]));
				data.push('<td class="calendar-week">'+weekNumber+'</td>');
			}
			for(var j=0; j<week.length; j++){
				var day = week[j];
				var s = day[0]+','+day[1]+','+day[2];
				var dvalue = new Date(day[0], parseInt(day[1])-1, day[2]);
				var d = opts.formatter.call(target, dvalue);
				var css = opts.styler.call(target, dvalue);
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				
				var cls = 'calendar-day';
				if (!(opts.year == day[0] && opts.month == day[1])){
					cls += ' calendar-other-month';
				}
				if (s == todayInfo){cls += ' calendar-today';}
				if (s == currentInfo){cls += ' calendar-selected';}
				if (j == saIndex){cls += ' calendar-saturday';}
				else if (j == suIndex){cls += ' calendar-sunday';}
				if (j == 0){cls += ' calendar-first';}
				else if (j == week.length-1){cls += ' calendar-last';}
				
				cls += ' ' + classValue;
				if (!opts.validator.call(target, dvalue)){
					cls += ' calendar-disabled';
				}
				
				data.push('<td class="' + cls + '" abbr="' + s + '" style="' + styleValue + '">' + d + '</td>');
			}
			data.push('</tr>');
		}
		data.push('</tbody>');
		data.push('</table>');
		
		body.append(data.join(''));
		body.children('table.calendar-dtable').prependTo(body);

		opts.onNavigate.call(target, opts.year, opts.month);
	}
	
	$.fn.calendar = function(options, param){
		if (typeof options == 'string'){
			return $.fn.calendar.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'calendar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'calendar', {
					options:$.extend({}, $.fn.calendar.defaults, $.fn.calendar.parseOptions(this), options)
				});
				init(this);
			}
			if (state.options.border == false){
				$(this).addClass('calendar-noborder');
			}
			setSize(this);
			bindEvents(this);
			show(this);
			$(this).find('div.calendar-menu').hide();	// hide the calendar menu
		});
	};
	
	$.fn.calendar.methods = {
		options: function(jq){
			return $.data(jq[0], 'calendar').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		moveTo: function(jq, date){
			return jq.each(function(){
				if (!date){
					var now = new Date();
					$(this).calendar({
						year: now.getFullYear(),
						month: now.getMonth()+1,
						current: date
					});
					return;
				}
				var opts = $(this).calendar('options');
				if (opts.validator.call(this, date)){
					var oldValue = opts.current;
					$(this).calendar({
						year: date.getFullYear(),
						month: date.getMonth()+1,
						current: date
					});
					if (!oldValue || oldValue.getTime() != date.getTime()){
						opts.onChange.call(this, opts.current, oldValue);
					}
				}
			});
		}
	};
	
	$.fn.calendar.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'weekNumberHeader',{firstDay:'number',fit:'boolean',border:'boolean',showWeek:'boolean'}
		]));
	};
	
	$.fn.calendar.defaults = {
		width:180,
		height:180,
		fit:false,
		border:true,
		showWeek:false,
		firstDay:0,
		weeks:['S','M','T','W','T','F','S'],
		months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:(function(){
			var d = new Date();
			return new Date(d.getFullYear(), d.getMonth(), d.getDate());
		})(),
		weekNumberHeader:'',
		getWeekNumber: function(date){
			var checkDate = new Date(date.getTime());
			checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
			var time = checkDate.getTime();
			checkDate.setMonth(0);
			checkDate.setDate(1);
			return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
		},

		formatter:function(date){return date.getDate()},
		styler:function(date){return ''},
		validator:function(date){return true},
		
		onSelect: function(date){},
		onChange: function(newDate, oldDate){},
		onNavigate: function(year, month){}
	};
})(jQuery);
﻿/**
 * spinner
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "spinner");
		var _4 = _3.options;
		var _5 = $.extend(true, [], _4.icons);
		if (_4.spinAlign == "left" || _4.spinAlign == "right") {
			_4.spinArrow = true;
			_4.iconAlign = _4.spinAlign;
			var _6 = {
				iconCls : "spinner-arrow",
				handler : function(e) {
					var _7 = $(e.target).closest(
							".spinner-arrow-up,.spinner-arrow-down");
					_13(e.data.target, _7.hasClass("spinner-arrow-down"));
				}
			};
			if (_4.spinAlign == "left") {
				_5.unshift(_6);
			} else {
				_5.push(_6);
			}
		} else {
			_4.spinArrow = false;
			if (_4.spinAlign == "vertical") {
				if (_4.buttonAlign != "top") {
					_4.buttonAlign = "bottom";
				}
				_4.clsLeft = "textbox-button-bottom";
				_4.clsRight = "textbox-button-top";
			} else {
				_4.clsLeft = "textbox-button-left";
				_4.clsRight = "textbox-button-right";
			}
		}
		$(_2).addClass("spinner-f").textbox($.extend({}, _4, {
			icons : _5,
			doSize : false,
			onResize : function(_8, _9) {
				if (!_4.spinArrow) {
					var _a = $(this).next();
					var _b = _a.find(".textbox-button:not(.spinner-button)");
					if (_b.length) {
						var _c = _b.outerWidth();
						var _d = _b.outerHeight();
						var _e = _a.find(".spinner-button." + _4.clsLeft);
						var _f = _a.find(".spinner-button." + _4.clsRight);
						if (_4.buttonAlign == "right") {
							_f.css("marginRight", _c + "px");
						} else {
							if (_4.buttonAlign == "left") {
								_e.css("marginLeft", _c + "px");
							} else {
								if (_4.buttonAlign == "top") {
									_f.css("marginTop", _d + "px");
								} else {
									_e.css("marginBottom", _d + "px");
								}
							}
						}
					}
				}
				_4.onResize.call(this, _8, _9);
			}
		}));
		$(_2).attr("spinnerName", $(_2).attr("textboxName"));
		_3.spinner = $(_2).next();
		_3.spinner.addClass("spinner");
		if (_4.spinArrow) {
			var _10 = _3.spinner.find(".spinner-arrow");
			_10
					.append("<a href=\"javascript:void(0)\" class=\"spinner-arrow-up\" tabindex=\"-1\"></a>");
			_10
					.append("<a href=\"javascript:void(0)\" class=\"spinner-arrow-down\" tabindex=\"-1\"></a>");
		} else {
			var _11 = $(
					"<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>")
					.addClass(_4.clsLeft).appendTo(_3.spinner);
			var _12 = $(
					"<a href=\"javascript:;\" class=\"textbox-button spinner-button\"></a>")
					.addClass(_4.clsRight).appendTo(_3.spinner);
			_11.linkbutton({
				iconCls : _4.reversed ? "spinner-button-up"
						: "spinner-button-down",
				onClick : function() {
					_13(_2, !_4.reversed);
				}
			});
			_12.linkbutton({
				iconCls : _4.reversed ? "spinner-button-down"
						: "spinner-button-up",
				onClick : function() {
					_13(_2, _4.reversed);
				}
			});
			if (_4.disabled) {
				$(_2).spinner("disable");
			}
			if (_4.readonly) {
				$(_2).spinner("readonly");
			}
		}
		$(_2).spinner("resize");
	}
	;
	function _13(_14, _15) {
		var _16 = $(_14).spinner("options");
		_16.spin.call(_14, _15);
		_16[_15 ? "onSpinDown" : "onSpinUp"].call(_14);
		$(_14).spinner("validate");
	}
	;
	$.fn.spinner = function(_17, _18) {
		if (typeof _17 == "string") {
			var _19 = $.fn.spinner.methods[_17];
			if (_19) {
				return _19(this, _18);
			} else {
				return this.textbox(_17, _18);
			}
		}
		_17 = _17 || {};
		return this.each(function() {
			var _1a = $.data(this, "spinner");
			if (_1a) {
				$.extend(_1a.options, _17);
			} else {
				_1a = $.data(this, "spinner", {
					options : $.extend({}, $.fn.spinner.defaults, $.fn.spinner
							.parseOptions(this), _17)
				});
			}
			_1(this);
		});
	};
	$.fn.spinner.methods = {
		options : function(jq) {
			var _1b = jq.textbox("options");
			return $.extend($.data(jq[0], "spinner").options, {
				width : _1b.width,
				value : _1b.value,
				originalValue : _1b.originalValue,
				disabled : _1b.disabled,
				readonly : _1b.readonly
			});
		}
	};
	$.fn.spinner.parseOptions = function(_1c) {
		return $.extend({}, $.fn.textbox.parseOptions(_1c), $.parser
				.parseOptions(_1c, [ "min", "max", "spinAlign", {
					increment : "number",
					reversed : "boolean"
				} ]));
	};
	$.fn.spinner.defaults = $.extend({}, $.fn.textbox.defaults, {
		min : null,
		max : null,
		increment : 1,
		spinAlign : "right",
		reversed : false,
		spin : function(_1d) {
		},
		onSpinUp : function() {
		},
		onSpinDown : function() {
		}
	});
})(jQuery);
﻿/**
 * numberspinner
 */
(function($) {
	function _1(_2) {
		$(_2).addClass("numberspinner-f");
		var _3 = $.data(_2, "numberspinner").options;
		$(_2).numberbox($.extend({}, _3, {
			doSize : false
		})).spinner(_3);
		$(_2).numberbox("setValue", _3.value);
	}
	;
	function _4(_5, _6) {
		var _7 = $.data(_5, "numberspinner").options;
		var v = parseFloat($(_5).numberbox("getValue") || _7.value) || 0;
		if (_6) {
			v -= _7.increment;
		} else {
			v += _7.increment;
		}
		$(_5).numberbox("setValue", v);
	}
	;
	$.fn.numberspinner = function(_8, _9) {
		if (typeof _8 == "string") {
			var _a = $.fn.numberspinner.methods[_8];
			if (_a) {
				return _a(this, _9);
			} else {
				return this.numberbox(_8, _9);
			}
		}
		_8 = _8 || {};
		return this.each(function() {
			var _b = $.data(this, "numberspinner");
			if (_b) {
				$.extend(_b.options, _8);
			} else {
				$.data(this, "numberspinner", {
					options : $.extend({}, $.fn.numberspinner.defaults,
							$.fn.numberspinner.parseOptions(this), _8)
				});
			}
			_1(this);
		});
	};
	$.fn.numberspinner.methods = {
		options : function(jq) {
			var _c = jq.numberbox("options");
			return $.extend($.data(jq[0], "numberspinner").options, {
				width : _c.width,
				value : _c.value,
				originalValue : _c.originalValue,
				disabled : _c.disabled,
				readonly : _c.readonly
			});
		}
	};
	$.fn.numberspinner.parseOptions = function(_d) {
		return $.extend({}, $.fn.spinner.parseOptions(_d), $.fn.numberbox
				.parseOptions(_d), {});
	};
	$.fn.numberspinner.defaults = $.extend({}, $.fn.spinner.defaults,
			$.fn.numberbox.defaults, {
				spin : function(_e) {
					_4(this, _e);
				}
			});
})(jQuery);
﻿/**
 * timespinner
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "timespinner").options;
		$(_2).addClass("timespinner-f").spinner(_3);
		var _4 = _3.formatter.call(_2, _3.parser.call(_2, _3.value));
		$(_2).timespinner("initValue", _4);
	}
	;
	function _5(e) {
		var _6 = e.data.target;
		var _7 = $.data(_6, "timespinner").options;
		var _8 = $(_6).timespinner("getSelectionStart");
		for (var i = 0; i < _7.selections.length; i++) {
			var _9 = _7.selections[i];
			if (_8 >= _9[0] && _8 <= _9[1]) {
				_a(_6, i);
				return;
			}
		}
	}
	;
	function _a(_b, _c) {
		var _d = $.data(_b, "timespinner").options;
		if (_c != undefined) {
			_d.highlight = _c;
		}
		var _e = _d.selections[_d.highlight];
		if (_e) {
			var tb = $(_b).timespinner("textbox");
			$(_b).timespinner("setSelectionRange", {
				start : _e[0],
				end : _e[1]
			});
			tb.focus();
		}
	}
	;
	function _f(_10, _11) {
		var _12 = $.data(_10, "timespinner").options;
		var _11 = _12.parser.call(_10, _11);
		var _13 = _12.formatter.call(_10, _11);
		$(_10).spinner("setValue", _13);
	}
	;
	function _14(_15, _16) {
		var _17 = $.data(_15, "timespinner").options;
		var s = $(_15).timespinner("getValue");
		var _18 = _17.selections[_17.highlight];
		var s1 = s.substring(0, _18[0]);
		var s2 = s.substring(_18[0], _18[1]);
		var s3 = s.substring(_18[1]);
		var v = s1 + ((parseInt(s2, 10) || 0) + _17.increment * (_16 ? -1 : 1))
				+ s3;
		$(_15).timespinner("setValue", v);
		_a(_15);
	}
	;
	$.fn.timespinner = function(_19, _1a) {
		if (typeof _19 == "string") {
			var _1b = $.fn.timespinner.methods[_19];
			if (_1b) {
				return _1b(this, _1a);
			} else {
				return this.spinner(_19, _1a);
			}
		}
		_19 = _19 || {};
		return this.each(function() {
			var _1c = $.data(this, "timespinner");
			if (_1c) {
				$.extend(_1c.options, _19);
			} else {
				$.data(this, "timespinner", {
					options : $.extend({}, $.fn.timespinner.defaults,
							$.fn.timespinner.parseOptions(this), _19)
				});
			}
			_1(this);
		});
	};
	$.fn.timespinner.methods = {
		options : function(jq) {
			var _1d = jq.data("spinner") ? jq.spinner("options") : {};
			return $.extend($.data(jq[0], "timespinner").options, {
				width : _1d.width,
				value : _1d.value,
				originalValue : _1d.originalValue,
				disabled : _1d.disabled,
				readonly : _1d.readonly
			});
		},
		setValue : function(jq, _1e) {
			return jq.each(function() {
				_f(this, _1e);
			});
		},
		getHours : function(jq) {
			var _1f = $.data(jq[0], "timespinner").options;
			var vv = jq.timespinner("getValue").split(_1f.separator);
			return parseInt(vv[0], 10);
		},
		getMinutes : function(jq) {
			var _20 = $.data(jq[0], "timespinner").options;
			var vv = jq.timespinner("getValue").split(_20.separator);
			return parseInt(vv[1], 10);
		},
		getSeconds : function(jq) {
			var _21 = $.data(jq[0], "timespinner").options;
			var vv = jq.timespinner("getValue").split(_21.separator);
			return parseInt(vv[2], 10) || 0;
		}
	};
	$.fn.timespinner.parseOptions = function(_22) {
		return $.extend({}, $.fn.spinner.parseOptions(_22), $.parser
				.parseOptions(_22, [ "separator", {
					showSeconds : "boolean",
					highlight : "number"
				} ]));
	};
	$.fn.timespinner.defaults = $.extend({}, $.fn.spinner.defaults, {
		inputEvents : $.extend({}, $.fn.spinner.defaults.inputEvents, {
			click : function(e) {
				_5.call(this, e);
			},
			blur : function(e) {
				var t = $(e.data.target);
				t.timespinner("setValue", t.timespinner("getText"));
			},
			keydown : function(e) {
				if (e.keyCode == 13) {
					var t = $(e.data.target);
					t.timespinner("setValue", t.timespinner("getText"));
				}
			}
		}),
		formatter : function(_23) {
			if (!_23) {
				return "";
			}
			var _24 = $(this).timespinner("options");
			var tt = [ _25(_23.getHours()), _25(_23.getMinutes()) ];
			if (_24.showSeconds) {
				tt.push(_25(_23.getSeconds()));
			}
			return tt.join(_24.separator);
			function _25(_26) {
				return (_26 < 10 ? "0" : "") + _26;
			}
			;
		},
		parser : function(s) {
			var _27 = $(this).timespinner("options");
			var _28 = _29(s);
			if (_28) {
				var min = _29(_27.min);
				var max = _29(_27.max);
				if (min && min > _28) {
					_28 = min;
				}
				if (max && max < _28) {
					_28 = max;
				}
			}
			return _28;
			function _29(s) {
				if (!s) {
					return null;
				}
				var tt = s.split(_27.separator);
				return new Date(1900, 0, 0, parseInt(tt[0], 10) || 0, parseInt(
						tt[1], 10) || 0, parseInt(tt[2], 10) || 0);
			}
			;
		},
		selections : [ [ 0, 2 ], [ 3, 5 ], [ 6, 8 ] ],
		separator : ":",
		showSeconds : false,
		highlight : 0,
		spin : function(_2a) {
			_14(this, _2a);
		}
	});
})(jQuery);
﻿/**
 * datetimespinner
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "datetimespinner").options;
		$(_2).addClass("datetimespinner-f").timespinner(_3);
	}
	;
	$.fn.datetimespinner = function(_4, _5) {
		if (typeof _4 == "string") {
			var _6 = $.fn.datetimespinner.methods[_4];
			if (_6) {
				return _6(this, _5);
			} else {
				return this.timespinner(_4, _5);
			}
		}
		_4 = _4 || {};
		return this.each(function() {
			var _7 = $.data(this, "datetimespinner");
			if (_7) {
				$.extend(_7.options, _4);
			} else {
				$.data(this, "datetimespinner", {
					options : $.extend({}, $.fn.datetimespinner.defaults,
							$.fn.datetimespinner.parseOptions(this), _4)
				});
			}
			_1(this);
		});
	};
	$.fn.datetimespinner.methods = {
		options : function(jq) {
			var _8 = jq.timespinner("options");
			return $.extend($.data(jq[0], "datetimespinner").options, {
				width : _8.width,
				value : _8.value,
				originalValue : _8.originalValue,
				disabled : _8.disabled,
				readonly : _8.readonly
			});
		}
	};
	$.fn.datetimespinner.parseOptions = function(_9) {
		return $.extend({}, $.fn.timespinner.parseOptions(_9), $.parser
				.parseOptions(_9, []));
	};
	$.fn.datetimespinner.defaults = $.extend({}, $.fn.timespinner.defaults, {
		formatter : function(_a) {
			if (!_a) {
				return "";
			}
			return $.fn.datebox.defaults.formatter.call(this, _a) + " "
					+ $.fn.timespinner.defaults.formatter.call(this, _a);
		},
		parser : function(s) {
			s = $.trim(s);
			if (!s) {
				return null;
			}
			var dt = s.split(" ");
			var _b = $.fn.datebox.defaults.parser.call(this, dt[0]);
			if (dt.length < 2) {
				return _b;
			}
			var _c = $.fn.timespinner.defaults.parser.call(this, dt[1]);
			return new Date(_b.getFullYear(), _b.getMonth(), _b.getDate(), _c
					.getHours(), _c.getMinutes(), _c.getSeconds());
		},
		selections : [ [ 0, 2 ], [ 3, 5 ], [ 6, 10 ], [ 11, 13 ], [ 14, 16 ],
				[ 17, 19 ] ]
	});
})(jQuery);
﻿/**
 * datagrid
 */
(function($){
var _1=0;
function _2(a,o){
return $.nestui.indexOfArray(a,o);
};
function _3(a,o,id){
$.nestui.removeArrayItem(a,o,id);
};
function _4(a,o,r){
$.nestui.addArrayItem(a,o,r);
};
function _5(_6,aa){
return $.data(_6,"treegrid")?aa.slice(1):aa;
};
function _7(_8){
var _9=$.data(_8,"datagrid");
var _a=_9.options;
var _b=_9.panel;
var dc=_9.dc;
var ss=null;
if(_a.sharedStyleSheet){
ss=typeof _a.sharedStyleSheet=="boolean"?"head":_a.sharedStyleSheet;
}else{
ss=_b.closest("div.datagrid-view");
if(!ss.length){
ss=dc.view;
}
}
var cc=$(ss);
var _c=$.data(cc[0],"ss");
if(!_c){
_c=$.data(cc[0],"ss",{cache:{},dirty:[]});
}
return {add:function(_d){
var ss=["<style type=\"text/css\" nestui=\"true\">"];
for(var i=0;i<_d.length;i++){
_c.cache[_d[i][0]]={width:_d[i][1]};
}
var _e=0;
for(var s in _c.cache){
var _f=_c.cache[s];
_f.index=_e++;
ss.push(s+"{width:"+_f.width+"}");
}
ss.push("</style>");
$(ss.join("\n")).appendTo(cc);
cc.children("style[nestui]:not(:last)").remove();
},getRule:function(_10){
var _11=cc.children("style[nestui]:last")[0];
var _12=_11.styleSheet?_11.styleSheet:(_11.sheet||document.styleSheets[document.styleSheets.length-1]);
var _13=_12.cssRules||_12.rules;
return _13[_10];
},set:function(_14,_15){
var _16=_c.cache[_14];
if(_16){
_16.width=_15;
var _17=this.getRule(_16.index);
if(_17){
_17.style["width"]=_15;
}
}
},remove:function(_18){
var tmp=[];
for(var s in _c.cache){
if(s.indexOf(_18)==-1){
tmp.push([s,_c.cache[s].width]);
}
}
_c.cache={};
this.add(tmp);
},dirty:function(_19){
if(_19){
_c.dirty.push(_19);
}
},clean:function(){
for(var i=0;i<_c.dirty.length;i++){
this.remove(_c.dirty[i]);
}
_c.dirty=[];
}};
};
function _1a(_1b,_1c){
var _1d=$.data(_1b,"datagrid");
var _1e=_1d.options;
var _1f=_1d.panel;
if(_1c){
$.extend(_1e,_1c);
}
if(_1e.fit==true){
var p=_1f.panel("panel").parent();
_1e.width=p.width();
_1e.height=p.height();
}
_1f.panel("resize",_1e);
};
function _20(_21){
var _22=$.data(_21,"datagrid");
var _23=_22.options;
var dc=_22.dc;
var _24=_22.panel;
var _25=_24.width();
var _26=_24.height();
var _27=dc.view;
var _28=dc.view1;
var _29=dc.view2;
var _2a=_28.children("div.datagrid-header");
var _2b=_29.children("div.datagrid-header");
var _2c=_2a.find("table");
var _2d=_2b.find("table");
_27.width(_25);
var _2e=_2a.children("div.datagrid-header-inner").show();
_28.width(_2e.find("table").width());
if(!_23.showHeader){
_2e.hide();
}
_29.width(_25-_28._outerWidth());
_28.children()._outerWidth(_28.width());
_29.children()._outerWidth(_29.width());
var all=_2a.add(_2b).add(_2c).add(_2d);
all.css("height","");
var hh=Math.max(_2c.height(),_2d.height());
all._outerHeight(hh);
_27.children(".datagrid-empty").css("top",hh+"px");
dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({position:"absolute",top:dc.header2._outerHeight()});
var _2f=dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
var _30=_2f+_2b._outerHeight()+_29.children(".datagrid-footer")._outerHeight();
_24.children(":not(.datagrid-view,.datagrid-mask,.datagrid-mask-msg)").each(function(){
_30+=$(this)._outerHeight();
});
var _31=_24.outerHeight()-_24.height();
var _32=_24._size("minHeight")||"";
var _33=_24._size("maxHeight")||"";
_28.add(_29).children("div.datagrid-body").css({marginTop:_2f,height:(isNaN(parseInt(_23.height))?"":(_26-_30)),minHeight:(_32?_32-_31-_30:""),maxHeight:(_33?_33-_31-_30:"")});
_27.height(_29.height());
};
function _34(_35,_36,_37){
var _38=$.data(_35,"datagrid").data.rows;
var _39=$.data(_35,"datagrid").options;
var dc=$.data(_35,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!_39.nowrap||_39.autoRowHeight||_37)){
if(_36!=undefined){
var tr1=_39.finder.getTr(_35,_36,"body",1);
var tr2=_39.finder.getTr(_35,_36,"body",2);
_3a(tr1,tr2);
}else{
var tr1=_39.finder.getTr(_35,0,"allbody",1);
var tr2=_39.finder.getTr(_35,0,"allbody",2);
_3a(tr1,tr2);
if(_39.showFooter){
var tr1=_39.finder.getTr(_35,0,"allfooter",1);
var tr2=_39.finder.getTr(_35,0,"allfooter",2);
_3a(tr1,tr2);
}
}
}
_20(_35);
if(_39.height=="auto"){
var _3b=dc.body1.parent();
var _3c=dc.body2;
var _3d=_3e(_3c);
var _3f=_3d.height;
if(_3d.width>_3c.width()){
_3f+=18;
}
_3f-=parseInt(_3c.css("marginTop"))||0;
_3b.height(_3f);
_3c.height(_3f);
dc.view.height(dc.view2.height());
}
dc.body2.triggerHandler("scroll");
function _3a(_40,_41){
for(var i=0;i<_41.length;i++){
var tr1=$(_40[i]);
var tr2=$(_41[i]);
tr1.css("height","");
tr2.css("height","");
var _42=Math.max(tr1.height(),tr2.height());
tr1.css("height",_42);
tr2.css("height",_42);
}
};
function _3e(cc){
var _43=0;
var _44=0;
$(cc).children().each(function(){
var c=$(this);
if(c.is(":visible")){
_44+=c._outerHeight();
if(_43<c._outerWidth()){
_43=c._outerWidth();
}
}
});
return {width:_43,height:_44};
};
};
function _45(_46,_47){
var _48=$.data(_46,"datagrid");
var _49=_48.options;
var dc=_48.dc;
if(!dc.body2.children("table.datagrid-btable-frozen").length){
dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
}
_4a(true);
_4a(false);
_20(_46);
function _4a(_4b){
var _4c=_4b?1:2;
var tr=_49.finder.getTr(_46,_47,"body",_4c);
(_4b?dc.body1:dc.body2).children("table.datagrid-btable-frozen").append(tr);
};
};
function _4d(_4e,_4f){
function _50(){
var _51=[];
var _52=[];
$(_4e).children("thead").each(function(){
var opt=$.parser.parseOptions(this,[{frozen:"boolean"}]);
$(this).find("tr").each(function(){
var _53=[];
$(this).find("th").each(function(){
var th=$(this);
var col=$.extend({},$.parser.parseOptions(this,["id","field","align","halign","order","width",{sortable:"boolean",checkbox:"boolean",resizable:"boolean",fixed:"boolean"},{rowspan:"number",colspan:"number"}]),{title:(th.html()||undefined),hidden:(th.attr("hidden")?true:undefined),formatter:(th.attr("formatter")?eval(th.attr("formatter")):undefined),styler:(th.attr("styler")?eval(th.attr("styler")):undefined),sorter:(th.attr("sorter")?eval(th.attr("sorter")):undefined)});
if(col.width&&String(col.width).indexOf("%")==-1){
col.width=parseInt(col.width);
}
if(th.attr("editor")){
var s=$.trim(th.attr("editor"));
if(s.substr(0,1)=="{"){
col.editor=eval("("+s+")");
}else{
col.editor=s;
}
}
_53.push(col);
});
opt.frozen?_51.push(_53):_52.push(_53);
});
});
return [_51,_52];
};
var _54=$("<div class=\"datagrid-wrap\">"+"<div class=\"datagrid-view\">"+"<div class=\"datagrid-view1\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\">"+"<div class=\"datagrid-body-inner\"></div>"+"</div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"<div class=\"datagrid-view2\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\"></div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"</div>"+"</div>").insertAfter(_4e);
_54.panel({doSize:false,cls:"datagrid"});
$(_4e).addClass("datagrid-f").hide().appendTo(_54.children("div.datagrid-view"));
var cc=_50();
var _55=_54.children("div.datagrid-view");
var _56=_55.children("div.datagrid-view1");
var _57=_55.children("div.datagrid-view2");
return {panel:_54,frozenColumns:cc[0],columns:cc[1],dc:{view:_55,view1:_56,view2:_57,header1:_56.children("div.datagrid-header").children("div.datagrid-header-inner"),header2:_57.children("div.datagrid-header").children("div.datagrid-header-inner"),body1:_56.children("div.datagrid-body").children("div.datagrid-body-inner"),body2:_57.children("div.datagrid-body"),footer1:_56.children("div.datagrid-footer").children("div.datagrid-footer-inner"),footer2:_57.children("div.datagrid-footer").children("div.datagrid-footer-inner")}};
};
function _58(_59){
var _5a=$.data(_59,"datagrid");
var _5b=_5a.options;
var dc=_5a.dc;
var _5c=_5a.panel;
_5a.ss=$(_59).datagrid("createStyleSheet");
_5c.panel($.extend({},_5b,{id:null,doSize:false,onResize:function(_5d,_5e){
if($.data(_59,"datagrid")){
_20(_59);
$(_59).datagrid("fitColumns");
_5b.onResize.call(_5c,_5d,_5e);
}
},onExpand:function(){
if($.data(_59,"datagrid")){
$(_59).datagrid("fixRowHeight").datagrid("fitColumns");
_5b.onExpand.call(_5c);
}
}}));
_5a.rowIdPrefix="datagrid-row-r"+(++_1);
_5a.cellClassPrefix="datagrid-cell-c"+_1;
_5f(dc.header1,_5b.frozenColumns,true);
_5f(dc.header2,_5b.columns,false);
_60();
dc.header1.add(dc.header2).css("display",_5b.showHeader?"block":"none");
dc.footer1.add(dc.footer2).css("display",_5b.showFooter?"block":"none");
if(_5b.toolbar){
if($.isArray(_5b.toolbar)){
$("div.datagrid-toolbar",_5c).remove();
var tb=$("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_5c);
var tr=tb.find("tr");
for(var i=0;i<_5b.toolbar.length;i++){
var btn=_5b.toolbar[i];
if(btn=="-"){
$("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var _61=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
_61[0].onclick=eval(btn.handler||function(){
});
_61.linkbutton($.extend({},btn,{plain:true}));
}
}
}else{
$(_5b.toolbar).addClass("datagrid-toolbar").prependTo(_5c);
$(_5b.toolbar).show();
}
}else{
$("div.datagrid-toolbar",_5c).remove();
}
$("div.datagrid-pager",_5c).remove();
if(_5b.pagination){
var _62=$("<div class=\"datagrid-pager\"></div>");
if(_5b.pagePosition=="bottom"){
_62.appendTo(_5c);
}else{
if(_5b.pagePosition=="top"){
_62.addClass("datagrid-pager-top").prependTo(_5c);
}else{
var _63=$("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(_5c);
_62.appendTo(_5c);
_62=_62.add(_63);
}
}
_62.pagination({total:(_5b.pageNumber*_5b.pageSize),pageNumber:_5b.pageNumber,pageSize:_5b.pageSize,pageList:_5b.pageList,onSelectPage:function(_64,_65){
_5b.pageNumber=_64||1;
_5b.pageSize=_65;
_62.pagination("refresh",{pageNumber:_64,pageSize:_65});
_bf(_59);
}});
_5b.pageSize=_62.pagination("options").pageSize;
}
function _5f(_66,_67,_68){
if(!_67){
return;
}
$(_66).show();
$(_66).empty();
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-99999px\"></div>").appendTo("body");
tmp._outerWidth(99);
var _69=100-parseInt(tmp[0].style.width);
tmp.remove();
var _6a=[];
var _6b=[];
var _6c=[];
if(_5b.sortName){
_6a=_5b.sortName.split(",");
_6b=_5b.sortOrder.split(",");
}
var t=$("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(_66);
for(var i=0;i<_67.length;i++){
var tr=$("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody",t));
var _6d=_67[i];
for(var j=0;j<_6d.length;j++){
var col=_6d[j];
var _6e="";
if(col.rowspan){
_6e+="rowspan=\""+col.rowspan+"\" ";
}
if(col.colspan){
_6e+="colspan=\""+col.colspan+"\" ";
if(!col.id){
col.id=["datagrid-td-group"+_1,i,j].join("-");
}
}
if(col.id){
_6e+="id=\""+col.id+"\"";
}
var td=$("<td "+_6e+"></td>").appendTo(tr);
if(col.checkbox){
td.attr("field",col.field);
$("<div class=\"datagrid-header-check\"></div>").html("<input type=\"checkbox\"/>").appendTo(td);
}else{
if(col.field){
td.attr("field",col.field);
td.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
td.find("span:first").html(col.title);
var _6f=td.find("div.datagrid-cell");
var pos=_2(_6a,col.field);
if(pos>=0){
_6f.addClass("datagrid-sort-"+_6b[pos]);
}
if(col.sortable){
_6f.addClass("datagrid-sort");
}
if(col.resizable==false){
_6f.attr("resizable","false");
}
if(col.width){
var _70=$.parser.parseValue("width",col.width,dc.view,_5b.scrollbarSize+(_5b.rownumbers?_5b.rownumberWidth:0));
col.deltaWidth=_69;
col.boxWidth=_70-_69;
}else{
col.auto=true;
}
_6f.css("text-align",(col.halign||col.align||""));
col.cellClass=_5a.cellClassPrefix+"-"+col.field.replace(/[\.|\s]/g,"-");
_6f.addClass(col.cellClass);
}else{
$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
}
}
if(col.hidden){
td.hide();
_6c.push(col.field);
}
}
}
if(_68&&_5b.rownumbers){
var td=$("<td rowspan=\""+_5b.frozenColumns.length+"\"><div class=\"datagrid-header-rownumber\"></div></td>");
if($("tr",t).length==0){
td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody",t));
}else{
td.prependTo($("tr:first",t));
}
}
for(var i=0;i<_6c.length;i++){
_c1(_59,_6c[i],-1);
}
};
function _60(){
var _71=[[".datagrid-header-rownumber",(_5b.rownumberWidth-1)+"px"],[".datagrid-cell-rownumber",(_5b.rownumberWidth-1)+"px"]];
var _72=_73(_59,true).concat(_73(_59));
for(var i=0;i<_72.length;i++){
var col=_74(_59,_72[i]);
if(col&&!col.checkbox){
_71.push(["."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto"]);
}
}
_5a.ss.add(_71);
_5a.ss.dirty(_5a.cellSelectorPrefix);
_5a.cellSelectorPrefix="."+_5a.cellClassPrefix;
};
};
function _75(_76){
var _77=$.data(_76,"datagrid");
var _78=_77.panel;
var _79=_77.options;
var dc=_77.dc;
var _7a=dc.header1.add(dc.header2);
_7a.unbind(".datagrid");
for(var _7b in _79.headerEvents){
_7a.bind(_7b+".datagrid",_79.headerEvents[_7b]);
}
var _7c=_7a.find("div.datagrid-cell");
var _7d=_79.resizeHandle=="right"?"e":(_79.resizeHandle=="left"?"w":"e,w");
_7c.each(function(){
$(this).resizable({handles:_7d,disabled:($(this).attr("resizable")?$(this).attr("resizable")=="false":false),minWidth:25,onStartResize:function(e){
_77.resizing=true;
_7a.css("cursor",$("body").css("cursor"));
if(!_77.proxy){
_77.proxy=$("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
}
_77.proxy.css({left:e.pageX-$(_78).offset().left-1,display:"none"});
setTimeout(function(){
if(_77.proxy){
_77.proxy.show();
}
},500);
},onResize:function(e){
_77.proxy.css({left:e.pageX-$(_78).offset().left-1,display:"block"});
return false;
},onStopResize:function(e){
_7a.css("cursor","");
$(this).css("height","");
var _7e=$(this).parent().attr("field");
var col=_74(_76,_7e);
col.width=$(this)._outerWidth();
col.boxWidth=col.width-col.deltaWidth;
col.auto=undefined;
$(this).css("width","");
$(_76).datagrid("fixColumnSize",_7e);
_77.proxy.remove();
_77.proxy=null;
if($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")){
_20(_76);
}
$(_76).datagrid("fitColumns");
_79.onResizeColumn.call(_76,_7e,col.width);
setTimeout(function(){
_77.resizing=false;
},0);
}});
});
var bb=dc.body1.add(dc.body2);
bb.unbind();
for(var _7b in _79.rowEvents){
bb.bind(_7b,_79.rowEvents[_7b]);
}
dc.body1.bind("mousewheel DOMMouseScroll",function(e){
e.preventDefault();
var e1=e.originalEvent||window.event;
var _7f=e1.wheelDelta||e1.detail*(-1);
if("deltaY" in e1){
_7f=e1.deltaY*-1;
}
var dg=$(e.target).closest("div.datagrid-view").children(".datagrid-f");
var dc=dg.data("datagrid").dc;
dc.body2.scrollTop(dc.body2.scrollTop()-_7f);
});
dc.body2.bind("scroll",function(){
var b1=dc.view1.children("div.datagrid-body");
b1.scrollTop($(this).scrollTop());
var c1=dc.body1.children(":first");
var c2=dc.body2.children(":first");
if(c1.length&&c2.length){
var _80=c1.offset().top;
var _81=c2.offset().top;
if(_80!=_81){
b1.scrollTop(b1.scrollTop()+_80-_81);
}
}
dc.view2.children("div.datagrid-header,div.datagrid-footer")._scrollLeft($(this)._scrollLeft());
dc.body2.children("table.datagrid-btable-frozen").css("left",-$(this)._scrollLeft());
});
};
function _82(_83){
return function(e){
var td=$(e.target).closest("td[field]");
if(td.length){
var _84=_85(td);
if(!$(_84).data("datagrid").resizing&&_83){
td.addClass("datagrid-header-over");
}else{
td.removeClass("datagrid-header-over");
}
}
};
};
function _86(e){
var _87=_85(e.target);
var _88=$(_87).datagrid("options");
var ck=$(e.target).closest("input[type=checkbox]");
if(ck.length){
if(_88.singleSelect&&_88.selectOnCheck){
return false;
}
if(ck.is(":checked")){
_89(_87);
}else{
_8a(_87);
}
e.stopPropagation();
}else{
var _8b=$(e.target).closest(".datagrid-cell");
if(_8b.length){
var p1=_8b.offset().left+5;
var p2=_8b.offset().left+_8b._outerWidth()-5;
if(e.pageX<p2&&e.pageX>p1){
_8c(_87,_8b.parent().attr("field"));
}
}
}
};
function _8d(e){
var _8e=_85(e.target);
var _8f=$(_8e).datagrid("options");
var _90=$(e.target).closest(".datagrid-cell");
if(_90.length){
var p1=_90.offset().left+5;
var p2=_90.offset().left+_90._outerWidth()-5;
var _91=_8f.resizeHandle=="right"?(e.pageX>p2):(_8f.resizeHandle=="left"?(e.pageX<p1):(e.pageX<p1||e.pageX>p2));
if(_91){
var _92=_90.parent().attr("field");
var col=_74(_8e,_92);
if(col.resizable==false){
return;
}
$(_8e).datagrid("autoSizeColumn",_92);
col.auto=false;
}
}
};
function _93(e){
var _94=_85(e.target);
var _95=$(_94).datagrid("options");
var td=$(e.target).closest("td[field]");
_95.onHeaderContextMenu.call(_94,e,td.attr("field"));
};
function _96(_97){
return function(e){
var tr=_98(e.target);
if(!tr){
return;
}
var _99=_85(tr);
if($.data(_99,"datagrid").resizing){
return;
}
var _9a=_9b(tr);
if(_97){
_9c(_99,_9a);
}else{
var _9d=$.data(_99,"datagrid").options;
_9d.finder.getTr(_99,_9a).removeClass("datagrid-row-over");
}
};
};
function _9e(e){
var tr=_98(e.target);
if(!tr){
return;
}
var _9f=_85(tr);
var _a0=$.data(_9f,"datagrid").options;
var _a1=_9b(tr);
var tt=$(e.target);
if(tt.parent().hasClass("datagrid-cell-check")){
if(_a0.singleSelect&&_a0.selectOnCheck){
tt._propAttr("checked",!tt.is(":checked"));
_a2(_9f,_a1);
}else{
if(tt.is(":checked")){
tt._propAttr("checked",false);
_a2(_9f,_a1);
}else{
tt._propAttr("checked",true);
_a3(_9f,_a1);
}
}
}else{
var row=_a0.finder.getRow(_9f,_a1);
var td=tt.closest("td[field]",tr);
if(td.length){
var _a4=td.attr("field");
_a0.onClickCell.call(_9f,_a1,_a4,row[_a4]);
}
if(_a0.singleSelect==true){
_a5(_9f,_a1);
}else{
if(_a0.ctrlSelect){
if(e.ctrlKey){
if(tr.hasClass("datagrid-row-selected")){
_a6(_9f,_a1);
}else{
_a5(_9f,_a1);
}
}else{
if(e.shiftKey){
$(_9f).datagrid("clearSelections");
var _a7=Math.min(_a0.lastSelectedIndex||0,_a1);
var _a8=Math.max(_a0.lastSelectedIndex||0,_a1);
for(var i=_a7;i<=_a8;i++){
_a5(_9f,i);
}
}else{
$(_9f).datagrid("clearSelections");
_a5(_9f,_a1);
_a0.lastSelectedIndex=_a1;
}
}
}else{
if(tr.hasClass("datagrid-row-selected")){
_a6(_9f,_a1);
}else{
_a5(_9f,_a1);
}
}
}
_a0.onClickRow.apply(_9f,_5(_9f,[_a1,row]));
}
};
function _a9(e){
var tr=_98(e.target);
if(!tr){
return;
}
var _aa=_85(tr);
var _ab=$.data(_aa,"datagrid").options;
var _ac=_9b(tr);
var row=_ab.finder.getRow(_aa,_ac);
var td=$(e.target).closest("td[field]",tr);
if(td.length){
var _ad=td.attr("field");
_ab.onDblClickCell.call(_aa,_ac,_ad,row[_ad]);
}
_ab.onDblClickRow.apply(_aa,_5(_aa,[_ac,row]));
};
function _ae(e){
var tr=_98(e.target);
if(tr){
var _af=_85(tr);
var _b0=$.data(_af,"datagrid").options;
var _b1=_9b(tr);
var row=_b0.finder.getRow(_af,_b1);
_b0.onRowContextMenu.call(_af,e,_b1,row);
}else{
var _b2=_98(e.target,".datagrid-body");
if(_b2){
var _af=_85(_b2);
var _b0=$.data(_af,"datagrid").options;
_b0.onRowContextMenu.call(_af,e,-1,null);
}
}
};
function _85(t){
return $(t).closest("div.datagrid-view").children(".datagrid-f")[0];
};
function _98(t,_b3){
var tr=$(t).closest(_b3||"tr.datagrid-row");
if(tr.length&&tr.parent().length){
return tr;
}else{
return undefined;
}
};
function _9b(tr){
if(tr.attr("datagrid-row-index")){
return parseInt(tr.attr("datagrid-row-index"));
}else{
return tr.attr("node-id");
}
};
function _8c(_b4,_b5){
var _b6=$.data(_b4,"datagrid");
var _b7=_b6.options;
_b5=_b5||{};
var _b8={sortName:_b7.sortName,sortOrder:_b7.sortOrder};
if(typeof _b5=="object"){
$.extend(_b8,_b5);
}
var _b9=[];
var _ba=[];
if(_b8.sortName){
_b9=_b8.sortName.split(",");
_ba=_b8.sortOrder.split(",");
}
if(typeof _b5=="string"){
var _bb=_b5;
var col=_74(_b4,_bb);
if(!col.sortable||_b6.resizing){
return;
}
var _bc=col.order||"asc";
var pos=_2(_b9,_bb);
if(pos>=0){
var _bd=_ba[pos]=="asc"?"desc":"asc";
if(_b7.multiSort&&_bd==_bc){
_b9.splice(pos,1);
_ba.splice(pos,1);
}else{
_ba[pos]=_bd;
}
}else{
if(_b7.multiSort){
_b9.push(_bb);
_ba.push(_bc);
}else{
_b9=[_bb];
_ba=[_bc];
}
}
_b8.sortName=_b9.join(",");
_b8.sortOrder=_ba.join(",");
}
if(_b7.onBeforeSortColumn.call(_b4,_b8.sortName,_b8.sortOrder)==false){
return;
}
$.extend(_b7,_b8);
var dc=_b6.dc;
var _be=dc.header1.add(dc.header2);
_be.find("div.datagrid-cell").removeClass("datagrid-sort-asc datagrid-sort-desc");
for(var i=0;i<_b9.length;i++){
var col=_74(_b4,_b9[i]);
_be.find("div."+col.cellClass).addClass("datagrid-sort-"+_ba[i]);
}
if(_b7.remoteSort){
_bf(_b4);
}else{
_c0(_b4,$(_b4).datagrid("getData"));
}
_b7.onSortColumn.call(_b4,_b7.sortName,_b7.sortOrder);
};
function _c1(_c2,_c3,_c4){
_c5(true);
_c5(false);
function _c5(_c6){
var aa=_c7(_c2,_c6);
if(aa.length){
var _c8=aa[aa.length-1];
var _c9=_2(_c8,_c3);
if(_c9>=0){
for(var _ca=0;_ca<aa.length-1;_ca++){
var td=$("#"+aa[_ca][_c9]);
var _cb=parseInt(td.attr("colspan")||1)+(_c4||0);
td.attr("colspan",_cb);
if(_cb){
td.show();
}else{
td.hide();
}
}
}
}
};
};
function _cc(_cd){
var _ce=$.data(_cd,"datagrid");
var _cf=_ce.options;
var dc=_ce.dc;
var _d0=dc.view2.children("div.datagrid-header");
dc.body2.css("overflow-x","");
_d1();
_d2();
_d3();
_d1(true);
if(_d0.width()>=_d0.find("table").width()){
dc.body2.css("overflow-x","hidden");
}
function _d3(){
if(!_cf.fitColumns){
return;
}
if(!_ce.leftWidth){
_ce.leftWidth=0;
}
var _d4=0;
var cc=[];
var _d5=_73(_cd,false);
for(var i=0;i<_d5.length;i++){
var col=_74(_cd,_d5[i]);
if(_d6(col)){
_d4+=col.width;
cc.push({field:col.field,col:col,addingWidth:0});
}
}
if(!_d4){
return;
}
cc[cc.length-1].addingWidth-=_ce.leftWidth;
var _d7=_d0.children("div.datagrid-header-inner").show();
var _d8=_d0.width()-_d0.find("table").width()-_cf.scrollbarSize+_ce.leftWidth;
var _d9=_d8/_d4;
if(!_cf.showHeader){
_d7.hide();
}
for(var i=0;i<cc.length;i++){
var c=cc[i];
var _da=parseInt(c.col.width*_d9);
c.addingWidth+=_da;
_d8-=_da;
}
cc[cc.length-1].addingWidth+=_d8;
for(var i=0;i<cc.length;i++){
var c=cc[i];
if(c.col.boxWidth+c.addingWidth>0){
c.col.boxWidth+=c.addingWidth;
c.col.width+=c.addingWidth;
}
}
_ce.leftWidth=_d8;
$(_cd).datagrid("fixColumnSize");
};
function _d2(){
var _db=false;
var _dc=_73(_cd,true).concat(_73(_cd,false));
$.map(_dc,function(_dd){
var col=_74(_cd,_dd);
if(String(col.width||"").indexOf("%")>=0){
var _de=$.parser.parseValue("width",col.width,dc.view,_cf.scrollbarSize+(_cf.rownumbers?_cf.rownumberWidth:0))-col.deltaWidth;
if(_de>0){
col.boxWidth=_de;
_db=true;
}
}
});
if(_db){
$(_cd).datagrid("fixColumnSize");
}
};
function _d1(fit){
var _df=dc.header1.add(dc.header2).find(".datagrid-cell-group");
if(_df.length){
_df.each(function(){
$(this)._outerWidth(fit?$(this).parent().width():10);
});
if(fit){
_20(_cd);
}
}
};
function _d6(col){
if(String(col.width||"").indexOf("%")>=0){
return false;
}
if(!col.hidden&&!col.checkbox&&!col.auto&&!col.fixed){
return true;
}
};
};
function _e0(_e1,_e2){
var _e3=$.data(_e1,"datagrid");
var _e4=_e3.options;
var dc=_e3.dc;
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-9999px\"></div>").appendTo("body");
if(_e2){
_1a(_e2);
$(_e1).datagrid("fitColumns");
}else{
var _e5=false;
var _e6=_73(_e1,true).concat(_73(_e1,false));
for(var i=0;i<_e6.length;i++){
var _e2=_e6[i];
var col=_74(_e1,_e2);
if(col.auto){
_1a(_e2);
_e5=true;
}
}
if(_e5){
$(_e1).datagrid("fitColumns");
}
}
tmp.remove();
function _1a(_e7){
var _e8=dc.view.find("div.datagrid-header td[field=\""+_e7+"\"] div.datagrid-cell");
_e8.css("width","");
var col=$(_e1).datagrid("getColumnOption",_e7);
col.width=undefined;
col.boxWidth=undefined;
col.auto=true;
$(_e1).datagrid("fixColumnSize",_e7);
var _e9=Math.max(_ea("header"),_ea("allbody"),_ea("allfooter"))+1;
_e8._outerWidth(_e9-1);
col.width=_e9;
col.boxWidth=parseInt(_e8[0].style.width);
col.deltaWidth=_e9-col.boxWidth;
_e8.css("width","");
$(_e1).datagrid("fixColumnSize",_e7);
_e4.onResizeColumn.call(_e1,_e7,col.width);
function _ea(_eb){
var _ec=0;
if(_eb=="header"){
_ec=_ed(_e8);
}else{
_e4.finder.getTr(_e1,0,_eb).find("td[field=\""+_e7+"\"] div.datagrid-cell").each(function(){
var w=_ed($(this));
if(_ec<w){
_ec=w;
}
});
}
return _ec;
function _ed(_ee){
return _ee.is(":visible")?_ee._outerWidth():tmp.html(_ee.html())._outerWidth();
};
};
};
};
function _ef(_f0,_f1){
var _f2=$.data(_f0,"datagrid");
var _f3=_f2.options;
var dc=_f2.dc;
var _f4=dc.view.find("table.datagrid-btable,table.datagrid-ftable");
_f4.css("table-layout","fixed");
if(_f1){
fix(_f1);
}else{
var ff=_73(_f0,true).concat(_73(_f0,false));
for(var i=0;i<ff.length;i++){
fix(ff[i]);
}
}
_f4.css("table-layout","");
_f5(_f0);
_34(_f0);
_f6(_f0);
function fix(_f7){
var col=_74(_f0,_f7);
if(col.cellClass){
_f2.ss.set("."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto");
}
};
};
function _f5(_f8,tds){
var dc=$.data(_f8,"datagrid").dc;
tds=tds||dc.view.find("td.datagrid-td-merged");
tds.each(function(){
var td=$(this);
var _f9=td.attr("colspan")||1;
if(_f9>1){
var col=_74(_f8,td.attr("field"));
var _fa=col.boxWidth+col.deltaWidth-1;
for(var i=1;i<_f9;i++){
td=td.next();
col=_74(_f8,td.attr("field"));
_fa+=col.boxWidth+col.deltaWidth;
}
$(this).children("div.datagrid-cell")._outerWidth(_fa);
}
});
};
function _f6(_fb){
var dc=$.data(_fb,"datagrid").dc;
dc.view.find("div.datagrid-editable").each(function(){
var _fc=$(this);
var _fd=_fc.parent().attr("field");
var col=$(_fb).datagrid("getColumnOption",_fd);
_fc._outerWidth(col.boxWidth+col.deltaWidth-1);
var ed=$.data(this,"datagrid.editor");
if(ed.actions.resize){
ed.actions.resize(ed.target,_fc.width());
}
});
};
function _74(_fe,_ff){
function find(_100){
if(_100){
for(var i=0;i<_100.length;i++){
var cc=_100[i];
for(var j=0;j<cc.length;j++){
var c=cc[j];
if(c.field==_ff){
return c;
}
}
}
}
return null;
};
var opts=$.data(_fe,"datagrid").options;
var col=find(opts.columns);
if(!col){
col=find(opts.frozenColumns);
}
return col;
};
function _c7(_101,_102){
var opts=$.data(_101,"datagrid").options;
var _103=_102?opts.frozenColumns:opts.columns;
var aa=[];
var _104=_105();
for(var i=0;i<_103.length;i++){
aa[i]=new Array(_104);
}
for(var _106=0;_106<_103.length;_106++){
$.map(_103[_106],function(col){
var _107=_108(aa[_106]);
if(_107>=0){
var _109=col.field||col.id||"";
for(var c=0;c<(col.colspan||1);c++){
for(var r=0;r<(col.rowspan||1);r++){
aa[_106+r][_107]=_109;
}
_107++;
}
}
});
}
return aa;
function _105(){
var _10a=0;
$.map(_103[0]||[],function(col){
_10a+=col.colspan||1;
});
return _10a;
};
function _108(a){
for(var i=0;i<a.length;i++){
if(a[i]==undefined){
return i;
}
}
return -1;
};
};
function _73(_10b,_10c){
var aa=_c7(_10b,_10c);
return aa.length?aa[aa.length-1]:aa;
};
function _c0(_10d,data){
var _10e=$.data(_10d,"datagrid");
var opts=_10e.options;
var dc=_10e.dc;
data=opts.loadFilter.call(_10d,data);
if($.isArray(data)){
data={total:data.length,rows:data};
}
data.total=parseInt(data.total);
_10e.data=data;
if(data.footer){
_10e.footer=data.footer;
}
if(!opts.remoteSort&&opts.sortName){
var _10f=opts.sortName.split(",");
var _110=opts.sortOrder.split(",");
data.rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_10f.length;i++){
var sn=_10f[i];
var so=_110[i];
var col=_74(_10d,sn);
var _111=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_111(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
}
if(opts.view.onBeforeRender){
opts.view.onBeforeRender.call(opts.view,_10d,data.rows);
}
opts.view.render.call(opts.view,_10d,dc.body2,false);
opts.view.render.call(opts.view,_10d,dc.body1,true);
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,_10d,dc.footer2,false);
opts.view.renderFooter.call(opts.view,_10d,dc.footer1,true);
}
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,_10d);
}
_10e.ss.clean();
var _112=$(_10d).datagrid("getPager");
if(_112.length){
var _113=_112.pagination("options");
if(_113.total!=data.total){
_112.pagination("refresh",{total:data.total});
if(opts.pageNumber!=_113.pageNumber&&_113.pageNumber>0){
opts.pageNumber=_113.pageNumber;
_bf(_10d);
}
}
}
_34(_10d);
dc.body2.triggerHandler("scroll");
$(_10d).datagrid("setSelectionState");
$(_10d).datagrid("autoSizeColumn");
opts.onLoadSuccess.call(_10d,data);
};
function _114(_115){
var _116=$.data(_115,"datagrid");
var opts=_116.options;
var dc=_116.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
var _117=$.data(_115,"treegrid")?true:false;
var _118=opts.onSelect;
var _119=opts.onCheck;
opts.onSelect=opts.onCheck=function(){
};
var rows=opts.finder.getRows(_115);
for(var i=0;i<rows.length;i++){
var row=rows[i];
var _11a=_117?row[opts.idField]:i;
if(_11b(_116.selectedRows,row)){
_a5(_115,_11a,true);
}
if(_11b(_116.checkedRows,row)){
_a2(_115,_11a,true);
}
}
opts.onSelect=_118;
opts.onCheck=_119;
}
function _11b(a,r){
for(var i=0;i<a.length;i++){
if(a[i][opts.idField]==r[opts.idField]){
a[i]=r;
return true;
}
}
return false;
};
};
function _11c(_11d,row){
var _11e=$.data(_11d,"datagrid");
var opts=_11e.options;
var rows=_11e.data.rows;
if(typeof row=="object"){
return _2(rows,row);
}else{
for(var i=0;i<rows.length;i++){
if(rows[i][opts.idField]==row){
return i;
}
}
return -1;
}
};
function _11f(_120){
var _121=$.data(_120,"datagrid");
var opts=_121.options;
var data=_121.data;
if(opts.idField){
return _121.selectedRows;
}else{
var rows=[];
opts.finder.getTr(_120,"","selected",2).each(function(){
rows.push(opts.finder.getRow(_120,$(this)));
});
return rows;
}
};
function _122(_123){
var _124=$.data(_123,"datagrid");
var opts=_124.options;
if(opts.idField){
return _124.checkedRows;
}else{
var rows=[];
opts.finder.getTr(_123,"","checked",2).each(function(){
rows.push(opts.finder.getRow(_123,$(this)));
});
return rows;
}
};
function _125(_126,_127){
var _128=$.data(_126,"datagrid");
var dc=_128.dc;
var opts=_128.options;
var tr=opts.finder.getTr(_126,_127);
if(tr.length){
if(tr.closest("table").hasClass("datagrid-btable-frozen")){
return;
}
var _129=dc.view2.children("div.datagrid-header")._outerHeight();
var _12a=dc.body2;
var _12b=_12a.outerHeight(true)-_12a.outerHeight();
var top=tr.position().top-_129-_12b;
if(top<0){
_12a.scrollTop(_12a.scrollTop()+top);
}else{
if(top+tr._outerHeight()>_12a.height()-18){
_12a.scrollTop(_12a.scrollTop()+top+tr._outerHeight()-_12a.height()+18);
}
}
}
};
function _9c(_12c,_12d){
var _12e=$.data(_12c,"datagrid");
var opts=_12e.options;
opts.finder.getTr(_12c,_12e.highlightIndex).removeClass("datagrid-row-over");
opts.finder.getTr(_12c,_12d).addClass("datagrid-row-over");
_12e.highlightIndex=_12d;
};
function _a5(_12f,_130,_131){
var _132=$.data(_12f,"datagrid");
var opts=_132.options;
var row=opts.finder.getRow(_12f,_130);
if(opts.onBeforeSelect.apply(_12f,_5(_12f,[_130,row]))==false){
return;
}
if(opts.singleSelect){
_133(_12f,true);
_132.selectedRows=[];
}
if(!_131&&opts.checkOnSelect){
_a2(_12f,_130,true);
}
if(opts.idField){
_4(_132.selectedRows,opts.idField,row);
}
opts.finder.getTr(_12f,_130).addClass("datagrid-row-selected");
opts.onSelect.apply(_12f,_5(_12f,[_130,row]));
_125(_12f,_130);
};
function _a6(_134,_135,_136){
var _137=$.data(_134,"datagrid");
var dc=_137.dc;
var opts=_137.options;
var row=opts.finder.getRow(_134,_135);
if(opts.onBeforeUnselect.apply(_134,_5(_134,[_135,row]))==false){
return;
}
if(!_136&&opts.checkOnSelect){
_a3(_134,_135,true);
}
opts.finder.getTr(_134,_135).removeClass("datagrid-row-selected");
if(opts.idField){
_3(_137.selectedRows,opts.idField,row[opts.idField]);
}
opts.onUnselect.apply(_134,_5(_134,[_135,row]));
};
function _138(_139,_13a){
var _13b=$.data(_139,"datagrid");
var opts=_13b.options;
var rows=opts.finder.getRows(_139);
var _13c=$.data(_139,"datagrid").selectedRows;
if(!_13a&&opts.checkOnSelect){
_89(_139,true);
}
opts.finder.getTr(_139,"","allbody").addClass("datagrid-row-selected");
if(opts.idField){
for(var _13d=0;_13d<rows.length;_13d++){
_4(_13c,opts.idField,rows[_13d]);
}
}
opts.onSelectAll.call(_139,rows);
};
function _133(_13e,_13f){
var _140=$.data(_13e,"datagrid");
var opts=_140.options;
var rows=opts.finder.getRows(_13e);
var _141=$.data(_13e,"datagrid").selectedRows;
if(!_13f&&opts.checkOnSelect){
_8a(_13e,true);
}
opts.finder.getTr(_13e,"","selected").removeClass("datagrid-row-selected");
if(opts.idField){
for(var _142=0;_142<rows.length;_142++){
_3(_141,opts.idField,rows[_142][opts.idField]);
}
}
opts.onUnselectAll.call(_13e,rows);
};
function _a2(_143,_144,_145){
var _146=$.data(_143,"datagrid");
var opts=_146.options;
var row=opts.finder.getRow(_143,_144);
if(opts.onBeforeCheck.apply(_143,_5(_143,[_144,row]))==false){
return;
}
if(opts.singleSelect&&opts.selectOnCheck){
_8a(_143,true);
_146.checkedRows=[];
}
if(!_145&&opts.selectOnCheck){
_a5(_143,_144,true);
}
var tr=opts.finder.getTr(_143,_144).addClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
tr=opts.finder.getTr(_143,"","checked",2);
if(tr.length==opts.finder.getRows(_143).length){
var dc=_146.dc;
dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",true);
}
if(opts.idField){
_4(_146.checkedRows,opts.idField,row);
}
opts.onCheck.apply(_143,_5(_143,[_144,row]));
};
function _a3(_147,_148,_149){
var _14a=$.data(_147,"datagrid");
var opts=_14a.options;
var row=opts.finder.getRow(_147,_148);
if(opts.onBeforeUncheck.apply(_147,_5(_147,[_148,row]))==false){
return;
}
if(!_149&&opts.selectOnCheck){
_a6(_147,_148,true);
}
var tr=opts.finder.getTr(_147,_148).removeClass("datagrid-row-checked");
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",false);
var dc=_14a.dc;
var _14b=dc.header1.add(dc.header2);
_14b.find("input[type=checkbox]")._propAttr("checked",false);
if(opts.idField){
_3(_14a.checkedRows,opts.idField,row[opts.idField]);
}
opts.onUncheck.apply(_147,_5(_147,[_148,row]));
};
function _89(_14c,_14d){
var _14e=$.data(_14c,"datagrid");
var opts=_14e.options;
var rows=opts.finder.getRows(_14c);
if(!_14d&&opts.selectOnCheck){
_138(_14c,true);
}
var dc=_14e.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_14c,"","allbody").addClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",true);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_4(_14e.checkedRows,opts.idField,rows[i]);
}
}
opts.onCheckAll.call(_14c,rows);
};
function _8a(_14f,_150){
var _151=$.data(_14f,"datagrid");
var opts=_151.options;
var rows=opts.finder.getRows(_14f);
if(!_150&&opts.selectOnCheck){
_133(_14f,true);
}
var dc=_151.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_14f,"","checked").removeClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",false);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_3(_151.checkedRows,opts.idField,rows[i][opts.idField]);
}
}
opts.onUncheckAll.call(_14f,rows);
};
function _152(_153,_154){
var opts=$.data(_153,"datagrid").options;
var tr=opts.finder.getTr(_153,_154);
var row=opts.finder.getRow(_153,_154);
if(tr.hasClass("datagrid-row-editing")){
return;
}
if(opts.onBeforeEdit.apply(_153,_5(_153,[_154,row]))==false){
return;
}
tr.addClass("datagrid-row-editing");
_155(_153,_154);
_f6(_153);
tr.find("div.datagrid-editable").each(function(){
var _156=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
ed.actions.setValue(ed.target,row[_156]);
});
_157(_153,_154);
opts.onBeginEdit.apply(_153,_5(_153,[_154,row]));
};
function _158(_159,_15a,_15b){
var _15c=$.data(_159,"datagrid");
var opts=_15c.options;
var _15d=_15c.updatedRows;
var _15e=_15c.insertedRows;
var tr=opts.finder.getTr(_159,_15a);
var row=opts.finder.getRow(_159,_15a);
if(!tr.hasClass("datagrid-row-editing")){
return;
}
if(!_15b){
if(!_157(_159,_15a)){
return;
}
var _15f=false;
var _160={};
tr.find("div.datagrid-editable").each(function(){
var _161=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
var t=$(ed.target);
var _162=t.data("textbox")?t.textbox("textbox"):t;
if(_162.is(":focus")){
_162.triggerHandler("blur");
}
var _163=ed.actions.getValue(ed.target);
if(row[_161]!==_163){
row[_161]=_163;
_15f=true;
_160[_161]=_163;
}
});
if(_15f){
if(_2(_15e,row)==-1){
if(_2(_15d,row)==-1){
_15d.push(row);
}
}
}
opts.onEndEdit.apply(_159,_5(_159,[_15a,row,_160]));
}
tr.removeClass("datagrid-row-editing");
_164(_159,_15a);
$(_159).datagrid("refreshRow",_15a);
if(!_15b){
opts.onAfterEdit.apply(_159,_5(_159,[_15a,row,_160]));
}else{
opts.onCancelEdit.apply(_159,_5(_159,[_15a,row]));
}
};
function _165(_166,_167){
var opts=$.data(_166,"datagrid").options;
var tr=opts.finder.getTr(_166,_167);
var _168=[];
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
_168.push(ed);
}
});
return _168;
};
function _169(_16a,_16b){
var _16c=_165(_16a,_16b.index!=undefined?_16b.index:_16b.id);
for(var i=0;i<_16c.length;i++){
if(_16c[i].field==_16b.field){
return _16c[i];
}
}
return null;
};
function _155(_16d,_16e){
var opts=$.data(_16d,"datagrid").options;
var tr=opts.finder.getTr(_16d,_16e);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-cell");
var _16f=$(this).attr("field");
var col=_74(_16d,_16f);
if(col&&col.editor){
var _170,_171;
if(typeof col.editor=="string"){
_170=col.editor;
}else{
_170=col.editor.type;
_171=col.editor.options;
}
var _172=opts.editors[_170];
if(_172){
var _173=cell.html();
var _174=cell._outerWidth();
cell.addClass("datagrid-editable");
cell._outerWidth(_174);
cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
cell.children("table").bind("click dblclick contextmenu",function(e){
e.stopPropagation();
});
$.data(cell[0],"datagrid.editor",{actions:_172,target:_172.init(cell.find("td"),$.extend({height:opts.editorHeight},_171)),field:_16f,type:_170,oldHtml:_173});
}
}
});
_34(_16d,_16e,true);
};
function _164(_175,_176){
var opts=$.data(_175,"datagrid").options;
var tr=opts.finder.getTr(_175,_176);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
if(ed.actions.destroy){
ed.actions.destroy(ed.target);
}
cell.html(ed.oldHtml);
$.removeData(cell[0],"datagrid.editor");
cell.removeClass("datagrid-editable");
cell.css("width","");
}
});
};
function _157(_177,_178){
var tr=$.data(_177,"datagrid").options.finder.getTr(_177,_178);
if(!tr.hasClass("datagrid-row-editing")){
return true;
}
var vbox=tr.find(".validatebox-text");
vbox.validatebox("validate");
vbox.trigger("mouseleave");
var _179=tr.find(".validatebox-invalid");
return _179.length==0;
};
function _17a(_17b,_17c){
var _17d=$.data(_17b,"datagrid").insertedRows;
var _17e=$.data(_17b,"datagrid").deletedRows;
var _17f=$.data(_17b,"datagrid").updatedRows;
if(!_17c){
var rows=[];
rows=rows.concat(_17d);
rows=rows.concat(_17e);
rows=rows.concat(_17f);
return rows;
}else{
if(_17c=="inserted"){
return _17d;
}else{
if(_17c=="deleted"){
return _17e;
}else{
if(_17c=="updated"){
return _17f;
}
}
}
}
return [];
};
function _180(_181,_182){
var _183=$.data(_181,"datagrid");
var opts=_183.options;
var data=_183.data;
var _184=_183.insertedRows;
var _185=_183.deletedRows;
$(_181).datagrid("cancelEdit",_182);
var row=opts.finder.getRow(_181,_182);
if(_2(_184,row)>=0){
_3(_184,row);
}else{
_185.push(row);
}
_3(_183.selectedRows,opts.idField,row[opts.idField]);
_3(_183.checkedRows,opts.idField,row[opts.idField]);
opts.view.deleteRow.call(opts.view,_181,_182);
if(opts.height=="auto"){
_34(_181);
}
$(_181).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _186(_187,_188){
var data=$.data(_187,"datagrid").data;
var view=$.data(_187,"datagrid").options.view;
var _189=$.data(_187,"datagrid").insertedRows;
view.insertRow.call(view,_187,_188.index,_188.row);
_189.push(_188.row);
$(_187).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _18a(_18b,row){
var data=$.data(_18b,"datagrid").data;
var view=$.data(_18b,"datagrid").options.view;
var _18c=$.data(_18b,"datagrid").insertedRows;
view.insertRow.call(view,_18b,null,row);
_18c.push(row);
$(_18b).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _18d(_18e,_18f){
var _190=$.data(_18e,"datagrid");
var opts=_190.options;
var row=opts.finder.getRow(_18e,_18f.index);
var _191=false;
_18f.row=_18f.row||{};
for(var _192 in _18f.row){
if(row[_192]!==_18f.row[_192]){
_191=true;
break;
}
}
if(_191){
if(_2(_190.insertedRows,row)==-1){
if(_2(_190.updatedRows,row)==-1){
_190.updatedRows.push(row);
}
}
opts.view.updateRow.call(opts.view,_18e,_18f.index,_18f.row);
}
};
function _193(_194){
var _195=$.data(_194,"datagrid");
var data=_195.data;
var rows=data.rows;
var _196=[];
for(var i=0;i<rows.length;i++){
_196.push($.extend({},rows[i]));
}
_195.originalRows=_196;
_195.updatedRows=[];
_195.insertedRows=[];
_195.deletedRows=[];
};
function _197(_198){
var data=$.data(_198,"datagrid").data;
var ok=true;
for(var i=0,len=data.rows.length;i<len;i++){
if(_157(_198,i)){
$(_198).datagrid("endEdit",i);
}else{
ok=false;
}
}
if(ok){
_193(_198);
}
};
function _199(_19a){
var _19b=$.data(_19a,"datagrid");
var opts=_19b.options;
var _19c=_19b.originalRows;
var _19d=_19b.insertedRows;
var _19e=_19b.deletedRows;
var _19f=_19b.selectedRows;
var _1a0=_19b.checkedRows;
var data=_19b.data;
function _1a1(a){
var ids=[];
for(var i=0;i<a.length;i++){
ids.push(a[i][opts.idField]);
}
return ids;
};
function _1a2(ids,_1a3){
for(var i=0;i<ids.length;i++){
var _1a4=_11c(_19a,ids[i]);
if(_1a4>=0){
(_1a3=="s"?_a5:_a2)(_19a,_1a4,true);
}
}
};
for(var i=0;i<data.rows.length;i++){
$(_19a).datagrid("cancelEdit",i);
}
var _1a5=_1a1(_19f);
var _1a6=_1a1(_1a0);
_19f.splice(0,_19f.length);
_1a0.splice(0,_1a0.length);
data.total+=_19e.length-_19d.length;
data.rows=_19c;
_c0(_19a,data);
_1a2(_1a5,"s");
_1a2(_1a6,"c");
_193(_19a);
};
function _bf(_1a7,_1a8,cb){
var opts=$.data(_1a7,"datagrid").options;
if(_1a8){
opts.queryParams=_1a8;
}
var _1a9=$.extend({},opts.queryParams);
if(opts.pagination){
$.extend(_1a9,{page:opts.pageNumber||1,rows:opts.pageSize});
}
if(opts.sortName){
$.extend(_1a9,{sort:opts.sortName,order:opts.sortOrder});
}
if(opts.onBeforeLoad.call(_1a7,_1a9)==false){
return;
}
$(_1a7).datagrid("loading");
var _1aa=opts.loader.call(_1a7,_1a9,function(data){
$(_1a7).datagrid("loaded");
$(_1a7).datagrid("loadData",data);
if(cb){
cb();
}
},function(){
$(_1a7).datagrid("loaded");
opts.onLoadError.apply(_1a7,arguments);
});
if(_1aa==false){
$(_1a7).datagrid("loaded");
}
};
function _1ab(_1ac,_1ad){
var opts=$.data(_1ac,"datagrid").options;
_1ad.type=_1ad.type||"body";
_1ad.rowspan=_1ad.rowspan||1;
_1ad.colspan=_1ad.colspan||1;
if(_1ad.rowspan==1&&_1ad.colspan==1){
return;
}
var tr=opts.finder.getTr(_1ac,(_1ad.index!=undefined?_1ad.index:_1ad.id),_1ad.type);
if(!tr.length){
return;
}
var td=tr.find("td[field=\""+_1ad.field+"\"]");
td.attr("rowspan",_1ad.rowspan).attr("colspan",_1ad.colspan);
td.addClass("datagrid-td-merged");
_1ae(td.next(),_1ad.colspan-1);
for(var i=1;i<_1ad.rowspan;i++){
tr=tr.next();
if(!tr.length){
break;
}
_1ae(tr.find("td[field=\""+_1ad.field+"\"]"),_1ad.colspan);
}
_f5(_1ac,td);
function _1ae(td,_1af){
for(var i=0;i<_1af;i++){
td.hide();
td=td.next();
}
};
};
$.fn.datagrid=function(_1b0,_1b1){
if(typeof _1b0=="string"){
return $.fn.datagrid.methods[_1b0](this,_1b1);
}
_1b0=_1b0||{};
return this.each(function(){
var _1b2=$.data(this,"datagrid");
var opts;
if(_1b2){
opts=$.extend(_1b2.options,_1b0);
_1b2.options=opts;
}else{
opts=$.extend({},$.extend({},$.fn.datagrid.defaults,{queryParams:{}}),$.fn.datagrid.parseOptions(this),_1b0);
$(this).css("width","").css("height","");
var _1b3=_4d(this,opts.rownumbers);
if(!opts.columns){
opts.columns=_1b3.columns;
}
if(!opts.frozenColumns){
opts.frozenColumns=_1b3.frozenColumns;
}
opts.columns=$.extend(true,[],opts.columns);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.view=$.extend({},opts.view);
$.data(this,"datagrid",{options:opts,panel:_1b3.panel,dc:_1b3.dc,ss:null,selectedRows:[],checkedRows:[],data:{total:0,rows:[]},originalRows:[],updatedRows:[],insertedRows:[],deletedRows:[]});
}
_58(this);
_75(this);
_1a(this);
if(opts.data){
$(this).datagrid("loadData",opts.data);
}else{
var data=$.fn.datagrid.parseData(this);
if(data.total>0){
$(this).datagrid("loadData",data);
}else{
opts.view.setEmptyMsg(this);
$(this).datagrid("autoSizeColumn");
}
}
_bf(this);
});
};
function _1b4(_1b5){
var _1b6={};
$.map(_1b5,function(name){
_1b6[name]=_1b7(name);
});
return _1b6;
function _1b7(name){
function isA(_1b8){
return $.data($(_1b8)[0],name)!=undefined;
};
return {init:function(_1b9,_1ba){
var _1bb=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_1b9);
if(_1bb[name]&&name!="text"){
return _1bb[name](_1ba);
}else{
return _1bb;
}
},destroy:function(_1bc){
if(isA(_1bc,name)){
$(_1bc)[name]("destroy");
}
},getValue:function(_1bd){
if(isA(_1bd,name)){
var opts=$(_1bd)[name]("options");
if(opts.multiple){
return $(_1bd)[name]("getValues").join(opts.separator);
}else{
return $(_1bd)[name]("getValue");
}
}else{
return $(_1bd).val();
}
},setValue:function(_1be,_1bf){
if(isA(_1be,name)){
var opts=$(_1be)[name]("options");
if(opts.multiple){
if(_1bf){
$(_1be)[name]("setValues",_1bf.split(opts.separator));
}else{
$(_1be)[name]("clear");
}
}else{
$(_1be)[name]("setValue",_1bf);
}
}else{
$(_1be).val(_1bf);
}
},resize:function(_1c0,_1c1){
if(isA(_1c0,name)){
$(_1c0)[name]("resize",_1c1);
}else{
$(_1c0)._size({width:_1c1,height:$.fn.datagrid.defaults.editorHeight});
}
}};
};
};
var _1c2=$.extend({},_1b4(["text","textbox","passwordbox","filebox","numberbox","numberspinner","combobox","combotree","combogrid","combotreegrid","datebox","datetimebox","timespinner","datetimespinner"]),{textarea:{init:function(_1c3,_1c4){
var _1c5=$("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(_1c3);
_1c5.css("vertical-align","middle")._outerHeight(_1c4.height);
return _1c5;
},getValue:function(_1c6){
return $(_1c6).val();
},setValue:function(_1c7,_1c8){
$(_1c7).val(_1c8);
},resize:function(_1c9,_1ca){
$(_1c9)._outerWidth(_1ca);
}},checkbox:{init:function(_1cb,_1cc){
var _1cd=$("<input type=\"checkbox\">").appendTo(_1cb);
_1cd.val(_1cc.on);
_1cd.attr("offval",_1cc.off);
return _1cd;
},getValue:function(_1ce){
if($(_1ce).is(":checked")){
return $(_1ce).val();
}else{
return $(_1ce).attr("offval");
}
},setValue:function(_1cf,_1d0){
var _1d1=false;
if($(_1cf).val()==_1d0){
_1d1=true;
}
$(_1cf)._propAttr("checked",_1d1);
}},validatebox:{init:function(_1d2,_1d3){
var _1d4=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_1d2);
_1d4.validatebox(_1d3);
return _1d4;
},destroy:function(_1d5){
$(_1d5).validatebox("destroy");
},getValue:function(_1d6){
return $(_1d6).val();
},setValue:function(_1d7,_1d8){
$(_1d7).val(_1d8);
},resize:function(_1d9,_1da){
$(_1d9)._outerWidth(_1da)._outerHeight($.fn.datagrid.defaults.editorHeight);
}}});
$.fn.datagrid.methods={options:function(jq){
var _1db=$.data(jq[0],"datagrid").options;
var _1dc=$.data(jq[0],"datagrid").panel.panel("options");
var opts=$.extend(_1db,{width:_1dc.width,height:_1dc.height,closed:_1dc.closed,collapsed:_1dc.collapsed,minimized:_1dc.minimized,maximized:_1dc.maximized});
return opts;
},setSelectionState:function(jq){
return jq.each(function(){
_114(this);
});
},createStyleSheet:function(jq){
return _7(jq[0]);
},getPanel:function(jq){
return $.data(jq[0],"datagrid").panel;
},getPager:function(jq){
return $.data(jq[0],"datagrid").panel.children("div.datagrid-pager");
},getColumnFields:function(jq,_1dd){
return _73(jq[0],_1dd);
},getColumnOption:function(jq,_1de){
return _74(jq[0],_1de);
},resize:function(jq,_1df){
return jq.each(function(){
_1a(this,_1df);
});
},load:function(jq,_1e0){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _1e0=="string"){
opts.url=_1e0;
_1e0=null;
}
opts.pageNumber=1;
var _1e1=$(this).datagrid("getPager");
_1e1.pagination("refresh",{pageNumber:1});
_bf(this,_1e0);
});
},reload:function(jq,_1e2){
return jq.each(function(){
var opts=$(this).datagrid("options");
if(typeof _1e2=="string"){
opts.url=_1e2;
_1e2=null;
}
_bf(this,_1e2);
});
},reloadFooter:function(jq,_1e3){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
var dc=$.data(this,"datagrid").dc;
if(_1e3){
$.data(this,"datagrid").footer=_1e3;
}
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,this,dc.footer2,false);
opts.view.renderFooter.call(opts.view,this,dc.footer1,true);
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,this);
}
$(this).datagrid("fixRowHeight");
}
});
},loading:function(jq){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
$(this).datagrid("getPager").pagination("loading");
if(opts.loadMsg){
var _1e4=$(this).datagrid("getPanel");
if(!_1e4.children("div.datagrid-mask").length){
$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_1e4);
var msg=$("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(_1e4);
msg._outerHeight(40);
msg.css({marginLeft:(-msg.outerWidth()/2),lineHeight:(msg.height()+"px")});
}
}
});
},loaded:function(jq){
return jq.each(function(){
$(this).datagrid("getPager").pagination("loaded");
var _1e5=$(this).datagrid("getPanel");
_1e5.children("div.datagrid-mask-msg").remove();
_1e5.children("div.datagrid-mask").remove();
});
},fitColumns:function(jq){
return jq.each(function(){
_cc(this);
});
},fixColumnSize:function(jq,_1e6){
return jq.each(function(){
_ef(this,_1e6);
});
},fixRowHeight:function(jq,_1e7){
return jq.each(function(){
_34(this,_1e7);
});
},freezeRow:function(jq,_1e8){
return jq.each(function(){
_45(this,_1e8);
});
},autoSizeColumn:function(jq,_1e9){
return jq.each(function(){
_e0(this,_1e9);
});
},loadData:function(jq,data){
return jq.each(function(){
_c0(this,data);
_193(this);
});
},getData:function(jq){
return $.data(jq[0],"datagrid").data;
},getRows:function(jq){
return $.data(jq[0],"datagrid").data.rows;
},getFooterRows:function(jq){
return $.data(jq[0],"datagrid").footer;
},getRowIndex:function(jq,id){
return _11c(jq[0],id);
},getChecked:function(jq){
return _122(jq[0]);
},getSelected:function(jq){
var rows=_11f(jq[0]);
return rows.length>0?rows[0]:null;
},getSelections:function(jq){
return _11f(jq[0]);
},clearSelections:function(jq){
return jq.each(function(){
var _1ea=$.data(this,"datagrid");
var _1eb=_1ea.selectedRows;
var _1ec=_1ea.checkedRows;
_1eb.splice(0,_1eb.length);
_133(this);
if(_1ea.options.checkOnSelect){
_1ec.splice(0,_1ec.length);
}
});
},clearChecked:function(jq){
return jq.each(function(){
var _1ed=$.data(this,"datagrid");
var _1ee=_1ed.selectedRows;
var _1ef=_1ed.checkedRows;
_1ef.splice(0,_1ef.length);
_8a(this);
if(_1ed.options.selectOnCheck){
_1ee.splice(0,_1ee.length);
}
});
},scrollTo:function(jq,_1f0){
return jq.each(function(){
_125(this,_1f0);
});
},highlightRow:function(jq,_1f1){
return jq.each(function(){
_9c(this,_1f1);
_125(this,_1f1);
});
},selectAll:function(jq){
return jq.each(function(){
_138(this);
});
},unselectAll:function(jq){
return jq.each(function(){
_133(this);
});
},selectRow:function(jq,_1f2){
return jq.each(function(){
_a5(this,_1f2);
});
},selectRecord:function(jq,id){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
if(opts.idField){
var _1f3=_11c(this,id);
if(_1f3>=0){
$(this).datagrid("selectRow",_1f3);
}
}
});
},unselectRow:function(jq,_1f4){
return jq.each(function(){
_a6(this,_1f4);
});
},checkRow:function(jq,_1f5){
return jq.each(function(){
_a2(this,_1f5);
});
},uncheckRow:function(jq,_1f6){
return jq.each(function(){
_a3(this,_1f6);
});
},checkAll:function(jq){
return jq.each(function(){
_89(this);
});
},uncheckAll:function(jq){
return jq.each(function(){
_8a(this);
});
},beginEdit:function(jq,_1f7){
return jq.each(function(){
_152(this,_1f7);
});
},endEdit:function(jq,_1f8){
return jq.each(function(){
_158(this,_1f8,false);
});
},cancelEdit:function(jq,_1f9){
return jq.each(function(){
_158(this,_1f9,true);
});
},getEditors:function(jq,_1fa){
return _165(jq[0],_1fa);
},getEditor:function(jq,_1fb){
return _169(jq[0],_1fb);
},refreshRow:function(jq,_1fc){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
opts.view.refreshRow.call(opts.view,this,_1fc);
});
},validateRow:function(jq,_1fd){
return _157(jq[0],_1fd);
},updateRow:function(jq,_1fe){
return jq.each(function(){
_18d(this,_1fe);
});
},appendRow:function(jq,row){
return jq.each(function(){
_18a(this,row);
});
},insertRow:function(jq,_1ff){
return jq.each(function(){
_186(this,_1ff);
});
},deleteRow:function(jq,_200){
return jq.each(function(){
_180(this,_200);
});
},getChanges:function(jq,_201){
return _17a(jq[0],_201);
},acceptChanges:function(jq){
return jq.each(function(){
_197(this);
});
},rejectChanges:function(jq){
return jq.each(function(){
_199(this);
});
},mergeCells:function(jq,_202){
return jq.each(function(){
_1ab(this,_202);
});
},showColumn:function(jq,_203){
return jq.each(function(){
var col=$(this).datagrid("getColumnOption",_203);
if(col.hidden){
col.hidden=false;
$(this).datagrid("getPanel").find("td[field=\""+_203+"\"]").show();
_c1(this,_203,1);
$(this).datagrid("fitColumns");
}
});
},hideColumn:function(jq,_204){
return jq.each(function(){
var col=$(this).datagrid("getColumnOption",_204);
if(!col.hidden){
col.hidden=true;
$(this).datagrid("getPanel").find("td[field=\""+_204+"\"]").hide();
_c1(this,_204,-1);
$(this).datagrid("fitColumns");
}
});
},sort:function(jq,_205){
return jq.each(function(){
_8c(this,_205);
});
},gotoPage:function(jq,_206){
return jq.each(function(){
var _207=this;
var page,cb;
if(typeof _206=="object"){
page=_206.page;
cb=_206.callback;
}else{
page=_206;
}
$(_207).datagrid("options").pageNumber=page;
$(_207).datagrid("getPager").pagination("refresh",{pageNumber:page});
_bf(_207,null,function(){
if(cb){
cb.call(_207,page);
}
});
});
}};
$.fn.datagrid.parseOptions=function(_208){
var t=$(_208);
return $.extend({},$.fn.panel.parseOptions(_208),$.parser.parseOptions(_208,["url","toolbar","idField","sortName","sortOrder","pagePosition","resizeHandle",{sharedStyleSheet:"boolean",fitColumns:"boolean",autoRowHeight:"boolean",striped:"boolean",nowrap:"boolean"},{rownumbers:"boolean",singleSelect:"boolean",ctrlSelect:"boolean",checkOnSelect:"boolean",selectOnCheck:"boolean"},{pagination:"boolean",pageSize:"number",pageNumber:"number"},{multiSort:"boolean",remoteSort:"boolean",showHeader:"boolean",showFooter:"boolean"},{scrollbarSize:"number"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined),loadMsg:(t.attr("loadMsg")!=undefined?t.attr("loadMsg"):undefined),rowStyler:(t.attr("rowStyler")?eval(t.attr("rowStyler")):undefined)});
};
$.fn.datagrid.parseData=function(_209){
var t=$(_209);
var data={total:0,rows:[]};
var _20a=t.datagrid("getColumnFields",true).concat(t.datagrid("getColumnFields",false));
t.find("tbody tr").each(function(){
data.total++;
var row={};
$.extend(row,$.parser.parseOptions(this,["iconCls","state"]));
for(var i=0;i<_20a.length;i++){
row[_20a[i]]=$(this).find("td:eq("+i+")").html();
}
data.rows.push(row);
});
return data;
};
var _20b={render:function(_20c,_20d,_20e){
var rows=$(_20c).datagrid("getRows");
$(_20d).html(this.renderTable(_20c,0,rows,_20e));
},renderFooter:function(_20f,_210,_211){
var opts=$.data(_20f,"datagrid").options;
var rows=$.data(_20f,"datagrid").footer||[];
var _212=$(_20f).datagrid("getColumnFields",_211);
var _213=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
_213.push("<tr class=\"datagrid-row\" datagrid-row-index=\""+i+"\">");
_213.push(this.renderRow.call(this,_20f,_212,_211,i,rows[i]));
_213.push("</tr>");
}
_213.push("</tbody></table>");
$(_210).html(_213.join(""));
},renderTable:function(_214,_215,rows,_216){
var _217=$.data(_214,"datagrid");
var opts=_217.options;
if(_216){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return "";
}
}
var _218=$(_214).datagrid("getColumnFields",_216);
var _219=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var row=rows[i];
var css=opts.rowStyler?opts.rowStyler.call(_214,_215,row):"";
var cs=this.getStyleValue(css);
var cls="class=\"datagrid-row "+(_215%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c+"\"";
var _21a=cs.s?"style=\""+cs.s+"\"":"";
var _21b=_217.rowIdPrefix+"-"+(_216?1:2)+"-"+_215;
_219.push("<tr id=\""+_21b+"\" datagrid-row-index=\""+_215+"\" "+cls+" "+_21a+">");
_219.push(this.renderRow.call(this,_214,_218,_216,_215,row));
_219.push("</tr>");
_215++;
}
_219.push("</tbody></table>");
return _219.join("");
},renderRow:function(_21c,_21d,_21e,_21f,_220){
var opts=$.data(_21c,"datagrid").options;
var cc=[];
if(_21e&&opts.rownumbers){
var _221=_21f+1;
if(opts.pagination){
_221+=(opts.pageNumber-1)*opts.pageSize;
}
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">"+_221+"</div></td>");
}
for(var i=0;i<_21d.length;i++){
var _222=_21d[i];
var col=$(_21c).datagrid("getColumnOption",_222);
if(col){
var _223=_220[_222];
var css=col.styler?(col.styler(_223,_220,_21f)||""):"";
var cs=this.getStyleValue(css);
var cls=cs.c?"class=\""+cs.c+"\"":"";
var _224=col.hidden?"style=\"display:none;"+cs.s+"\"":(cs.s?"style=\""+cs.s+"\"":"");
cc.push("<td field=\""+_222+"\" "+cls+" "+_224+">");
var _224="";
if(!col.checkbox){
if(col.align){
_224+="text-align:"+col.align+";";
}
if(!opts.nowrap){
_224+="white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_224+="height:auto;";
}
}
}
cc.push("<div style=\""+_224+"\" ");
cc.push(col.checkbox?"class=\"datagrid-cell-check\"":"class=\"datagrid-cell "+col.cellClass+"\"");
cc.push(">");
if(col.checkbox){
cc.push("<input type=\"checkbox\" "+(_220.checked?"checked=\"checked\"":""));
cc.push(" name=\""+_222+"\" value=\""+(_223!=undefined?_223:"")+"\">");
}else{
if(col.formatter){
cc.push(col.formatter(_223,_220,_21f));
}else{
cc.push(_223);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},getStyleValue:function(css){
var _225="";
var _226="";
if(typeof css=="string"){
_226=css;
}else{
if(css){
_225=css["class"]||"";
_226=css["style"]||"";
}
}
return {c:_225,s:_226};
},refreshRow:function(_227,_228){
this.updateRow.call(this,_227,_228,{});
},updateRow:function(_229,_22a,row){
var opts=$.data(_229,"datagrid").options;
var _22b=opts.finder.getRow(_229,_22a);
$.extend(_22b,row);
var cs=_22c.call(this,_22a);
var _22d=cs.s;
var cls="datagrid-row "+(_22a%2&&opts.striped?"datagrid-row-alt ":" ")+cs.c;
function _22c(_22e){
var css=opts.rowStyler?opts.rowStyler.call(_229,_22e,_22b):"";
return this.getStyleValue(css);
};
function _22f(_230){
var _231=$(_229).datagrid("getColumnFields",_230);
var tr=opts.finder.getTr(_229,_22a,"body",(_230?1:2));
var _232=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow.call(this,_229,_231,_230,_22a,_22b));
tr.attr("style",_22d).attr("class",cls);
if(_232){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
};
_22f.call(this,true);
_22f.call(this,false);
$(_229).datagrid("fixRowHeight",_22a);
},insertRow:function(_233,_234,row){
var _235=$.data(_233,"datagrid");
var opts=_235.options;
var dc=_235.dc;
var data=_235.data;
if(_234==undefined||_234==null){
_234=data.rows.length;
}
if(_234>data.rows.length){
_234=data.rows.length;
}
function _236(_237){
var _238=_237?1:2;
for(var i=data.rows.length-1;i>=_234;i--){
var tr=opts.finder.getTr(_233,i,"body",_238);
tr.attr("datagrid-row-index",i+1);
tr.attr("id",_235.rowIdPrefix+"-"+_238+"-"+(i+1));
if(_237&&opts.rownumbers){
var _239=i+2;
if(opts.pagination){
_239+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_239);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i+1)%2?"datagrid-row-alt":"");
}
}
};
function _23a(_23b){
var _23c=_23b?1:2;
var _23d=$(_233).datagrid("getColumnFields",_23b);
var _23e=_235.rowIdPrefix+"-"+_23c+"-"+_234;
var tr="<tr id=\""+_23e+"\" class=\"datagrid-row\" datagrid-row-index=\""+_234+"\"></tr>";
if(_234>=data.rows.length){
if(data.rows.length){
opts.finder.getTr(_233,"","last",_23c).after(tr);
}else{
var cc=_23b?dc.body1:dc.body2;
cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"+tr+"</tbody></table>");
}
}else{
opts.finder.getTr(_233,_234+1,"body",_23c).before(tr);
}
};
_236.call(this,true);
_236.call(this,false);
_23a.call(this,true);
_23a.call(this,false);
data.total+=1;
data.rows.splice(_234,0,row);
this.setEmptyMsg(_233);
this.refreshRow.call(this,_233,_234);
},deleteRow:function(_23f,_240){
var _241=$.data(_23f,"datagrid");
var opts=_241.options;
var data=_241.data;
function _242(_243){
var _244=_243?1:2;
for(var i=_240+1;i<data.rows.length;i++){
var tr=opts.finder.getTr(_23f,i,"body",_244);
tr.attr("datagrid-row-index",i-1);
tr.attr("id",_241.rowIdPrefix+"-"+_244+"-"+(i-1));
if(_243&&opts.rownumbers){
var _245=i;
if(opts.pagination){
_245+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_245);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i-1)%2?"datagrid-row-alt":"");
}
}
};
opts.finder.getTr(_23f,_240).remove();
_242.call(this,true);
_242.call(this,false);
data.total-=1;
data.rows.splice(_240,1);
this.setEmptyMsg(_23f);
},onBeforeRender:function(_246,rows){
},onAfterRender:function(_247){
var _248=$.data(_247,"datagrid");
var opts=_248.options;
if(opts.showFooter){
var _249=$(_247).datagrid("getPanel").find("div.datagrid-footer");
_249.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
}
this.setEmptyMsg(_247);
},setEmptyMsg:function(_24a){
var _24b=$.data(_24a,"datagrid");
var opts=_24b.options;
var _24c=opts.finder.getRows(_24a).length==0;
if(_24c){
this.renderEmptyRow(_24a);
}
if(opts.emptyMsg){
if(_24c){
var h=_24b.dc.header2.parent().outerHeight();
var d=$("<div class=\"datagrid-empty\"></div>").appendTo(_24b.dc.view);
d.html(opts.emptyMsg).css("top",h+"px");
}else{
_24b.dc.view.children(".datagrid-empty").remove();
}
}
},renderEmptyRow:function(_24d){
var cols=$.map($(_24d).datagrid("getColumnFields"),function(_24e){
return $(_24d).datagrid("getColumnOption",_24e);
});
$.map(cols,function(col){
col.formatter1=col.formatter;
col.styler1=col.styler;
col.formatter=col.styler=undefined;
});
var _24f=$.data(_24d,"datagrid").dc.body2;
_24f.html(this.renderTable(_24d,0,[{}],false));
_24f.find("tbody *").css({height:1,borderColor:"transparent",background:"transparent"});
var tr=_24f.find(".datagrid-row");
tr.removeClass("datagrid-row").removeAttr("datagrid-row-index");
tr.find(".datagrid-cell,.datagrid-cell-check").empty();
$.map(cols,function(col){
col.formatter=col.formatter1;
col.styler=col.styler1;
col.formatter1=col.styler1=undefined;
});
}};
$.fn.datagrid.defaults=$.extend({},$.fn.panel.defaults,{sharedStyleSheet:false,frozenColumns:undefined,columns:undefined,fitColumns:false,resizeHandle:"right",autoRowHeight:true,toolbar:null,striped:false,method:"post",nowrap:true,idField:null,url:null,data:null,loadMsg:"Processing, please wait ...",emptyMsg:"",rownumbers:false,singleSelect:false,ctrlSelect:false,selectOnCheck:true,checkOnSelect:true,pagination:false,pagePosition:"bottom",pageNumber:1,pageSize:10,pageList:[10,20,30,40,50],queryParams:{},sortName:null,sortOrder:"asc",multiSort:false,remoteSort:true,showHeader:true,showFooter:false,scrollbarSize:18,rownumberWidth:30,editorHeight:24,headerEvents:{mouseover:_82(true),mouseout:_82(false),click:_86,dblclick:_8d,contextmenu:_93},rowEvents:{mouseover:_96(true),mouseout:_96(false),click:_9e,dblclick:_a9,contextmenu:_ae},rowStyler:function(_250,_251){
},loader:function(_252,_253,_254){
var opts=$(this).datagrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_252,dataType:"json",success:function(data){
_253(data);
},error:function(){
_254.apply(this,arguments);
}});
},loadFilter:function(data){
return data;
},editors:_1c2,finder:{getTr:function(_255,_256,type,_257){
type=type||"body";
_257=_257||0;
var _258=$.data(_255,"datagrid");
var dc=_258.dc;
var opts=_258.options;
if(_257==0){
var tr1=opts.finder.getTr(_255,_256,type,1);
var tr2=opts.finder.getTr(_255,_256,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+_258.rowIdPrefix+"-"+_257+"-"+_256);
if(!tr.length){
tr=(_257==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index="+_256+"]");
}
return tr;
}else{
if(type=="footer"){
return (_257==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index="+_256+"]");
}else{
if(type=="selected"){
return (_257==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_257==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_257==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-checked");
}else{
if(type=="editing"){
return (_257==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-editing");
}else{
if(type=="last"){
return (_257==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]:last");
}else{
if(type=="allbody"){
return (_257==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]");
}else{
if(type=="allfooter"){
return (_257==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index]");
}
}
}
}
}
}
}
}
}
}
},getRow:function(_259,p){
var _25a=(typeof p=="object")?p.attr("datagrid-row-index"):p;
return $.data(_259,"datagrid").data.rows[parseInt(_25a)];
},getRows:function(_25b){
return $(_25b).datagrid("getRows");
}},view:_20b,onBeforeLoad:function(_25c){
},onLoadSuccess:function(){
},onLoadError:function(){
},onClickRow:function(_25d,_25e){
},onDblClickRow:function(_25f,_260){
},onClickCell:function(_261,_262,_263){
},onDblClickCell:function(_264,_265,_266){
},onBeforeSortColumn:function(sort,_267){
},onSortColumn:function(sort,_268){
},onResizeColumn:function(_269,_26a){
},onBeforeSelect:function(_26b,_26c){
},onSelect:function(_26d,_26e){
},onBeforeUnselect:function(_26f,_270){
},onUnselect:function(_271,_272){
},onSelectAll:function(rows){
},onUnselectAll:function(rows){
},onBeforeCheck:function(_273,_274){
},onCheck:function(_275,_276){
},onBeforeUncheck:function(_277,_278){
},onUncheck:function(_279,_27a){
},onCheckAll:function(rows){
},onUncheckAll:function(rows){
},onBeforeEdit:function(_27b,_27c){
},onBeginEdit:function(_27d,_27e){
},onEndEdit:function(_27f,_280,_281){
},onAfterEdit:function(_282,_283,_284){
},onCancelEdit:function(_285,_286){
},onHeaderContextMenu:function(e,_287){
},onRowContextMenu:function(e,_288,_289){
}});
})(jQuery);

﻿/**
 * propertygrid 
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	var currTarget;
	$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
		var p = $(e.target).closest('div.datagrid-view,div.combo-panel');
		if (p.length){return;}
		stopEditing(currTarget);
		currTarget = undefined;
	});
	
	function buildGrid(target){
		var state = $.data(target, 'propertygrid');
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			cls:'propertygrid',
			view:(opts.showGroup ? opts.groupView : opts.view),
			onBeforeEdit:function(index, row){
				if (opts.onBeforeEdit.call(target, index, row) == false){return false;}
				var dg = $(this);
				var row = dg.datagrid('getRows')[index];
				var col = dg.datagrid('getColumnOption', 'value');
				col.editor = row.editor;
			},
			onClickCell:function(index, field, value){
				if (currTarget != this){
					stopEditing(currTarget);
					currTarget = this;
				}
				if (opts.editIndex != index){
					stopEditing(currTarget);
					$(this).datagrid('beginEdit', index);
					var ed = $(this).datagrid('getEditor', {index:index,field:field});
					if (!ed){
						ed = $(this).datagrid('getEditor', {index:index,field:'value'});
					}
					if (ed){
						var t = $(ed.target);
						var input = t.data('textbox') ? t.textbox('textbox') : t;
						input.focus();
						opts.editIndex = index;
					}
				}
				opts.onClickCell.call(target, index, field, value);
			},
			loadFilter:function(data){
				stopEditing(this);
				return opts.loadFilter.call(this, data);
			}
		}));
	}
	
	function stopEditing(target){
		var t = $(target);
		if (!t.length){return}
		var opts = $.data(target, 'propertygrid').options;
		opts.finder.getTr(target, null, 'editing').each(function(){
			var index = parseInt($(this).attr('datagrid-row-index'));
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		});
		opts.editIndex = undefined;
	}
	
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.columns = $.extend(true, [], opts.columns);
				$.data(this, 'propertygrid', {
					options: opts
				});
			}
			buildGrid(this);
		});
	}
	
	$.fn.propertygrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'propertygrid').options;
		}
	};
	
	$.fn.propertygrid.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,[{showGroup:'boolean'}]));
	};
	
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var table = [];
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				table.push(this.renderGroup.call(this, target, i, groups[i], frozen));
			}
			$(container).html(table.join(''));
		},
		
		renderGroup: function(target, groupIndex, group, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			table.push('<div class="datagrid-group" group-index=' + groupIndex + '>');
			if ((frozen && (opts.rownumbers || opts.frozenColumns.length)) ||
					(!frozen && !(opts.rownumbers || opts.frozenColumns.length))){
				table.push('<span class="datagrid-group-expander">');
				table.push('<span class="datagrid-row-expander datagrid-row-collapse">&nbsp;</span>');
				table.push('</span>');
			}
			if (!frozen){
				table.push('<span class="datagrid-group-title">');
				table.push(opts.groupFormatter.call(target, group.value, group.rows));
				table.push('</span>');
			}
			table.push('</div>');
			
			table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
			var index = group.startIndex;
			for(var j=0; j<group.rows.length; j++) {
				var css = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				
				var cls = 'class="datagrid-row ' + (index % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
				table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
				table.push('</tr>');
				index++;
			}
			table.push('</tbody></table>');
			return table.join('');
		},
		
		bindEvents: function(target){
			var state = $.data(target, 'datagrid');
			var dc = state.dc;
			var body = dc.body1.add(dc.body2);
			var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
			body.unbind('click').bind('click', function(e){
				var tt = $(e.target);
				var expander = tt.closest('span.datagrid-row-expander');
				if (expander.length){
					var gindex = expander.closest('div.datagrid-group').attr('group-index');
					if (expander.hasClass('datagrid-row-collapse')){
						$(target).datagrid('collapseGroup', gindex);
					} else {
						$(target).datagrid('expandGroup', gindex);
					}
				} else {
					clickHandler(e);
				}
				e.stopPropagation();
			});
		},
		
		onBeforeRender: function(target, rows){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			
			initCss();
			
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						value: row[opts.groupField],
						rows: [row]
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			var index = 0;
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				group.startIndex = index;
				index += group.rows.length;
				newRows = newRows.concat(group.rows);
			}
			
			state.data.rows = newRows;
			this.groups = groups;
			
			var that = this;
			setTimeout(function(){
				that.bindEvents(target);
			},0);
			
			function getGroup(value){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.value == value){
						return group;
					}
				}
				return null;
			}
			function initCss(){
				if (!$('#datagrid-group-style').length){
					$('head').append(
						'<style id="datagrid-group-style">' +
						'.datagrid-group{height:'+opts.groupHeight+'px;overflow:hidden;font-weight:bold;border-bottom:1px solid #ccc;}' +
						'.datagrid-group-title,.datagrid-group-expander{display:inline-block;vertical-align:bottom;height:100%;line-height:'+opts.groupHeight+'px;padding:0 4px;}' +
						'.datagrid-group-expander{width:'+opts.expanderWidth+'px;text-align:center;padding:0}' +
						'.datagrid-row-expander{margin:'+Math.floor((opts.groupHeight-16)/2)+'px 0;display:inline-block;width:16px;height:16px;cursor:pointer}' +
						'</style>'
					);
				}
			}
		}
	});

	$.extend($.fn.datagrid.methods, {
		groups:function(jq){
			return jq.datagrid('options').view.groups;
		},
	    expandGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-expand')){
	                expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
	                group.next('table').show();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    },
	    collapseGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-collapse')){
	                expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
	                group.next('table').hide();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    }
	});

	$.extend(groupview, {
		refreshGroupTitle: function(target, groupIndex){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var group = this.groups[groupIndex];
			var span = dc.body2.children('div.datagrid-group[group-index=' + groupIndex + ']').find('span.datagrid-group-title');
			span.html(opts.groupFormatter.call(target, group.value, group.rows));
		},
		
		insertRow: function(target, index, row){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var group = null;
			var groupIndex;
			
			if (!state.data.rows.length){
				$(target).datagrid('loadData', [row]);
				return;
			}
			
			for(var i=0; i<this.groups.length; i++){
				if (this.groups[i].value == row[opts.groupField]){
					group = this.groups[i];
					groupIndex = i;
					break;
				}
			}
			if (group){
				if (index == undefined || index == null){
					index = state.data.rows.length;
				}
				if (index < group.startIndex){
					index = group.startIndex;
				} else if (index > group.startIndex + group.rows.length){
					index = group.startIndex + group.rows.length;
				}
				$.fn.datagrid.defaults.view.insertRow.call(this, target, index, row);
				
				if (index >= group.startIndex + group.rows.length){
					_moveTr(index, true);
					_moveTr(index, false);
				}
				group.rows.splice(index - group.startIndex, 0, row);
			} else {
				group = {
					value: row[opts.groupField],
					rows: [row],
					startIndex: state.data.rows.length
				}
				groupIndex = this.groups.length;
				dc.body1.append(this.renderGroup.call(this, target, groupIndex, group, true));
				dc.body2.append(this.renderGroup.call(this, target, groupIndex, group, false));
				this.groups.push(group);
				state.data.rows.push(row);
			}
			
			this.refreshGroupTitle(target, groupIndex);
			
			function _moveTr(index,frozen){
				var serno = frozen?1:2;
				var prevTr = opts.finder.getTr(target, index-1, 'body', serno);
				var tr = opts.finder.getTr(target, index, 'body', serno);
				tr.insertAfter(prevTr);
			}
		},
		
		updateRow: function(target, index, row){
			var opts = $.data(target, 'datagrid').options;
			$.fn.datagrid.defaults.view.updateRow.call(this, target, index, row);
			var tb = opts.finder.getTr(target, index, 'body', 2).closest('table.datagrid-btable');
			var groupIndex = parseInt(tb.prev().attr('group-index'));
			this.refreshGroupTitle(target, groupIndex);
		},
		
		deleteRow: function(target, index){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var body = dc.body1.add(dc.body2);
			
			var tb = opts.finder.getTr(target, index, 'body', 2).closest('table.datagrid-btable');
			var groupIndex = parseInt(tb.prev().attr('group-index'));
			
			$.fn.datagrid.defaults.view.deleteRow.call(this, target, index);
			
			var group = this.groups[groupIndex];
			if (group.rows.length > 1){
				group.rows.splice(index-group.startIndex, 1);
				this.refreshGroupTitle(target, groupIndex);
			} else {
				body.children('div.datagrid-group[group-index='+groupIndex+']').remove();
				for(var i=groupIndex+1; i<this.groups.length; i++){
					body.children('div.datagrid-group[group-index='+i+']').attr('group-index', i-1);
				}
				this.groups.splice(groupIndex, 1);
			}
			
			var index = 0;
			for(var i=0; i<this.groups.length; i++){
				var group = this.groups[i];
				group.startIndex = index;
				index += group.rows.length;
			}
		}
	});


	// end of group view definition
	
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		groupHeight:21,
		expanderWidth:16,
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		
		showGroup:false,
		groupView:groupview,
		groupField:'group',
		groupFormatter:function(fvalue,rows){return fvalue}
	});
})(jQuery);
﻿/**
 * treegrid
 * 
 */
(function($){
function _1(_2){
var _3=$.data(_2,"treegrid");
var _4=_3.options;
$(_2).datagrid($.extend({},_4,{url:null,data:null,loader:function(){
return false;
},onBeforeLoad:function(){
return false;
},onLoadSuccess:function(){
},onResizeColumn:function(_5,_6){
_16(_2);
_4.onResizeColumn.call(_2,_5,_6);
},onBeforeSortColumn:function(_7,_8){
if(_4.onBeforeSortColumn.call(_2,_7,_8)==false){
return false;
}
},onSortColumn:function(_9,_a){
_4.sortName=_9;
_4.sortOrder=_a;
if(_4.remoteSort){
_15(_2);
}else{
var _b=$(_2).treegrid("getData");
_4f(_2,null,_b);
}
_4.onSortColumn.call(_2,_9,_a);
},onClickCell:function(_c,_d){
_4.onClickCell.call(_2,_d,_30(_2,_c));
},onDblClickCell:function(_e,_f){
_4.onDblClickCell.call(_2,_f,_30(_2,_e));
},onRowContextMenu:function(e,_10){
_4.onContextMenu.call(_2,e,_30(_2,_10));
}}));
var _11=$.data(_2,"datagrid").options;
_4.columns=_11.columns;
_4.frozenColumns=_11.frozenColumns;
_3.dc=$.data(_2,"datagrid").dc;
if(_4.pagination){
var _12=$(_2).datagrid("getPager");
_12.pagination({pageNumber:_4.pageNumber,pageSize:_4.pageSize,pageList:_4.pageList,onSelectPage:function(_13,_14){
_4.pageNumber=_13;
_4.pageSize=_14;
_15(_2);
}});
_4.pageSize=_12.pagination("options").pageSize;
}
};
function _16(_17,_18){
var _19=$.data(_17,"datagrid").options;
var dc=$.data(_17,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!_19.nowrap||_19.autoRowHeight)){
if(_18!=undefined){
var _1a=_1b(_17,_18);
for(var i=0;i<_1a.length;i++){
_1c(_1a[i][_19.idField]);
}
}
}
$(_17).datagrid("fixRowHeight",_18);
function _1c(_1d){
var tr1=_19.finder.getTr(_17,_1d,"body",1);
var tr2=_19.finder.getTr(_17,_1d,"body",2);
tr1.css("height","");
tr2.css("height","");
var _1e=Math.max(tr1.height(),tr2.height());
tr1.css("height",_1e);
tr2.css("height",_1e);
};
};
function _1f(_20){
var dc=$.data(_20,"datagrid").dc;
var _21=$.data(_20,"treegrid").options;
if(!_21.rownumbers){
return;
}
dc.body1.find("div.datagrid-cell-rownumber").each(function(i){
$(this).html(i+1);
});
};
function _22(_23){
return function(e){
$.fn.datagrid.defaults.rowEvents[_23?"mouseover":"mouseout"](e);
var tt=$(e.target);
var fn=_23?"addClass":"removeClass";
if(tt.hasClass("tree-hit")){
tt.hasClass("tree-expanded")?tt[fn]("tree-expanded-hover"):tt[fn]("tree-collapsed-hover");
}
};
};
function _24(e){
var tt=$(e.target);
if(tt.hasClass("tree-hit")){
_25(_26);
}else{
if(tt.hasClass("tree-checkbox")){
_25(_27);
}else{
$.fn.datagrid.defaults.rowEvents.click(e);
}
}
function _25(fn){
var tr=tt.closest("tr.datagrid-row");
var _28=tr.closest("div.datagrid-view").children(".datagrid-f")[0];
fn(_28,tr.attr("node-id"));
};
};
function _27(_29,_2a,_2b,_2c){
var _2d=$.data(_29,"treegrid");
var _2e=_2d.checkedRows;
var _2f=_2d.options;
if(!_2f.checkbox){
return;
}
var row=_30(_29,_2a);
if(!row.checkState){
return;
}
var tr=_2f.finder.getTr(_29,_2a);
var ck=tr.find(".tree-checkbox");
if(_2b==undefined){
if(ck.hasClass("tree-checkbox1")){
_2b=false;
}else{
if(ck.hasClass("tree-checkbox0")){
_2b=true;
}else{
if(row._checked==undefined){
row._checked=ck.hasClass("tree-checkbox1");
}
_2b=!row._checked;
}
}
}
row._checked=_2b;
if(_2b){
if(ck.hasClass("tree-checkbox1")){
return;
}
}else{
if(ck.hasClass("tree-checkbox0")){
return;
}
}
if(!_2c){
if(_2f.onBeforeCheckNode.call(_29,row,_2b)==false){
return;
}
}
if(_2f.cascadeCheck){
_31(_29,row,_2b);
_32(_29,row);
}else{
_33(_29,row,_2b?"1":"0");
}
if(!_2c){
_2f.onCheckNode.call(_29,row,_2b);
}
};
function _33(_34,row,_35){
var _36=$.data(_34,"treegrid");
var _37=_36.checkedRows;
var _38=_36.options;
if(!row.checkState||_35==undefined){
return;
}
var tr=_38.finder.getTr(_34,row[_38.idField]);
var ck=tr.find(".tree-checkbox");
if(!ck.length){
return;
}
row.checkState=["unchecked","checked","indeterminate"][_35];
row.checked=(row.checkState=="checked");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
ck.addClass("tree-checkbox"+_35);
if(_35==0){
$.nestui.removeArrayItem(_37,_38.idField,row[_38.idField]);
}else{
$.nestui.addArrayItem(_37,_38.idField,row);
}
};
function _31(_39,row,_3a){
var _3b=_3a?1:0;
_33(_39,row,_3b);
$.nestui.forEach(row.children||[],true,function(r){
_33(_39,r,_3b);
});
};
function _32(_3c,row){
var _3d=$.data(_3c,"treegrid").options;
var _3e=_3f(_3c,row[_3d.idField]);
if(_3e){
_33(_3c,_3e,_40(_3e));
_32(_3c,_3e);
}
};
function _40(row){
var len=0;
var c0=0;
var c1=0;
$.nestui.forEach(row.children||[],false,function(r){
if(r.checkState){
len++;
if(r.checkState=="checked"){
c1++;
}else{
if(r.checkState=="unchecked"){
c0++;
}
}
}
});
if(len==0){
return undefined;
}
var _41=0;
if(c0==len){
_41=0;
}else{
if(c1==len){
_41=1;
}else{
_41=2;
}
}
return _41;
};
function _42(_43,_44){
var _45=$.data(_43,"treegrid").options;
if(!_45.checkbox){
return;
}
var row=_30(_43,_44);
var tr=_45.finder.getTr(_43,_44);
var ck=tr.find(".tree-checkbox");
if(_45.view.hasCheckbox(_43,row)){
if(!ck.length){
row.checkState=row.checkState||"unchecked";
$("<span class=\"tree-checkbox\"></span>").insertBefore(tr.find(".tree-title"));
}
if(row.checkState=="checked"){
_27(_43,_44,true,true);
}else{
if(row.checkState=="unchecked"){
_27(_43,_44,false,true);
}else{
var _46=_40(row);
if(_46===0){
_27(_43,_44,false,true);
}else{
if(_46===1){
_27(_43,_44,true,true);
}
}
}
}
}else{
ck.remove();
row.checkState=undefined;
row.checked=undefined;
_32(_43,row);
}
};
function _47(_48,_49){
var _4a=$.data(_48,"treegrid").options;
var tr1=_4a.finder.getTr(_48,_49,"body",1);
var tr2=_4a.finder.getTr(_48,_49,"body",2);
var _4b=$(_48).datagrid("getColumnFields",true).length+(_4a.rownumbers?1:0);
var _4c=$(_48).datagrid("getColumnFields",false).length;
_4d(tr1,_4b);
_4d(tr2,_4c);
function _4d(tr,_4e){
$("<tr class=\"treegrid-tr-tree\">"+"<td style=\"border:0px\" colspan=\""+_4e+"\">"+"<div></div>"+"</td>"+"</tr>").insertAfter(tr);
};
};
function _4f(_50,_51,_52,_53,_54){
var _55=$.data(_50,"treegrid");
var _56=_55.options;
var dc=_55.dc;
_52=_56.loadFilter.call(_50,_52,_51);
var _57=_30(_50,_51);
if(_57){
var _58=_56.finder.getTr(_50,_51,"body",1);
var _59=_56.finder.getTr(_50,_51,"body",2);
var cc1=_58.next("tr.treegrid-tr-tree").children("td").children("div");
var cc2=_59.next("tr.treegrid-tr-tree").children("td").children("div");
if(!_53){
_57.children=[];
}
}else{
var cc1=dc.body1;
var cc2=dc.body2;
if(!_53){
_55.data=[];
}
}
if(!_53){
cc1.empty();
cc2.empty();
}
if(_56.view.onBeforeRender){
_56.view.onBeforeRender.call(_56.view,_50,_51,_52);
}
_56.view.render.call(_56.view,_50,cc1,true);
_56.view.render.call(_56.view,_50,cc2,false);
if(_56.showFooter){
_56.view.renderFooter.call(_56.view,_50,dc.footer1,true);
_56.view.renderFooter.call(_56.view,_50,dc.footer2,false);
}
if(_56.view.onAfterRender){
_56.view.onAfterRender.call(_56.view,_50);
}
if(!_51&&_56.pagination){
var _5a=$.data(_50,"treegrid").total;
var _5b=$(_50).datagrid("getPager");
if(_5b.pagination("options").total!=_5a){
_5b.pagination({total:_5a});
}
}
_16(_50);
_1f(_50);
$(_50).treegrid("showLines");
$(_50).treegrid("setSelectionState");
$(_50).treegrid("autoSizeColumn");
if(!_54){
_56.onLoadSuccess.call(_50,_57,_52);
}
};
function _15(_5c,_5d,_5e,_5f,_60){
var _61=$.data(_5c,"treegrid").options;
var _62=$(_5c).datagrid("getPanel").find("div.datagrid-body");
if(_5d==undefined&&_61.queryParams){
_61.queryParams.id=undefined;
}
if(_5e){
_61.queryParams=_5e;
}
var _63=$.extend({},_61.queryParams);
if(_61.pagination){
$.extend(_63,{page:_61.pageNumber,rows:_61.pageSize});
}
if(_61.sortName){
$.extend(_63,{sort:_61.sortName,order:_61.sortOrder});
}
var row=_30(_5c,_5d);
if(_61.onBeforeLoad.call(_5c,row,_63)==false){
return;
}
var _64=_62.find("tr[node-id=\""+_5d+"\"] span.tree-folder");
_64.addClass("tree-loading");
$(_5c).treegrid("loading");
var _65=_61.loader.call(_5c,_63,function(_66){
_64.removeClass("tree-loading");
$(_5c).treegrid("loaded");
_4f(_5c,_5d,_66,_5f);
if(_60){
_60();
}
},function(){
_64.removeClass("tree-loading");
$(_5c).treegrid("loaded");
_61.onLoadError.apply(_5c,arguments);
if(_60){
_60();
}
});
if(_65==false){
_64.removeClass("tree-loading");
$(_5c).treegrid("loaded");
}
};
function _67(_68){
var _69=_6a(_68);
return _69.length?_69[0]:null;
};
function _6a(_6b){
return $.data(_6b,"treegrid").data;
};
function _3f(_6c,_6d){
var row=_30(_6c,_6d);
if(row._parentId){
return _30(_6c,row._parentId);
}else{
return null;
}
};
function _1b(_6e,_6f){
var _70=$.data(_6e,"treegrid").data;
if(_6f){
var _71=_30(_6e,_6f);
_70=_71?(_71.children||[]):[];
}
var _72=[];
$.nestui.forEach(_70,true,function(_73){
_72.push(_73);
});
return _72;
};
function _74(_75,_76){
var _77=$.data(_75,"treegrid").options;
var tr=_77.finder.getTr(_75,_76);
var _78=tr.children("td[field=\""+_77.treeField+"\"]");
return _78.find("span.tree-indent,span.tree-hit").length;
};
function _30(_79,_7a){
var _7b=$.data(_79,"treegrid");
var _7c=_7b.options;
var _7d=null;
$.nestui.forEach(_7b.data,true,function(_7e){
if(_7e[_7c.idField]==_7a){
_7d=_7e;
return false;
}
});
return _7d;
};
function _7f(_80,_81){
var _82=$.data(_80,"treegrid").options;
var row=_30(_80,_81);
var tr=_82.finder.getTr(_80,_81);
var hit=tr.find("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
if(_82.onBeforeCollapse.call(_80,row)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
row.state="closed";
tr=tr.next("tr.treegrid-tr-tree");
var cc=tr.children("td").children("div");
if(_82.animate){
cc.slideUp("normal",function(){
$(_80).treegrid("autoSizeColumn");
_16(_80,_81);
_82.onCollapse.call(_80,row);
});
}else{
cc.hide();
$(_80).treegrid("autoSizeColumn");
_16(_80,_81);
_82.onCollapse.call(_80,row);
}
};
function _83(_84,_85){
var _86=$.data(_84,"treegrid").options;
var tr=_86.finder.getTr(_84,_85);
var hit=tr.find("span.tree-hit");
var row=_30(_84,_85);
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
if(_86.onBeforeExpand.call(_84,row)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var _87=tr.next("tr.treegrid-tr-tree");
if(_87.length){
var cc=_87.children("td").children("div");
_88(cc);
}else{
_47(_84,row[_86.idField]);
var _87=tr.next("tr.treegrid-tr-tree");
var cc=_87.children("td").children("div");
cc.hide();
var _89=$.extend({},_86.queryParams||{});
_89.id=row[_86.idField];
_15(_84,row[_86.idField],_89,true,function(){
if(cc.is(":empty")){
_87.remove();
}else{
_88(cc);
}
});
}
function _88(cc){
row.state="open";
if(_86.animate){
cc.slideDown("normal",function(){
$(_84).treegrid("autoSizeColumn");
_16(_84,_85);
_86.onExpand.call(_84,row);
});
}else{
cc.show();
$(_84).treegrid("autoSizeColumn");
_16(_84,_85);
_86.onExpand.call(_84,row);
}
};
};
function _26(_8a,_8b){
var _8c=$.data(_8a,"treegrid").options;
var tr=_8c.finder.getTr(_8a,_8b);
var hit=tr.find("span.tree-hit");
if(hit.hasClass("tree-expanded")){
_7f(_8a,_8b);
}else{
_83(_8a,_8b);
}
};
function _8d(_8e,_8f){
var _90=$.data(_8e,"treegrid").options;
var _91=_1b(_8e,_8f);
if(_8f){
_91.unshift(_30(_8e,_8f));
}
for(var i=0;i<_91.length;i++){
_7f(_8e,_91[i][_90.idField]);
}
};
function _92(_93,_94){
var _95=$.data(_93,"treegrid").options;
var _96=_1b(_93,_94);
if(_94){
_96.unshift(_30(_93,_94));
}
for(var i=0;i<_96.length;i++){
_83(_93,_96[i][_95.idField]);
}
};
function _97(_98,_99){
var _9a=$.data(_98,"treegrid").options;
var ids=[];
var p=_3f(_98,_99);
while(p){
var id=p[_9a.idField];
ids.unshift(id);
p=_3f(_98,id);
}
for(var i=0;i<ids.length;i++){
_83(_98,ids[i]);
}
};
function _9b(_9c,_9d){
var _9e=$.data(_9c,"treegrid");
var _9f=_9e.options;
if(_9d.parent){
var tr=_9f.finder.getTr(_9c,_9d.parent);
if(tr.next("tr.treegrid-tr-tree").length==0){
_47(_9c,_9d.parent);
}
var _a0=tr.children("td[field=\""+_9f.treeField+"\"]").children("div.datagrid-cell");
var _a1=_a0.children("span.tree-icon");
if(_a1.hasClass("tree-file")){
_a1.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_a1);
if(hit.prev().length){
hit.prev().remove();
}
}
}
_4f(_9c,_9d.parent,_9d.data,_9e.data.length>0,true);
};
function _a2(_a3,_a4){
var ref=_a4.before||_a4.after;
var _a5=$.data(_a3,"treegrid").options;
var _a6=_3f(_a3,ref);
_9b(_a3,{parent:(_a6?_a6[_a5.idField]:null),data:[_a4.data]});
var _a7=_a6?_a6.children:$(_a3).treegrid("getRoots");
for(var i=0;i<_a7.length;i++){
if(_a7[i][_a5.idField]==ref){
var _a8=_a7[_a7.length-1];
_a7.splice(_a4.before?i:(i+1),0,_a8);
_a7.splice(_a7.length-1,1);
break;
}
}
_a9(true);
_a9(false);
_1f(_a3);
$(_a3).treegrid("showLines");
function _a9(_aa){
var _ab=_aa?1:2;
var tr=_a5.finder.getTr(_a3,_a4.data[_a5.idField],"body",_ab);
var _ac=tr.closest("table.datagrid-btable");
tr=tr.parent().children();
var _ad=_a5.finder.getTr(_a3,ref,"body",_ab);
if(_a4.before){
tr.insertBefore(_ad);
}else{
var sub=_ad.next("tr.treegrid-tr-tree");
tr.insertAfter(sub.length?sub:_ad);
}
_ac.remove();
};
};
function _ae(_af,_b0){
var _b1=$.data(_af,"treegrid");
var _b2=_b1.options;
var _b3=_3f(_af,_b0);
$(_af).datagrid("deleteRow",_b0);
$.nestui.removeArrayItem(_b1.checkedRows,_b2.idField,_b0);
_1f(_af);
if(_b3){
_42(_af,_b3[_b2.idField]);
}
_b1.total-=1;
$(_af).datagrid("getPager").pagination("refresh",{total:_b1.total});
$(_af).treegrid("showLines");
};
function _b4(_b5){
var t=$(_b5);
var _b6=t.treegrid("options");
if(_b6.lines){
t.treegrid("getPanel").addClass("tree-lines");
}else{
t.treegrid("getPanel").removeClass("tree-lines");
return;
}
t.treegrid("getPanel").find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
t.treegrid("getPanel").find("div.datagrid-cell").removeClass("tree-node-last tree-root-first tree-root-one");
var _b7=t.treegrid("getRoots");
if(_b7.length>1){
_b8(_b7[0]).addClass("tree-root-first");
}else{
if(_b7.length==1){
_b8(_b7[0]).addClass("tree-root-one");
}
}
_b9(_b7);
_ba(_b7);
function _b9(_bb){
$.map(_bb,function(_bc){
if(_bc.children&&_bc.children.length){
_b9(_bc.children);
}else{
var _bd=_b8(_bc);
_bd.find(".tree-icon").prev().addClass("tree-join");
}
});
if(_bb.length){
var _be=_b8(_bb[_bb.length-1]);
_be.addClass("tree-node-last");
_be.find(".tree-join").removeClass("tree-join").addClass("tree-joinbottom");
}
};
function _ba(_bf){
$.map(_bf,function(_c0){
if(_c0.children&&_c0.children.length){
_ba(_c0.children);
}
});
for(var i=0;i<_bf.length-1;i++){
var _c1=_bf[i];
var _c2=t.treegrid("getLevel",_c1[_b6.idField]);
var tr=_b6.finder.getTr(_b5,_c1[_b6.idField]);
var cc=tr.next().find("tr.datagrid-row td[field=\""+_b6.treeField+"\"] div.datagrid-cell");
cc.find("span:eq("+(_c2-1)+")").addClass("tree-line");
}
};
function _b8(_c3){
var tr=_b6.finder.getTr(_b5,_c3[_b6.idField]);
var _c4=tr.find("td[field=\""+_b6.treeField+"\"] div.datagrid-cell");
return _c4;
};
};
$.fn.treegrid=function(_c5,_c6){
if(typeof _c5=="string"){
var _c7=$.fn.treegrid.methods[_c5];
if(_c7){
return _c7(this,_c6);
}else{
return this.datagrid(_c5,_c6);
}
}
_c5=_c5||{};
return this.each(function(){
var _c8=$.data(this,"treegrid");
if(_c8){
$.extend(_c8.options,_c5);
}else{
_c8=$.data(this,"treegrid",{options:$.extend({},$.fn.treegrid.defaults,$.fn.treegrid.parseOptions(this),_c5),data:[],checkedRows:[],tmpIds:[]});
}
_1(this);
if(_c8.options.data){
$(this).treegrid("loadData",_c8.options.data);
}
_15(this);
});
};
$.fn.treegrid.methods={options:function(jq){
return $.data(jq[0],"treegrid").options;
},resize:function(jq,_c9){
return jq.each(function(){
$(this).datagrid("resize",_c9);
});
},fixRowHeight:function(jq,_ca){
return jq.each(function(){
_16(this,_ca);
});
},loadData:function(jq,_cb){
return jq.each(function(){
_4f(this,_cb.parent,_cb);
});
},load:function(jq,_cc){
return jq.each(function(){
$(this).treegrid("options").pageNumber=1;
$(this).treegrid("getPager").pagination({pageNumber:1});
$(this).treegrid("reload",_cc);
});
},reload:function(jq,id){
return jq.each(function(){
var _cd=$(this).treegrid("options");
var _ce={};
if(typeof id=="object"){
_ce=id;
}else{
_ce=$.extend({},_cd.queryParams);
_ce.id=id;
}
if(_ce.id){
var _cf=$(this).treegrid("find",_ce.id);
if(_cf.children){
_cf.children.splice(0,_cf.children.length);
}
_cd.queryParams=_ce;
var tr=_cd.finder.getTr(this,_ce.id);
tr.next("tr.treegrid-tr-tree").remove();
tr.find("span.tree-hit").removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
_83(this,_ce.id);
}else{
_15(this,null,_ce);
}
});
},reloadFooter:function(jq,_d0){
return jq.each(function(){
var _d1=$.data(this,"treegrid").options;
var dc=$.data(this,"datagrid").dc;
if(_d0){
$.data(this,"treegrid").footer=_d0;
}
if(_d1.showFooter){
_d1.view.renderFooter.call(_d1.view,this,dc.footer1,true);
_d1.view.renderFooter.call(_d1.view,this,dc.footer2,false);
if(_d1.view.onAfterRender){
_d1.view.onAfterRender.call(_d1.view,this);
}
$(this).treegrid("fixRowHeight");
}
});
},getData:function(jq){
return $.data(jq[0],"treegrid").data;
},getFooterRows:function(jq){
return $.data(jq[0],"treegrid").footer;
},getRoot:function(jq){
return _67(jq[0]);
},getRoots:function(jq){
return _6a(jq[0]);
},getParent:function(jq,id){
return _3f(jq[0],id);
},getChildren:function(jq,id){
return _1b(jq[0],id);
},getLevel:function(jq,id){
return _74(jq[0],id);
},find:function(jq,id){
return _30(jq[0],id);
},isLeaf:function(jq,id){
var _d2=$.data(jq[0],"treegrid").options;
var tr=_d2.finder.getTr(jq[0],id);
var hit=tr.find("span.tree-hit");
return hit.length==0;
},select:function(jq,id){
return jq.each(function(){
$(this).datagrid("selectRow",id);
});
},unselect:function(jq,id){
return jq.each(function(){
$(this).datagrid("unselectRow",id);
});
},collapse:function(jq,id){
return jq.each(function(){
_7f(this,id);
});
},expand:function(jq,id){
return jq.each(function(){
_83(this,id);
});
},toggle:function(jq,id){
return jq.each(function(){
_26(this,id);
});
},collapseAll:function(jq,id){
return jq.each(function(){
_8d(this,id);
});
},expandAll:function(jq,id){
return jq.each(function(){
_92(this,id);
});
},expandTo:function(jq,id){
return jq.each(function(){
_97(this,id);
});
},append:function(jq,_d3){
return jq.each(function(){
_9b(this,_d3);
});
},insert:function(jq,_d4){
return jq.each(function(){
_a2(this,_d4);
});
},remove:function(jq,id){
return jq.each(function(){
_ae(this,id);
});
},pop:function(jq,id){
var row=jq.treegrid("find",id);
jq.treegrid("remove",id);
return row;
},refresh:function(jq,id){
return jq.each(function(){
var _d5=$.data(this,"treegrid").options;
_d5.view.refreshRow.call(_d5.view,this,id);
});
},update:function(jq,_d6){
return jq.each(function(){
var _d7=$.data(this,"treegrid").options;
var row=_d6.row;
_d7.view.updateRow.call(_d7.view,this,_d6.id,row);
if(row.checked!=undefined){
row=_30(this,_d6.id);
$.extend(row,{checkState:row.checked?"checked":(row.checked===false?"unchecked":undefined)});
_42(this,_d6.id);
}
});
},beginEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("beginEdit",id);
$(this).treegrid("fixRowHeight",id);
});
},endEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("endEdit",id);
});
},cancelEdit:function(jq,id){
return jq.each(function(){
$(this).datagrid("cancelEdit",id);
});
},showLines:function(jq){
return jq.each(function(){
_b4(this);
});
},setSelectionState:function(jq){
return jq.each(function(){
$(this).datagrid("setSelectionState");
var _d8=$(this).data("treegrid");
for(var i=0;i<_d8.tmpIds.length;i++){
_27(this,_d8.tmpIds[i],true,true);
}
_d8.tmpIds=[];
});
},getCheckedNodes:function(jq,_d9){
_d9=_d9||"checked";
var _da=[];
$.nestui.forEach(jq.data("treegrid").checkedRows,false,function(row){
if(row.checkState==_d9){
_da.push(row);
}
});
return _da;
},checkNode:function(jq,id){
return jq.each(function(){
_27(this,id,true);
});
},uncheckNode:function(jq,id){
return jq.each(function(){
_27(this,id,false);
});
},clearChecked:function(jq){
return jq.each(function(){
var _db=this;
var _dc=$(_db).treegrid("options");
$(_db).datagrid("clearChecked");
$.map($(_db).treegrid("getCheckedNodes"),function(row){
_27(_db,row[_dc.idField],false,true);
});
});
}};
$.fn.treegrid.parseOptions=function(_dd){
return $.extend({},$.fn.datagrid.parseOptions(_dd),$.parser.parseOptions(_dd,["treeField",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean"}]));
};
var _de=$.extend({},$.fn.datagrid.defaults.view,{render:function(_df,_e0,_e1){
var _e2=$.data(_df,"treegrid").options;
var _e3=$(_df).datagrid("getColumnFields",_e1);
var _e4=$.data(_df,"datagrid").rowIdPrefix;
if(_e1){
if(!(_e2.rownumbers||(_e2.frozenColumns&&_e2.frozenColumns.length))){
return;
}
}
var _e5=this;
if(this.treeNodes&&this.treeNodes.length){
var _e6=_e7.call(this,_e1,this.treeLevel,this.treeNodes);
$(_e0).append(_e6.join(""));
}
function _e7(_e8,_e9,_ea){
var _eb=$(_df).treegrid("getParent",_ea[0][_e2.idField]);
var _ec=(_eb?_eb.children.length:$(_df).treegrid("getRoots").length)-_ea.length;
var _ed=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<_ea.length;i++){
var row=_ea[i];
if(row.state!="open"&&row.state!="closed"){
row.state="open";
}
var css=_e2.rowStyler?_e2.rowStyler.call(_df,row):"";
var cs=this.getStyleValue(css);
var cls="class=\"datagrid-row "+(_ec++%2&&_e2.striped?"datagrid-row-alt ":" ")+cs.c+"\"";
var _ee=cs.s?"style=\""+cs.s+"\"":"";
var _ef=_e4+"-"+(_e8?1:2)+"-"+row[_e2.idField];
_ed.push("<tr id=\""+_ef+"\" node-id=\""+row[_e2.idField]+"\" "+cls+" "+_ee+">");
_ed=_ed.concat(_e5.renderRow.call(_e5,_df,_e3,_e8,_e9,row));
_ed.push("</tr>");
if(row.children&&row.children.length){
var tt=_e7.call(this,_e8,_e9+1,row.children);
var v=row.state=="closed"?"none":"block";
_ed.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan="+(_e3.length+(_e2.rownumbers?1:0))+"><div style=\"display:"+v+"\">");
_ed=_ed.concat(tt);
_ed.push("</div></td></tr>");
}
}
_ed.push("</tbody></table>");
return _ed;
};
},renderFooter:function(_f0,_f1,_f2){
var _f3=$.data(_f0,"treegrid").options;
var _f4=$.data(_f0,"treegrid").footer||[];
var _f5=$(_f0).datagrid("getColumnFields",_f2);
var _f6=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<_f4.length;i++){
var row=_f4[i];
row[_f3.idField]=row[_f3.idField]||("foot-row-id"+i);
_f6.push("<tr class=\"datagrid-row\" node-id=\""+row[_f3.idField]+"\">");
_f6.push(this.renderRow.call(this,_f0,_f5,_f2,0,row));
_f6.push("</tr>");
}
_f6.push("</tbody></table>");
$(_f1).html(_f6.join(""));
},renderRow:function(_f7,_f8,_f9,_fa,row){
var _fb=$.data(_f7,"treegrid");
var _fc=_fb.options;
var cc=[];
if(_f9&&_fc.rownumbers){
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
}
for(var i=0;i<_f8.length;i++){
var _fd=_f8[i];
var col=$(_f7).datagrid("getColumnOption",_fd);
if(col){
var css=col.styler?(col.styler(row[_fd],row)||""):"";
var cs=this.getStyleValue(css);
var cls=cs.c?"class=\""+cs.c+"\"":"";
var _fe=col.hidden?"style=\"display:none;"+cs.s+"\"":(cs.s?"style=\""+cs.s+"\"":"");
cc.push("<td field=\""+_fd+"\" "+cls+" "+_fe+">");
var _fe="";
if(!col.checkbox){
if(col.align){
_fe+="text-align:"+col.align+";";
}
if(!_fc.nowrap){
_fe+="white-space:normal;height:auto;";
}else{
if(_fc.autoRowHeight){
_fe+="height:auto;";
}
}
}
cc.push("<div style=\""+_fe+"\" ");
if(col.checkbox){
cc.push("class=\"datagrid-cell-check ");
}else{
cc.push("class=\"datagrid-cell "+col.cellClass);
}
cc.push("\">");
if(col.checkbox){
if(row.checked){
cc.push("<input type=\"checkbox\" checked=\"checked\"");
}else{
cc.push("<input type=\"checkbox\"");
}
cc.push(" name=\""+_fd+"\" value=\""+(row[_fd]!=undefined?row[_fd]:"")+"\">");
}else{
var val=null;
if(col.formatter){
val=col.formatter(row[_fd],row);
}else{
val=row[_fd];
}
if(_fd==_fc.treeField){
for(var j=0;j<_fa;j++){
cc.push("<span class=\"tree-indent\"></span>");
}
if(row.state=="closed"){
cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
cc.push("<span class=\"tree-icon tree-folder "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
if(row.children&&row.children.length){
cc.push("<span class=\"tree-hit tree-expanded\"></span>");
cc.push("<span class=\"tree-icon tree-folder tree-folder-open "+(row.iconCls?row.iconCls:"")+"\"></span>");
}else{
cc.push("<span class=\"tree-indent\"></span>");
cc.push("<span class=\"tree-icon tree-file "+(row.iconCls?row.iconCls:"")+"\"></span>");
}
}
if(this.hasCheckbox(_f7,row)){
var _ff=0;
var crow=$.nestui.getArrayItem(_fb.checkedRows,_fc.idField,row[_fc.idField]);
if(crow){
_ff=crow.checkState=="checked"?1:2;
}else{
var prow=$.nestui.getArrayItem(_fb.checkedRows,_fc.idField,row._parentId);
if(prow&&prow.checkState=="checked"&&_fc.cascadeCheck){
_ff=1;
row.checked=true;
$.nestui.addArrayItem(_fb.checkedRows,_fc.idField,row);
}else{
if(row.checked){
$.nestui.addArrayItem(_fb.tmpIds,row[_fc.idField]);
}
}
row.checkState=_ff?"checked":"unchecked";
}
cc.push("<span class=\"tree-checkbox tree-checkbox"+_ff+"\"></span>");
}else{
row.checkState=undefined;
row.checked=undefined;
}
cc.push("<span class=\"tree-title\">"+val+"</span>");
}else{
cc.push(val);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},hasCheckbox:function(_100,row){
var opts=$.data(_100,"treegrid").options;
if(opts.checkbox){
if($.isFunction(opts.checkbox)){
if(opts.checkbox.call(_100,row)){
return true;
}else{
return false;
}
}else{
if(opts.onlyLeafCheck){
if(row.state=="open"&&!(row.children&&row.children.length)){
return true;
}
}else{
return true;
}
}
}
return false;
},refreshRow:function(_101,id){
this.updateRow.call(this,_101,id,{});
},updateRow:function(_102,id,row){
var opts=$.data(_102,"treegrid").options;
var _103=$(_102).treegrid("find",id);
$.extend(_103,row);
var _104=$(_102).treegrid("getLevel",id)-1;
var _105=opts.rowStyler?opts.rowStyler.call(_102,_103):"";
var _106=$.data(_102,"datagrid").rowIdPrefix;
var _107=_103[opts.idField];
function _108(_109){
var _10a=$(_102).treegrid("getColumnFields",_109);
var tr=opts.finder.getTr(_102,id,"body",(_109?1:2));
var _10b=tr.find("div.datagrid-cell-rownumber").html();
var _10c=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow(_102,_10a,_109,_104,_103));
tr.attr("style",_105||"");
tr.find("div.datagrid-cell-rownumber").html(_10b);
if(_10c){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
if(_107!=id){
tr.attr("id",_106+"-"+(_109?1:2)+"-"+_107);
tr.attr("node-id",_107);
}
};
_108.call(this,true);
_108.call(this,false);
$(_102).treegrid("fixRowHeight",id);
},deleteRow:function(_10d,id){
var opts=$.data(_10d,"treegrid").options;
var tr=opts.finder.getTr(_10d,id);
tr.next("tr.treegrid-tr-tree").remove();
tr.remove();
var _10e=del(id);
if(_10e){
if(_10e.children.length==0){
tr=opts.finder.getTr(_10d,_10e[opts.idField]);
tr.next("tr.treegrid-tr-tree").remove();
var cell=tr.children("td[field=\""+opts.treeField+"\"]").children("div.datagrid-cell");
cell.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
cell.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(cell);
}
}
this.setEmptyMsg(_10d);
function del(id){
var cc;
var _10f=$(_10d).treegrid("getParent",id);
if(_10f){
cc=_10f.children;
}else{
cc=$(_10d).treegrid("getData");
}
for(var i=0;i<cc.length;i++){
if(cc[i][opts.idField]==id){
cc.splice(i,1);
break;
}
}
return _10f;
};
},onBeforeRender:function(_110,_111,data){
if($.isArray(_111)){
data={total:_111.length,rows:_111};
_111=null;
}
if(!data){
return false;
}
var _112=$.data(_110,"treegrid");
var opts=_112.options;
if(data.length==undefined){
if(data.footer){
_112.footer=data.footer;
}
if(data.total){
_112.total=data.total;
}
data=this.transfer(_110,_111,data.rows);
}else{
function _113(_114,_115){
for(var i=0;i<_114.length;i++){
var row=_114[i];
row._parentId=_115;
if(row.children&&row.children.length){
_113(row.children,row[opts.idField]);
}
}
};
_113(data,_111);
}
var node=_30(_110,_111);
if(node){
if(node.children){
node.children=node.children.concat(data);
}else{
node.children=data;
}
}else{
_112.data=_112.data.concat(data);
}
this.sort(_110,data);
this.treeNodes=data;
this.treeLevel=$(_110).treegrid("getLevel",_111);
},sort:function(_116,data){
var opts=$.data(_116,"treegrid").options;
if(!opts.remoteSort&&opts.sortName){
var _117=opts.sortName.split(",");
var _118=opts.sortOrder.split(",");
_119(data);
}
function _119(rows){
rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_117.length;i++){
var sn=_117[i];
var so=_118[i];
var col=$(_116).treegrid("getColumnOption",sn);
var _11a=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_11a(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
for(var i=0;i<rows.length;i++){
var _11b=rows[i].children;
if(_11b&&_11b.length){
_119(_11b);
}
}
};
},transfer:function(_11c,_11d,data){
var opts=$.data(_11c,"treegrid").options;
var rows=$.extend([],data);
var _11e=_11f(_11d,rows);
var toDo=$.extend([],_11e);
while(toDo.length){
var node=toDo.shift();
var _120=_11f(node[opts.idField],rows);
if(_120.length){
if(node.children){
node.children=node.children.concat(_120);
}else{
node.children=_120;
}
toDo=toDo.concat(_120);
}
}
return _11e;
function _11f(_121,rows){
var rr=[];
for(var i=0;i<rows.length;i++){
var row=rows[i];
if(row._parentId==_121){
rr.push(row);
rows.splice(i,1);
i--;
}
}
return rr;
};
}});
$.fn.treegrid.defaults=$.extend({},$.fn.datagrid.defaults,{treeField:null,checkbox:false,cascadeCheck:true,onlyLeafCheck:false,lines:false,animate:false,singleSelect:true,view:_de,rowEvents:$.extend({},$.fn.datagrid.defaults.rowEvents,{mouseover:_22(true),mouseout:_22(false),click:_24}),loader:function(_122,_123,_124){
var opts=$(this).treegrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_122,dataType:"json",success:function(data){
_123(data);
},error:function(){
_124.apply(this,arguments);
}});
},loadFilter:function(data,_125){
return data;
},finder:{getTr:function(_126,id,type,_127){
type=type||"body";
_127=_127||0;
var dc=$.data(_126,"datagrid").dc;
if(_127==0){
var opts=$.data(_126,"treegrid").options;
var tr1=opts.finder.getTr(_126,id,type,1);
var tr2=opts.finder.getTr(_126,id,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+$.data(_126,"datagrid").rowIdPrefix+"-"+_127+"-"+id);
if(!tr.length){
tr=(_127==1?dc.body1:dc.body2).find("tr[node-id=\""+id+"\"]");
}
return tr;
}else{
if(type=="footer"){
return (_127==1?dc.footer1:dc.footer2).find("tr[node-id=\""+id+"\"]");
}else{
if(type=="selected"){
return (_127==1?dc.body1:dc.body2).find("tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_127==1?dc.body1:dc.body2).find("tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_127==1?dc.body1:dc.body2).find("tr.datagrid-row-checked");
}else{
if(type=="last"){
return (_127==1?dc.body1:dc.body2).find("tr:last[node-id]");
}else{
if(type=="allbody"){
return (_127==1?dc.body1:dc.body2).find("tr[node-id]");
}else{
if(type=="allfooter"){
return (_127==1?dc.footer1:dc.footer2).find("tr[node-id]");
}
}
}
}
}
}
}
}
}
},getRow:function(_128,p){
var id=(typeof p=="object")?p.attr("node-id"):p;
return $(_128).treegrid("find",id);
},getRows:function(_129){
return $(_129).treegrid("getChildren");
}},onBeforeLoad:function(row,_12a){
},onLoadSuccess:function(row,data){
},onLoadError:function(){
},onBeforeCollapse:function(row){
},onCollapse:function(row){
},onBeforeExpand:function(row){
},onExpand:function(row){
},onClickRow:function(row){
},onDblClickRow:function(row){
},onClickCell:function(_12b,row){
},onDblClickCell:function(_12c,row){
},onContextMenu:function(e,row){
},onBeforeEdit:function(row){
},onAfterEdit:function(row,_12d){
},onCancelEdit:function(row){
},onBeforeCheckNode:function(row,_12e){
},onCheckNode:function(row,_12f){
}});
})(jQuery);

﻿/**
 * datalist
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "datalist").options;
		$(_2)
				.datagrid(
						$
								.extend(
										{},
										_3,
										{
											cls : "datalist"
													+ (_3.lines ? " datalist-lines"
															: ""),
											frozenColumns : (_3.frozenColumns && _3.frozenColumns.length) ? _3.frozenColumns
													: (_3.checkbox ? [ [ {
														field : "_ck",
														checkbox : true
													} ] ] : undefined),
											columns : (_3.columns && _3.columns.length) ? _3.columns
													: [ [ {
														field : _3.textField,
														width : "100%",
														formatter : function(
																_4, _5, _6) {
															return _3.textFormatter ? _3
																	.textFormatter(
																			_4,
																			_5,
																			_6)
																	: _4;
														}
													} ] ]
										}));
	}
	;
	var _7 = $.extend({}, $.fn.datagrid.defaults.view, {
		render : function(_8, _9, _a) {
			var _b = $.data(_8, "datagrid");
			var _c = _b.options;
			if (_c.groupField) {
				var g = this.groupRows(_8, _b.data.rows);
				this.groups = g.groups;
				_b.data.rows = g.rows;
				var _d = [];
				for (var i = 0; i < g.groups.length; i++) {
					_d
							.push(this.renderGroup.call(this, _8, i,
									g.groups[i], _a));
				}
				$(_9).html(_d.join(""));
			} else {
				$(_9).html(this.renderTable(_8, 0, _b.data.rows, _a));
			}
		},
		renderGroup : function(_e, _f, _10, _11) {
			var _12 = $.data(_e, "datagrid");
			var _13 = _12.options;
			var _14 = $(_e).datagrid("getColumnFields", _11);
			var _15 = [];
			_15.push("<div class=\"datagrid-group\" group-index=" + _f + ">");
			if (!_11) {
				_15.push("<span class=\"datagrid-group-title\">");
				_15.push(_13.groupFormatter.call(_e, _10.value, _10.rows));
				_15.push("</span>");
			}
			_15.push("</div>");
			_15.push(this.renderTable(_e, _10.startIndex, _10.rows, _11));
			return _15.join("");
		},
		groupRows : function(_16, _17) {
			var _18 = $.data(_16, "datagrid");
			var _19 = _18.options;
			var _1a = [];
			for (var i = 0; i < _17.length; i++) {
				var row = _17[i];
				var _1b = _1c(row[_19.groupField]);
				if (!_1b) {
					_1b = {
						value : row[_19.groupField],
						rows : [ row ]
					};
					_1a.push(_1b);
				} else {
					_1b.rows.push(row);
				}
			}
			var _1d = 0;
			var _17 = [];
			for (var i = 0; i < _1a.length; i++) {
				var _1b = _1a[i];
				_1b.startIndex = _1d;
				_1d += _1b.rows.length;
				_17 = _17.concat(_1b.rows);
			}
			return {
				groups : _1a,
				rows : _17
			};
			function _1c(_1e) {
				for (var i = 0; i < _1a.length; i++) {
					var _1f = _1a[i];
					if (_1f.value == _1e) {
						return _1f;
					}
				}
				return null;
			}
			;
		}
	});
	$.fn.datalist = function(_20, _21) {
		if (typeof _20 == "string") {
			var _22 = $.fn.datalist.methods[_20];
			if (_22) {
				return _22(this, _21);
			} else {
				return this.datagrid(_20, _21);
			}
		}
		_20 = _20 || {};
		return this.each(function() {
			var _23 = $.data(this, "datalist");
			if (_23) {
				$.extend(_23.options, _20);
			} else {
				var _24 = $.extend({}, $.fn.datalist.defaults, $.fn.datalist
						.parseOptions(this), _20);
				_24.columns = $.extend(true, [], _24.columns);
				_23 = $.data(this, "datalist", {
					options : _24
				});
			}
			_1(this);
			if (!_23.options.data) {
				var _25 = $.fn.datalist.parseData(this);
				if (_25.total) {
					$(this).datalist("loadData", _25);
				}
			}
		});
	};
	$.fn.datalist.methods = {
		options : function(jq) {
			return $.data(jq[0], "datalist").options;
		}
	};
	$.fn.datalist.parseOptions = function(_26) {
		return $.extend({}, $.fn.datagrid.parseOptions(_26), $.parser
				.parseOptions(_26, [ "valueField", "textField", "groupField", {
					checkbox : "boolean",
					lines : "boolean"
				} ]));
	};
	$.fn.datalist.parseData = function(_27) {
		var _28 = $.data(_27, "datalist").options;
		var _29 = {
			total : 0,
			rows : []
		};
		$(_27).children().each(function() {
			var _2a = $.parser.parseOptions(this, [ "value", "group" ]);
			var row = {};
			var _2b = $(this).html();
			row[_28.valueField] = _2a.value != undefined ? _2a.value : _2b;
			row[_28.textField] = _2b;
			if (_28.groupField) {
				row[_28.groupField] = _2a.group;
			}
			_29.total++;
			_29.rows.push(row);
		});
		return _29;
	};
	$.fn.datalist.defaults = $.extend({}, $.fn.datagrid.defaults, {
		fitColumns : true,
		singleSelect : true,
		showHeader : false,
		checkbox : false,
		lines : false,
		valueField : "value",
		textField : "text",
		groupField : "",
		view : _7,
		textFormatter : function(_2c, row) {
			return _2c;
		},
		groupFormatter : function(_2d, _2e) {
			return _2d;
		}
	});
})(jQuery);
﻿/**
 * combo
 * 
 */
(function($) {
	$(function() {
		$(document).unbind(".combo").bind("mousedown.combo mousewheel.combo", function(e) {
			var p = $(e.target).closest(
					"span.combo,div.combo-p,div.menu");
			if (p.length) {
				_1(p);
				return;
			}
			$("body>div.combo-p>div.combo-panel:visible").panel("close");
		});
	});
	function _2(_3) {
		var _4 = $.data(_3, "combo");
		var _5 = _4.options;
		if (!_4.panel) {
			_4.panel = $("<div class=\"combo-panel\"></div>").appendTo("body");
			_4.panel.panel({
				minWidth : _5.panelMinWidth,
				maxWidth : _5.panelMaxWidth,
				minHeight : _5.panelMinHeight,
				maxHeight : _5.panelMaxHeight,
				doSize : false,
				closed : true,
				cls : "combo-p",
				style : {
					position : "absolute",
					zIndex : 10
				},
				onOpen : function() {
					var _6 = $(this).panel("options").comboTarget;
					var _7 = $.data(_6, "combo");
					if (_7) {
						_7.options.onShowPanel.call(_6);
					}
				},
				onBeforeClose : function() {
					_1($(this).parent());
				},
				onClose : function() {
					var _8 = $(this).panel("options").comboTarget;
					var _9 = $(_8).data("combo");
					if (_9) {
						_9.options.onHidePanel.call(_8);
					}
				}
			});
		}
		var _a = $.extend(true, [], _5.icons);
		if (_5.hasDownArrow) {
			_a.push({
				iconCls : "combo-arrow",
				handler : function(e) {
					_f(e.data.target);
				}
			});
		}
		$(_3).addClass("combo-f").textbox($.extend({}, _5, {
			icons : _a,
			onChange : function() {
			}
		}));
		$(_3).attr("comboName", $(_3).attr("textboxName"));
		_4.combo = $(_3).next();
		_4.combo.addClass("combo");
	}
	;
	function _b(_c) {
		var _d = $.data(_c, "combo");
		var _e = _d.options;
		var p = _d.panel;
		if (p.is(":visible")) {
			p.panel("close");
		}
		if (!_e.cloned) {
			p.panel("destroy");
		}
		$(_c).textbox("destroy");
	}
	;
	function _f(_10) {
		var _11 = $.data(_10, "combo").panel;
		if (_11.is(":visible")) {
			var _12 = _11.combo("combo");
			_13(_12);
			if (_12 != _10) {
				$(_10).combo("showPanel");
			}
		} else {
			var p = $(_10).closest("div.combo-p").children(".combo-panel");
			$("div.combo-panel:visible").not(_11).not(p).panel("close");
			$(_10).combo("showPanel");
		}
		$(_10).combo("textbox").focus();
	}
	;
	function _1(_14) {
		$(_14).find(".combo-f").each(function() {
			var p = $(this).combo("panel");
			if (p.is(":visible")) {
				p.panel("close");
			}
		});
	}
	;
	function _15(e) {
		var _16 = e.data.target;
		var _17 = $.data(_16, "combo");
		var _18 = _17.options;
		if (!_18.editable) {
			_f(_16);
		} else {
			var p = $(_16).closest("div.combo-p").children(".combo-panel");
			$("div.combo-panel:visible").not(p).each(function() {
				var _19 = $(this).combo("combo");
				if (_19 != _16) {
					_13(_19);
				}
			});
		}
	}
	;
	function _1a(e) {
		var _1b = e.data.target;
		var t = $(_1b);
		var _1c = t.data("combo");
		var _1d = t.combo("options");
		_1c.panel.panel("options").comboTarget = _1b;
		switch (e.keyCode) {
		case 38:
			_1d.keyHandler.up.call(_1b, e);
			break;
		case 40:
			_1d.keyHandler.down.call(_1b, e);
			break;
		case 37:
			_1d.keyHandler.left.call(_1b, e);
			break;
		case 39:
			_1d.keyHandler.right.call(_1b, e);
			break;
		case 13:
			e.preventDefault();
			_1d.keyHandler.enter.call(_1b, e);
			return false;
		case 9:
		case 27:
			_13(_1b);
			break;
		default:
			if (_1d.editable) {
				if (_1c.timer) {
					clearTimeout(_1c.timer);
				}
				_1c.timer = setTimeout(function() {
					var q = t.combo("getText");
					if (_1c.previousText != q) {
						_1c.previousText = q;
						t.combo("showPanel");
						_1d.keyHandler.query.call(_1b, q, e);
						t.combo("validate");
					}
				}, _1d.delay);
			}
		}
	}
	;
	function _1e(_1f) {
		var _20 = $.data(_1f, "combo");
		var _21 = _20.combo;
		var _22 = _20.panel;
		var _23 = $(_1f).combo("options");
		var _24 = _22.panel("options");
		_24.comboTarget = _1f;
		if (_24.closed) {
			_22.panel("panel").show().css(
					{
						zIndex : ($.fn.menu ? $.fn.menu.defaults.zIndex++
								: ($.fn.window ? $.fn.window.defaults.zIndex++
										: 99)),
						left : -999999
					});
			_22.panel("resize", {
				width : (_23.panelWidth ? _23.panelWidth : _21._outerWidth()),
				height : _23.panelHeight
			});
			_22.panel("panel").hide();
			_22.panel("open");
		}
		(function() {
			if (_24.comboTarget == _1f && _22.is(":visible")) {
				_22.panel("move", {
					left : _25(),
					top : _26()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		function _25() {
			var _27 = _21.offset().left;
			if (_23.panelAlign == "right") {
				_27 += _21._outerWidth() - _22._outerWidth();
			}
			if (_27 + _22._outerWidth() > $(window)._outerWidth()
					+ $(document).scrollLeft()) {
				_27 = $(window)._outerWidth() + $(document).scrollLeft()
						- _22._outerWidth();
			}
			if (_27 < 0) {
				_27 = 0;
			}
			return _27;
		}
		;
		function _26() {
			var top = _21.offset().top + _21._outerHeight();
			if (top + _22._outerHeight() > $(window)._outerHeight()
					+ $(document).scrollTop()) {
				top = _21.offset().top - _22._outerHeight();
			}
			if (top < $(document).scrollTop()) {
				top = _21.offset().top + _21._outerHeight();
			}
			return top;
		};
	};
	function _13(_28) {
		var _29 = $.data(_28, "combo").panel;
		_29.panel("close");
	};
	function _2a(_2b, _2c) {
		var _2d = $.data(_2b, "combo");
		var _2e = $(_2b).textbox("getText");
		if (_2e != _2c) {
			$(_2b).textbox("setText", _2c);
			_2d.previousText = _2c;
		}
	};
	function _2f(_30) {
		var _31 = [];
		var _32 = $.data(_30, "combo").combo;
		_32.find(".textbox-value").each(function() {
			_31.push($(this).val());
		});
		return _31;
	};
	function _33(_34, _35) {
		var _36 = $.data(_34, "combo");
		var _37 = _36.options;
		var _38 = _36.combo;
		if (!$.isArray(_35)) {
			_35 = _35.split(_37.separator);
		}
		var _39 = _2f(_34);
		_38.find(".textbox-value").remove();
		var _3a = $(_34).attr("textboxName") || "";
		for (var i = 0; i < _35.length; i++) {
			var _3b = $("<input type=\"hidden\" class=\"textbox-value\">")
					.appendTo(_38);
			_3b.attr("name", _3a);
			if (_37.disabled) {
				_3b.attr("disabled", "disabled");
			}
			_3b.val(_35[i]);
		}
		var _3c = (function() {
			if (_39.length != _35.length) {
				return true;
			}
			var a1 = $.extend(true, [], _39);
			var a2 = $.extend(true, [], _35);
			a1.sort();
			a2.sort();
			for (var i = 0; i < a1.length; i++) {
				if (a1[i] != a2[i]) {
					return true;
				}
			}
			return false;
		})();
		if (_3c) {
			if (_37.multiple) {
				_37.onChange.call(_34, _35, _39);
			} else {
				_37.onChange.call(_34, _35[0], _39[0]);
			}
			$(_34).closest("form").trigger("_change", [ _34 ]);
		}
	};
	function _3d(_3e) {
		var _3f = _2f(_3e);
		return _3f[0];
	};
	function _40(_41, _42) {
		_33(_41, [ _42 ]);
	};
	function _43(_44) {
		var _45 = $.data(_44, "combo").options;
		var _46 = _45.onChange;
		_45.onChange = function() {
		};
		if (_45.multiple) {
			_33(_44, _45.value ? _45.value : []);
		} else {
			_40(_44, _45.value);
		}
		_45.onChange = _46;
	};
	$.fn.combo = function(_47, _48) {
		if (typeof _47 == "string") {
			var _49 = $.fn.combo.methods[_47];
			if (_49) {
				return _49(this, _48);
			} else {
				return this.textbox(_47, _48);
			}
		}
		_47 = _47 || {};
		return this.each(function() {
			var _4a = $.data(this, "combo");
			if (_4a) {
				$.extend(_4a.options, _47);
				if (_47.value != undefined) {
					_4a.options.originalValue = _47.value;
				}
			} else {
				_4a = $.data(this, "combo", {
					options : $.extend({}, $.fn.combo.defaults, $.fn.combo
							.parseOptions(this), _47),
					previousText : ""
				});
				_4a.options.originalValue = _4a.options.value;
			}
			_2(this);
			_43(this);
		});
	};
	$.fn.combo.methods = {
		options : function(jq) {
			var _4b = jq.textbox("options");
			return $.extend($.data(jq[0], "combo").options, {
				width : _4b.width,
				height : _4b.height,
				disabled : _4b.disabled,
				readonly : _4b.readonly
			});
		},
		cloneFrom : function(jq, _4c) {
			return jq.each(function() {
				$(this).textbox("cloneFrom", _4c);
				$.data(this, "combo", {
					options : $.extend(true, {
						cloned : true
					}, $(_4c).combo("options")),
					combo : $(this).next(),
					panel : $(_4c).combo("panel")
				});
				$(this).addClass("combo-f").attr("comboName",
						$(this).attr("textboxName"));
			});
		},
		combo : function(jq) {
			return jq.closest(".combo-panel").panel("options").comboTarget;
		},
		panel : function(jq) {
			return $.data(jq[0], "combo").panel;
		},
		destroy : function(jq) {
			return jq.each(function() {
				_b(this);
			});
		},
		showPanel : function(jq) {
			return jq.each(function() {
				_1e(this);
			});
		},
		hidePanel : function(jq) {
			return jq.each(function() {
				_13(this);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).textbox("setText", "");
				var _4d = $.data(this, "combo").options;
				if (_4d.multiple) {
					$(this).combo("setValues", []);
				} else {
					$(this).combo("setValue", "");
				}
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _4e = $.data(this, "combo").options;
				if (_4e.multiple) {
					$(this).combo("setValues", _4e.originalValue);
				} else {
					$(this).combo("setValue", _4e.originalValue);
				}
			});
		},
		setText : function(jq, _4f) {
			return jq.each(function() {
				_2a(this, _4f);
			});
		},
		getValues : function(jq) {
			return _2f(jq[0]);
		},
		setValues : function(jq, _50) {
			return jq.each(function() {
				_33(this, _50);
			});
		},
		getValue : function(jq) {
			return _3d(jq[0]);
		},
		setValue : function(jq, _51) {
			return jq.each(function() {
				_40(this, _51);
			});
		}
	};
	$.fn.combo.parseOptions = function(_52) {
		var t = $(_52);
		return $.extend({}, $.fn.textbox.parseOptions(_52), $.parser
				.parseOptions(_52, [ "separator", "panelAlign", {
					panelWidth : "number",
					hasDownArrow : "boolean",
					delay : "number",
					selectOnNavigation : "boolean"
				}, {
					panelMinWidth : "number",
					panelMaxWidth : "number",
					panelMinHeight : "number",
					panelMaxHeight : "number"
				} ]), {
			panelHeight : (t.attr("panelHeight") == "auto" ? "auto"
					: parseInt(t.attr("panelHeight")) || undefined),
			multiple : (t.attr("multiple") ? true : undefined)
		});
	};
	$.fn.combo.defaults = $.extend({}, $.fn.textbox.defaults, {
		inputEvents : {
			click : _15,
			keydown : _1a,
			paste : _1a,
			drop : _1a
		},
		panelWidth : null,
		panelHeight : 200,
		panelMinWidth : null,
		panelMaxWidth : null,
		panelMinHeight : null,
		panelMaxHeight : null,
		panelAlign : "left",
		multiple : false,
		selectOnNavigation : true,
		separator : ",",
		hasDownArrow : true,
		delay : 200,
		keyHandler : {
			up : function(e) {},
			down : function(e) {},
			left : function(e) {},
			right : function(e) {},
			enter : function(e) {},
			query : function(q, e) {}
		},
		onShowPanel : function() {},
		onHidePanel : function() {},
		onChange : function(_53, _54) {}
	});
})(jQuery);﻿/**
 * combobox
 * 
 * Dependencies:
 *   combo
 * 
 */
(function($){
	function getRowIndex(target, value){
		var state = $.data(target, 'combobox');
		return $.nestui.indexOfArray(state.data, state.options.valueField, value);
	}
	
	/**
	 * scroll panel to display the specified item
	 */
	function scrollTo(target, value){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		var item = opts.finder.getEl(target, value);
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
		panel.triggerHandler('scroll');	// trigger the group sticking
	}
	
	function nav(target, dir){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combobox('panel');
		var item = panel.children('div.combobox-item-hover');
		if (!item.length){
			item = panel.children('div.combobox-item-selected');
		}
		item.removeClass('combobox-item-hover');
		var firstSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):first';
		var lastSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):last';
		if (!item.length){
			item = panel.children(dir=='next' ? firstSelector : lastSelector);
		} else {
			if (dir == 'next'){
				item = item.nextAll(firstSelector);
				if (!item.length){
					item = panel.children(firstSelector);
				}
			} else {
				item = item.prevAll(firstSelector);
				if (!item.length){
					item = panel.children(lastSelector);
				}
			}
		}
		if (item.length){
			item.addClass('combobox-item-hover');
			var row = opts.finder.getRow(target, item);
			if (row){
				$(target).combobox('scrollTo', row[opts.valueField]);
				if (opts.selectOnNavigation){
					select(target, row[opts.valueField]);
				}
			}
		}
	}
	
	/**
	 * select the specified value
	 */
	function select(target, value, remainText){
		var opts = $.data(target, 'combobox').options;
		var values = $(target).combo('getValues');
		if ($.inArray(value+'', values) == -1){
			if (opts.multiple){
				values.push(value);
			} else {
				values = [value];
			}
			setValues(target, values, remainText);
		}
	}
	
	/**
	 * unselect the specified value
	 */
	function unselect(target, value){
		var opts = $.data(target, 'combobox').options;
		var values = $(target).combo('getValues');
		var index = $.inArray(value+'', values);
		if (index >= 0){
			values.splice(index, 1);
			setValues(target, values);
		}
	}
	
	/**
	 * set values
	 */
	function setValues(target, values, remainText){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		
		if (!$.isArray(values)){
			values = values.split(opts.separator);
		}
		if (!opts.multiple){
			values = values.length ? [values[0]] : [''];
		}

		// unselect the old rows
		$.map($(target).combo('getValues'), function(v){
			if ($.nestui.indexOfArray(values, v) == -1){
				var el = opts.finder.getEl(target, v);
				if (el.hasClass('combobox-item-selected')){
					el.removeClass('combobox-item-selected');
					opts.onUnselect.call(target, opts.finder.getRow(target, v));
				}
			}
		});

		var theRow = null;
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			var row = opts.finder.getRow(target, v);
			if (row){
				s = row[opts.textField];
				theRow = row;
				var el = opts.finder.getEl(target, v);
				if (!el.hasClass('combobox-item-selected')){
					el.addClass('combobox-item-selected');
					opts.onSelect.call(target, row);
				}
			}
			vv.push(v);
			ss.push(s);
		}

		if (!remainText){
			$(target).combo('setText', ss.join(opts.separator));
		}
		if (opts.showItemIcon){
			var tb = $(target).combobox('textbox');
			tb.removeClass('textbox-bgicon ' + opts.textboxIconCls);
			if (theRow && theRow.iconCls){
				tb.addClass('textbox-bgicon ' + theRow.iconCls);
				opts.textboxIconCls = theRow.iconCls;
			}
		}
		$(target).combo('setValues', vv);
		panel.triggerHandler('scroll');	// trigger the group sticking
	}
	
	/**
	 * load data, the old list items will be removed.
	 */
	function loadData(target, data, remainText){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		state.data = opts.loadFilter.call(target, data);

		opts.view.render.call(opts.view, target, $(target).combo('panel'), state.data);		

		var vv = $(target).combobox('getValues');
		$.nestui.forEach(state.data, false, function(row){
			if (row['selected']){
				$.nestui.addArrayItem(vv, row[opts.valueField]+'');
			}
		});
		if (opts.multiple){
			setValues(target, vv, remainText);
		} else {
			setValues(target, vv.length ? [vv[vv.length-1]] : [], remainText);
		}
		
		opts.onLoadSuccess.call(target, data);
	}
	
	/**
	 * request remote data if the url property is setted.
	 */
	function request(target, url, param, remainText){
		var opts = $.data(target, 'combobox').options;
		if (url){
			opts.url = url;
		}
		param = $.extend({}, opts.queryParams, param||{});
//		param = param || {};
		
		if (opts.onBeforeLoad.call(target, param) == false) return;

		opts.loader.call(target, param, function(data){
			loadData(target, data, remainText);
		}, function(){
			opts.onLoadError.apply(this, arguments);
		});
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		
		var qq = opts.multiple ? q.split(opts.separator) : [q];
		if (opts.mode == 'remote'){
			_setValues(qq);
			request(target, null, {q:q}, true);
		} else {
			var panel = $(target).combo('panel');
			panel.find('.combobox-item-hover').removeClass('combobox-item-hover');
			panel.find('.combobox-item,.combobox-group').hide();
			var data = state.data;
			var vv = [];
			$.map(qq, function(q){
				q = $.trim(q);
				var value = q;
				var group = undefined;
				for(var i=0; i<data.length; i++){
					var row = data[i];
					if (opts.filter.call(target, q, row)){
						var v = row[opts.valueField];
						var s = row[opts.textField];
						var g = row[opts.groupField];
						var item = opts.finder.getEl(target, v).show();
						if (s.toLowerCase() == q.toLowerCase()){
							value = v;
							select(target, v, true);
						}
						if (opts.groupField && group != g){
							opts.finder.getGroupEl(target, g).show();
							group = g;
						}
					}
				}
				vv.push(value);
			});
			_setValues(vv);
		}
		function _setValues(vv){
			setValues(target, opts.multiple ? (q?vv:[]) : vv, true);
		}
	}
	
	function doEnter(target){
		var t = $(target);
		var opts = t.combobox('options');
		var panel = t.combobox('panel');
		var item = panel.children('div.combobox-item-hover');
		if (item.length){
			var row = opts.finder.getRow(target, item);
			var value = row[opts.valueField];
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					t.combobox('unselect', value);
				} else {
					t.combobox('select', value);
				}
			} else {
				t.combobox('select', value);
			}
		}
		var vv = [];
		$.map(t.combobox('getValues'), function(v){
			if (getRowIndex(target, v) >= 0){
				vv.push(v);
			}
		});
		t.combobox('setValues', vv);
		if (!opts.multiple){
			t.combobox('hidePanel');
		}
	}
	
	/**
	 * create the component
	 */
	function create(target){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		
		$(target).addClass('combobox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel: function(){
				$(this).combo('panel').find('div.combobox-item:hidden,div.combobox-group:hidden').show();
				setValues(this, $(this).combobox('getValues'), true);
				$(this).combobox('scrollTo', $(this).combobox('getValue'));
				opts.onShowPanel.call(this);
			}
		}));

		var p = $(target).combo('panel');
		p.unbind('.combobox');
		for(var event in opts.panelEvents){
			p.bind(event+'.combobox', {target:target}, opts.panelEvents[event]);
		}
	}

	function mouseoverHandler(e){
		$(this).children('div.combobox-item-hover').removeClass('combobox-item-hover');
		var item = $(e.target).closest('div.combobox-item');
		if (!item.hasClass('combobox-item-disabled')){
			item.addClass('combobox-item-hover');
		}
		e.stopPropagation();
	}
	function mouseoutHandler(e){
		$(e.target).closest('div.combobox-item').removeClass('combobox-item-hover');
		e.stopPropagation();
	}
	function clickHandler(e){
		var target = $(this).panel('options').comboTarget;
		if (!target){return;}
		var opts = $(target).combobox('options');
		var item = $(e.target).closest('div.combobox-item');
		if (!item.length || item.hasClass('combobox-item-disabled')){return}
		var row = opts.finder.getRow(target, item);
		if (!row){return}
		var value = row[opts.valueField];
		if (opts.multiple){
			if (item.hasClass('combobox-item-selected')){
				unselect(target, value);
			} else {
				select(target, value);
			}
		} else {
			$(target).combobox('setValue', value).combobox('hidePanel');
		}
		e.stopPropagation();
	}
	function scrollHandler(e){
		var target = $(this).panel('options').comboTarget;
		if (!target){return;}
		var opts = $(target).combobox('options');
		if (opts.groupPosition == 'sticky'){
			var stick = $(this).children('.combobox-stick');
			if (!stick.length){
				stick = $('<div class="combobox-stick"></div>').appendTo(this);
			}
			stick.hide();
			var state = $(target).data('combobox');
			$(this).children('.combobox-group:visible').each(function(){
				var g = $(this);
				var groupData = opts.finder.getGroup(target, g);
				var rowData = state.data[groupData.startIndex + groupData.count - 1];
				var last = opts.finder.getEl(target, rowData[opts.valueField]);
				if (g.position().top < 0 && last.position().top > 0){
					stick.show().html(g.html());
					return false;
				}
			});
		}
	}
	
	$.fn.combobox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combobox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combobox');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'combobox', {
					options: $.extend({}, $.fn.combobox.defaults, $.fn.combobox.parseOptions(this), options),
					data: []
				});
			}
			create(this);
			if (state.options.data){
				loadData(this, state.options.data);
			} else {
				var data = $.fn.combobox.parseData(this);
				if (data.length){
					loadData(this, data);
				}
			}
			request(this);
		});
	};
	
	
	$.fn.combobox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combobox').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		cloneFrom: function(jq, from){
			return jq.each(function(){
				$(this).combo('cloneFrom', from);
				$.data(this, 'combobox', $(from).data('combobox'));
				$(this).addClass('combobox-f').attr('comboboxName', $(this).attr('textboxName'));
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'combobox').data;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, $.isArray(value)?value:[value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				setValues(this, []);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combobox('options');
				if (opts.multiple){
					$(this).combobox('setValues', opts.originalValue);
				} else {
					$(this).combobox('setValue', opts.originalValue);
				}
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				if (typeof url == 'string'){
					request(this, url);
				} else {
					if (url){
						var opts = $(this).combobox('options');
						opts.queryParams = url;
					}
					request(this);
				}
			});
		},
		select: function(jq, value){
			return jq.each(function(){
				select(this, value);
			});
		},
		unselect: function(jq, value){
			return jq.each(function(){
				unselect(this, value);
			});
		},
		scrollTo: function(jq, value){
			return jq.each(function(){
				scrollTo(this, value);
			});
		}
	};
	
	$.fn.combobox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target,[
			'valueField','textField','groupField','groupPosition','mode','method','url',
			{showItemIcon:'boolean',limitToList:'boolean'}
		]));
	};
	
	$.fn.combobox.parseData = function(target){
		var data = [];
		var opts = $(target).combobox('options');
		$(target).children().each(function(){
			if (this.tagName.toLowerCase() == 'optgroup'){
				var group = $(this).attr('label');
				$(this).children().each(function(){
					_parseItem(this, group);
				});
			} else {
				_parseItem(this);
			}
		});
		return data;
		
		function _parseItem(el, group){
			var t = $(el);
			var row = {};
			row[opts.valueField] = t.attr('value')!=undefined ? t.attr('value') : t.text();
			row[opts.textField] = t.text();
			row['selected'] = t.is(':selected');
			row['disabled'] = t.is(':disabled');
			if (group){
				opts.groupField = opts.groupField || 'group';
				row[opts.groupField] = group;
			}
			data.push(row);
		}
	};

	var COMBOBOX_SERNO = 0;
	var defaultView = {
		render: function(target, container, data){
			var state = $.data(target, 'combobox');
			var opts = state.options;

			COMBOBOX_SERNO++;
			state.itemIdPrefix = '_nestui_combobox_i' + COMBOBOX_SERNO;
			state.groupIdPrefix = '_nestui_combobox_g' + COMBOBOX_SERNO;		
			state.groups = [];
			
			var dd = [];
			var group = undefined;
			for(var i=0; i<data.length; i++){
				var row = data[i];
				var v = row[opts.valueField]+'';
				var s = row[opts.textField];
				var g = row[opts.groupField];
				
				if (g){
					if (group != g){
						group = g;
						state.groups.push({
							value: g,
							startIndex: i,
							count: 1
						});
						dd.push('<div id="' + (state.groupIdPrefix+'_'+(state.groups.length-1)) + '" class="combobox-group">');
						dd.push(opts.groupFormatter ? opts.groupFormatter.call(target, g) : g);
						dd.push('</div>');
					} else {
						state.groups[state.groups.length-1].count++;
					}
				} else {
					group = undefined;
				}
				
				var cls = 'combobox-item' + (row.disabled ? ' combobox-item-disabled' : '') + (g ? ' combobox-gitem' : '');
				dd.push('<div id="' + (state.itemIdPrefix+'_'+i) + '" class="' + cls + '">');
				if (opts.showItemIcon && row.iconCls){
					dd.push('<span class="combobox-icon ' + row.iconCls + '"></span>');
				}
				dd.push(opts.formatter ? opts.formatter.call(target, row) : s);
				dd.push('</div>');
			}
			$(container).html(dd.join(''));
		}
	};
	
	$.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {
		valueField: 'value',
		textField: 'text',
		groupPosition: 'static',	// or 'sticky'
		groupField: null,
		groupFormatter: function(group){return group;},
		mode: 'local',	// or 'remote'
		method: 'post',
		url: null,
		data: null,
		queryParams: {},
		showItemIcon: false,
		limitToList: false,	// limit the inputed values to the listed items
		view: defaultView,
		
		keyHandler: {
			up: function(e){nav(this,'prev');e.preventDefault()},
			down: function(e){nav(this,'next');e.preventDefault()},
			left: function(e){},
			right: function(e){},
			enter: function(e){doEnter(this)},
			query: function(q,e){doQuery(this, q)}
		},
		inputEvents: $.extend({}, $.fn.combo.defaults.inputEvents, {
			blur: function(e){
				var target = e.data.target;
				var opts = $(target).combobox('options');
				if (opts.limitToList){
					doEnter(target);
				}
			}
		}),
		panelEvents: {
			mouseover: mouseoverHandler,
			mouseout: mouseoutHandler,
			click: clickHandler,
			scroll: scrollHandler
		},
		filter: function(q, row){
			var opts = $(this).combobox('options');
			return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) >= 0;
		},
		formatter: function(row){
			var opts = $(this).combobox('options');
			return row[opts.textField];
		},
		loader: function(param, success, error){
			var opts = $(this).combobox('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data){
			return data;
		},
		finder:{
			getEl:function(target, value){
				var index = getRowIndex(target, value);
				var id = $.data(target, 'combobox').itemIdPrefix + '_' + index;
				return $('#'+id);
			},
			getGroupEl:function(target, gvalue){
				var state = $.data(target, 'combobox');
				var index = $.nestui.indexOfArray(state.groups, 'value', gvalue);
				var id = state.groupIdPrefix + '_' + index;
				return $('#'+id);
			},
			getGroup:function(target, p){
				var state = $.data(target, 'combobox');
				var index = p.attr('id').substr(state.groupIdPrefix.length+1);
				return state.groups[parseInt(index)];
			},
			getRow:function(target, p){
				var state = $.data(target, 'combobox');
				var index = (p instanceof $) ? p.attr('id').substr(state.itemIdPrefix.length+1) : getRowIndex(target, p);
				return state.data[parseInt(index)];
			}
		},
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onUnselect: function(record){}
	});
})(jQuery);
﻿/**
 * combotree
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "combotree");
		var _4 = _3.options;
		var _5 = _3.tree;
		$(_2).addClass("combotree-f");
		$(_2).combo($.extend({}, _4, {
			onShowPanel : function() {
				if (_4.editable) {
					_5.tree("doFilter", "");
				}
				_4.onShowPanel.call(this);
			}
		}));
		var _6 = $(_2).combo("panel");
		if (!_5) {
			_5 = $("<ul></ul>").appendTo(_6);
			_3.tree = _5;
		}
		_5.tree($.extend({}, _4, {
			checkbox : _4.multiple,
			onLoadSuccess : function(_7, _8) {
				var _9 = $(_2).combotree("getValues");
				if (_4.multiple) {
					$.map(_5.tree("getChecked"), function(_a) {
						$.nestui.addArrayItem(_9, _a.id);
					});
				}
				_15(_2, _9, _3.remainText);
				_4.onLoadSuccess.call(this, _7, _8);
			},
			onClick : function(_b) {
				if (_4.multiple) {
					$(this).tree(_b.checked ? "uncheck" : "check", _b.target);
				} else {
					$(_2).combo("hidePanel");
				}
				_3.remainText = false;
				_e(_2);
				_4.onClick.call(this, _b);
			},
			onCheck : function(_c, _d) {
				_3.remainText = false;
				_e(_2);
				_4.onCheck.call(this, _c, _d);
			}
		}));
	}
	;
	function _e(_f) {
		var _10 = $.data(_f, "combotree");
		var _11 = _10.options;
		var _12 = _10.tree;
		var vv = [];
		if (_11.multiple) {
			vv = $.map(_12.tree("getChecked"), function(_13) {
				return _13.id;
			});
		} else {
			var _14 = _12.tree("getSelected");
			if (_14) {
				vv.push(_14.id);
			}
		}
		vv = vv.concat(_11.unselectedValues);
		_15(_f, vv, _10.remainText);
	}
	;
	function _15(_16, _17, _18) {
		var _19 = $.data(_16, "combotree");
		var _1a = _19.options;
		var _1b = _19.tree;
		var _1c = _1b.tree("options");
		var _1d = _1c.onBeforeCheck;
		var _1e = _1c.onCheck;
		var _1f = _1c.onSelect;
		_1c.onBeforeCheck = _1c.onCheck = _1c.onSelect = function() {
		};
		if (!$.isArray(_17)) {
			_17 = _17.split(_1a.separator);
		}
		if (!_1a.multiple) {
			_17 = _17.length ? [ _17[0] ] : [ "" ];
		}
		var vv = $.map(_17, function(_20) {
			return String(_20);
		});
		_1b.find("div.tree-node-selected").removeClass("tree-node-selected");
		$.map(_1b.tree("getChecked"), function(_21) {
			if ($.inArray(String(_21.id), vv) == -1) {
				_1b.tree("uncheck", _21.target);
			}
		});
		var ss = [];
		_1a.unselectedValues = [];
		$.map(vv, function(v) {
			var _22 = _1b.tree("find", v);
			if (_22) {
				_1b.tree("check", _22.target).tree("select", _22.target);
				ss.push(_22.text);
			} else {
				ss.push(_23(v, _1a.mappingRows) || v);
				_1a.unselectedValues.push(v);
			}
		});
		if (_1a.multiple) {
			$.map(_1b.tree("getChecked"), function(_24) {
				var id = String(_24.id);
				if ($.inArray(id, vv) == -1) {
					vv.push(id);
					ss.push(_24.text);
				}
			});
		}
		_1c.onBeforeCheck = _1d;
		_1c.onCheck = _1e;
		_1c.onSelect = _1f;
		if (!_18) {
			var s = ss.join(_1a.separator);
			if ($(_16).combo("getText") != s) {
				$(_16).combo("setText", s);
			}
		}
		$(_16).combo("setValues", vv);
		function _23(_25, a) {
			var _26 = $.nestui.getArrayItem(a, "id", _25);
			return _26 ? _26.text : undefined;
		}
		;
	}
	;
	function _27(_28, q) {
		var _29 = $.data(_28, "combotree");
		var _2a = _29.options;
		var _2b = _29.tree;
		_29.remainText = true;
		_2b.tree("doFilter", _2a.multiple ? q.split(_2a.separator) : q);
	}
	;
	function _2c(_2d) {
		var _2e = $.data(_2d, "combotree");
		_2e.remainText = false;
		$(_2d).combotree("setValues", $(_2d).combotree("getValues"));
		$(_2d).combotree("hidePanel");
	}
	;
	$.fn.combotree = function(_2f, _30) {
		if (typeof _2f == "string") {
			var _31 = $.fn.combotree.methods[_2f];
			if (_31) {
				return _31(this, _30);
			} else {
				return this.combo(_2f, _30);
			}
		}
		_2f = _2f || {};
		return this.each(function() {
			var _32 = $.data(this, "combotree");
			if (_32) {
				$.extend(_32.options, _2f);
			} else {
				$.data(this, "combotree", {
					options : $.extend({}, $.fn.combotree.defaults,
							$.fn.combotree.parseOptions(this), _2f)
				});
			}
			_1(this);
		});
	};
	$.fn.combotree.methods = {
		options : function(jq) {
			var _33 = jq.combo("options");
			return $.extend($.data(jq[0], "combotree").options, {
				width : _33.width,
				height : _33.height,
				originalValue : _33.originalValue,
				disabled : _33.disabled,
				readonly : _33.readonly
			});
		},
		clone : function(jq, _34) {
			var t = jq.combo("clone", _34);
			t.data("combotree", {
				options : $.extend(true, {}, jq.combotree("options")),
				tree : jq.combotree("tree")
			});
			return t;
		},
		tree : function(jq) {
			return $.data(jq[0], "combotree").tree;
		},
		loadData : function(jq, _35) {
			return jq.each(function() {
				var _36 = $.data(this, "combotree").options;
				_36.data = _35;
				var _37 = $.data(this, "combotree").tree;
				_37.tree("loadData", _35);
			});
		},
		reload : function(jq, url) {
			return jq.each(function() {
				var _38 = $.data(this, "combotree").options;
				var _39 = $.data(this, "combotree").tree;
				if (url) {
					_38.url = url;
				}
				_39.tree({
					url : _38.url
				});
			});
		},
		setValues : function(jq, _3a) {
			return jq.each(function() {
				var _3b = $(this).combotree("options");
				if ($.isArray(_3a)) {
					_3a = $.map(_3a, function(_3c) {
						if (_3c && typeof _3c == "object") {
							$.nestui.addArrayItem(_3b.mappingRows, "id", _3c);
							return _3c.id;
						} else {
							return _3c;
						}
					});
				}
				_15(this, _3a);
			});
		},
		setValue : function(jq, _3d) {
			return jq.each(function() {
				$(this).combotree("setValues", $.isArray(_3d) ? _3d : [ _3d ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).combotree("setValues", []);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _3e = $(this).combotree("options");
				if (_3e.multiple) {
					$(this).combotree("setValues", _3e.originalValue);
				} else {
					$(this).combotree("setValue", _3e.originalValue);
				}
			});
		}
	};
	$.fn.combotree.parseOptions = function(_3f) {
		return $.extend({}, $.fn.combo.parseOptions(_3f), $.fn.tree
				.parseOptions(_3f));
	};
	$.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults,
			$.fn.tree.defaults, {
				editable : false,
				unselectedValues : [],
				mappingRows : [],
				keyHandler : {
					up : function(e) {
					},
					down : function(e) {
					},
					left : function(e) {
					},
					right : function(e) {
					},
					enter : function(e) {
						_2c(this);
					},
					query : function(q, e) {
						_27(this, q);
					}
				}
			});
})(jQuery);
﻿/**
 * combogrid
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "combogrid");
		var _4 = _3.options;
		var _5 = _3.grid;
		$(_2).addClass("combogrid-f").combo(
				$.extend({}, _4, {
					onShowPanel : function() {
						_20(this, $(this).combogrid("getValues"), true);
						var p = $(this).combogrid("panel");
						var _6 = p.outerHeight() - p.height();
						var _7 = p._size("minHeight");
						var _8 = p._size("maxHeight");
						var dg = $(this).combogrid("grid");
						dg.datagrid("resize", {
							width : "100%",
							height : (isNaN(parseInt(_4.panelHeight)) ? "auto"
									: "100%"),
							minHeight : (_7 ? _7 - _6 : ""),
							maxHeight : (_8 ? _8 - _6 : "")
						});
						var _9 = dg.datagrid("getSelected");
						if (_9) {
							dg.datagrid("scrollTo", dg.datagrid("getRowIndex",
									_9));
						}
						_4.onShowPanel.call(this);
					}
				}));
		var _a = $(_2).combo("panel");
		if (!_5) {
			_5 = $("<table></table>").appendTo(_a);
			_3.grid = _5;
		}
		_5.datagrid($.extend({}, _4, {
			border : false,
			singleSelect : (!_4.multiple),
			onLoadSuccess : _b,
			onClickRow : _c,
			onSelect : _d("onSelect"),
			onUnselect : _d("onUnselect"),
			onSelectAll : _d("onSelectAll"),
			onUnselectAll : _d("onUnselectAll")
		}));
		function _e(dg) {
			return $(dg).closest(".combo-panel").panel("options").comboTarget
					|| _2;
		};
		function _b(_f) {
			var _10 = _e(this);
			var _11 = $(_10).data("combogrid");
			var _12 = _11.options;
			var _13 = $(_10).combo("getValues");
			_20(_10, _13, _11.remainText);
			_12.onLoadSuccess.call(this, _f);
		};
		function _c(_14, row) {
			var _15 = _e(this);
			var _16 = $(_15).data("combogrid");
			var _17 = _16.options;
			_16.remainText = false;
			_18.call(this);
			if (!_17.multiple) {
				$(_15).combo("hidePanel");
			}
			_17.onClickRow.call(this, _14, row);
		};
		function _d(_19) {
			return function(_1a, row) {
				var _1b = _e(this);
				var _1c = $(_1b).combogrid("options");
				if (_19 == "onUnselectAll") {
					if (_1c.multiple) {
						_18.call(this);
					}
				} else {
					_18.call(this);
				}
				_1c[_19].call(this, _1a, row);
			};
		};
		function _18() {
			var dg = $(this);
			var _1d = _e(dg);
			var _1e = $(_1d).data("combogrid");
			var _1f = _1e.options;
			var vv = $.map(dg.datagrid("getSelections"), function(row) {
				return row[_1f.idField];
			});
			vv = vv.concat(_1f.unselectedValues);
			_20(_1d, vv, _1e.remainText);
		};
	};
	function nav(_21, dir) {
		var _22 = $.data(_21, "combogrid");
		var _23 = _22.options;
		var _24 = _22.grid;
		var _25 = _24.datagrid("getRows").length;
		if (!_25) {
			return;
		}
		var tr = _23.finder.getTr(_24[0], null, "highlight");
		if (!tr.length) {
			tr = _23.finder.getTr(_24[0], null, "selected");
		}
		var _26;
		if (!tr.length) {
			_26 = (dir == "next" ? 0 : _25 - 1);
		} else {
			var _26 = parseInt(tr.attr("datagrid-row-index"));
			_26 += (dir == "next" ? 1 : -1);
			if (_26 < 0) {
				_26 = _25 - 1;
			}
			if (_26 >= _25) {
				_26 = 0;
			}
		}
		_24.datagrid("highlightRow", _26);
		if (_23.selectOnNavigation) {
			_22.remainText = false;
			_24.datagrid("selectRow", _26);
		}
	};
	function _20(_27, _28, _29) {
		var _2a = $.data(_27, "combogrid");
		var _2b = _2a.options;
		var _2c = _2a.grid;
		var _2d = $(_27).combo("getValues");
		var _2e = $(_27).combo("options");
		var _2f = _2e.onChange;
		_2e.onChange = function() {
		};
		var _30 = _2c.datagrid("options");
		var _31 = _30.onSelect;
		var _32 = _30.onUnselectAll;
		_30.onSelect = _30.onUnselectAll = function() {
		};
		if (!$.isArray(_28)) {
			_28 = _28.split(_2b.separator);
		}
		if (!_2b.multiple) {
			_28 = _28.length ? [ _28[0] ] : [ "" ];
		}
		var vv = $.map(_28, function(_33) {
			return String(_33);
		});
		vv = $.grep(vv, function(v, _34) {
			return _34 === $.inArray(v, vv);
		});
		var _35 = $.grep(_2c.datagrid("getSelections"), function(row, _36) {
			return $.inArray(String(row[_2b.idField]), vv) >= 0;
		});
		_2c.datagrid("clearSelections");
		_2c.data("datagrid").selectedRows = _35;
		var ss = [];
		_2b.unselectedValues = [];
		$.map(vv, function(v) {
			var _37 = _2c.datagrid("getRowIndex", v);
			if (_37 >= 0) {
				_2c.datagrid("selectRow", _37);
			} else {
				_2b.unselectedValues.push(v);
			}
			ss.push(_38(v, _2c.datagrid("getRows")) || _38(v, _35)
					|| _38(v, _2b.mappingRows) || v);
		});
		$(_27).combo("setValues", _2d);
		_2e.onChange = _2f;
		_30.onSelect = _31;
		_30.onUnselectAll = _32;
		if (!_29) {
			var s = ss.join(_2b.separator);
			if ($(_27).combo("getText") != s) {
				$(_27).combo("setText", s);
			}
		}
		$(_27).combo("setValues", _28);
		function _38(_39, a) {
			var _3a = $.nestui.getArrayItem(a, _2b.idField, _39);
			return _3a ? _3a[_2b.textField] : undefined;
		};
	};
	function _3b(_3c, q) {
		var _3d = $.data(_3c, "combogrid");
		var _3e = _3d.options;
		var _3f = _3d.grid;
		_3d.remainText = true;
		if (_3e.multiple && !q) {
			_20(_3c, [], true);
		} else {
			_20(_3c, [ q ], true);
		}
		if (_3e.mode == "remote") {
			_3f.datagrid("clearSelections");
			_3f.datagrid("load", $.extend({}, _3e.queryParams, {
				q : q
			}));
		} else {
			if (!q) {
				return;
			}
			_3f.datagrid("clearSelections").datagrid("highlightRow", -1);
			var _40 = _3f.datagrid("getRows");
			var qq = _3e.multiple ? q.split(_3e.separator) : [ q ];
			$.map(qq, function(q) {
				q = $.trim(q);
				if (q) {
					$.map(_40, function(row, i) {
						if (q == row[_3e.textField]) {
							_3f.datagrid("selectRow", i);
						} else {
							if (_3e.filter.call(_3c, q, row)) {
								_3f.datagrid("highlightRow", i);
							}
						}
					});
				}
			});
		}
	};
	function _41(_42) {
		var _43 = $.data(_42, "combogrid");
		var _44 = _43.options;
		var _45 = _43.grid;
		var tr = _44.finder.getTr(_45[0], null, "highlight");
		_43.remainText = false;
		if (tr.length) {
			var _46 = parseInt(tr.attr("datagrid-row-index"));
			if (_44.multiple) {
				if (tr.hasClass("datagrid-row-selected")) {
					_45.datagrid("unselectRow", _46);
				} else {
					_45.datagrid("selectRow", _46);
				}
			} else {
				_45.datagrid("selectRow", _46);
			}
		}
		var vv = [];
		$.map(_45.datagrid("getSelections"), function(row) {
			vv.push(row[_44.idField]);
		});
		$(_42).combogrid("setValues", vv);
		if (!_44.multiple) {
			$(_42).combogrid("hidePanel");
		}
	};
	$.fn.combogrid = function(_47, _48) {
		if (typeof _47 == "string") {
			var _49 = $.fn.combogrid.methods[_47];
			if (_49) {
				return _49(this, _48);
			} else {
				return this.combo(_47, _48);
			}
		}
		_47 = _47 || {};
		return this.each(function() {
			var _4a = $.data(this, "combogrid");
			if (_4a) {
				$.extend(_4a.options, _47);
			} else {
				_4a = $.data(this, "combogrid", {
					options : $.extend({}, $.fn.combogrid.defaults,
							$.fn.combogrid.parseOptions(this), _47)
				});
			}
			_1(this);
		});
	};
	$.fn.combogrid.methods = {
		options : function(jq) {
			var _4b = jq.combo("options");
			return $.extend($.data(jq[0], "combogrid").options, {
				width : _4b.width,
				height : _4b.height,
				originalValue : _4b.originalValue,
				disabled : _4b.disabled,
				readonly : _4b.readonly
			});
		},
		cloneFrom : function(jq, _4c) {
			return jq.each(function() {
				$(this).combo("cloneFrom", _4c);
				$.data(this, "combogrid", {
					options : $.extend(true, {
						cloned : true
					}, $(_4c).combogrid("options")),
					combo : $(this).next(),
					panel : $(_4c).combo("panel"),
					grid : $(_4c).combogrid("grid")
				});
			});
		},
		grid : function(jq) {
			return $.data(jq[0], "combogrid").grid;
		},
		setValues : function(jq, _4d) {
			return jq.each(function() {
				var _4e = $(this).combogrid("options");
				if ($.isArray(_4d)) {
					_4d = $.map(_4d, function(_4f) {
						if (_4f && typeof _4f == "object") {
							$.nestui.addArrayItem(_4e.mappingRows, _4e.idField,
									_4f);
							return _4f[_4e.idField];
						} else {
							return _4f;
						}
					});
				}
				_20(this, _4d);
			});
		},
		setValue : function(jq, _50) {
			return jq.each(function() {
				$(this).combogrid("setValues", $.isArray(_50) ? _50 : [ _50 ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).combogrid("setValues", []);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _51 = $(this).combogrid("options");
				if (_51.multiple) {
					$(this).combogrid("setValues", _51.originalValue);
				} else {
					$(this).combogrid("setValue", _51.originalValue);
				}
			});
		}
	};
	$.fn.combogrid.parseOptions = function(_52) {
		var t = $(_52);
		return $.extend({}, $.fn.combo.parseOptions(_52), $.fn.datagrid
				.parseOptions(_52), $.parser.parseOptions(_52, [ "idField",
				"textField", "mode" ]));
	};
	$.fn.combogrid.defaults = $.extend({}, $.fn.combo.defaults,
			$.fn.datagrid.defaults, {
				loadMsg : null,
				idField : null,
				textField : null,
				unselectedValues : [],
				mappingRows : [],
				mode : "local",
				keyHandler : {
					up : function(e) {
						nav(this, "prev");
						e.preventDefault();
					},
					down : function(e) {
						nav(this, "next");
						e.preventDefault();
					},
					left : function(e) {
					},
					right : function(e) {
					},
					enter : function(e) {
						_41(this);
					},
					query : function(q, e) {
						_3b(this, q);
					}
				},
				filter : function(q, row) {
					var _53 = $(this).combogrid("options");
					return (row[_53.textField] || "").toLowerCase().indexOf(
							q.toLowerCase()) >= 0;
				}
			});
})(jQuery);﻿/**
 * combotreegrid
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "combotreegrid");
		var _4 = _3.options;
		$(_2).addClass("combotreegrid-f").combo(
				$.extend({}, _4, {
					onShowPanel : function() {
						var p = $(this).combotreegrid("panel");
						var _5 = p.outerHeight() - p.height();
						var _6 = p._size("minHeight");
						var _7 = p._size("maxHeight");
						var dg = $(this).combotreegrid("grid");
						dg.treegrid("resize", {
							width : "100%",
							height : (isNaN(parseInt(_4.panelHeight)) ? "auto"
									: "100%"),
							minHeight : (_6 ? _6 - _5 : ""),
							maxHeight : (_7 ? _7 - _5 : "")
						});
						var _8 = dg.treegrid("getSelected");
						if (_8) {
							dg.treegrid("scrollTo", _8[_4.idField]);
						}
						_4.onShowPanel.call(this);
					}
				}));
		if (!_3.grid) {
			var _9 = $(_2).combo("panel");
			_3.grid = $("<table></table>").appendTo(_9);
		}
		_3.grid.treegrid($.extend({}, _4, {
			border : false,
			checkbox : _4.multiple,
			onLoadSuccess : function(_a, _b) {
				var _c = $(_2).combotreegrid("getValues");
				if (_4.multiple) {
					$.map($(this).treegrid("getCheckedNodes"), function(_d) {
						$.nestui.addArrayItem(_c, _d[_4.idField]);
					});
				}
				_16(_2, _c);
				_4.onLoadSuccess.call(this, _a, _b);
				_3.remainText = false;
			},
			onClickRow : function(_e) {
				if (_4.multiple) {
					$(this).treegrid(_e.checked ? "uncheckNode" : "checkNode",
							_e[_4.idField]);
					$(this).treegrid("unselect", _e[_4.idField]);
				} else {
					$(_2).combo("hidePanel");
				}
				_11(_2);
				_4.onClickRow.call(this, _e);
			},
			onCheckNode : function(_f, _10) {
				_11(_2);
				_4.onCheckNode.call(this, _f, _10);
			}
		}));
	}
	;
	function _11(_12) {
		var _13 = $.data(_12, "combotreegrid");
		var _14 = _13.options;
		var _15 = _13.grid;
		var vv = [];
		if (_14.multiple) {
			vv = $.map(_15.treegrid("getCheckedNodes"), function(row) {
				return row[_14.idField];
			});
		} else {
			var row = _15.treegrid("getSelected");
			if (row) {
				vv.push(row[_14.idField]);
			}
		}
		vv = vv.concat(_14.unselectedValues);
		_16(_12, vv);
	}
	;
	function _16(_17, _18) {
		var _19 = $.data(_17, "combotreegrid");
		var _1a = _19.options;
		var _1b = _19.grid;
		if (!$.isArray(_18)) {
			_18 = _18.split(_1a.separator);
		}
		if (!_1a.multiple) {
			_18 = _18.length ? [ _18[0] ] : [ "" ];
		}
		var vv = $.map(_18, function(_1c) {
			return String(_1c);
		});
		vv = $.grep(vv, function(v, _1d) {
			return _1d === $.inArray(v, vv);
		});
		var _1e = _1b.treegrid("getSelected");
		if (_1e) {
			_1b.treegrid("unselect", _1e[_1a.idField]);
		}
		$.map(_1b.treegrid("getCheckedNodes"), function(row) {
			if ($.inArray(String(row[_1a.idField]), vv) == -1) {
				_1b.treegrid("uncheckNode", row[_1a.idField]);
			}
		});
		var ss = [];
		_1a.unselectedValues = [];
		$.map(vv, function(v) {
			var row = _1b.treegrid("find", v);
			if (row) {
				if (_1a.multiple) {
					_1b.treegrid("checkNode", v);
				} else {
					_1b.treegrid("select", v);
				}
				ss.push(row[_1a.treeField]);
			} else {
				ss.push(_1f(v, _1a.mappingRows) || v);
				_1a.unselectedValues.push(v);
			}
		});
		if (_1a.multiple) {
			$.map(_1b.treegrid("getCheckedNodes"), function(row) {
				var id = String(row[_1a.idField]);
				if ($.inArray(id, vv) == -1) {
					vv.push(id);
					ss.push(row[_1a.treeField]);
				}
			});
		}
		if (!_19.remainText) {
			var s = ss.join(_1a.separator);
			if ($(_17).combo("getText") != s) {
				$(_17).combo("setText", s);
			}
		}
		$(_17).combo("setValues", vv);
		function _1f(_20, a) {
			var _21 = $.nestui.getArrayItem(a, _1a.idField, _20);
			return _21 ? _21[_1a.treeField] : undefined;
		}
		;
	}
	;
	function _22(_23, q) {
		var _24 = $.data(_23, "combotreegrid");
		var _25 = _24.options;
		var _26 = _24.grid;
		_24.remainText = true;
		_26.treegrid("clearSelections").treegrid("clearChecked").treegrid(
				"highlightRow", -1);
		if (_25.mode == "remote") {
			$(_23).combotreegrid("clear");
			_26.treegrid("load", $.extend({}, _25.queryParams, {
				q : q
			}));
		} else {
			if (q) {
				var _27 = _26.treegrid("getData");
				var vv = [];
				var qq = _25.multiple ? q.split(_25.separator) : [ q ];
				$
						.map(
								qq,
								function(q) {
									q = $.trim(q);
									if (q) {
										var v = undefined;
										$.nestui.forEach(_27, true, function(
												row) {
											if (q.toLowerCase() == String(
													row[_25.treeField])
													.toLowerCase()) {
												v = row[_25.idField];
												return false;
											} else {
												if (_25.filter
														.call(_23, q, row)) {
													_26.treegrid("expandTo",
															row[_25.idField]);
													_26.treegrid(
															"highlightRow",
															row[_25.idField]);
													return false;
												}
											}
										});
										if (v == undefined) {
											$.nestui
													.forEach(
															_25.mappingRows,
															false,
															function(row) {
																if (q
																		.toLowerCase() == String(row[_25.treeField])) {
																	v = row[_25.idField];
																	return false;
																}
															});
										}
										if (v != undefined) {
											vv.push(v);
										}
									}
								});
				_16(_23, vv);
				_24.remainText = false;
			}
		}
	}
	;
	function _28(_29) {
		_11(_29);
	}
	;
	$.fn.combotreegrid = function(_2a, _2b) {
		if (typeof _2a == "string") {
			var _2c = $.fn.combotreegrid.methods[_2a];
			if (_2c) {
				return _2c(this, _2b);
			} else {
				return this.combo(_2a, _2b);
			}
		}
		_2a = _2a || {};
		return this.each(function() {
			var _2d = $.data(this, "combotreegrid");
			if (_2d) {
				$.extend(_2d.options, _2a);
			} else {
				_2d = $.data(this, "combotreegrid", {
					options : $.extend({}, $.fn.combotreegrid.defaults,
							$.fn.combotreegrid.parseOptions(this), _2a)
				});
			}
			_1(this);
		});
	};
	$.fn.combotreegrid.methods = {
		options : function(jq) {
			var _2e = jq.combo("options");
			return $.extend($.data(jq[0], "combotreegrid").options, {
				width : _2e.width,
				height : _2e.height,
				originalValue : _2e.originalValue,
				disabled : _2e.disabled,
				readonly : _2e.readonly
			});
		},
		grid : function(jq) {
			return $.data(jq[0], "combotreegrid").grid;
		},
		setValues : function(jq, _2f) {
			return jq.each(function() {
				var _30 = $(this).combotreegrid("options");
				if ($.isArray(_2f)) {
					_2f = $.map(_2f, function(_31) {
						if (_31 && typeof _31 == "object") {
							$.nestui.addArrayItem(_30.mappingRows, _30.idField,
									_31);
							return _31[_30.idField];
						} else {
							return _31;
						}
					});
				}
				_16(this, _2f);
			});
		},
		setValue : function(jq, _32) {
			return jq.each(function() {
				$(this).combotreegrid("setValues",
						$.isArray(_32) ? _32 : [ _32 ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).combotreegrid("setValues", []);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _33 = $(this).combotreegrid("options");
				if (_33.multiple) {
					$(this).combotreegrid("setValues", _33.originalValue);
				} else {
					$(this).combotreegrid("setValue", _33.originalValue);
				}
			});
		}
	};
	$.fn.combotreegrid.parseOptions = function(_34) {
		var t = $(_34);
		return $.extend({}, $.fn.combo.parseOptions(_34), $.fn.treegrid
				.parseOptions(_34), $.parser.parseOptions(_34, [ "mode", {
			limitToGrid : "boolean"
		} ]));
	};
	$.fn.combotreegrid.defaults = $.extend({}, $.fn.combo.defaults,
			$.fn.treegrid.defaults, {
				editable : false,
				singleSelect : true,
				limitToGrid : false,
				unselectedValues : [],
				mappingRows : [],
				mode : "local",
				keyHandler : {
					up : function(e) {
					},
					down : function(e) {
					},
					left : function(e) {
					},
					right : function(e) {
					},
					enter : function(e) {
						_28(this);
					},
					query : function(q, e) {
						_22(this, q);
					}
				},
				inputEvents : $.extend({}, $.fn.combo.defaults.inputEvents, {
					blur : function(e) {
						var _35 = e.data.target;
						var _36 = $(_35).combotreegrid("options");
						if (_36.limitToGrid) {
							_28(_35);
						}
					}
				}),
				filter : function(q, row) {
					var _37 = $(this).combotreegrid("options");
					return (row[_37.treeField] || "").toLowerCase().indexOf(
							q.toLowerCase()) >= 0;
				}
			});
})(jQuery);
﻿/**
 * datebox
 * 
 * Dependencies:
 * 	 calendar
 *   combo
 * 
 */
(function($){
	/**
	 * create date box
	 */
	function createBox(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		
		$(target).addClass('datebox-f').combo($.extend({}, opts, {
			onShowPanel:function(){
				bindEvents(this);
				setButtons(this);
				setCalendar(this);
				setValue(this, $(this).datebox('getText'), true);
				opts.onShowPanel.call(this);
			}
		}));
		
		/**
		 * if the calendar isn't created, create it.
		 */
		if (!state.calendar){
			var panel = $(target).combo('panel').css('overflow','hidden');
			panel.panel('options').onBeforeDestroy = function(){
				var c = $(this).find('.calendar-shared');
				if (c.length){
					c.insertBefore(c[0].pholder);
				}
			};
			var cc = $('<div class="datebox-calendar-inner"></div>').prependTo(panel);
			if (opts.sharedCalendar){
				var c = $(opts.sharedCalendar);
				if (!c[0].pholder){
					c[0].pholder = $('<div class="calendar-pholder" style="display:none"></div>').insertAfter(c);
				}
				c.addClass('calendar-shared').appendTo(cc);
				if (!c.hasClass('calendar')){
					c.calendar();
				}
				state.calendar = c;
			} else {
				state.calendar = $('<div></div>').appendTo(cc).calendar();
			}

			$.extend(state.calendar.calendar('options'), {
				fit:true,
				border:false,
				onSelect:function(date){
					var target = this.target;
					var opts = $(target).datebox('options');
					setValue(target, opts.formatter.call(target, date));
					$(target).combo('hidePanel');
					opts.onSelect.call(target, date);
				}
			});
		}

		$(target).combo('textbox').parent().addClass('datebox');
		$(target).datebox('initValue', opts.value);
		
		function bindEvents(target){
			var opts = $(target).datebox('options');
			var panel = $(target).combo('panel');
			panel.unbind('.datebox').bind('click.datebox', function(e){
				if ($(e.target).hasClass('datebox-button-a')){
					var index = parseInt($(e.target).attr('datebox-button-index'));
					opts.buttons[index].handler.call(e.target, target);
				}
			});
		}
		function setButtons(target){
			var panel = $(target).combo('panel');
			if (panel.children('div.datebox-button').length){return}
			var button = $('<div class="datebox-button"><table cellspacing="0" cellpadding="0" style="width:100%"><tr></tr></table></div>').appendTo(panel);
			var tr = button.find('tr');
			for(var i=0; i<opts.buttons.length; i++){
				var td = $('<td></td>').appendTo(tr);
				var btn = opts.buttons[i];
				var t = $('<a class="datebox-button-a" href="javascript:void(0)"></a>').html($.isFunction(btn.text) ? btn.text(target) : btn.text).appendTo(td);
				t.attr('datebox-button-index', i);
			}
			tr.find('td').css('width', (100/opts.buttons.length)+'%');
		}
		function setCalendar(target){
			var panel = $(target).combo('panel');
			var cc = panel.children('div.datebox-calendar-inner');
			panel.children()._outerWidth(panel.width());
			state.calendar.appendTo(cc);
			state.calendar[0].target = target;
			if (opts.panelHeight != 'auto'){
				var height = panel.height();
				panel.children().not(cc).each(function(){
					height -= $(this).outerHeight();
				});
				cc._outerHeight(height);
			}
			state.calendar.calendar('resize');
		}
	}
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q, true);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var current = state.calendar.calendar('options').current;
		if (current){
			setValue(target, opts.formatter.call(target, current));
			$(target).combo('hidePanel');
		}
	}
	
	function setValue(target, value, remainText){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var calendar = state.calendar;
		calendar.calendar('moveTo', opts.parser.call(target, value));
		if (remainText){
			$(target).combo('setValue', value);
		} else {
			if (value){
				value = opts.formatter.call(target, calendar.calendar('options').current);
			}
			$(target).combo('setText', value).combo('setValue', value);
		}
	}
	
	$.fn.datebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datebox', {
					options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	
	$.fn.datebox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'datebox').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		cloneFrom: function(jq, from){
			return jq.each(function(){
				$(this).combo('cloneFrom', from);
				$.data(this, 'datebox', {
					options: $.extend(true, {}, $(from).datebox('options')),
					calendar: $(from).datebox('calendar')
				});
				$(this).addClass('datebox-f');
			});
		},
		calendar: function(jq){	// get the calendar object
			return $.data(jq[0], 'datebox').calendar;
		},
		initValue: function(jq, value){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				var value = opts.value;
				if (value){
					value = opts.formatter.call(this, opts.parser.call(this, value));
				}
				$(this).combo('initValue', value).combo('setText', value);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				$(this).datebox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.datebox.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target, ['sharedCalendar']));
	};
	
	$.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:180,
		panelHeight:'auto',
		sharedCalendar:null,
		
		keyHandler: {
			up:function(e){},
			down:function(e){},
			left: function(e){},
			right: function(e){},
			enter:function(e){doEnter(this)},
			query:function(q,e){doQuery(this, q)}
		},
		
		currentText:'Today',
		closeText:'Close',
		okText:'Ok',
		
		buttons:[{
			text: function(target){return $(target).datebox('options').currentText;},
			handler: function(target){
				var now = new Date();
				$(target).datebox('calendar').calendar({
					year:now.getFullYear(),
					month:now.getMonth()+1,
					current:new Date(now.getFullYear(), now.getMonth(), now.getDate())
				});
				doEnter(target);
			}
		},{
			text: function(target){return $(target).datebox('options').closeText;},
			handler: function(target){
				$(this).closest('div.combo-panel').panel('close');
			}
		}],
		
		formatter:function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			return (m<10?('0'+m):m)+'/'+(d<10?('0'+d):d)+'/'+y;
		},
		parser:function(s){
			if (!s) return new Date();
			var ss = s.split('/');
			var m = parseInt(ss[0],10);
			var d = parseInt(ss[1],10);
			var y = parseInt(ss[2],10);
			if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
				return new Date(y,m-1,d);
			} else {
				return new Date();
			}
		},
		
		onSelect:function(date){}
	});
})(jQuery);
﻿/**
 * datetimebox
 * 
 */
(function($) {
	function _1(_2) {
		var _3 = $.data(_2, "datetimebox");
		var _4 = _3.options;
		$(_2).datebox($.extend({}, _4, {
			onShowPanel : function() {
				var _5 = $(this).datetimebox("getValue");
				_d(this, _5, true);
				_4.onShowPanel.call(this);
			},
			formatter : $.fn.datebox.defaults.formatter,
			parser : $.fn.datebox.defaults.parser
		}));
		$(_2).removeClass("datebox-f").addClass("datetimebox-f");
		$(_2).datebox("calendar").calendar({
			onSelect : function(_6) {
				_4.onSelect.call(this.target, _6);
			}
		});
		if (!_3.spinner) {
			var _7 = $(_2).datebox("panel");
			var p = $("<div style=\"padding:2px\"><input></div>").insertAfter(
					_7.children("div.datebox-calendar-inner"));
			_3.spinner = p.children("input");
		}
		_3.spinner.timespinner({
			width : _4.spinnerWidth,
			showSeconds : _4.showSeconds,
			separator : _4.timeSeparator
		});
		$(_2).datetimebox("initValue", _4.value);
	}
	;
	function _8(_9) {
		var c = $(_9).datetimebox("calendar");
		var t = $(_9).datetimebox("spinner");
		var _a = c.calendar("options").current;
		return new Date(_a.getFullYear(), _a.getMonth(), _a.getDate(), t
				.timespinner("getHours"), t.timespinner("getMinutes"), t
				.timespinner("getSeconds"));
	}
	;
	function _b(_c, q) {
		_d(_c, q, true);
	}
	;
	function _e(_f) {
		var _10 = $.data(_f, "datetimebox").options;
		var _11 = _8(_f);
		_d(_f, _10.formatter.call(_f, _11));
		$(_f).combo("hidePanel");
	}
	;
	function _d(_12, _13, _14) {
		var _15 = $.data(_12, "datetimebox").options;
		$(_12).combo("setValue", _13);
		if (!_14) {
			if (_13) {
				var _16 = _15.parser.call(_12, _13);
				$(_12).combo("setText", _15.formatter.call(_12, _16));
				$(_12).combo("setValue", _15.formatter.call(_12, _16));
			} else {
				$(_12).combo("setText", _13);
			}
		}
		var _16 = _15.parser.call(_12, _13);
		$(_12).datetimebox("calendar").calendar("moveTo", _16);
		$(_12).datetimebox("spinner").timespinner("setValue", _17(_16));
		function _17(_18) {
			function _19(_1a) {
				return (_1a < 10 ? "0" : "") + _1a;
			}
			;
			var tt = [ _19(_18.getHours()), _19(_18.getMinutes()) ];
			if (_15.showSeconds) {
				tt.push(_19(_18.getSeconds()));
			}
			return tt
					.join($(_12).datetimebox("spinner").timespinner("options").separator);
		}
		;
	}
	;
	$.fn.datetimebox = function(_1b, _1c) {
		if (typeof _1b == "string") {
			var _1d = $.fn.datetimebox.methods[_1b];
			if (_1d) {
				return _1d(this, _1c);
			} else {
				return this.datebox(_1b, _1c);
			}
		}
		_1b = _1b || {};
		return this.each(function() {
			var _1e = $.data(this, "datetimebox");
			if (_1e) {
				$.extend(_1e.options, _1b);
			} else {
				$.data(this, "datetimebox", {
					options : $.extend({}, $.fn.datetimebox.defaults,
							$.fn.datetimebox.parseOptions(this), _1b)
				});
			}
			_1(this);
		});
	};
	$.fn.datetimebox.methods = {
		options : function(jq) {
			var _1f = jq.datebox("options");
			return $.extend($.data(jq[0], "datetimebox").options, {
				originalValue : _1f.originalValue,
				disabled : _1f.disabled,
				readonly : _1f.readonly
			});
		},
		cloneFrom : function(jq, _20) {
			return jq.each(function() {
				$(this).datebox("cloneFrom", _20);
				$.data(this, "datetimebox",
						{
							options : $.extend(true, {}, $(_20).datetimebox(
									"options")),
							spinner : $(_20).datetimebox("spinner")
						});
				$(this).removeClass("datebox-f").addClass("datetimebox-f");
			});
		},
		spinner : function(jq) {
			return $.data(jq[0], "datetimebox").spinner;
		},
		initValue : function(jq, _21) {
			return jq.each(function() {
				var _22 = $(this).datetimebox("options");
				var _23 = _22.value;
				if (_23) {
					_23 = _22.formatter.call(this, _22.parser.call(this, _23));
				}
				$(this).combo("initValue", _23).combo("setText", _23);
			});
		},
		setValue : function(jq, _24) {
			return jq.each(function() {
				_d(this, _24);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var _25 = $(this).datetimebox("options");
				$(this).datetimebox("setValue", _25.originalValue);
			});
		}
	};
	$.fn.datetimebox.parseOptions = function(_26) {
		var t = $(_26);
		return $.extend({}, $.fn.datebox.parseOptions(_26), $.parser
				.parseOptions(_26, [ "timeSeparator", "spinnerWidth", {
					showSeconds : "boolean"
				} ]));
	};
	$.fn.datetimebox.defaults = $.extend({}, $.fn.datebox.defaults,
			{
				spinnerWidth : "100%",
				showSeconds : true,
				timeSeparator : ":",
				keyHandler : {
					up : function(e) {
					},
					down : function(e) {
					},
					left : function(e) {
					},
					right : function(e) {
					},
					enter : function(e) {
						_e(this);
					},
					query : function(q, e) {
						_b(this, q);
					}
				},
				buttons : [ {
					text : function(_27) {
						return $(_27).datetimebox("options").currentText;
					},
					handler : function(_28) {
						var _29 = $(_28).datetimebox("options");
						_d(_28, _29.formatter.call(_28, new Date()));
						$(_28).datetimebox("hidePanel");
					}
				}, {
					text : function(_2a) {
						return $(_2a).datetimebox("options").okText;
					},
					handler : function(_2b) {
						_e(_2b);
					}
				}, {
					text : function(_2c) {
						return $(_2c).datetimebox("options").closeText;
					},
					handler : function(_2d) {
						$(_2d).datetimebox("hidePanel");
					}
				} ],
				formatter : function(_2e) {
					var h = _2e.getHours();
					var M = _2e.getMinutes();
					var s = _2e.getSeconds();
					function _2f(_30) {
						return (_30 < 10 ? "0" : "") + _30;
					}
					;
					var _31 = $(this).datetimebox("spinner").timespinner(
							"options").separator;
					var r = $.fn.datebox.defaults.formatter(_2e) + " " + _2f(h)
							+ _31 + _2f(M);
					if ($(this).datetimebox("options").showSeconds) {
						r += _31 + _2f(s);
					}
					return r;
				},
				parser : function(s) {
					if ($.trim(s) == "") {
						return new Date();
					}
					var dt = s.split(" ");
					var d = $.fn.datebox.defaults.parser(dt[0]);
					if (dt.length < 2) {
						return d;
					}
					var _32 = $(this).datetimebox("spinner").timespinner(
							"options").separator;
					var tt = dt[1].split(_32);
					var _33 = parseInt(tt[0], 10) || 0;
					var _34 = parseInt(tt[1], 10) || 0;
					var _35 = parseInt(tt[2], 10) || 0;
					return new Date(d.getFullYear(), d.getMonth(), d.getDate(),
							_33, _34, _35);
				}
			});
})(jQuery);
﻿/**
 * slider 
 * 
 * Dependencies:
 *  draggable
 * 
 */
(function($){
	function init(target){
		var slider = $('<div class="slider">' +
				'<div class="slider-inner">' +
				'<a href="javascript:void(0)" class="slider-handle"></a>' +
				'<span class="slider-tip"></span>' +
				'</div>' +
				'<div class="slider-rule"></div>' +
				'<div class="slider-rulelabel"></div>' +
				'<div style="clear:both"></div>' +
				'<input type="hidden" class="slider-value">' +
				'</div>').insertAfter(target);
		var t = $(target);
		t.addClass('slider-f').hide();
		var name = t.attr('name');
		if (name){
			slider.find('input.slider-value').attr('name', name);
			t.removeAttr('name').attr('sliderName', name);
		}
		slider.bind('_resize', function(e,force){
			if ($(this).hasClass('nestui-fluid') || force){
				setSize(target);
			}
			return false;
		});
		return slider;
	}
	
	/**
	 * set the slider size, for vertical slider, the height property is required
	 */
	function setSize(target, param){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		slider._size(opts);
		if (opts.mode == 'h'){
			slider.css('height', '');
			slider.children('div').css('height', '');
		} else {
			slider.css('width', '');
			slider.children('div').css('width', '');
			slider.children('div.slider-rule,div.slider-rulelabel,div.slider-inner')._outerHeight(slider._outerHeight());
		}
		initValue(target);
	}
	
	/**
	 * show slider rule if needed
	 */
	function showRule(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		var aa = opts.mode == 'h' ? opts.rule : opts.rule.slice(0).reverse();
		if (opts.reversed){
			aa = aa.slice(0).reverse();
		}
		_build(aa);
		
		function _build(aa){
			var rule = slider.find('div.slider-rule');
			var label = slider.find('div.slider-rulelabel');
			rule.empty();
			label.empty();
			for(var i=0; i<aa.length; i++){
				var distance = i*100/(aa.length-1)+'%';
				var span = $('<span></span>').appendTo(rule);
				span.css((opts.mode=='h'?'left':'top'), distance);
				
				// show the labels
				if (aa[i] != '|'){
					span = $('<span></span>').appendTo(label);
					span.html(aa[i]);
					if (opts.mode == 'h'){
						span.css({
							left: distance,
							marginLeft: -Math.round(span.outerWidth()/2)
						});
					} else {
						span.css({
							top: distance,
							marginTop: -Math.round(span.outerHeight()/2)
						});
					}
				}
			}
		}
	}
	
	/**
	 * build the slider and set some properties
	 */
	function buildSlider(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		slider.removeClass('slider-h slider-v slider-disabled');
		slider.addClass(opts.mode == 'h' ? 'slider-h' : 'slider-v');
		slider.addClass(opts.disabled ? 'slider-disabled' : '');
		
		var inner = slider.find('.slider-inner');
		inner.html(
			'<a href="javascript:void(0)" class="slider-handle"></a>' +
			'<span class="slider-tip"></span>'
		);
		if (opts.range){
			inner.append(
				'<a href="javascript:void(0)" class="slider-handle"></a>' +
				'<span class="slider-tip"></span>'
			);
		}
		
		slider.find('a.slider-handle').draggable({
			axis:opts.mode,
			cursor:'pointer',
			disabled: opts.disabled,
			onDrag:function(e){
				var left = e.data.left;
				var width = slider.width();
				if (opts.mode!='h'){
					left = e.data.top;
					width = slider.height();
				}
				if (left < 0 || left > width) {
					return false;
				} else {
					setPos(left, this);
					return false;
				}
			},
			onStartDrag:function(){
				state.isDragging = true;
				opts.onSlideStart.call(target, opts.value);
			},
			onStopDrag:function(e){
				setPos(opts.mode=='h'?e.data.left:e.data.top, this);
				opts.onSlideEnd.call(target, opts.value);
				opts.onComplete.call(target, opts.value);
				state.isDragging = false;
			}
		});
		slider.find('div.slider-inner').unbind('.slider').bind('mousedown.slider', function(e){
			if (state.isDragging || opts.disabled){return}
			var pos = $(this).offset();
			setPos(opts.mode=='h'?(e.pageX-pos.left):(e.pageY-pos.top));
			opts.onComplete.call(target, opts.value);
		});
		
		function setPos(pos, handle){
			var value = pos2value(target, pos);
			var s = Math.abs(value % opts.step);
			if (s < opts.step/2){
				value -= s;
			} else {
				value = value - s + opts.step;
			}
			if (opts.range){
				var v1 = opts.value[0];
				var v2 = opts.value[1];
				var m = parseFloat((v1+v2)/2);
				if (handle){
					var isLeft = $(handle).nextAll('.slider-handle').length > 0;
					if (value <= v2 && isLeft){
						v1 = value;
					} else if (value >= v1 && (!isLeft)){
						v2 = value;
					}
				} else {
					if (value < v1){
						v1 = value;
					} else if (value > v2){
						v2 = value;
					} else {
						value < m ? v1 = value : v2 = value;
					}					
				}
				$(target).slider('setValues', [v1,v2]);
			} else {
				$(target).slider('setValue', value);
			}
		}
	}
	
	/**
	 * set a specified value to slider
	 */
	function setValues(target, values){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var oldValues = $.isArray(opts.value) ? opts.value : [opts.value];
		var newValues = [];
		
		if (!$.isArray(values)){
			values = $.map(String(values).split(opts.separator), function(v){
				return parseFloat(v);
			});
		}
		
		slider.find('.slider-value').remove();
		var name = $(target).attr('sliderName') || '';
		for(var i=0; i<values.length; i++){
			var value = values[i];
			if (value < opts.min) value = opts.min;
			if (value > opts.max) value = opts.max;
			
			var input = $('<input type="hidden" class="slider-value">').appendTo(slider);
			input.attr('name', name);
			input.val(value);
			newValues.push(value);
			
			var handle = slider.find('.slider-handle:eq('+i+')');
			var tip = handle.next();
			var pos = value2pos(target, value);
			if (opts.showTip){
				tip.show();
				tip.html(opts.tipFormatter.call(target, value));
			} else {
				tip.hide();
			}
			
			if (opts.mode == 'h'){
				var style = 'left:'+pos+'px;';
				handle.attr('style', style);
				tip.attr('style', style +  'margin-left:' + (-Math.round(tip.outerWidth()/2)) + 'px');
			} else {
				var style = 'top:' + pos + 'px;';
				handle.attr('style', style);
				tip.attr('style', style + 'margin-left:' + (-Math.round(tip.outerWidth())) + 'px');
			}
		}
		opts.value = opts.range ? newValues : newValues[0];
		$(target).val(opts.range ? newValues.join(opts.separator) : newValues[0]);
		
		if (oldValues.join(',') != newValues.join(',')){
			opts.onChange.call(target, opts.value, (opts.range?oldValues:oldValues[0]));
		}
	}
	
	function initValue(target){
		var opts = $.data(target, 'slider').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		setValues(target, opts.value);
		opts.onChange = fn;
	}
	
	/**
	 * translate value to slider position
	 */
	function value2pos(target, value){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var size = opts.mode == 'h' ? slider.width() : slider.height();
		var pos = opts.converter.toPosition.call(target, value, size);
		if (opts.mode == 'v'){
			pos = slider.height() - pos;
		}
		if (opts.reversed){
			pos = size - pos;
		}
		return pos.toFixed(0);
	}
	
	/**
	 * translate slider position to value
	 */
	function pos2value(target, pos){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var size = opts.mode == 'h' ? slider.width() : slider.height();
		var pos = opts.mode=='h' ? (opts.reversed?(size-pos):pos) : (opts.reversed?pos:(size-pos));
		var value = opts.converter.toValue.call(target, pos, size);
		return value.toFixed(0);
	}
	
	$.fn.slider = function(options, param){
		if (typeof options == 'string'){
			return $.fn.slider.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'slider');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'slider', {
					options: $.extend({}, $.fn.slider.defaults, $.fn.slider.parseOptions(this), options),
					slider: init(this)
				});
				$(this).removeAttr('disabled');
			}
			
			var opts = state.options;
			opts.min = parseFloat(opts.min);
			opts.max = parseFloat(opts.max);
			if (opts.range){
				if (!$.isArray(opts.value)){
					opts.value = $.map(String(opts.value).split(opts.separator), function(v){
						return parseFloat(v);
					});
				}
				if (opts.value.length < 2){
					opts.value.push(opts.max);
				}
			} else {
				opts.value = parseFloat(opts.value);
			}
			opts.step = parseFloat(opts.step);
			opts.originalValue = opts.value;
			
			buildSlider(this);
			showRule(this);
			setSize(this);
		});
	};
	
	$.fn.slider.methods = {
		options: function(jq){
			return $.data(jq[0], 'slider').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').slider.remove();
				$(this).remove();
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getValue: function(jq){
			return jq.slider('options').value;
		},
		getValues: function(jq){
			return jq.slider('options').value;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var opts = $(this).slider('options');
				setValues(this, opts.range?[opts.min,opts.max]:[opts.min]);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).slider('options');
				$(this).slider(opts.range?'setValues':'setValue', opts.originalValue);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = false;
				buildSlider(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = true;
				buildSlider(this);
			});
		}
	};
	
	$.fn.slider.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height','mode',{reversed:'boolean',showTip:'boolean',range:'boolean',min:'number',max:'number',step:'number'}
		]), {
			value: (t.val() || undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			rule: (t.attr('rule') ? eval(t.attr('rule')) : undefined)
		});
	};
	
	$.fn.slider.defaults = {
		width: 'auto',
		height: 'auto',
		mode: 'h',	// 'h'(horizontal) or 'v'(vertical)
		reversed: false,
		showTip: false,
		disabled: false,
		range: false,
		value: 0,
		separator: ',',
		min: 0,
		max: 100,
		step: 1,
		rule: [],	// [0,'|',100]
		tipFormatter: function(value){return value},
		converter:{
			toPosition:function(value, size){
				var opts = $(this).slider('options');
				return (value-opts.min)/(opts.max-opts.min)*size;
			},
			toValue:function(pos, size){
				var opts = $(this).slider('options');
				return opts.min + (opts.max-opts.min)*(pos/size);
			}
		},
		onChange: function(value, oldValue){},
		onSlideStart: function(value){},
		onSlideEnd: function(value){},
		onComplete: function(value){}
	};
})(jQuery);
