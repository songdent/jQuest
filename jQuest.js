/*
 * jQuest- jQuery plugin for ajax request
 *
 * Copyright (c) 2016 songdengtao <http://www.songdengtao.cn>
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home: http://www.songdengtao.cn/projects/jquest
 *
 * Version:  1.0.0
 */

//@require jquery,jquery.validate,jquery.form

(function ($, window, document, undefined) {
    $.fn.jQuest = function (options) {
        var defaults = {
            requestType: 'normal', // 请求类型 form 表单请求 ,normal 普通的ajax请求
            event      : '', // 事件 click or submit
            type       : 'get',
            url        : '',
            dataType   : 'json',
            data       : {},
            eptmsg     : '', // data为空时不允许提交的提示语；如果为空，则不管data是否为空都可以提交
            cfrmsg     : '', // 确认提交时的提示语；如果为空，则不提示直接提交,
            rules      : {}, // 表单验证规则
            messages   : {}, // 表单验证消息
            clear      : true, // clear form
            reset      : true, // reset form
            timeout    : 3000,
            before     : function () { // 提交前回调函数

            },
            success    : function (data) {

            },
            error      : function (data) {

            }
        };
        var settings = $.extend(defaults, options || {});

        if ($.toLowerCase(settings.event) == 'submit') {
            settings.event = 'submit';
        }

        if ($.toLowerCase(settings.type) == 'post') {
            settings.url = $(this).attr('data-url');
        }

        if (typeof settings.data == 'function') {
            settings.data = settings.data();
        }

        var isEmpty   = $.trim(settings.eptmsg) ? true : false;
        var isConfirm = $.trim(settings.cfrmsg) ? true : false;
        if (isConfirm && isEmpty) {
            if (!$.isEmptyObject(settings.data)) {
                if (window.confirm(settings.cfrmsg)) {
                    jQuestAjaxFunc();
                }
            } else {
                alert(settings.eptmsg);
            }
        } else if (isConfirm && !isEmpty) {
            if (window.confirm(settings.cfrmsg)) {
                jQuestAjaxFunc();
            }
        } else if (!isConfirm && isEmpty) {
            if (!$.isEmptyObject(settings.data)) {
                jQuestAjaxFunc();
            } else {
                alert(settings.eptmsg);
            }
        } else {
            jQuestAjaxFunc();
        }

        // 执行请求
        var jQuestAjaxFunc = function () {
            var requestType = $.toLowerCase(settings.requestType);
            if (requestType == 'form') {
                settings.event = 'submit';
                if (!$.isEmptyObject(settings.rules)) {
                    ajaxValidateFormRequest(settings);
                } else {
                    ajaxNormalFormRequest(settings);
                }
            } else {
                if ($.trim(settings.event) == '') {
                    settings.event = 'click';
                }
                ajaxNormalRequst(settings);
            }
        };
    };

    // 提交验证表单的请求
    function ajaxValidateFormRequest(settings) {
        $(this).validate({
            rules         : settings.rules,
            messages      : settings.messages,
            errorPlacement: function (error, element) {
                error.appendTo(element.parent());
            },
            submitHandler : function (form) {
                ajaxNormalFormRequest(settings);
                return false;
            }
        });
        return false;
    }

    // 提交普通的表单请求
    function ajaxNormalFormRequest(settings) {
        $(document).on(settings.event, $(this).selector, function (e) {
            $.ajaxSubmit({
                type        : settings.type,
                url         : settings.url,
                dataType    : settings.dataType,
                data        : settings.data,
                clearForm   : settings.clear,
                resetForm   : settings.reset,
                timeout     : settings.timeout,
                beforeSubmit: function () {
                    settings.before();
                },
                success     : function (data) {
                    settings.success(data);
                },
                error       : function (data) {
                    settings.error(data);
                }
            });
            e.preventDefault();
        });
        return false;
    }

    // 提交普通的ajax请求
    function ajaxNormalRequst(settings) {
        $(document).on(settings.event, $(this).selector, function (e) {
            $.ajax({
                type    : settings.type,
                url     : settings.url,
                dataType: settings.dataType,
                data    : settings.data,
                success : function (data) {
                    settings.success(data);
                },
                error   : function (data) {
                    settings.error(data);
                }
            });
            e.preventDefault();
        });
        return false;
    }
})(jQuery, window, document);