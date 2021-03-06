/**
 * Copyright (c) Maarch, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 *
 * Author: Alex ORLUC
 * Version: 5.1.6 (2020-02-11)
 */
(function () {
	'use strict';

	var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

	var register = function (editor) {
		editor.addCommand("InsertImage", function () {
			editor.windowManager.open({
				title: 'Image...',
				body: {
					type: 'panel',
					items: [
						{
							type: 'htmlpanel',
							html: '<input type="file" class="input" name="input-image" style="font-size:14px;padding:30px;" accept="image/png, image/gif, image/jpeg, image/jpg"/>'
						}
					]
				},
				buttons: [
					{
						type: 'cancel',
						name: 'closeButton',
						text: 'Cancel'
					},
					{
						type: 'submit',
						name: 'submitButton',
						text: 'Ok',
						primary: true
					}
				],
				onSubmit: function (api) {
					if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
						alert("Your browser is not compatible.");
						api.close();
						return;
					}

					var imagefile = document.getElementsByName("input-image")[0].files;

					if (imagefile.length <= 0) {
						// do nothing
						api.close();
						return;
					}

					if (imagefile[0].size > 512 * 1024) {
						alert("The image cannot be larger than 500KB.");
						return;
					}

					var thisOne = this;

					var classFilereader = new FileReader();
					classFilereader.onload = function (base64) {
						var imgData = base64.target.result;
						var img = new Image();
						img.src = imgData;

						editor.execCommand("mceInsertContent", false, "<img src='" + imgData + "' />");
						api.close();
					};

					classFilereader.onerror = function (err) {
						alert("Error reading file : " + err.getMessage());
					};

					classFilereader.readAsDataURL(imagefile[0]);
					api.close();
				}
			});
		});
	};
	var Commands = { register: register };

	var register$1 = function (editor) {
		editor.ui.registry.addButton('maarch_b64image', {
			icon: 'image',
			tooltip: 'Image...',
			onAction: function () {
				return editor.execCommand('InsertImage');
			}
		});
		editor.ui.registry.addMenuItem('maarch_b64image', {
			icon: 'image',
			text: 'Image...',
			onAction: function () {
				return editor.execCommand('InsertImage');
			}
		});
	};
	var Buttons = { register: register$1 };

	function Plugin() {
		global.add('maarch_b64image', function (editor) {
			Commands.register(editor);
			Buttons.register(editor);
		});
	}

	Plugin();

}());
