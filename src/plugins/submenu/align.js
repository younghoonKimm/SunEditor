/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
'use strict';

export default {
    name: 'align',
    display: 'submenu',
    add: function (core, targetElement) {
        const context = core.context;
        context.align = {
            targetIcon: targetElement.querySelector('i'),
            _alignList: null,
            currentAlign: ''
        };

        /** set submenu */
        let listDiv = this.setSubmenu.call(core);
        let listUl = listDiv.querySelector('ul');

        /** add event listeners */
        listUl.addEventListener('click', this.pickup.bind(core));

        context.align._alignList = listUl.querySelectorAll('li button');

        /** append html */
        targetElement.parentNode.appendChild(listDiv);

        /** empty memory */
        listDiv = null, listUl = null;
    },

    setSubmenu: function () {
        const lang = this.lang;
        const listDiv = this.util.createElement('DIV');

        listDiv.className = 'se-list-layer';
        listDiv.innerHTML = '' +
            '<div class="se-submenu se-list-inner se-list-align">' +
                '<ul class="se-list-basic">' +
                    '<li><button type="button" class="se-btn-list se-btn-align" data-command="justifyleft" data-value="left" title="' + lang.toolbar.alignLeft + '"><span class="se-icon-align-left"></span>' + lang.toolbar.alignLeft + '</button></li>' +
                    '<li><button type="button" class="se-btn-list se-btn-align" data-command="justifycenter" data-value="center" title="' + lang.toolbar.alignCenter + '"><span class="se-icon-align-center"></span>' + lang.toolbar.alignCenter + '</button></li>' +
                    '<li><button type="button" class="se-btn-list se-btn-align" data-command="justifyright" data-value="right" title="' + lang.toolbar.alignRight + '"><span class="se-icon-align-right"></span>' + lang.toolbar.alignRight + '</button></li>' +
                    '<li><button type="button" class="se-btn-list se-btn-align" data-command="justifyfull" data-value="justify" title="' + lang.toolbar.alignJustify + '"><span class="se-icon-align-justify"></span>' + lang.toolbar.alignJustify + '</button></li>' +
                '</ul>' +
            '</div>';

        return listDiv;
    },

    active: function (element) {
        const target = this.context.align.targetIcon;

        if (!element) {
            target.className = 'se-icon-align-left';
            target.removeAttribute('data-focus');
        } else if (this.util.isFormatElement(element)) {
            const textAlign = element.style.textAlign;
            if (textAlign) {
                target.className = 'se-icon-align-' + textAlign;
                target.setAttribute('data-focus', textAlign);
            }
            return true;
        }

        return false;
    },

    on: function () {
        const alignContext = this.context.align;
        const alignList = alignContext._alignList;
        const currentAlign = alignContext.targetIcon.getAttribute('data-focus') || 'left';

        if (currentAlign !== alignContext.currentAlign) {
            for (let i = 0, len = alignList.length; i < len; i++) {
                if (currentAlign === alignList[i].getAttribute('data-value')) {
                    this.util.addClass(alignList[i], 'active');
                } else {
                    this.util.removeClass(alignList[i], 'active');
                }
            }

            alignContext.currentAlign = currentAlign;
        }
    },

    pickup: function (e) {
        e.preventDefault();
        e.stopPropagation();

        let target = e.target;
        let value = null;

        while (!value && !/UL/i.test(target.tagName)) {
            value = target.getAttribute('data-value');
            target = target.parentNode;
        }

        if (!value) return;

        const selectedFormsts = this.getSelectedElements();
        for (let i = 0, len = selectedFormsts.length; i < len; i++) {
            this.util.setStyle(selectedFormsts[i], 'textAlign', (value === 'left' ? '' : value));
        }

        this.submenuOff();
        this.focus();
        
        // history stack
        this.history.push(false);
    }
};
