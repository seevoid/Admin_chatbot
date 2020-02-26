function blur_room() {
	document.getElementsByClassName("container-fluid")[0].style.WebkitFilter = 'blur(20px)';
	document.getElementsByClassName("container-fluid")[0].style.filter= 'blur(20px)';
}

var production = false
var botui = null
var room_locked = true

if (production) {
  var BASE_URL = "https://chatbot.majordome.io"
  var URL_CHAT_PANEL = "https://chat.online.majordome.io"
} else {
  var BASE_URL = "http://localhost:5050"
  var URL_CHAT_PANEL = "http://localhost:5001/"
}

$('#to_chat_button').attr("href", URL_CHAT_PANEL)

var scripts_array = [BASE_URL+'/js/bootstrap_js_min.js', BASE_URL+'/js/vuejs_2_3_2.js', BASE_URL+'/js/botui_back.js',  'static/js/displace.js', 'static/js/colorpicker.js']

function getScripts(scripts, callback) {
    var progress = 0;
    scripts.forEach(function(script) { 
        $.getScript(script, function () {
            if (++progress == scripts.length) callback();
        });
    });
}

client_name = window.sessionStorage.getItem('client_name')

window.sessionStorage.setItem('client_name', client_name)

$(".container-fluid").click(function(event) {
	if (room_locked == true) {
		event.stopPropagation()
	}
});

function create_html(client_name) {
	var html = '<div id="botui_container"><div id="header_bot"><div id="support_section"><img id="support_logo" src="' + BASE_URL + '/avatar/' + client_name + '.png"><span id="name_support" bind="chatbot_name"></span></div><i id="close_icon" class="fas fa-times fa-lg"></i></div><div class="popup_bot" data-popup_bot="popup_bot-1"><div class="popup_bot-inner"><h6 id="popup_bot_msg"></h6><div id="popup_bot_buttons" class="btn-group" role="group" aria-label="Basic example"><a id="yes_button_popup"><button style="width: 120px;" type="button" class="btn btn-success">Oui</button></a><a id="no_button_popup"><button style="width: 120px;" type="button" class="btn btn-secondary">Non</button></a></div><a class="popup_bot-close" id="close_button_popup">x</a></div></div><bot-ui></bot-ui><div id="bottom_bot" ><div id="container_input_bot"><input type="text" id="input_bot" name="name" placeholder="Ecrivez quelque chose..." autocomplete="off"><i id="icon_send" class="far fa-paper-plane fa-lg"></i></div><div class="flex-bottom-container"><i id="icon_help_livechat" class="far fa-question-circle"></i><div id="tip_help"><p style="font-size: 70%; line-height: 100%; color: white; text-align: center;"></p></div><img id="human_status_pics" width="15" height="17" src="' + BASE_URL + '/img/online_status.png"><span data-popup_bot-open="popup_bot-1"  title="" id="human_status_text">Humain en ligne</span></div><div class="flex-copyright-container"><span id="copyright_bot">Powered by <a style="color: #25499F;" href="https://majordome.io" target="_blank">Majordome.io</a></span></div></div></div>'

	$("#bot_view .item-container-bot-view").prepend(html)
	$("#tip_help").hide()
}

var CURRENT_ACTION_EDITING = null
var list_creation_action_jquery = []
var list_help_action_jquery = []
var list_tree_action_jquery = []
var current_level_tree = 0
var discussion_tree_locked = true

init_room("example")

function init_room(client_name) {
	window.sessionStorage.setItem('client_name', client_name)
	room_locked = false
	$("#popup_login").hide()
	$('#client_name').text(window.sessionStorage.getItem('client_name')[0].toUpperCase() + window.sessionStorage.getItem('client_name').slice(1, window.sessionStorage.getItem('client_name').length))
	document.getElementsByClassName("container-fluid")[0].style.WebkitFilter = 'blur(0px)';
	document.getElementsByClassName("container-fluid")[0].style.filter= 'blur(0px)';
	create_html(window.sessionStorage.getItem('client_name'))
	main_programm()
}

$("#login_button").click(function(event) {
	event.stopPropagation()
	ask_for_login($("#email").val(), $("#password").val())
});

$("#logout_button").click(function(event) {
	event.stopPropagation()
	blur_room()
	room_locked = false
	$("#popup_login").show()
	window.sessionStorage.clear()
	$("#botui_container").remove()
	clear_panel()
});

function clear_panel() {
	$("#avatar_panel").remove()
	$("#bubble_panel").remove()
	$("#bubble").remove()
	$("#botui_container").remove()
	$(".action_creation").remove()
	$(".action_tree").remove()
	$(".action_help").remove()
}

$('body').keypress(function(event){
  let keycode = (event.keyCode ? event.keyCode : event.which);
  event.stopPropagation();
  if(keycode == '13'){
    if (room_locked == true) {
      ask_for_login($("#email").val(), $("#password").val())
    }
  }
});

