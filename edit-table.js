/**
 *
 version : 1.0.0
 =========================================================
 EditTable
 https://github.com/juniorari/EditTable
 Copyright (c) 2019 José Ari Junior
 =========================================================

 The MIT License (MIT)

 Copyright (c) 2019 José Ari Junior

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 
 * A simple edit one cell in the table
 *
 * Use:
 *
 * <td class="edit-table">Content of the cell</td>
 *
 * (...)
 *
 * $('td.edit-table').EditTable(options);
 *
 *
 * Options:
 *  - classTd: String - The class name who will be added on td cell
 *  - classInput: String - The class name who will be added on input created
 *  - afterChange: Function - Action to be execute after input change
 *  - beforeOpen: Function - Action to be execute/verify if have open or not to edit cell. Have return true to be able edit
 *  - maxLength: String|Integer - Maxlength of input
 *  - iconEdit: String - If present, will be show a icon on right of the input to indicate it is editing. To not show, pass empty value
 *  - iconEditStyle: String - The stylesheet of icon showed. PS: Because different versions of FontAwesome, if necessary modify this parameter
 *
 *
 * Bonus: $('element').setCursorPosition(pos)
 * Set cursor at point position
 * @param pos integer The position cursor will be positioned
 *
 */
(function ($) {
    "use strict";
    $.fn.EditTable = function (options) {
        if (!this.is('td')) {
            throw new Error('Edit Table only works on td of table.');
        }
        let settings = $.extend({
            'classTd': 'input-cell',
            'classInput': 'auto',
            'afterChange': null,
            'beforeOpen': function () {return true},
            'maxLength': 50,
            'iconEdit': 'fa fa-edit',
            'iconEditStyle': 'right: 5px; position: absolute; top: 10px; color: #424242;',
        }, options);
        
        let objName = 'ajr-edit-table';
        let isClosing = false;
        
        let $faEdit = null;
        if (settings.iconEdit !== '') {
            $faEdit = $('<i/>').attr({class: settings.iconEdit + " " + objName + "__faEdit"});
            let sheet = document.createElement('style');
            sheet.innerHTML = "." + objName + "__faEdit {" + settings.iconEditStyle + "}";
            document.body.appendChild(sheet);
        }
        
        
        /**
         * Init the EditTable on cell of table
         * @param $this The cell who is be changed
         */
        let start = function ($this) {
            
            //if just added
            if ($this.find('input').length) return;
            
            let oldVal = $this.text();
            let randomId = parseInt(Math.random() * 10000);
                        
            $this.addClass(settings.classTd);
            
            let $input = $('<input/>').attr({
                class: settings.classInput,
                type: 'text',
                id: 'input_' + objName + '_' + randomId,
                value: oldVal,
            });
            
            if (settings.iconEdit !== '' && $faEdit) $input.attr('style', 'padding-right: 20px;');
            if (settings.maxLength) $input.attr('maxlength', settings.maxLength);
            
            $this.html($input);
            $input.focus();
            if (settings.iconEdit !== '' && $faEdit) {
                $this.append($faEdit);
            }
            setTimeout(() => {
                $input.setCursorPosition(String(oldVal).length);
            }, 100);
            $this.attr('data-isediting', 'true');
            
            $input.on('blur', function (event) {
                isClosing = true;
                close(event, oldVal, $this);
            });
            
            $input.on('keydown', function (e) {
                if (e.keyCode === 27) {//ESC
                    cancel(oldVal, $this);
                }
            });
            $input.on('keypress', function (e) {
                //38: 'up', 40: 'down', 9: 'tab', 13: 'enter'
                let keys = [13, 9, 38, 40];
                if (keys.indexOf(e.keyCode) >= 0) {
                    isClosing = true;
                    close(e, oldVal, $this);
                }
            })
            
        };
        
        /**
         * Close editing and execute action, if has
         */
        let close = function (event, oldVal, $this) {
            
            if (isClosing === false) return;
            
            isClosing = false;
            
            if (typeof settings.afterChange === 'function') {
                settings.afterChange($this, oldVal, $(event.currentTarget).val())
            }
            $this.removeClass(settings.classTd);
            $this.html($(event.currentTarget).val());
            $this.removeAttr('data-isediting')
        };
        
        /**
         * Cancel edition
         * @param oldVal string The value who will be returned
         * @param $this The element td of table
         */
        let cancel = function (oldVal, $this) {
            $this.removeClass(settings.classTd);
            $this.html(oldVal);
            $this.removeAttr('data-isediting')
        };
        
        return this.each(function () {
            let $this = $(this);
            
            $this.click(function (ev) {
                if (settings.beforeOpen($this, ev)) {
                    start($this);
                }
            });
        });
        
    };
})(jQuery);


/**
 * Set cursor at point position
 * @param pos integer The position cursor will be positioned
 */
(function ($) {
    $.fn.setCursorPosition = function (pos) {
        this.each(function (index, elem) {
            pos = (pos === undefined ? elem.value.length : pos);
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };
})(jQuery);