function main_programm() {
	getScripts(scripts_array, function () {
		get_gui()
		get_chatbot_name()
		get_welcome_msg()
		get_text_popup()
		get_all_actions()
		get_help()

		//-------- COLOR PICKER SEECTION --------//

		$('#header_color_picker').ColorPicker({
			color: JSON.parse(window.sessionStorage.getItem('gui'))['header_color'],
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				$('#header_bot').css('background-color', '#' + hex);
				$('#header_color_picker').attr("value", '#' + hex)

				var gui = JSON.parse(window.sessionStorage.getItem('gui'))
				gui['header_color'] = '#' + hex
				window.sessionStorage.setItem('gui', JSON.stringify(gui))
			}
		});

		$('#user_msg_background_color_picker').ColorPicker({
			color: JSON.parse(window.sessionStorage.getItem('gui'))['user_msg_background_color'],
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				document.documentElement.style.setProperty('--background_color_msg_user', '#' + hex)
				$('#user_msg_background_color_picker').attr("value", '#' + hex)

				var gui = JSON.parse(window.sessionStorage.getItem('gui'))
				gui['user_msg_background_color'] = '#' + hex
				window.sessionStorage.setItem('gui', JSON.stringify(gui))
			}
		});



		$("#welcome_msg_input").focusout(function() {
			var welcome_msg = $("#welcome_msg_input").val()
			while (welcome_msg.includes("\n")) {
				welcome_msg = welcome_msg.replace("\n", "<br/>")	
			}

			if (window.sessionStorage.getItem('welcome_msg') != welcome_msg) {
				window.sessionStorage.setItem('welcome_msg', welcome_msg)
				reload_view()
			}
		})

		function clear_conversation_window() {
			botui.message.removeAll()
			botui.action.hide()
		}

		$("*[bind]").on('change keyup', function (e) {
			var to_bind = $(this).attr('bind');
			$("*[bind='"+to_bind+"']").html($(this).val());
			$("*[bind='"+to_bind+"']").val($(this).val());
		})
		$("div[bind]").bind("DOMSubtreeModified",function(){
			var to_bind = $(this).attr('bind');
			$("*[bind='"+to_bind+"']").html($(this).html());
			$("*[bind='"+to_bind+"']").val($(this).html());
		});

		$("input:file").change(function (){
		   var fileName = $(this).val();
		   var file = $(this)[0].files[0];
		   var upload = new Upload(file);

		   if ($(this).attr("id") == "avatar_file") {
		   	upload.doUpload("/set_avatar");
		   	$("#avatar_panel").attr('src', $("#avatar_panel").attr('src')+'?'+Math.random());
		   	$("#support_logo").attr('src', $("#support_logo").attr('src')+'?'+Math.random());
		   } else {
		   	upload.doUpload("/set_bubble");
		   	$("#bubble").attr('src', $("#bubble").attr('src')+'?'+Math.random());
		   	$("#bubble_panel").attr('src', $("#bubble_panel").attr('src')+'?'+Math.random());
		   }
		 });

		$('#slider_drag').slider({
		  	range: 'min',
		  	value: $('#slider_drag').attr('data-min-range')*100,
		  	min: 0,
		  	max: 1000,
		  	slide: function(event, ui) {
		  		var slideVal = ui.value/100,
		  			slideMinVal = parseInt($('#slider_drag').attr('data-min-range'));
		  		if(slideVal<=slideMinVal) { return false; }
		    	$('#slider_value').text(slideVal);
		    	$('#slider_tooltip').css({'left':parseInt($('.ui-slider-handle').css('left'))-35+'px'});
		  	},
		  	change: function(event, ui) {
		  		$('#slider_tooltip').css({'left':parseInt($('.ui-slider-handle').css('left'))-35+'px'});
		  	}
		});

		$('#slider_value').text($('#slider_drag').slider('value')/100);
		$('#slider_tooltip').css({'left':parseInt($('.ui-slider-handle').css('left'))-35+'px'});

		$('#set_minvalue').on('change',function(){
		  var minValue = $(this).val();
		  if(minValue<0||minValue>10){
		    $(this).val($('#slider_drag').slider('value')/100);
		    return false;
		  }
		  $('#slider_drag').attr('data-min-range',minValue).slider('value',minValue*100);
		  $('#slider_value').text(minValue);
		});

		$('#add_level_tree_button_main').click(function() {
			//TODO
		})


		function init_control_panel() {
			var welcome_msg = window.sessionStorage.getItem('welcome_msg')

			$("#chatbot_name_input").val(window.sessionStorage.getItem('chatbot_name'))

			while (welcome_msg.includes("<br/>")) {
				welcome_msg = welcome_msg.replace("<br/>", "\n")
			}

			$("#welcome_msg_input").html(welcome_msg)
			$('#text_popup_input').html(window.sessionStorage.getItem('text_popup'))

			var html = '<img id="avatar_panel" src="' + BASE_URL + '/avatar/' + window.sessionStorage.getItem('client_name') + '.png" style="width: 50px; height: 50px; border-radius: 70%;">'
			$("#avatar").append(html)

			html = '<img id="bubble_panel" src="' + BASE_URL + '/bubble/' +  window.sessionStorage.getItem('client_name') + '.png" style="width: 50px; height: 50px; border-radius: 70%;">'
			$("#bubble_input").append(html)

			html = '<img  id="bubble" src="' + BASE_URL + '/bubble/' + window.sessionStorage.getItem('client_name') + '.png">'
			$("#bubble_div").append(html)

			$("#width_bubble_slider_label").text($("#bubble").css("width"))
			$("#width_bubble_slider").attr("value", $("#bubble").css("width").slice(0, -2))
			$("#height_bubble_slider_label").text($("#bubble").css("height"))
			$("#height_bubble_slider").attr("value", $("#bubble").css("height").slice(0, -2))
			$("#width_window_slider_label").text($("#botui_container").css("width"))
			$("#width_window_slider").attr("value", $("#botui_container").css("width").slice(0, -2))
			$("#height_window_slider_label").text($("#botui_container").css("height"))
			$("#height_window_slider").attr("value", $("#botui_container").css("height").slice(0, -2))


			$('#header_color_picker').attr("value", JSON.parse(window.sessionStorage.getItem('gui'))['header_color'])
			$('#user_msg_background_color_picker').attr("value", JSON.parse(window.sessionStorage.getItem('gui'))['user_msg_background_color'])
		}


		function init_creation_panel() {
			var actions = JSON.parse(window.sessionStorage.getItem('actions'))
			var html = ""
			var action_id = ""

			$('#container_popup_edition').hide()
			$('#container_tree_popup_edition').hide()

			for (var i = 0; i < actions.length; i++) {
				action_id = action_name_to_id(actions[i]['name'])
				html = '<div class="action_creation" id="creation_' + action_id + '" value="' + actions[i]['name'] + '"><span>' + actions[i]['name'] + '</span></div>'
				$(".actions_creation_container").append(html)
				list_creation_action_jquery.push($("#creation_"+action_id))
			}

			$(".action_creation").click(function(event) {
				action_creation_clicked($(this))
			})

			display_help_actions(false)

			for (var i = 0; i < actions.length; i++) {
				var html_tree = '<option id="option_tree_' + action_name_to_id(actions[i]['name']) + '">' + actions[i]['name'] + '</option>'
				$("#select_action_box_main").append(html_tree)
			}
		}

		function action_creation_clicked(action_jquery) {
			$('#container_popup_edition').show()
			$(".flex-container-creation").css("pointer-events", "none")
			$(".flex-container-creation").css("filter", "blur(8px)")

			CURRENT_ACTION_EDITING = action_jquery
			let action = get_action_by_name(action_jquery.attr("value"))

			if (CURRENT_ACTION_EDITING != null) {
				$("#action_name_input_edition").val(action['name'])
				$("#action_text_input_edition").val(action['text'])

				$("#checkbox_edit_action").prop("checked", false)
				for (var i = 0; i < list_help_action_jquery.length; i++) {
					if (list_help_action_jquery[i].attr("id") == "help_"+action_jquery.attr("id")) {
						$("#checkbox_edit_action").prop("checked", true)
					}
				}
			}
		}

		function add_next_action(action_name, next_action_name) {
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))

			for (var i = 0; i < all_actions.length; i++) {
				if (all_actions[i]['name'] == action_name) {
					all_actions[i]['next_actions'].push(next_action_name)
				}
			}

			window.sessionStorage.setItem('actions', JSON.stringify(all_actions))
		}

		function add_action_tree_button_clicked(action_jquery) {
			var current_level = parseInt(action_jquery.attr("data-level"))
			var option_choosen = $("#select_action_tree_level_"+current_level).val()
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))

			var action_already_exist_in_level = false

			$("#tree_level_"+current_level).children().map(function() {
				if ($(this).attr("value") == option_choosen) {
					action_already_exist_in_level = true
				}
			})

			if (!action_already_exist_in_level) {
				var action_id = action_name_to_id(option_choosen)

				var container_current_level = $("#tree_level_"+current_level)
				var html_action = '<div class="action_tree" tabindex="0" value="' + option_choosen + '" data-level=' + current_level + ' id="tree_action_level_' + current_level.toString() + '_' + action_id + '"><span>' + option_choosen + '</span></div>'

				container_current_level.append(html_action)

				if (current_level > 1) {
					$("#tree_level_"+(current_level-1).toString()).children().map(function() {
						if ($(this).attr("data-selected") == "true") {
							let action_to_add = $("#tree_action_level_"+current_level+"_"+action_id)
							add_next_action(get_action_by_name($(this).attr("value"))['name'], action_to_add.attr("value"))
						}
					})
				} else {
					$(".action_tree").map(function() {
						if ($(this).attr("data-level") == "0" || $(this).attr("data-level") == 0) {
							let action_to_add = $("#tree_action_level_"+current_level+"_"+action_id)
							add_next_action(get_action_by_name($(this).attr("value"))['name'], action_to_add.attr("value"))
						}
					})
				}				
			}
		}	

		function remove_next_action(action_name, next_action_name) {
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))

			for (var i = 0; i < all_actions.length; i++) {
				if (all_actions[i]['name'] == action_name) {
					for (var j = 0; j < all_actions[i]['next_actions'].length; j++) {
						if (all_actions[i]['next_actions'][j] == next_action_name) {
							let removed = all_actions[i]['next_actions'].splice(1,j)
							all_actions[i]['next_actions'] = removed
						}
					}	
				}
			}

			window.sessionStorage.setItem('actions', JSON.stringify(all_actions))
		}

		function action_tree_delete_key(action_jquery) {
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))
			var current_level = parseInt(action_jquery.attr("data-level"))
			var current_action_name = action_jquery.attr("value")
			var action_id = action_name_to_id(action_jquery.attr("value"))

			//On supprime toutes les next actions de cette action précise
			$(".action_tree").map(function() {
				if ($(this).attr("data-level") > current_level) {
					remove_next_action(current_action_name, $(this).attr("value"))
					$(this).remove()
				} else if ($(this).attr("data-level") == current_level-1 && $(this).attr("data-selected") == "true") {
					remove_next_action($(this).attr("value"), current_action_name)
				}
			});

			action_jquery.remove()

			$("#tree_level_"+(current_level+1).toString()).remove()
		}

		function action_tree_clicked(action_jquery) {
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))

			var current_level = parseInt(action_jquery.attr("data-level"))
			var research_done = false
			var current_action_name = action_jquery.attr("value")
			var action_tree_card = ""
			var action_tree_container = ""
			var add_action_tree_button = ""
			var option_html = ""
			var action_id = action_name_to_id(action_jquery.attr("value"))

			// $(".actions_tree_container").remove()
			action_jquery.attr("data-selected", true)
			action_jquery.css("background-color", "#F7D358")
			action_jquery.focus();


			if ($("#tree_"+action_id).attr("value") != current_action_name) {
				$(".action_tree").map(function() {
					if ($(this).attr("value") != current_action_name && $(this).attr("data-level") == current_level) {
						$(this).css("background-color", "grey")
						$(this).attr("data-selected",false)
					}

				    if ($(this).attr("data-level") > current_level) {
				    	$(this).remove()
				    	$("#add_action_tree_button_level_"+$(this).attr("data-level")).remove()
				    	$("#select_action_tree_level_"+$(this).attr("data-level")).remove()
				    }

				    if ($(this).attr("data-level") < current_level) {
				    	if ($(this).attr("data-selected") == "false") {
				    		$(this).css("background-color", "grey")
				    	} else {
				    		$(this).css("background-color", "#05728F")
				    	}
				    }

				    if ($(this).attr("data-level") == 0) {
				    	$(this).css("background-color", "#05728F")
				    	$(this).attr("data-selected",true)
				    }

				})

				$(".actions_tree_container").map(function() {
					if ($(this).attr("data-level") > current_level) {
						$(this).remove()
					}
				})

				$(".add_action_tree_button").map(function() {
					if ($(this).attr("data-level") > current_level) {
						$(this).remove()
					}
				})

				// $("#tree_level_"+(current_level+1).toString()).remove()
				next_actions = get_action_by_name(current_action_name)['next_actions']

				action_tree_container = '<div class="actions_tree_container" data-level=' + (current_level+1).toString() + ' id="tree_level_' + (current_level+1).toString() + '"></div>'
				$("#global_actions_tree_container").append(action_tree_container)
				add_action_tree_button = '<i data-level=' + (current_level+1).toString() + ' class="fas fa-plus-circle add_action_tree_button" style="cursor: pointer;" id="add_action_tree_button_level_' + (current_level+1).toString() + '"></i><select style="margin-top: 1%;" id="select_action_tree_level_' + (current_level+1).toString() + '"></select>'
				$("#tree_level_"+(current_level+1).toString()).append(add_action_tree_button)
				for (var k = 0; k < all_actions.length; k++) {
					option_html = '<option id="option_tree_level_"' + (current_level+1).toString() + '>' + all_actions[k]['name'] + '</option>'
					$("#select_action_tree_level_"+(current_level+1).toString()).append(option_html)
				}
				for (var j = 0; j < next_actions.length; j++) {
					action_id = action_name_to_id(next_actions[j])
					action_tree_card = '<div class="action_tree" tabindex="0" data-selected=false value="' + next_actions[j] + '" data-level=' + (current_level+1).toString() + ' id="tree_action_level_' + (current_level+1).toString() + '_' + action_id + '"><span>' + next_actions[j] + '</span></div>'
					$("#tree_level_"+(current_level+1).toString()).append(action_tree_card)
				}

				// $("#tree_level_"+current_level+2).remove()
				// $("#tree_level_"+current_level+1).remove()
				// console.log("alors ? : " + $("#tree_level_"+(current_level+3).toString()).length)

				$( ".action_tree" ).keydown(function(evt) {
				    evt = evt || window.event;
				    if (evt.keyCode == 46) {
				    	action_tree_delete_key($(this))
				    }
				});

				if (!($("#tree_level_"+(current_level+1).toString()).length)) {
					action_tree_container = '<div class="actions_tree_container" data-level=' + (current_level+1).toString() +' id="tree_level_' + (current_level+1).toString() + '"></div>'
					$("#global_actions_tree_container").append(action_tree_container)
					add_action_tree_button = '<i data-level=' + (current_level+1).toString() + ' class="fas fa-plus-circle add_action_tree_button" style="cursor: pointer;" id="add_action_tree_button_level_' + (current_level+1).toString() + '"></i><select style="margin-top: 1%;" id="select_action_tree_level_' + (current_level+1).toString() + '"></select>'
					$("#tree_level_"+(current_level+1).toString()).append(add_action_tree_button)
					for (var k = 0; k < all_actions.length; k++) {
						option_html = '<option id="option_tree_level_"' + (current_level+1).toString() + '>' + all_actions[k]['name'] + '</option>'
						$("#select_action_tree_level_"+(current_level+1).toString()).append(option_html)
					}
				}
			}
		}

		function action_help_clicked(action_jquery) {
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))
			var action_id = action_name_to_id(action_jquery.attr("value"))
			var next_actions = []
			var research_done = false
			var counter_research = 0
			var current_action_name = action_jquery.attr("value")
			var current_level = 0
			var action_tree_card = ""
			var action_tree_container = ""
			var add_action_tree_button = ""
			var option_html = ""

			if ($("#tree_"+action_id).attr("value") != current_action_name) {

				$(".add_action_tree_button").map(function() {
					$(this).remove()
				})

				$(".actions_tree_level_0_container").children().remove()
				$(".actions_tree_container").remove()
				var help_action_html = '<div class="action_tree" data-level=0 id="tree_' + action_id + '" value="' + current_action_name + '"><span>' + current_action_name + '</span></div>'

				$(".actions_tree_level_0_container").append(help_action_html)
				var el1 = $("#tree_"+action_id)
				$("#tree_"+action_id).css("background-color", "#05728F")



				next_actions = get_action_by_name(current_action_name)['next_actions']
				current_level += 1
				action_tree_container = '<div class="actions_tree_container" data-level=' + current_level.toString() + ' id="tree_level_' + current_level.toString() + '"></div>'
				$("#global_actions_tree_container").append(action_tree_container)
				add_action_tree_button = '<i data-level=' + current_level.toString() + ' class="fas fa-plus-circle add_action_tree_button" style="cursor: pointer;" id="add_action_tree_button_level_' + current_level.toString() + '"></i><select style="margin-top: 1%;" id="select_action_tree_level_' + current_level.toString() + '"></select>'
				$("#tree_level_"+current_level.toString()).append(add_action_tree_button)
				for (var k = 0; k < all_actions.length; k++) {
					option_html = '<option id="option_tree_level_"' + current_level.toString() + '>' + all_actions[k]['name'] + '</option>'
					$("#select_action_tree_level_"+current_level.toString()).append(option_html)
				}
				for (var j = 0; j < next_actions.length; j++) {
					action_id = action_name_to_id(next_actions[j])
					action_tree_card = '<div class="action_tree" tabindex="0" data-selected=false value="' + next_actions[j] + '" data-level=' + current_level.toString() + ' id="tree_action_level_' + current_level.toString() + '_' + action_id + '"><span>' + next_actions[j] + '</span></div>'
					$("#tree_level_"+current_level.toString()).append(action_tree_card)
				}


				if (!$("#tree_level_1").length) {
					action_tree_container = '<div class="actions_tree_container" data-level=1 id="tree_level_1"></div>'
					$("#global_actions_tree_container").append(action_tree_container)
					add_action_tree_button = '<i data-level=1 class="fas fa-plus-circle add_action_tree_button" style="cursor: pointer;" id="add_action_tree_button_level_1"></i><select style="margin-top: 1%;" id="select_action_tree_level_1"></select>'
					$("#tree_level_1").append(add_action_tree_button)
					for (var k = 0; k < all_actions.length; k++) {
						option_html = '<option id="option_tree_level_"' + current_level.toString() + '>' + all_actions[k]['name'] + '</option>'
						$("#select_action_tree_level_"+current_level.toString()).append(option_html)
					}
				}

				if (!($("#tree_level_"+(current_level+1).toString()).length)) {
					action_tree_container = '<div class="actions_tree_container" data-level=' + (current_level+1).toString() +' id="tree_level_' + (current_level+1).toString() + '"></div>'
					$("#global_actions_tree_container").append(action_tree_container)
					add_action_tree_button = '<i data-level=' + (current_level+1).toString() + ' class="fas fa-plus-circle add_action_tree_button" style="cursor: pointer;" id="add_action_tree_button_level_' + (current_level+1).toString() + '"></i><select style="margin-top: 1%;" id="select_action_tree_level_' + (current_level+1).toString() + '"></select>'
					$("#tree_level_"+(current_level+1).toString()).append(add_action_tree_button)
					for (var k = 0; k < all_actions.length; k++) {
						option_html = '<option id="option_tree_level_"' + (current_level+1).toString() + '>' + all_actions[k]['name'] + '</option>'
						$("#select_action_tree_level_"+(current_level+1).toString()).append(option_html)
					}
				}

				$(document).on('click', '.action_tree', function(e) {
					e.preventDefault()
					action_tree_clicked($(this))
				})

				$(document).on('click', '.add_action_tree_button', function(e) {
					e.preventDefault()
					add_action_tree_button_clicked($(this))
				})

			}
		}

		function set_client_gui() {
		  gui = JSON.parse(window.sessionStorage.getItem('gui'))

		  // Set all the variable of custom css
		  $("#name_support").text(window.sessionStorage.getItem('chatbot_name'))
		  $("#header_bot").css('background-color', gui['header_color'])
		  $("#botui_container").css('width', gui['window_width'])
		  $("#botui_container").css('height', gui['window_height'])
		  $("#bubble").css('width', gui['bot_bubble_width'])
		  $("#bubble").css('height', gui['bot_bubble_height'])

		  // Set global variables in the file botui_thm_default.css
		  document.documentElement.style.setProperty('--border_color_actions_bubble', gui['actions_bubble_border_color'])
		  document.documentElement.style.setProperty('--text_color_actions_bubble', gui['actions_bubble_text_color'])
		  document.documentElement.style.setProperty('--text_color_actions_bubble_hover', gui['actions_bubble_text_color_hover'])
		  document.documentElement.style.setProperty('--background_color_actions_bubble', gui['actions_bubble_background_color'])
		  document.documentElement.style.setProperty('--background_color_actions_bubble_hover', gui['actions_bubble_background_color_hover'])
		  document.documentElement.style.setProperty('--text_color_msg_bot', gui['bot_msg_text_color'])
		  document.documentElement.style.setProperty('--background_color_msg_bot', gui['bot_msg_background_color'])
		  document.documentElement.style.setProperty('--text_color_msg_user', gui['user_msg_text_color'])
		  document.documentElement.style.setProperty('--background_color_msg_user', gui['user_msg_background_color'])
		}

		

		// Function that display the help actions bubbles. When the user click on an action --> Go to function 'show_action_text'
		function display_help_actions(botview) {
		  var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))

		  var help_actions_text = JSON.parse(window.sessionStorage.getItem('help'))
		  var help_actions_value = []
		  var help_actions = []
		  var html = ""

		  var botui_actions = []
		  for (var i = 0; i < help_actions_text.length; i++) {
		    for (var j = 0; j < all_actions.length; j++) {
		      if (help_actions_text[i] == all_actions[j]['name']) {
		        botui_actions.push({text: all_actions[j]['name'], value: all_actions[j]['value']})
		        help_actions.push(all_actions[j])
		      }
		    }
		  }

		  if (botview) {
		  	botui.action.button({
			    loading: false,
			    delay: 0,
			    action: botui_actions
			  }).then(function () {

			    })
			} else {
				for (var i = 0; i < help_actions.length; i++) {
					action_id = action_name_to_id(help_actions[i]['name'])
					html = '<div class="action_help" id="help_' + action_id + '" value="' + help_actions[i]['name'] + '"><span>' + help_actions[i]['name'] + '</span></div>'
					$(".actions_help_container").append(html)
					list_help_action_jquery.push($("#help_"+action_id))
				}

				$(".action_help").click(function() {
					action_help_clicked($(this))
				})
			}
		}

		//----------------- SLIDERS SECTION -----------------//

		var width_bubble_slider = document.getElementById("width_bubble_slider");
		var height_bubble_slider = document.getElementById("height_bubble_slider");
		var width_window_slider = document.getElementById("width_window_slider");
		var height_window_slider = document.getElementById("height_window_slider");

		width_bubble_slider.addEventListener("input", width_bubble_slider_changed, false);
		height_bubble_slider.addEventListener("input", height_bubble_slider_changed, false);
		width_window_slider.addEventListener("input", width_window_slider_changed, false);
		height_window_slider.addEventListener("input", height_window_slider_changed, false);

		function width_bubble_slider_changed() {
		  let value = width_bubble_slider.value;
		  $("#bubble").css("width", value+"px")
		  $("#width_bubble_slider_label").text(value+"px")
		}

		function height_bubble_slider_changed() {
		  let value = height_bubble_slider.value;
		  $("#bubble").css("height", value+"px")
		  $("#height_bubble_slider_label").text(value+"px")
		}


		function width_window_slider_changed() {
		  let value = width_window_slider.value;
		  $("#botui_container").css("width", value+"px")
		  $("#width_window_slider_label").text(value+"px")
		  var bottom_element_1 = $(".flex-bottom-container").remove()
		  var bottom_element_2 = $(".flex-copyright-container").remove()
		  $("#bottom_bot").append(bottom_element_1)
		  $("#bottom_bot").append(bottom_element_2)
		}

		function height_window_slider_changed() {
		  let value = height_window_slider.value;
		  $("#botui_container").css("height", value+"px")
		  $("#height_window_slider_label").text(value+"px")
		}

		$(document).on('click', '#human_status_text', function(e) {
			online_status_clicked()
		});

		$(document).on('click', '#human_status_pics', function(e) {
			online_status_clicked()
		});

		function online_status_clicked() {
		  $('.botui-message').css("filter", "blur(4px)")
		  $('.botui-message').css("-webkit-filter", "blur(4px)")
		  $(".botui-message").css("pointer-events","none");
		  display_popup_bot()
		}

		function display_popup_bot() {
		  let text_popup_bot = $('#text_popup_input').val()
		  // $('#popup_bot_buttons').hide()
		  $('#popup_bot_msg').text(text_popup_bot)
		  $('.popup_bot').css("width", $('#botui_container').css("width"))
		  $('.popup_bot').css("height", $('#botui_container').css("height"))
		  var targeted_popup_bot_class = $('[data-popup_bot-open]').attr('data-popup_bot-open');
		  $('[data-popup_bot="' + targeted_popup_bot_class + '"]').fadeIn(350);
		}


		$(document).on('click', '#yes_button_popup', function(e) {
	      e.preventDefault()
	      close_popup_bot()
		});

		$(document).on('click', '#close_button_popup', function(e) {
	      e.preventDefault()
	      close_popup_bot()
		});

		$(document).on('click', '#no_button_popup', function(e) {
	      e.preventDefault()
	      close_popup_bot()
		});

		function close_popup_bot() {
		  var targeted_popup_bot_class = $('[data-popup_bot-close]').attr('data-popup_bot-close');
		  $('[data-popup_bot="' + targeted_popup_bot_class + '"]').fadeOut(350);

		  $('.botui-message').css("filter", "blur(0px)")
		  $('.botui-message').css("-webkit-filter", "blur(0px)")
		  $(".botui-message").css("pointer-events","auto");
		  $('.botui-actions-buttons-button').css("filter", "blur(0px)")
		  $('.botui-actions-buttons-button').css("-webkit-filter", "blur(0px)")
		  $(".botui-actions-buttons-button").css("pointer-events","auto");
		}

		$('[data-popup_bot-close]').on('click', function(e) {
		  close_popup_bot()
		  e.preventDefault();
		});

		$('#add_action_button').click(function() {
			let action_name = $('#action_name_input').val().trim()
			let action_text = $('#action_text_input').val().trim()

			var action_id = action_name_to_id(action_name)

			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))
			var help_actions_text = JSON.parse(window.sessionStorage.getItem('help'))
			var new_help_actions_list = ""

			if (action_name.length < 1) {
				$('#warning_add_action').text("Nom invalide")
			} else if (action_text.length < 1) {
				$('#warning_add_action').text("Texte invalide")
			} else if (is_action_exist(action_id)) {
				$('#warning_add_action').text("Action déjà existante")
			} else {
				$('#action_text_input').val("")
				$('#action_name_input').val("")
				$('#warning_add_action').text("")
				html = '<div class="action_creation" id="creation_' + action_id + '" value="' + action_name + '"><span>' + action_name + '</span></div>'
				$(".actions_creation_container").append(html)
				let action_value = action_name.toLowerCase()
				let action_object = {"name": action_name,
									"text": action_text,
									"value": action_id,
									"next_actions": [""]}
				all_actions.push(action_object)
				window.sessionStorage.setItem('actions', JSON.stringify(all_actions))
				list_creation_action_jquery.push($("#"+action_id))

				var html_tree = '<option id="option_tree_' + action_name + '">' + action_name + '</option>'
				$("#select_action_box_main").append(html_tree)

				if ($("#checkbox_add_action").prop("checked") == true) {
					html = '<div class="action_help" id="help_' + action_id + '" value="' + action_name + '"><span>' + action_name + '</span></div>'
						$(".actions_help_container").append(html)
						list_help_action_jquery.push($("#help_"+action_id))
						new_help_actions_list += help_actions_text + "," + action_name
						window.sessionStorage.setItem('help', new_help_actions_list)
				}

				$(".action_help").click(function() {
					action_help_clicked($(this))
				})

				$(".action_creation").click(function() {
					action_creation_clicked($(this))
				})
			}
		})

		function is_action_exist(id) {
			for (var i = 0; i < list_creation_action_jquery.length; i++) {
				if (list_creation_action_jquery[i].attr("id") == id) {
					return true
				}
			}
			return false
		}

		function get_action_by_name(name) {
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))

			for (var i = 0; i < all_actions.length; i++) {
				if (all_actions[i]['name'] == name) {
					return all_actions[i]
				}
			}
		}

		function action_name_to_id(name) {
			return desired = name.replace(/[^\w\s]/gi, '').split(' ').join('_')
		}

		$('#close_action_edition').click(function() {
			$(".flex-container-creation").css("pointer-events", "auto")
			$('#container_popup_edition').hide()
			$(".flex-container-creation").css("filter", "blur(0px)")
		})

		$('#edit_action_button').click(function() {
			var new_name = $("#action_name_input_edition").val().trim()
			var new_text = $("#action_text_input_edition").val().trim()

			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))

			var action_id = action_name_to_id(new_name)

			var help_actions_text = JSON.parse(window.sessionStorage.getItem('help'))
			var new_help_actions_list = ""

			if (new_name.length < 1) {
				$('#warning_edit_action').text("Nom invalide")
			} else if (new_text.length < 1) {
				$('#warning_edit_action').text("Texte invalide")
			} else {
				for (var i = 0; i < all_actions.length; i++) {
					if (all_actions[i]['name'] == CURRENT_ACTION_EDITING.attr("value")) {
						all_actions[i]['name'] = new_name
						all_actions[i]['text'] = new_text
						CURRENT_ACTION_EDITING.attr("id", action_id)
						CURRENT_ACTION_EDITING.attr("value", new_name)
						CURRENT_ACTION_EDITING.find("span").text(new_name)
					}
				}

				if ($("#checkbox_edit_action").prop("checked") == false) {
					for (var i = 0; i < list_help_action_jquery.length; i++) {
						if (list_help_action_jquery[i].attr("id") == "help_"+CURRENT_ACTION_EDITING.attr("id")) {
							list_help_action_jquery[i].remove()
							if (i > -1) {
							  list_help_action_jquery.splice(i, 1);
							  i = i-1
							}
						} else {
							if (i < list_help_action_jquery.length) {
								new_help_actions_list += list_help_action_jquery[i].attr("value") + ","
							} else {
								new_help_actions_list += list_help_action_jquery[i].attr("value")
							}		
						}
					}
				} else {
					let already_present = false
					for (var i = 0; i < list_help_action_jquery.length; i++) {
						if (list_help_action_jquery[i].attr("id") == "help_"+CURRENT_ACTION_EDITING.attr("id")) {
							already_present = true
						}
					}
					if (!already_present) {
						html = '<div class="action_help" id="help_' + action_id + '" value="' + CURRENT_ACTION_EDITING.attr("value") + '"><span>' + CURRENT_ACTION_EDITING.attr("value") + '</span></div>'
						$(".actions_help_container").append(html)
						list_help_action_jquery.push($("#help_"+action_id))
						new_help_actions_list += help_actions_text + "," + CURRENT_ACTION_EDITING.attr("value")
					}
				}

				$(".action_help").click(function() {
					action_help_clicked($(this))
				})

				window.sessionStorage.setItem('help', new_help_actions_list)
				window.sessionStorage.setItem('actions', JSON.stringify(all_actions))
				$(".flex-container-creation").css("pointer-events", "auto")
				$('#container_popup_edition').hide()
				$(".flex-container-creation").css("filter", "blur(0px)")
			}
		})

		$('#delete_action_button').click(function() {
			var all_actions = JSON.parse(window.sessionStorage.getItem('actions'))
			var action_to_remove = null

			for (var i = 0; i < all_actions.length; i++) {
				if (all_actions[i]['name'] == CURRENT_ACTION_EDITING.attr("value")) {
					action_to_remove = all_actions[i]
				}
			}

			all_actions = all_actions.filter(function(item) {
				return item != action_to_remove
			})

			for (var i = 0; i < list_help_action_jquery.length; i++) {
				if (list_help_action_jquery[i].attr("id") == "help_"+CURRENT_ACTION_EDITING.attr("id")) {
					list_help_action_jquery[i].remove()
					list_help_action_jquery = list_help_action_jquery.filter(function(item) {
						return item != list_help_action_jquery[i]
					})
				}
			}

			list_creation_action_jquery = list_creation_action_jquery.filter(function(item) {
				return item != CURRENT_ACTION_EDITING
			})

			// $("#option_tree_" + CURRENT_ACTION_EDITING.attr("id")).remove()

			$.map( $('option'), function (element) { 
				// console.log("$(element).attr(id) : " + $(element).attr("id"))
				if ($(element).attr("id") == "option_tree_"+CURRENT_ACTION_EDITING.attr("id")) {
					$(element).remove()
				}
			});

			window.sessionStorage.setItem('actions', JSON.stringify(all_actions))

			CURRENT_ACTION_EDITING.remove()
			CURRENT_ACTION_EDITING = null
			$(".flex-container-creation").css("pointer-events", "auto")
			$('#container_popup_edition').hide()
			$(".flex-container-creation").css("filter", "blur(0px)")
		})

		$('#reload_view_button').click(function(e) {
			e.preventDefault()
			reload_view()
		})

		function reload_view() {
			clear_conversation_window()
			botui.message.add({
				loading: true,
				delay: 1,
				type: 'html',
				human: false,
				content: window.sessionStorage.getItem('welcome_msg')
			}).then(function() {
				display_help_actions(true)
				botui.message.add({
				loading: true,
				delay: 1,
				type: 'html',
				human: true,
				content: "Bonjour, pouvez-vous m'en dire plus sur Majordome ?"
				}).then(function() {
					window.scrollTo({ top: 0});
				})
			})
		}

		//---------------------- INITIALIZATION ----------------------//
		botui = new BotUI('botui_container');

		botui.message.add({
			loading: true,
			delay: 1,
			type: 'html',
			human: false,
			content: window.sessionStorage.getItem('welcome_msg')
		}).then(function() { //Use 'function' in 'then' to wait till the previous msg is correctly sent.
				display_help_actions(true)
		      botui.message.add({
				loading: false,
				delay: 1,
				type: 'html',
				human: true,
				content: "Bonjour, pouvez-vous m'en dire plus sur Majordome ?"
			})
		})


		set_client_gui()
		init_control_panel()
		init_creation_panel()

		//---------------------- END OF INITIALIZATION ----------------------//

		function get_gui() {
		  let url = BASE_URL + "/get_gui"

		  request = $.ajax({
		      url: url,
		      method: "GET",
		      data: {client_name: window.sessionStorage.getItem('client_name'), theme: ''},
		      async: false,
		  });

		  request.done(function(msg) {
		    data = JSON.parse(msg);

		    if (data['success']) {
		      window.sessionStorage.setItem('gui', JSON.stringify(data['gui']))
		    } else {
		      console.log(data['error'])
		    }
		  });

		  request.fail(function(jqXHR, textStatus) {
		      console.log("Request failed: " + textStatus);
		  });

		  return request
		}

		function get_chatbot_name() {
		  let url = BASE_URL + "/get_chatbot_name"

		  request = $.ajax({
		      url: url,
		      method: "GET",
		      data: {client_name: window.sessionStorage.getItem('client_name')},
		      async: false,
		  });

		  request.done(function(msg) {
		    data = JSON.parse(msg);

		    if (data['success']) {
		      window.sessionStorage.setItem('chatbot_name', data['chatbot_name']);
		    } else {
		      console.log(data['error'])
		    }
		  });

		  request.fail(function(jqXHR, textStatus) {
		      console.log("Request failed: " + textStatus);
		  });

		  return request
		}

		function get_welcome_msg() {
		  let url = BASE_URL + "/get_welcome_msg"

		  request = $.ajax({
		      url: url,
		      method: "GET",
		      data: {client_name: window.sessionStorage.getItem('client_name')},
		      async: false,
		  });

		  request.done(function(msg) {
		    data = JSON.parse(msg);

		    if (data['success']) {
		      window.sessionStorage.setItem('welcome_msg', data['welcome_msg']);
		    } else {
		      console.log(data['error'])
		    }
		  });

		  request.fail(function(jqXHR, textStatus) {
		      console.log("Request failed: " + textStatus);
		  });

		  return request
		}

		function get_text_popup() {
		  let url = BASE_URL + "/get_text_popup"

		  request = $.ajax({
		      url: url,
		      method: "GET",
		      data: {client_name: window.sessionStorage.getItem('client_name')},
		      async: false,
		  });

		  request.done(function(msg) {
		    data = JSON.parse(msg);

		    if (data['success']) {
		      window.sessionStorage.setItem('text_popup', data['text']);
		    } else {
		      console.log(data['error'])
		    }
		  });

		  request.fail(function(jqXHR, textStatus) {
		      console.log("Request failed: " + textStatus);
		  });

		  return request
		}

		var Upload = function (file) {
		    this.file = file;
		};

		Upload.prototype.getType = function() {
		    return this.file.type;
		};
		Upload.prototype.getSize = function() {
		    return this.file.size;
		};
		Upload.prototype.getName = function() {
		    return this.file.name;
		};

		Upload.prototype.doUpload = function (route) {
			var that = this;
			var formData = new FormData();

			// add assoc key values, this will be posts values
			formData.append("file", this.file, this.getName());
			formData.append("upload_file", true);
			formData.append("client_name", window.sessionStorage.getItem('client_name'));

			let url = BASE_URL + route

			request = $.ajax({
				url: url,
				method: "POST",
				dataType: 'json',
				data: formData,
				async: false,
				cache: false,
				contentType: false,
				processData: false,
				timeout: 60000
			});

			request.done(function(msg) {

				data = msg

				if (!data['success']) {
				  console.log(data['error'])
				}
			});

			request.fail(function(jqXHR, textStatus) {
			  console.log("Request failed: " + textStatus);
			});

			return request
		}

		function get_all_actions() {
		  let url = BASE_URL + "/get_all_actions"

		  request = $.ajax({
		      url: url,
		      method: "GET",
		      data: {client_name: window.sessionStorage.getItem('client_name')},
		      async: false,
		  });

		  request.done(function(msg) {
		    data = JSON.parse(msg);

		    if (data['success']) {
		    	// console.log("ALL ACTIONS : " + JSON.stringify(data['actions']))
		      window.sessionStorage.setItem('actions', JSON.stringify(data['actions']))
		    } else {
		      console.log(data['error'])
		    }
		  });

		  request.fail(function(jqXHR, textStatus) {
		      console.log("Request failed: " + textStatus);
		  });

		  return request
		}
		    
		function get_help() {
		  let url = BASE_URL + "/get_help"

		  request = $.ajax({
		      url: url,
		      method: "GET",
		      data: {client_name: window.sessionStorage.getItem('client_name')},
		      async: false,
		  });

		  request.done(function(msg) {
		    data = JSON.parse(msg);
		    if (data['success']) {
		      window.sessionStorage.setItem('help', JSON.stringify(data['help']))
		    } else {
		      console.log(data['error'])
		    }
		  });

		  request.fail(function(jqXHR, textStatus) {
		      console.log("Request failed: " + textStatus);
		  });

		  return request
		}
	});
}
	function ask_for_login(email, password) {
	  let url = BASE_URL + "/ask_for_login"
	  request = $.ajax({
	      url: url,
	      method: "POST",
	      dataType: 'json',
	      data: {email: email, password: password},
	      async: true,
	  });

	  request.done(function(msg) {
	    
	    data = msg

	    if (data['success']) {
	      init_room(data['client_name'])
	    } else {
	    	$("#mail_msg").text(data['error'])
	    }
	  });

	  request.fail(function(jqXHR, textStatus) {
	      console.log("Request failed: " + textStatus);
	  });

	  return request
	}


