function getCookie(b) {
    var e = b + "=";
    var a = document.cookie.split(";");
    for (var d = 0; d < a.length; d++) {
        var f = a[d];
        while (f.charAt(0) == " ") {
            f = f.substring(1, f.length)
        }
        if (f.indexOf(e) == 0) {
            return f.substring(e.length, f.length)
        }
    }
    return null
}
var extendLoginYn = true;
var extendTimerPrd = 1000 * 60 * 25;
var extendTimer = {};

function extendLoginCheck() {
    if (extendLoginYn) {
        if (confirm("5분 후에 로그인이 만료됩니다. 로그인을 연장하시겠습니까?")) {
            doExtendLogin()
        } else {
            extendLoginYn = false
        }
    }
}

function doExtendLogin() {
    $.ajax({
        type: "POST",
        url: "/nhis/etc/newSessExtend.do",
        dataType: "text",
        error: function(a) {
            initLoginExtend();
            location.replace("/nhis/etc/logout.do")
        },
        success: function(a) {
            if (a == "extend") {
                initLoginExtend();
                alert("연장되었습니다.")
            } else {
                if (a == "invalid") {
                    alert("이미 로그인이 만료되었습니다. 다시 로그인하시기 바랍니다.");
                    location.replace("/nhis/etc/logout.do")
                }
            }
        }
    })
}

function initLoginExtend() {
    clearTimeout(extendTimer);
    extendTimer = setTimeout(extendLoginCheck, extendTimerPrd)
}
if (getCookie("ssotoken") != "" && getCookie("ssotoken") != null) {
    initLoginExtend()
}

function desktopMode() {
    if ($.cookie("DesktopMode") == "true") {
        setModeCookie(false)
    } else {
        setModeCookie(true);
        window.scrollTo(0, 0)
    }
    location.reload()
}

function setModeCookie(c) {
    $.cookie("DesktopMode", c);
    $.cookie("DesktopModeScale", $("html").width() / defWidth);
    return;
    var a = new Date();
    var b = a.getTime();
    b += 3600 * 1000;
    a.setTime(b);
    document.cookie = "DesktopMode=" + c + ";";
    if (c) {
        document.cookie = "DesktopModeScale=" + $("html").width() / defWidth + ";"
    }
}

function fn_destroy(b, a) {
    if (a == "undefined" || a == null || a == "") {
        $(b).unbind();
        $(b).find("*").unbind()
    } else {
        $(b).unbind(a)
    }
}
var mySwiper = undefined;
var workFunc = false;

function fn_tabList(b) {
    if (b) {
        workFunc = false
    }
    if ($(".tab-list").length > 0 || $(".tab-button").length > 0 || $(".tab-block").length > 0 || $(".tab-transform").length > 0) {
        var c = $(window).width(),
            d = function(h, e) {
                var g = h.not(".variable").find("li").length,
                    f = h.not(".variable").width();
                h.not(".variable").find("li").css("width", 100 / g + "%");
                h.animate({
                    opacity: "1"
                })
            },
            a = function() {
                $(".tab-list:not('.tab-mark, .inner-tab'), .tab-button:not('.tab-mark, .inner-tab'), .tab-block:not('.tab-mark, .inner-tab')").each(function() {
                    $(this).find("li.curr").attr("title", "선택된 메뉴 입니다.");
                    $(this).find("li.curr a").attr("title", "선택됨");
                    $(this).after('<h4 class="ir">' + $(this).find("li.curr").text() + " 화면 입니다.</h4>");
                    if (!$(this).is(".tab-button")) {}
                });
                workFunc = true
            };
        if (!workFunc) {
            a()
        }
        $(".inner-tab").not(".tab-mark").each(function(e) {
            $(this).find("li a").attr("href", "#empty");
            $(this).find(".curr").addClass("curr").attr("title", "선택된 메뉴 입니다.");
            $(".tab-wrap").eq(e).find(".tab-area").each(function(f) {
                if ($(this).find(".ir").length < 1) {
                    $(this).prepend('<h4 class="ir">' + $(".inner-tab").eq(e).find("li").eq(f).text() + " 탭 화면 입니다.</h4>")
                }
            });
            $(".inner-tab").eq(e).find("a").click(function(f) {
                $(this).closest("ul").find("li").removeClass("curr").removeAttr("title");
                $(this).parent().addClass("curr").attr("title", "선택된 메뉴 입니다.");
                $(".tab-wrap").eq(e).find(".tab-area").removeClass("show").eq($(this).parent().index()).addClass("show")
            })
        });
        if (b && mySwiper != undefined) {
            mySwiper.destroy();
            mySwiper = undefined
        }
        if (c <= 767 && mySwiper == undefined) {
            $(".tab-list, .tab-block").not(".v2").each(function(e) {
                if ($(this).find("li").length <= 1) {
                    d($(this), e)
                } else {
                    $("html,body").css("overflow-x", "hidden");
                    $(this).find("ul").addClass("swiper-wrapper");
                    $(this).find("li").removeAttr("style").addClass("swiper-slide");
                    var f = 0;
                    $(this).find("li").each(function() {
                        f += Math.floor($(this).width())
                    });
                    $(window).on("resize.myResizer", function() {
                        if (f < $(window).width()) {
                            mTabWidth = $(".tab-list, .tab-block").not(".v2, .variable").eq(e).width();
                            mTabListLength = $(".tab-list, .tab-block").not(".v2, .variable").eq(e).find("li").length;
                            tabListWidth = mTabWidth / mTabListLength;
                            $(".tab-list, .tab-block").not(".v2, .variable").eq(e).find("li").css("min-width", Math.floor(tabListWidth))
                        } else {
                            $(".tab-list, .tab-block").not(".v2, .variable").eq(e).find("li").removeAttr("style")
                        }
                    }).resize();
                    mySwiper = new Swiper($(this)[0], {
                        slidesPerView: "auto"
                    });
                    mySwiper.slideTo($(this).find("li.curr").index())
                }
            });
            $(".tab-button:not('.tab-mark'), .tab-list.v2").addClass("tab-transform");
            $(".tab-transform").each(function(f) {
                var g = $(this).find("li.curr").text(),
                    e = '<p class="imaginary"><button type="button">' + g + "</button></p>";
                $(".tab-transform").eq(f).append(e);
                $(".tab-transform:eq(" + f + ") .imaginary").bind("click", function() {
                    $(this).closest(".tab-transform").find("ul").toggle()
                });
                $(".tab-transform.inner-tab").eq(f).find("li a").click(function() {
                    $(this).closest(".tab-transform.inner-tab").find(".imaginary button").text($(this).text());
                    $(this).closest(".tab-transform.inner-tab").find("ul").hide()
                })
            })
        } else {
            if (c >= 768) {
                $(".imaginary").remove();
                $(".tab-button:not('.tab-mark'), .tab-list.v2").removeClass("tab-transform").find("ul").removeAttr("style");
                if (mySwiper != undefined) {
                    mySwiper.destroy(true, true);
                    $("html,body").removeAttr("style");
                    mySwiper = undefined
                }
                $(".tab-list, .tab-block").not(".v2").each(function(e) {
                    $(this).find("ul").removeClass("swiper-wrapper");
                    $(this).find("li").removeClass("swiper-slide");
                    d($(this), e)
                });
                $(".tab-list, .tab-block li").removeAttr("style")
            }
        }
    }
    $(".tab-mark").find("a").on("click", function(f) {
        f.preventDefault();
        $(this).closest("ul").find("li").removeClass("curr");
        $(this).closest("li").addClass("curr");
        if ($(f.target).closest(".modal").length > 0) {
            _top = $($(this).attr("href")).position().top;
            $(this).closest(".jquery-modal.current").stop(true, true).animate({
                scrollTop: _top
            }, 200, "easeInOutExpo")
        } else {
            _top = $($(this).attr("href")).offset().top;
            $("html, body").stop(true, true).animate({
                scrollTop: _top
            }, 200, "easeInOutExpo")
        }
    })
}

function fn_escapeSelector(a) {
    return "#" + a.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1")
}

function isDateChk(a) {
    if ($(a).val() != "") {
        if (typeof(callbackDatepicker) == "function") {
            callbackDatepicker(a)
        }
    }
}

function fn_datepicker() {
    $.datepicker.setDefaults({
        showOn: "button",
        buttonText: "날짜 선택",
        buttonImageOnly: false,
        showButtonPanel: true,
        currentText: "오늘",
        closeText: "달력 닫기",
        dateFormat: "yy.mm.dd",
        showOtherMonths: true,
        prevText: "이전 달",
        nextText: "다음 달",
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        dayNames: ["일", "월", "화", "수", "목", "금", "토"],
        dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
        showMonthAfterYear: true,
        changeYear: true,
        changeMonth: true,
        onClose: function(c, b) {
            var a = String($(b.input[0]).attr("id"));
            $(fn_escapeSelector(a)).focus();
            isDateChk($(fn_escapeSelector(a)))
        }
    });
    $(".datepicker input").datepicker();
    setTimeout(function() {
        $("input[disabled], input[readonly]").each(function() {
            if (!$(this).closest(".board").is(".board")) {
                $(this).closest(".datepicker").addClass("disabled")
            }
        })
    }, 1);
    dayTripper()
}

function isNumeric(b, c) {
    var d = b.hasClass("datepicker") ? 7 : 8,
        a = b.val();
    if (c == 16) {
        isShift = true
    }
    if (((c >= 48 && c <= 57) || c == 8 || c <= 37 || c <= 39 || (c >= 96 && c <= 105))) {
        if ((b.val().length == 4 || b.val().length == d) && c != 8) {
            a += seperator;
            b.val(a)
        }
        return true
    } else {
        return false
    }
}

function fn_dim(b, a) {
    if (a == true) {
        if ($(".dim").length == 0) {
            $(b).append("<div class='dim'></div>")
        }
    } else {
        $(b).find(".dim").remove()
    }
}

function fn_variable_obj(b, a) {
    $target = $("#" + a);
    str = $target.find(".clone").clone();
    removeBtn = '<div class="button-group mt40"><div class="float-r"><button type="button" class="button medium border" onclick="$(\'.add\').focus(); $(this).closest(\'.imaginary\').remove();">삭제</button></div></div>';
    setTimeout(function() {
        str.removeClass("clone").wrap("<div class='imaginary'></div>");
        str.find("input").each(function() {
            $(this).val("")
        });
        str.find(".datepicker input").val("").removeAttr("id class");
        str.find(".datepicker button").remove();
        fn_datepicker();
        str.closest(".imaginary").prepend(removeBtn).find("button:first").focus()
    }, 1);
    $target.append(str)
}

function fn_print(a) {
    if ($("#" + a).find(".row-table").length > 0) {
        $("#" + a).find(".row-table").each(function() {
            $(this).addClass("default")
        })
    }
    $("#" + a).printThis({
        base: true
    })
}

function fn_focus(a, b) {
    a.attr("tabindex", "0").focus();
    a.on("keydown", function(c) {
        if (c.originalEvent.target.className == a.attr("class")) {
            if (c.keyCode == 9 && c.shiftKey == true) {
                c.preventDefault();
                $(b).focus()
            }
        }
    });
    a.find("*:last").on("keydown", function(c) {
        if (c.keyCode == 9 && c.shiftKey == false) {
            c.preventDefault();
            $(b).focus()
        }
    })
}

function fn_input_button() {
    $(".input-button").each(function() {
        $(this).css("padding-right", parseInt($(this).find(".button").outerWidth()) + 10)
    })
}

function fn_innerDp(b, a) {
    $(".inner-dp-wrap .item").removeClass("show");
    $(".inner-dp-wrap .item").eq(a).addClass("show");
    $(".inner-dp-list li").removeClass("curr");
    $(b).closest("li").addClass("curr")
}

function fn_flick(a) {
    if ($(".col-table").length > 0) {
        $(".col-table").each(function(b) {
            if (!$(this).hasClass("force-pc")) {
                if ($(window).outerWidth() <= 991 && $(this).outerWidth() <= 900) {
                    $(this).find(".flick-wrap").remove();
                    if (!$(this).hasClass('pc-no-scroll')) {
                        $(this).attr("style", "overflow:hidden").prepend('<div class="flick-wrap"><div class="flick-area"><span>화면을 터치한 후에<br>좌우로 스크롤하여 확인하세요.</span></div></div>');
                        $(this).on("click", ".flick-wrap", function(c) {
                            c.preventDefault();
                            $(this).parent("div").addClass("flick-hidden");
                            $(this).parent(".col-table").removeAttr("style");
                            $(this).remove();
                        });
                    }
                } else {
                    $(this).find(".flick-wrap").remove();
                }
            }
        });
    }
}

function fn_file_upload() {
    $(".file-area").each(function() {
        $(this).find(".upload-btn").on("change", function() {
            if (window.FileReader) {
                if ($(this).val() != "") {
                    var a = $(this)[0].files[0].name
                }
            } else {
                var a = $(this).val().split("/").pop().split("\\").pop()
            }
            $(this).closest(".file-area").find(".fileName").attr("title", a + " 파일 입니다.").val(a)
        })
    });
    $(".file-area .btn-file-del").click(function(a) {
        a.preventDefault();
        $(this).closest(".file-area").find("input").val("")
    })
}
var loadingState = false;

function fn_loading(a, b) {
    str = '<div id="loading"><p class="loading-text">' + b + '</p><div class="output-msg">잠시만 기다려 주십시오.</div></div>';
    if (a) {
        if (!loadingState) {
            loadingState = true;
            $("body").append(str);
            fn_dim($("body"), true);
            $(".dim").css("z-index", "10000");
            $("#loading").attr("style", "margin:-" + ($("#loading").outerHeight() / 2) + "px 0 0 -" + ($("#loading").outerWidth() / 2) + "px").show()
        }
    } else {
        loadingState = false;
        fn_dim($("body"), false);
        $("#loading").remove()
    }
}

function checkMobileDevice() {
    var b = new Array("Android", "iPhone", "iPod", "BlackBerry", "Windows CE", "SAMSUNG", "LG", "MOT", "SonyEricsson");
    for (var a = 0; a < b.length; a++) {
        var c = b[a];
        if (navigator.userAgent.match(c) != null) {
            return true
        }
    }
    return false
}

function checkIosMobileDevice() {
    var b = new Array("iPhone", "iPod");
    for (var a = 0; a < b.length; a++) {
        var c = b[a];
        if (navigator.userAgent.match(c) != null) {
            window.open("http://itunes.apple.com/kr/app/apple-store/id375279377?mt=8")
        }
    }
    window.open("http://play.google.com/store/apps/details?id=kr.or.nhic")
}

function fn_checkImp() {
    $(".row-table.v1").each(function() {
        if ($(this).find("div").hasClass("datepicker")) {
            $(this).find("em.mark").closest("tr").find(".datepicker").addClass("imp-wrap")
        }
        $(this).find("th:not([rowspan]) em.mark").text("(필수입력)").closest("tr").find("td input, td select").addClass("imp")
    });
    $(".standard-data.form").each(function() {
        if ($(this).find("div").hasClass("datepicker")) {
            $(this).find("em.mark").closest(".data-box").find(".datepicker").addClass("imp-wrap")
        }
        $(this).find("em.mark").closest(".data-box").find(".data input, .data select").addClass("imp")
    })
}

function fn_oderList() {
    $("ol").each(function() {
        $(this).find("> li").each(function(a) {
            a = a + 1;
            if ($(this).closest("ol").hasClass("bracket-num")) {
                $(this).prepend("<em class='number'>" + a + ")</em>")
            } else {
                if ($(this).closest("ol").hasClass("normal-num")) {
                    $(this).prepend("<em class='number'>" + a + ".</em>")
                } else {
                    if ($(this).closest("ol").hasClass("normal-num-v2")) {
                        $(this).prepend("<em class='number'>0" + a + ".</em>")
                    } else {
                        if ($(this).closest("ol").hasClass("round-num")) {
                            $(this).prepend("<em class='number'>" + a + "</em>")
                        } else {
                            if ($(this).closest("ol").hasClass("round-num v1")) {
                                $(this).prepend("<em class='number'>" + a + "</em>")
                            }
                        }
                    }
                }
            }
            if (a >= 10) {
                $(this).addClass("digits")
            }
        })
    })
}

function fn_tooltip() {
    if ($(".tool-tip").length > 0) {
        $(document).on("click", ".tool-tip", function(a) {
            a.preventDefault();
            $(this).addClass("on")
        });
        $(".tool-tip").tooltipster({
            trigger: "click",
            interactive: "true",
            autoClose: "false",
            theme: "tooltipster-box-1",
            functionReady: function(a) {
                $("#" + a.__namespace).attr("tabindex", "0").focus();
                if ($("#" + a.__namespace).find("a").length == 0 && $("#" + a.__namespace).find("button").length == 0) {
                    $("#" + a.__namespace).on("keydown", function(b) {
                        if (b.keyCode == 9 && b.shiftKey == false || b.keyCode == 9 && b.shiftKey == true) {
                            b.preventDefault();
                            $(".tool-tip.on").focus();
                            $(".tool-tip").tooltipster("hide");
                            $(".tool-tip").removeClass("on")
                        }
                    })
                }
                $("#" + a.__namespace).find("a, button").last().on("keydown", function(b) {
                    if (b.keyCode == 9 && b.shiftKey == false) {
                        b.preventDefault();
                        $(".tool-tip.on").focus();
                        $(".tool-tip").tooltipster("hide");
                        $(".tool-tip").removeClass("on")
                    }
                });
                $(".tooltip-close").click(function(b) {
                    b.preventDefault();
                    $(".tool-tip").tooltipster("hide");
                    $(".tool-tip.on").focus();
                    $(".tool-tip").removeClass("on")
                })
            }
        })
    }
}

function fn_tooltip() {
    if ($(".tool-tip").length > 0) {
        $(document).on("click", ".tool-tip", function(a) {
            a.preventDefault();
            $(this).addClass("on")
        });
        $(".tool-tip").tooltipster({
            trigger: "click",
            interactive: "true",
            autoClose: "false",
            theme: "tooltipster-box-1",
            functionReady: function(a) {
                $("#" + a.__namespace).attr("tabindex", "0").focus();
                if ($("#" + a.__namespace).find("a").length == 0 && $("#" + a.__namespace).find("button").length == 0) {
                    $("#" + a.__namespace).on("keydown", function(b) {
                        if (b.keyCode == 9 && b.shiftKey == false || b.keyCode == 9 && b.shiftKey == true) {
                            b.preventDefault();
                            $(".tool-tip.on").focus();
                            $(".tool-tip").tooltipster("hide");
                            $(".tool-tip").removeClass("on")
                        }
                    })
                }
                $("#" + a.__namespace).find("a, button").last().on("keydown", function(b) {
                    if (b.keyCode == 9 && b.shiftKey == false) {
                        b.preventDefault();
                        $(".tool-tip.on").focus();
                        $(".tool-tip").tooltipster("hide");
                        $(".tool-tip").removeClass("on")
                    }
                });
                $(".tooltip-close").click(function(b) {
                    b.preventDefault();
                    $(".tool-tip").tooltipster("hide");
                    $(".tool-tip.on").focus();
                    $(".tool-tip").removeClass("on")
                })
            }
        })
    }
    if ($(".tool-tip2").length > 0) {
        $(document).on("click", ".tool-tip2", function(a) {
            a.preventDefault();
            $(this).addClass("on")
        });
        $(".tool-tip2").tooltipster({
            trigger: "click",
            interactive: "true",
            autoClose: "false",
            theme: "tooltipster-box-2",
            functionReady: function(a) {
                $("#" + a.__namespace).attr("tabindex", "0").focus();
                if ($("#" + a.__namespace).find("a").length == 0 && $("#" + a.__namespace).find("button").length == 0) {
                    $("#" + a.__namespace).on("keydown", function(b) {
                        if (b.keyCode == 9 && b.shiftKey == false || b.keyCode == 9 && b.shiftKey == true) {
                            b.preventDefault();
                            $(".tool-tip2.on").focus();
                            $(".tool-tip2").tooltipster("hide");
                            $(".tool-tip2").removeClass("on")
                        }
                    })
                }
                $("#" + a.__namespace).find("a, button").last().on("keydown", function(b) {
                    if (b.keyCode == 9 && b.shiftKey == false) {
                        b.preventDefault();
                        $(".tool-tip2.on").focus();
                        $(".tool-tip2").tooltipster("hide");
                        $(".tool-tip2").removeClass("on")
                    }
                });
                $(".tooltip-close").click(function(b) {
                    b.preventDefault();
                    $(".tool-tip2").tooltipster("hide");
                    $(".tool-tip2.on").focus();
                    $(".tool-tip2").removeClass("on")
                })
            }
        })
    }
}

function fn_calendar(k, r) {
    var g = document.getElementById(k);
    var q = new Date();
    if (typeof(r) !== "undefined") {
        r = r.split("-");
        r[1] = r[1] - 1;
        r = new Date(r[0], r[1], r[2])
    } else {
        var r = new Date()
    }
    var t = r.getFullYear();
    var l = r.getMonth() + 1;
    var d = r.getDate();
    r.setDate(1);
    var e = r.getDay();
    var s = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
    var f = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if ((t % 4 === 0 && t % 100 !== 0) || t % 400 === 0) {
        f[1] = 29
    }
    var a = f[l - 1];
    var m = Math.ceil((e + a) / 7);
    if (l != 1) {
        var p = t + "-" + (l - 1) + "-" + d
    } else {
        var p = (t - 1) + "-" + 12 + "-" + d
    }
    if (l != 12) {
        var c = t + "-" + (l + 1) + "-" + d
    } else {
        var c = (t + 1) + "-" + 1 + "-" + d
    }
    var h = "";
    h += '<div class="control">';
    h += '<button type="button" class="btn btn-prev-calendar" onclick="fn_calendar(\'' + k + "', '" + p + "')\">이전 달 선택</button>";
    h += "<span>" + l + "월</span> <span>" + t + "년</span>";
    h += '<button type="button" class="btn btn-next-calendar" onclick="fn_calendar(\'' + k + "', '" + c + "')\">다음 달 선택</button>";
    h += "		</div>";
    h += '		<table border="0" cellspacing="0" cellpadding="0">';
    h += "			<caption>" + t + "년 " + l + "월 달력</caption>";
    h += "			<thead>";
    h += "				<tr>";
    h += '				  <th class="sun" scope="row">일</th>';
    h += '				  <th class="mon" scope="row">월</th>';
    h += '				  <th class="tue" scope="row">화</th>';
    h += '				  <th class="wed" scope="row">수</th>';
    h += '				  <th class="thu" scope="row">목</th>';
    h += '				  <th class="fri" scope="row">금</th>';
    h += '				  <th class="sat" scope="row">토</th>';
    h += "				</tr>";
    h += "			</thead>";
    h += "			<tbody>";
    var b = 1 - e;
    for (var o = 0; o < m; o++) {
        h += "			<tr>";
        for (var n = 0; n < 7; n++, b++) {
            if (b < 1 || b > a) {
                h += '<td class="' + s[n] + '"> </td>';
                continue
            }
            if (b == d && q.getFullYear() == t && q.getMonth() + 1 == l) {
                h += '<td class="' + s[n] + ' today"><span>' + b + "</span></td>"
            } else {
                h += '<td class="' + s[n] + '"><span>' + b + "</span></td>"
            }
        }
        h += "</tr>"
    }
    h += "			</tbody>";
    h += "		</table>";
    g.innerHTML = h;
    $(".calendar-table .today-date").html(q.getFullYear() + "." + (q.getMonth() + 1) + "." + q.getDay())
}

function fn_organs(a) {
    var b = $(".organs-info-wrap"),
        c = 0;
    paging = "";
    b.each(function() {
        var f = $(this).find(".list-text li"),
            e = $(this).find(".img-bullet-wrap");
        var d = function() {
            for (i = 1; i <= f.length; i++) {
                if (i == 1) {
                    paging += '<button type="button" class="on">' + i + "번째 이미지 보기</button>"
                } else {
                    paging += '<button type="button">' + i + "번째 이미지 보기</button>"
                }
            }
        };
        d();
        if (e.find("button").length == 0) {
            e.append(paging)
        }
        f.find("a").click(function(g) {
            g.preventDefault();
            idx = $(this).closest("li").index();
            f.removeClass("curr");
            $(this).closest("li").addClass("curr");
            e.find("button").eq(idx).trigger("click")
        });
        e.find("button").on("click", function() {
            c = $(this).index();
            $(this).closest(e).find("button").removeClass("on");
            $(this).addClass("on");
            $(this).closest(".info-img-area").find(".cont").removeClass("show");
            $(this).closest(".info-img-area").find(".cont").eq(c).addClass("show");
            $(this).closest(".organs-info-wrap").find(".list-text li").removeClass("curr");
            $(this).closest(".organs-info-wrap").find(".list-text li").eq(c).addClass("curr")
        })
    });
    b.find(".btn-zoom").click(function(d) {
        d.preventDefault();
        $("#layer_info_zoom").modal();
        $("#layer_info_zoom .img-bullet-wrap button").eq(c).trigger("click");
        fn_organs("modal")
    });
    return fn_organs
}

function fn_menu(b, a) {
    $(b).closest(".menu").find("li").removeClass("curr");
    $(b).addClass("curr");
    $(".menu-list-area." + a).closest(".all-menu-gnb").find("> .menu-list-area").hide();
    $(".menu-list-area." + a).show();
    $("#layer_all_menu .all-menu-cont .all-menu-gnb").scrollTop(0)
}

function fn_formBlock() {
    if ($(".form-wrap").length > 0) {
        if ($(window).width() <= 320) {
            $(".form-wrap").each(function() {
                $(this).find(".datepicker").closest(".form-wrap").addClass("has-datepicker")
            })
        } else {
            $(".form-wrap").each(function() {
                $(this).find(".datepicker").closest(".form-wrap").removeClass("has-datepicker")
            })
        }
    }
}

function tableCaption() {
    var b = "";
    var a = "";
    $(".col-table").each(function(d) {
        var c = [];
        $(".col-table").eq(d).find("thead th").each(function() {
            var e = $(this).text();
            e = e.replace(/\s+/, "");
            e = e.replace(/\s+$/g, "");
            e = e.replace(/\n/g, "");
            c.push(e)
        });
        if ($(this).is("[data-title]")) {
            b = $(this).attr("data-title") + "의 "
        }
        $(".col-table").eq(d).find("caption").text(b + c + " 항목으로 구성된 표입니다.")
    });
    $(".row-table").each(function(d) {
        var e = [];
        $(".row-table").eq(d).find("tbody th").each(function() {
            var c = $(this).text();
            c = c.replace(/\s+/, "");
            c = c.replace(/\s+$/g, "");
            c = c.replace(/\n/g, "");
            e.push(c)
        });
        if ($(this).is("[data-title]")) {
            b = $(this).attr("data-title") + "의 "
        }
        if ($(this).is("[data-name]")) {
            a = $(this).attr("data-name")
        }
        $(".row-table").eq(d).find("caption").text(b + e + " 항목으로 구성된 " + a + "표입니다.")
    })
}

function fn_watermark(b, a) {
    setTimeout(function() {
        var c = "",
            d = Math.floor($("#" + b).height() / 94);
        c += '<div class="watermark">';
        c += '<div class="wm-inner">';
        for (i = 1; i <= d; i++) {
            c += "<p>" + a + "</p>";
            c += "<p>" + a + "</p>"
        }
        c += "</div>";
        c += "</div>";
        $("#" + b).css({
            position: "relative",
            "z-index": "2"
        }).append(c);
        $("#" + b).find("> *:first").css({
            position: "relative",
            "z-index": "2"
        })
    }, 500)
}
$(function() {
    $(".skip a").on({
        focus: function() {
            $(".skip").addClass("on")
        },
        blur: function() {
            $(".skip").removeClass("on")
        }
    });
    var j = function(m) {
        if ($("#go_main").length > 0) {
            if (m) {
                $("#go_main li").eq(2).remove()
            } else {
                if ($("#go_main li").length == 2) {
                    $("#go_main").append('<li><a href="#cms-lnb">보조메뉴 바로가기</a></li>')
                }
            }
        }
    };
    var h = function(m) {
        $mGnb = $(".gnb-mobile"), $mGnbToggle = $(".user-support .toggle-menu");
        fn_destroy($mGnb);
        fn_destroy($mGnbToggle);
        if (m) {
            $mGnb.css("height", $(window).height());
            $mGnbToggle.click(function() {
                fn_dim("body", true);
                $("#header").css("z-index", "auto");
                $("#header .search-wrap").hide();
                $("#container .section-left").removeClass("open");
                $("#container .section-left h2").css("z-index", "1");
                $("body").css("overflow", "hidden");
                $(".gnb-mobile").show().stop(true, true).animate({
                    right: "0"
                }, 500, "easeOutCubic");
                $mGnb.find(".gnb-depth > ul > li:not(:has(ul))").addClass("no-sub")
            });
            $mGnb.find(".m-gnb > ul > li > a").click(function(n) {
                n.preventDefault();
                $(".m-gnb > ul > li").removeClass("on");
                $(this).closest("li").addClass("on");
                $(".m-gnb > ul > li").each(function() {
                    $(this).find("> a").attr("title", $(this).find("> a").text())
                });
                $(this).attr("title", $(this).text() + " 선택됨");
                $mGnb.find(".gnb-depth > ul > li:not(:has(ul))").addClass("no-sub")
            });
            $mGnb.find(".gnb-depth > ul > li > a").click(function(n) {
                if (!$(this).closest("li").hasClass("no-sub")) {
                    n.preventDefault();
                    $(this).closest("li").toggleClass("on")
                }
            });
            $mGnb.find(".gnb-close").click(function(n) {
                n.preventDefault();
                fn_dim("body", false);
                $("#header, #container .section-left h2").removeAttr("style");
                $("body").css("overflow", "hidden");
                $(".gnb-mobile").stop(true).animate({
                    right: "-87.5%"
                }, 500, "easeOutCubic", function() {
                    $("body").removeAttr("style");
                    $(".m-gnb > ul > li").removeClass("on");
                    $(".m-gnb > ul > li.curr").addClass("on");
                    $(".gnb-depth > ul > li").removeClass("on");
                    $(".gnb-mobile").hide()
                })
            });
            $(".gnb-mobile .bottom-set > li.m-lang > a").click(function(n) {
                n.preventDefault();
                $(this).closest("li").toggleClass("open")
            })
        }
        $("#cms-gnb > ul > li").on({
            mouseover: function() {
                $("#header").addClass("open");
                $(this).addClass("on");
                if (!$("#cms-gnb > ul > li ul").is("[style]")) {
                    $("#cms-gnb > ul > li ul").height($("#cms-gnb > ul").height() - 105)
                }
            },
            mouseleave: function() {
                $("#cms-gnb > ul > li").removeClass("on")
            }
        });
        $("#cms-gnb > ul > li > a").focus(function() {
            $("#header").addClass("open");
            $("#cms-gnb > ul > li:not('.curr')").removeClass("on");
            $(this).parent().addClass("on");
            if (!$("#cms-gnb > ul > li ul").is("[style]")) {
                $("#cms-gnb > ul > li ul").height($("#cms-gnb > ul").height() - 105)
            }
        });
        $("#cms-gnb > ul > li:last li a:last").blur(function() {
            $("#cms-gnb > ul > li:not('.curr')").removeClass("on")
        });
        $(".favorite-menu dl dd ul li a:last").blur(function() {
            $("#header").removeClass("open")
        });
        $("#cms-gnb").mouseleave(function() {
            $("#header").removeClass("open")
        });
        $("#header .toggle-menu").focus(function() {
            $("#header .search-wrap.type-acce").hide();
            $("#header .toggle-search").removeClass("on")
        });
        $("#cms-gnb > ul > li > a").focus(function() {
            $("#header .search-wrap.type-acce").hide();
            $("#header .toggle-search").removeClass("on")
        })
    };
    var k = function(m) {
        $lnb = $("#container .section-left");
        fn_destroy($lnb);
        if (m) {
            $lnb.find("h2 button").click(function(n) {
                n.preventDefault();
                $("#header .search-wrap").hide();
                $("#container .section-left").toggleClass("open");
                if ($("#container .section-left").hasClass("open")) {
                    fn_dim("body", true)
                } else {
                    fn_dim("body", false)
                }
            });
            $lnb.find("#cms-lnb > button").click(function() {
                $("#container .section-left").removeClass("open");
                fn_dim("body", false)
            })
        }
        $lnb.find("#cms-lnb > ul > li:has(ul) > a").click(function(n) {
            n.preventDefault();
            if (!$(this).closest("li").hasClass("on")) {
                $(this).closest("li").toggleClass("open")
            }
        });
        $lnb.find("#cms-lnb > ul > li:not(:has(ul))").each(function() {
            $(this).addClass("no-sub")
        })
    };
    $("#header .toggle-search").on("click", function() {
        $("#container .section-left").removeClass("open");
        $(this).toggleClass("on");
        $("#header .search-wrap").toggle();
        $(".search-wrap .form input").focus();
        if ($(this).hasClass("on")) {
            $(this).text("통합검색 닫기")
        } else {
            $(this).text("통합검색 열기")
        }
        if ($("body:not('.web') .search-wrap").css("display") == "block") {
            fn_dim("body", true)
        } else {
            fn_dim("body", false)
        }
        $(".search-wrap .tag-list a:last").blur(function() {
            $(".user-support .toggle-search").focus()
        })
    });
    $("#header .search-wrap > button").click(function() {
        $("#header .search-wrap").toggle();
        $(".dim").remove()
    });
    $("#header .top .user-set > ul > li > button").click(function(m) {
        m.stopPropagation();
        if ($(this).hasClass("on")) {
            $(this).toggleClass("on");
            $(this).closest("li").find(".box-header").toggle()
        } else {
            $("#header .top .user-set > ul > li > button").removeClass("on");
            $("#header .top .user-set > ul > li").find(".box-header").hide();
            $(this).addClass("on");
            $(this).closest("li").find(".box-header").show();
            $(this).next(".box-header").find("li:last a").blur(function() {
                $(this).closest(".box-header").hide()
            })
        }
    });
    $(document).on("click", function(m) {
        $("#header .top .user-set .box-header").hide();
        $("#header .top .user-set > ul > li > button").removeClass("on")
    });
    if ($(".datepicker").length > 0) {
        fn_datepicker()
    }
    $(document).on("click", function(m) {
        if ($(m.target).is("a.word")) {} else {
            $(".popular-word .util").removeClass("on")
        }
    });
    var l = 0;
    var a = [];
    var e = function(m) {
        $visualImg = $(".resp-img");
        if (m) {
            if ($visualImg.length > 0 && l == 0) {
                $visualImg.each(function(o) {
                    var q = $visualImg.eq(o).find("img").attr("src"),
                        p = q.split(".")[q.split(".").length - 1],
                        n = q.split("." + p)[0];
                    a.push(n.split("-m")[0] + "." + p);
                    $visualImg.eq(o).find("img").attr("src", n.split("-m")[0] + "-m." + p);
                    setTimeout(function() {
                        $visualImg.eq(o).find("img").css({
                            width: "80%",
                            height: "auto"
                        })
                    }, 50)
                });
                l = 1
            }
        } else {
            $visualImg.each(function(n) {
                $visualImg.eq(n).find("img").attr("src", a[n]).removeAttr("style")
            });
            l = 0
        }
    };
    $("#footer .family-site-area > p button").click(function() {
        $(this).parents(".family-site-area").toggleClass("on");
        $(this).closest(".family-site-area").find(".box-site li:last a").blur(function() {
            $(this).closest(".family-site-area").removeClass("on")
        })
    });
    $("#footer .box-site ul li a").click(function(n) {
        n.preventDefault();
        var o = $(this).text();
        var m = $(this).attr("href");
        $(this).parents(".family-site-area").find("p > button").text(o);
        $(this).parents(".family-site-area").find(".btn-move").attr("href", m).focus();
        $(this).parents(".family-site-area").removeClass("on")
    });
    $(".utililty > li.share > a").click(function(m) {
        m.preventDefault();
        $(this).closest("li").find("div").toggleClass("open")
    });
    $(".utililty > li.share > div .close a").click(function(m) {
        m.preventDefault();
        $(this).closest("div").removeClass("open")
    });
    if ($(".toggle .box-title").length > 0) {
        $(".toggle .box-title.on p").text("상세닫기");
        $(".toggle .box-title").attr("tabindex", "0")
    }
    $(".toggle .box-title").on("click keypress", function() {
        if ($(this).text() == "상세보기" || $(this).text() == "상세닫기") {
            $(this).text($(this).text() == "상세보기" ? "상세닫기" : "상세보기")
        }
        $(this).toggleClass("on");
        $(this).next("div").slideToggle()
    });
    $(".toggle-new .box-title").click(function(m) {
        if ($(this).hasClass("on") == true) {
            $(this).removeClass("on");
            $(this).find("p").text("상세보기");
            $(this).next("div").addClass("d-n")
        } else {
            $(this).addClass("on");
            $(this).find("p").text("상세닫기");
            $(this).next("div").removeClass("d-n")
        }
    });
    $(".accordian > li > a").click(function(m) {
        m.preventDefault();
        $(this).parent().toggleClass("on").find("> div").slideToggle("past")
    });
    $(".btn-accordian").on("click", function(m) {
        m.preventDefault();
        if ($(this).hasClass("on")) {
            $(this).removeClass("on").text("전체펼치기");
            $(".accordian > li").removeClass("on").find("> div").slideUp("past")
        } else {
            $(this).addClass("on").text("전체닫기");
            $(".accordian > li").addClass("on").find("> div").slideDown("past")
        }
    });
    $(".accordian > li > a em").each(function() {
        $txt = $(this).text().trim();
        if ($txt.length == 0) {
            $(this).addClass("empty")
        }
    });
    $(".reply-wrap .reply-list ul li .data-state span button").on("click", function() {
        $(this).parent().parent().next().find(".input-text").focus()
    });
    $(".organ_area .link a").on("focusin", function() {
        $(this).addClass("on")
    });
    $(".organ_area .link a").on("focusout", function() {
        $(this).removeClass("on")
    });
    $(".btn-print").click(function(m) {
        m.preventDefault()
    });
    fn_tooltip();
    fn_oderList();
    fn_file_upload();
    fn_checkImp();
    var g = 0;
    $(".file-area-wrap").on("click", ".btn", function(o) {
        o.preventDefault();
        var p = $(this).attr("data-function");
        g++;
        str = $(this).closest(".file-area:not(.data)").clone();
        str.find("label").attr("for", "upload-btn-" + g);
        str.find("input[type='file']").val("").attr("id", "upload-btn-" + g);
        str.find("input[type='file']").attr("name", "upload-btn-" + g);
        str.find("input").val("");
        str.find(".btn.btn-file-del").remove();
        str.find(".btn").removeClass("file-area-add").removeAttr("data-function").addClass("file-area-del").attr("title", "해당 파일 영역을 삭제합니다.").html("").append('<i class="iconset ico-delete">파일 영역을 삭제하기</i>');
        if ($(this).hasClass("file-area-add")) {
            var n = $(this).closest(".file-area-wrap").find("input[type='file']").length - 1;
            if ($(this).closest(".file-area-wrap").find("input[type='file']").eq(n).val() == "") {
                alert("파일을 먼저 등록해 주세요.");
                return
            }
            str.find(".btn").attr("onclick", p);
            $(this).closest(".file-area-wrap").append(str)
        } else {
            if ($(this).hasClass("file-area-del")) {
                if ($(this).closest(".file-area").find("input[type='file']").val() != "") {
                    var m = confirm("파일이 존재합니다. 삭제 하시겠습니까?");
                    if (m) {
                        $(this).closest(".file-area").remove()
                    }
                } else {
                    $(this).closest(".file-area").remove()
                }
            }
        }
        fn_file_upload()
    });
    fn_buttonSize = function() {
        if ($(".button-group").length > 0) {
            $(".button-group").each(function(m) {
                var n = 0;
                $(this).find(".button").each(function() {
                    n += Math.floor($(this).outerWidth() + 30);
                    if ($(window).width() <= n) {
                        $(".button-group").eq(m).addClass("resp")
                    } else {
                        $(".button-group").eq(m).removeClass("resp")
                    }
                })
            })
        }
    };
    $(".menu-location-select ul li").click(function() {
        $(this).closest("ul").find("li").removeClass("curr");
        $(this).addClass("curr")
    });
    $(".layer-contents .topic-list ul li a").click(function(m) {
        m.preventDefault();
        $(this).parent().toggleClass("curr")
    });
    if ($(".window-popup").length >= 2) {
        $(".window-popup").eq(0).contents().unwrap()
    }
    $(".window-popup").closest("#wrap").addClass("no-bg");
    $(".window-popup").closest("#container").css("padding", "0");
    $(".window-popup").closest(".contents").css({
        padding: "0",
        width: "100%",
        "float": "none"
    });
    $(".window-popup").closest("body").find("#go_main").remove();
    $(".attach-list > a").click(function(m) {
        m.preventDefault();
        $(this).closest(".attach-list").find("> div").toggleClass("open")
    });
    $(".attach-list .close a").click(function(m) {
        m.preventDefault();
        $(this).closest(".attach-list").find("> div").removeClass("open")
    });
    $(".file-area.data .btn-file-del").click(function(m) {
        m.preventDefault();
        $(this).closest(".file-area.data").remove()
    });
    // if ($(".pagination").length > 0) {
    //     $(".pagination").each(function() {
    //         if ($(this).find(".in *").length == 0) {
    //             $(this).hide()
    //         }
    //     })
    // }
    if ($(".map-api-wrap").length > 0) {
        $(".map-api-wrap").closest("html").addClass("map-body");
        $(".map-api-wrap").closest("body").addClass("map-body")
    }
    if (checkMobileDevice()) {
        $("body").addClass("device")
    }
    fn_organs();
    $("#cms-content").find("#cms-content").contents().unwrap();
    if ($(".survey-area").length > 1) {
        $(".survey-area").closest("#cms-content").next(".survey-area").css("margin-top", "0")
    }
    $(".key-ko").keyup(function() {
        var m = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
        this.value = this.value.replace(m, "")
    });
    $(".more-to-hidden .more-to-button").click(function() {
        $(this).closest(".more-to-hidden").find(".border-box").addClass("auto");
        $(this).remove()
    });
    var f = function(m) {
        if (!m) {
            var n = ($(window).width() - $(".inner").width()) / 2
        }
    };
    if ($(".col-table").length > 0) {
        tableCaption()
    }
    $(".btn-share-button .btn").click(function() {
        $(".share-sns-area").toggleClass("on")
    });
    if ($(".progress").length > 0) {
        $("title").text($(".progress li.curr span").text() + " < " + $("title").text());
        $(".progress li.curr").attr("title", "현재단계")
    }
    var d = function(m) {
        if ($(".row-table").length > 0) {
            if (m) {
                $(".row-table").find("tbody th").removeAttr("scope")
            } else {
                $(".row-table").find("tbody th").attr("scope", "row")
            }
        }
    };
    if ($(".post-content").length > 0) {
        setTimeout(function() {
            $(".post-content img").css({
                width: "auto",
                height: "auto"
            })
        }, 300)
    }
    var b = $(window),
        c = $(document);
    b.resize(function() {
        setTimeout(function() {
            screenWidth = b.width(), screenHeight = c.outerHeight();
            if (screenWidth > 991) {
                mFlag = false;
                mobile = false;
                $("body").removeClass("tablet mobile").addClass("web")
            } else {
                if (screenWidth <= 991 && screenWidth >= 767) {
                    mFlag = true;
                    mobile = false;
                    $("body").removeClass("web mobile").addClass("tablet");
                    $("#layer_all_menu").parent(".jquery-modal").hide()
                } else {
                    mFlag = true;
                    mobile = true;
                    $("body").removeClass("web tablet").addClass("mobile")
                }
            }
            h(mFlag);
            k(mFlag);
            fn_tabList();
            e(mobile);
            fn_buttonSize();
            fn_input_button();
            fn_flick();
            fn_formBlock();
            f(mFlag);
            tableCaption();
            j(mFlag);
            d(mobile)
        }, 10)
    }).resize()
});
$(document).ajaxSuccess(function() {
    if ($(".tab-list").length > 0 || $(".tab-button").length > 0 || $(".tab-block").length > 0 || $(".tab-transform").length > 0) {
        fn_tabList()
    }
});

function dayTripper() {
    $(".ui-datepicker-trigger").click(function() {
        setTimeout(function() {
            var a = $(".ui-datepicker-today a")[0];
            if (!a) {
                a = $(".ui-state-active")[0] || $(".ui-state-default")[0]
            } else {
                if ($("#ui-datepicker-div").hasClass("onlyMonth")) {
                    a = $(".ui-datepicker-year")[0]
                }
            }
            a.focus();
            datePickHandler();
            $(document).on("click", "#ui-datepicker-div .ui-datepicker-close", function() {
                closeCalendar()
            })
        }, 0)
    })
}

function datePickHandler() {
    var f;
    var b = document.getElementById("ui-datepicker-div");
    var c = $(".datepicker, datepicker-month");
    if (!b || !c) {
        return
    }
    b.setAttribute("role", "application");
    b.setAttribute("aria-label", "Calendar view date-picker");
    var e = $(".ui-datepicker-prev", b)[0],
        d = $(".ui-datepicker-next", b)[0];
    d.href = "javascript:void(0)";
    e.href = "javascript:void(0)";
    d.setAttribute("role", "button");
    d.removeAttribute("title");
    e.setAttribute("role", "button");
    e.removeAttribute("title");
    appendOffscreenMonthText(d);
    appendOffscreenMonthText(e);
    $(d).on("click", handleNextClicks);
    $(e).on("click", handlePrevClicks);
    monthDayYearText();
    $(b).on("keydown", function a(j) {
        var m = j.which;
        var k = j.target;
        var h = getCurrentDate(b);
        if (!h) {
            h = $("a.ui-state-default")[0];
            setHighlightState(h, b)
        }
        if (27 === m) {
            j.stopPropagation();
            return closeCalendar()
        } else {
            if (m === 9 && j.shiftKey) {
                j.preventDefault();
                if ($(k).hasClass("ui-datepicker-close")) {
                    $(".ui-datepicker-prev")[0].focus()
                } else {
                    if ($(k).hasClass("ui-state-default")) {
                        $(".ui-datepicker-close")[0].focus()
                    } else {
                        if ($(k).hasClass("ui-datepicker-year")) {
                            if ($("#ui-datepicker-div").hasClass("onlyMonth")) {
                                f = $(".ui-datepicker-close")[0]
                            } else {
                                f = $(".ui-state-highlight") || $(".ui-state-active")[0]
                            }
                            if (f) {
                                f.focus()
                            }
                        } else {
                            if ($(k).hasClass("ui-datepicker-month")) {
                                $(".ui-datepicker-year")[0].focus()
                            } else {
                                if ($(k).hasClass("ui-datepicker-prev")) {
                                    $(".ui-datepicker-next")[0].focus()
                                } else {
                                    if ($(k).hasClass("ui-datepicker-next")) {
                                        $(".ui-datepicker-month")[0].focus()
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (m === 9) {
                    j.preventDefault();
                    if ($(k).hasClass("ui-datepicker-close")) {
                        if ($("#ui-datepicker-div").hasClass("onlyMonth")) {
                            f = $(".ui-datepicker-year")[0]
                        } else {
                            f = $(".ui-state-highlight") || $(".ui-state-active")[0]
                        }
                        if (f) {
                            f.focus()
                        }
                    } else {
                        if ($(k).hasClass("ui-state-default")) {
                            $(".ui-datepicker-year")[0].focus()
                        } else {
                            if ($(k).hasClass("ui-datepicker-year")) {
                                $(".ui-datepicker-month")[0].focus()
                            } else {
                                if ($(k).hasClass("ui-datepicker-month")) {
                                    $(".ui-datepicker-next")[0].focus()
                                } else {
                                    if ($(k).hasClass("ui-datepicker-next")) {
                                        $(".ui-datepicker-prev")[0].focus()
                                    } else {
                                        if ($(k).hasClass("ui-datepicker-prev")) {
                                            $(".ui-datepicker-close")[0].focus()
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (m === 37) {
                        if (!$(k).hasClass("ui-datepicker-close") && $(k).hasClass("ui-state-default")) {
                            j.preventDefault();
                            previousDay(k)
                        }
                    } else {
                        if (m === 39) {
                            if (!$(k).hasClass("ui-datepicker-close") && $(k).hasClass("ui-state-default")) {
                                j.preventDefault();
                                nextDay(k)
                            }
                        } else {
                            if (m === 38) {
                                if (!$(k).hasClass("ui-datepicker-close") && $(k).hasClass("ui-state-default")) {
                                    j.preventDefault();
                                    upHandler(k, b, e)
                                }
                            } else {
                                if (m === 40) {
                                    if (!$(k).hasClass("ui-datepicker-close") && $(k).hasClass("ui-state-default")) {
                                        j.preventDefault();
                                        downHandler(k, b, d)
                                    }
                                } else {
                                    if (m === 13) {
                                        if ($(k).hasClass("ui-state-default")) {
                                            setTimeout(function() {
                                                closeCalendar()
                                            }, 100)
                                        } else {
                                            if ($(k).hasClass("ui-datepicker-prev")) {
                                                handlePrevClicks()
                                            } else {
                                                if ($(k).hasClass("ui-datepicker-next")) {
                                                    handleNextClicks()
                                                }
                                            }
                                        }
                                    } else {
                                        if (32 === m) {
                                            if ($(k).hasClass("ui-datepicker-prev") || $(k).hasClass("ui-datepicker-next")) {
                                                k.click()
                                            }
                                        } else {
                                            if (33 === m) {
                                                moveOneMonth(k, "prev")
                                            } else {
                                                if (34 === m) {
                                                    moveOneMonth(k, "next")
                                                } else {
                                                    if (36 === m) {
                                                        var l = $(k).closest("tbody").find(".ui-state-default")[0];
                                                        if (l) {
                                                            l.focus();
                                                            setHighlightState(l, $("#ui-datepicker-div")[0])
                                                        }
                                                    } else {
                                                        if (35 === m) {
                                                            var g = $(k).closest("tbody").find(".ui-state-default");
                                                            var n = g[g.length - 1];
                                                            if (n) {
                                                                n.focus();
                                                                setHighlightState(n, $("#ui-datepicker-div")[0])
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
                    }
                }
            }
        }
    })
}

function closeCalendar() {
    var a = $("#ui-datepicker-div");
    $(a).off("keydown");
    var b = $(".datepicker, .datepicker-month")[0];
    $(b).datepicker("hide")
}

function removeAria() {}

function isOdd(a) {
    return a % 2
}

function moveOneMonth(c, d) {
    var e = (d === "next") ? $(".ui-datepicker-next")[0] : $(".ui-datepicker-prev")[0];
    if (!e) {
        return
    }
    var a = "#ui-datepicker-div tbody td:not(.ui-state-disabled)";
    var b = $(a);
    var f = $.inArray(c.parentNode, b);
    e.click();
    setTimeout(function() {
        updateHeaderElements();
        var g = $(a);
        var h = g[f];
        var j = h && $(h).find("a")[0];
        while (!j) {
            f--;
            h = g[f];
            j = h && $(h).find("a")[0]
        }
        setHighlightState(j, $("#ui-datepicker-div")[0]);
        j.focus()
    }, 0)
}

function handleNextClicks() {
    setTimeout(function() {
        updateHeaderElements();
        prepHighlightState();
        $(".ui-datepicker-next").focus()
    }, 0)
}

function handlePrevClicks() {
    setTimeout(function() {
        updateHeaderElements();
        prepHighlightState();
        $(".ui-datepicker-prev").focus()
    }, 0)
}

function previousDay(c) {
    var a = document.getElementById("ui-datepicker-div");
    if (!c) {
        return
    }
    var e = $(c).closest("td");
    if (!e) {
        return
    }
    var d = $(e).prev(),
        b = $("a.ui-state-default", d)[0];
    if (d && b) {
        setHighlightState(b, a);
        b.focus()
    } else {
        handlePrevious(c)
    }
}

function handlePrevious(e) {
    var b = document.getElementById("ui-datepicker-div");
    if (!e) {
        return
    }
    var d = $(e).closest("tr");
    if (!d) {
        return
    }
    var a = $(d).prev();
    if (!a || a.length === 0) {
        previousMonth()
    } else {
        var f = $("td a.ui-state-default", a);
        var c = f[f.length - 1];
        if (c) {
            setTimeout(function() {
                setHighlightState(c, b);
                c.focus()
            }, 0)
        }
    }
}

function previousMonth() {
    var b = $(".ui-datepicker-prev")[0];
    var a = document.getElementById("ui-datepicker-div");
    b.click();
    setTimeout(function() {
        var c = $("tr", a),
            e = $("td a.ui-state-default", c[c.length - 1]),
            d = e[e.length - 1];
        updateHeaderElements();
        setHighlightState(d, a);
        d.focus()
    }, 0)
}

function nextDay(d) {
    var b = document.getElementById("ui-datepicker-div");
    if (!d) {
        return
    }
    var e = $(d).closest("td");
    if (!e) {
        return
    }
    var c = $(e).next(),
        a = $("a.ui-state-default", c)[0];
    if (c && a) {
        setHighlightState(a, b);
        a.focus()
    } else {
        handleNext(d)
    }
}

function handleNext(e) {
    var a = document.getElementById("ui-datepicker-div");
    if (!e) {
        return
    }
    var b = $(e).closest("tr"),
        d = $(b).next();
    if (!d || d.length === 0) {
        nextMonth()
    } else {
        var c = $("a.ui-state-default", d)[0];
        if (c) {
            setHighlightState(c, a);
            c.focus()
        }
    }
}

function nextMonth() {
    nextMon = $(".ui-datepicker-next")[0];
    var a = document.getElementById("ui-datepicker-div");
    nextMon.click();
    setTimeout(function() {
        updateHeaderElements();
        var b = $("a.ui-state-default", a)[0];
        setHighlightState(b, a);
        b.focus()
    }, 0)
}

function upHandler(j, l, h) {
    h = $(".ui-datepicker-prev")[0];
    var d = $(j).closest("tr");
    if (!d) {
        return
    }
    var k = $("td", d),
        b = $("a.ui-state-default", d),
        e = $.inArray(j, b),
        c = $(d).prev(),
        a = $("td", c),
        g = a[e],
        f = $("a.ui-state-default", g)[0];
    if (c && g && f) {
        setHighlightState(f, l);
        f.focus()
    } else {
        h.click();
        setTimeout(function() {
            updateHeaderElements();
            var t = $("tr", l),
                v = t[t.length - 1],
                q = $("td", v),
                r = $.inArray(j.parentNode, k),
                u = q[r],
                s = $("a.ui-state-default", u)[0];
            if (v && u && s) {
                setHighlightState(s, l);
                s.focus()
            } else {
                var p = t[t.length - 2],
                    n = $("td", p),
                    m = n[r],
                    o = $("a.ui-state-default", m)[0];
                if (o) {
                    setHighlightState(o, l);
                    o.focus()
                }
            }
        }, 0)
    }
}

function downHandler(f, k, h) {
    h = $(".ui-datepicker-next")[0];
    var a = $(f).closest("tr");
    if (!a) {
        return
    }
    var e = $("td", a),
        g = $.inArray(f.parentNode, e),
        j = $(a).next(),
        b = $("td", j),
        d = b[g],
        c = $("a.ui-state-default", d)[0];
    if (j && d && c) {
        setHighlightState(c, k);
        c.focus()
    } else {
        h.click();
        setTimeout(function() {
            updateHeaderElements();
            var n = $("tbody tr", k),
                q = $("td", n[0]),
                o = q[g],
                s = $("a.ui-state-default", o)[0];
            if (o && s) {
                setHighlightState(s, k);
                s.focus()
            } else {
                var m = n[1],
                    r = $("td", m),
                    l = r[g],
                    p = $("a.ui-state-default", l)[0];
                if (m && p) {
                    setHighlightState(p, k);
                    p.focus()
                }
            }
        }, 0)
    }
}

function onCalendarHide() {
    closeCalendar()
}

function monthDayYearText() {
    var a = $(".amaze-date");
    $(a).each(function(d) {
        d.parentNode.removeChild(d)
    });
    var b = document.getElementById("ui-datepicker-div");
    if (!b) {
        return
    }
    var c = $("a.ui-state-default", b);
    $(c).attr("role", "button").on("keydown", function(d) {
        if (d.which === 32) {
            d.preventDefault();
            d.target.click();
            setTimeout(function() {
                closeCalendar()
            }, 100)
        }
    });
    $(c).each(function(h, e) {
        var n = $(e).closest("tr"),
            f = $("td", n),
            k = $.inArray(e.parentNode, f),
            p = $("thead tr th", b),
            d = p[k],
            j = $("span", d)[0],
            o = $(".ui-datepicker-month option:selected").text(),
            m = $(".ui-datepicker-year option:selected").text(),
            g = e.innerHTML;
        if (!j || !o || !g || !m) {
            return
        }
        var l = m + "년 " + o + " " + e.innerHTML + "일 " + j.title + "요일";
        e.setAttribute("aria-label", l)
    })
}

function updateHeaderElements() {
    var a = document.getElementById("ui-datepicker-div");
    if (!a) {
        return
    }
    prev = $(".ui-datepicker-prev", a)[0];
    next = $(".ui-datepicker-next", a)[0];
    next.href = "javascript:void(0)";
    prev.href = "javascript:void(0)";
    next.setAttribute("role", "button");
    prev.setAttribute("role", "button");
    appendOffscreenMonthText(next);
    appendOffscreenMonthText(prev);
    monthDayYearText()

    console.log(monthDayYearText())
}

function prepHighlightState() {
    var b;
    var a = document.getElementById("ui-datepicker-div");
    b = $(".ui-state-highlight", a)[0] || $(".ui-state-default", a)[0];
    if (b && a) {
        setHighlightState(b, a)
    }
}

function setHighlightState(c, a) {
    var b = getCurrentDate(a);
    $(b).removeClass("ui-state-highlight");
    $(c).addClass("ui-state-highlight")
}

function getCurrentDate(b) {
    var a = $(".ui-state-highlight", b)[0];
    return a
}

function appendOffscreenMonthText(d) {
    var g;
    var f = $(d).hasClass("ui-datepicker-next");
    var a = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    if ($(d).closest(".ui-datepicker").find(".ui-datepicker-title select").hasClass("ui-datepicker-year")) {
        var e = $(".ui-datepicker-title .ui-datepicker-month").attr("data-select").toLowerCase();
        var h = $.inArray(e.toLowerCase(), a);
        var c = $(".ui-datepicker-title .ui-datepicker-year").attr("data-select").toLowerCase();
        var b = (f) ? h + 1 : h - 1
    } else {
        var e = $(".ui-datepicker-title .ui-datepicker-month").text().toLowerCase();
        var h = $.inArray(e.toLowerCase(), a);
        var c = $(".ui-datepicker-title .ui-datepicker-year").text().toLowerCase();
        var b = (f) ? h + 1 : h - 1
    }
    if (f && e === "12월") {
        c = parseInt(c, 10);
        b = 0
    } else {
        if (!f && e === "1월") {
            c = parseInt(c, 10);
            b = a.length - 1
        }
    }
    g = (f) ? "다음 달, " + firstToCap(a[b]) + " " + c : "이전 달, " + firstToCap(a[b]) + " " + c;
    $(d).find(".ui-icon").html(g)
}

function firstToCap(a) {
    return a.charAt(0).toUpperCase() + a.slice(1)
}

function fncInputCheckLen(d, b, c) {
    var a = fncLengthCheck(d.value);
    if (c < a) {
        alert(c + "byte를 초과할 수 없습니다.");
        d.value = strCutByte(d.value, c)
    }
    a = fncLengthCheck(d.value);
    var e = document.getElementById(b);
    e.innerHTML = a
}

function fncLengthCheck(c) {
    var a = 0;
    for (i = 0; i < c.length; i++) {
        var b = c.charAt(i);
        if (4 < escape(b).length) {
            a += 2
        } else {
            if (b != "\r") {
                a++
            }
        }
    }
    return a
}

function fncLevelOnChange(a) {
    if (a == "01") {
        $("#pregnantWeek").html("<option value='/nhis/healthin/wbhacd07800m01.do' selected='selected'>1주차</option><option value='/nhis/healthin/wbhacd07900m01.do'>2주차</option><option value='/nhis/healthin/wbhacd08000m01.do'>3주차</option><option value='/nhis/healthin/wbhacd08100m01.do'>4주차</option><option value='/nhis/healthin/wbhacd08200m01.do'>5주차</option><option value='/nhis/healthin/wbhacd08300m01.do'>6주차</option><option value='/nhis/healthin/wbhacd08400m01.do'>7주차</option><option value='/nhis/healthin/wbhacd08500m01.do'>8주차</option><option value='/nhis/healthin/wbhacd08600m01.do'>9주차</option><option value='/nhis/healthin/wbhacd08700m01.do'>10주차</option><option value='/nhis/healthin/wbhacd08800m01.do'>11주차</option><option value='/nhis/healthin/wbhacd08900m01.do'>12주차</option>")
    } else {
        if (a == "02") {
            $("#pregnantWeek").html("<option value='/nhis/healthin/wbhacd09000m01.do' selected='selected'>13주차</option><option value='/nhis/healthin/wbhacd09100m01.do'>14주차</option><option value='/nhis/healthin/wbhacd09200m01.do'>15주차</option><option value='/nhis/healthin/wbhacd09300m01.do'>16주차</option><option value='/nhis/healthin/wbhacd09400m01.do'>17주차</option><option value='/nhis/healthin/wbhacd09500m01.do'>18주차</option><option value='/nhis/healthin/wbhacd09600m01.do'>19주차</option><option value='/nhis/healthin/wbhacd09700m01.do'>20주차</option><option value='/nhis/healthin/wbhacd09800m01.do'>21주차</option><option value='/nhis/healthin/wbhacd09900m01.do'>22주차</option><option value='/nhis/healthin/wbhacd10000m01.do'>23주차</option><option value='/nhis/healthin/wbhacd10100m01.do'>24주차</option><option value='/nhis/healthin/wbhacd10200m01.do'>25주차</option><option value='/nhis/healthin/wbhacd10300m01.do'>26주차</option><option value='/nhis/healthin/wbhacd10400m01.do'>27주차</option><option value='/nhis/healthin/wbhacd10500m01.do'>28주차</option>")
        } else {
            if (a == "03") {
                $("#pregnantWeek").html("<option value='/nhis/healthin/wbhacd10600m01.do' selected='selected'>29주차</option><option value='/nhis/healthin/wbhacd10700m01.do'>30주차</option><option value='/nhis/healthin/wbhacd10800m01.do'>31주차</option><option value='/nhis/healthin/wbhacd10900m01.do'>32주차</option><option value='/nhis/healthin/wbhacd11000m01.do'>33주차</option><option value='/nhis/healthin/wbhacd11100m01.do'>34주차</option><option value='/nhis/healthin/wbhacd11200m01.do'>35주차</option><option value='/nhis/healthin/wbhacd11300m01.do'>36주차</option><option value='/nhis/healthin/wbhacd11400m01.do'>37주차</option><option value='/nhis/healthin/wbhacd11500m01.do'>38주차</option><option value='/nhis/healthin/wbhacd11600m01.do'>39주차</option><option value='/nhis/healthin/wbhacd11700m01.do'>40주차</option>")
            } else {}
        }
    }
}

function fncGoPage() {
    var a = $("#pregnantWeek").val();
    location.href = a
}

function fn_goToUrl(a) {
    location.href = $(a).closest("div").find("select option:selected").val()
}
jQuery.unparam = function(d) {
    if (d.startsWith("?")) {
        d = d.substring(1)
    }
    var f = {},
        c = d.split("&"),
        e, b, a;
    for (b = 0, a = c.length; b < a; b++) {
        e = c[b].split("=", 2);
        f[decodeURIComponent(e[0])] = (e.length == 2 ? decodeURIComponent(e[1].replace(/\+/g, " ")) : true)
    }
    return f
};
$(function() {
    $("[data-window-open]").click(function() {
        var a = $(this).attr("data-window-height");
        var c = $(this).attr("data-window-width");
        var b = "menubar=no,toolbar=no,resizable=yes,scrollbars=yes";
        if (a) {
            b += ",height=" + a
        }
        if (c) {
            b += ",width=" + c
        }
        window.open($(this).attr("href"), "", b);
        return false
    })
});

function fn_menu(b, a) {
    $(b).closest(".menu").find("li").removeClass("curr");
    $(b).addClass("curr");
    $(".menu-list-area." + a).closest(".all-menu-gnb").find("> .menu-list-area").hide();
    $(".menu-list-area." + a).show();
    $("#layer_all_menu .all-menu-cont .all-menu-gnb").scrollTop(0)
}

function go_search(b) {
    if (b != "" && b != null) {
        document.getElementById("query").value = b
    } else {
        if (document.getElementById("query").value == null || document.getElementById("query").value == "") {
            alert("검색어를 입력하세요.");
            $("#query").focus();
            return
        }
    }
    var c = document.getElementById("query").value;
    var a = "/nhis/etc/searchNhis.do?query=" + encodeURIComponent(c);
    window.open(a, "_blank", "");
    $(".toggle-search").click();
    $("#query").val("")
}

function go_searchMain(b) {
    if (b != "" && b != null) {
        document.getElementById("query_main").value = b
    } else {
        if (document.getElementById("query_main").value == null || document.getElementById("query_main").value == "") {
            alert("검색어를 입력하세요.");
            $("#query_main").focus();
            return
        }
    }
    var c = document.getElementById("query_main").value;
    var a = "/nhis/etc/searchNhis.do?query=" + encodeURIComponent(c);
    window.open(a, "_blank", "");
    $("#query_main").val("");
    $(".form-area").removeClass("on")
}

function fncSnsShare(a) {
    var f = $(this),
        g = f.attr("id"),
        c, e, b;
    var d = location.protocol + "//" + location.host;
    e = document.title;
    if (e == "") {
        e = "국민건강보험"
    }
    $.ajax({
        url: "/cms/util/getShortUrl.do",
        data: {
            url: location.pathname + location.search
        },
        success: function(h) {
            if (h.success) {
                b = d + "/s.do?" + h.shortUrl
            }
        },
        async: false,
        dataType: "json"
    });
    if (a == "kakaostory") {
        c = "https://story.kakao.com/share?url=" + encodeURIComponent(b) + "&title=" + encodeURIComponent(e)
    }
    if (a == "facebook") {
        c = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(b) + "&t=" + encodeURIComponent(e)
    }
    if (a == "twitter") {
        c = "http://twitter.com/intent/tweet?via=" + encodeURIComponent(b) + "&text=" + encodeURIComponent(e)
    }
    if (a == "naverBlog") {
        c = "http://blog.naver.com/openapi/share?url=" + encodeURIComponent(b) + "&title=" + encodeURIComponent(e)
    }
    if (a == "naverLine") {
        c = "http://line.me/R/msg/text/?" + encodeURIComponent(b) + "&body=" + encodeURIComponent(e)
    }
    window.open(c, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=680,width=830")
}

function fncClipUrl() {
    var b = (document.all) ? true : false;
    var a = location.href;
    if (b) {
        window.clipboardData.setData("Text", a);
        alert("주소가 복사되었습니다. Ctril+V를 눌러 붙여넣기 해주세요.")
    } else {
        temp = prompt("이 게시물의 주소입니다. Ctrl+C를 눌러 클립보드로 복사하세요.", a)
    }
}

function changeMobileTel() {
    if (checkMobileDevice()) {
        $(".mobileTel").each(function() {
            var a = $(this).text();
            a = a.replace(/\s/gi, "");
            if (a == "" || a == "-") {
                return
            } else {
                $(this).html("<a href='tel:" + a + "'>" + a + "</a>")
            }
        })
    }
}
$(function() {
    $(".ui_tabbx .ui_tab").each(function() {
        $(this).find("li.active > a").append('<span class="ir">선택된 탭</span>')
    });
    $(".ui_tabbx .ui_tab > li > a").on("click", function(b) {
        b.preventDefault();
        var a = $(this).attr("data-tab");
        $(this).closest(".ui_tabbx").find(".ui_tab > li").removeClass("active");
        $(this).closest(".ui_tabbx").find(".ui_tab > li .ir").remove();
        $(this).parent().addClass("active");
        $(this).append('<span class="ir">선택된 탭</span>');
        $(this).closest(".ui_tabbx").find(".tab_content").removeClass("active");
        $(this).closest(".ui_tabbx").find("#" + a).addClass("active")
    });
    $("#zoom-in").click(function(a) {
        a.stopPropagation();
        $(this).closest("ul.zoom_list").find("li").removeClass("select");
        $(this).closest('li:not(".reflash")').addClass("select");
    });
    $("#zoom-out").click(function(a) {
        a.stopPropagation();
        $(this).closest("ul.zoom_list").find("li").removeClass("select");
        $(this).closest('li:not(".reflash")').addClass("select");
    });
    popLayerNew();
    popLayerNewClose();
    $(".pop_layer .btnClose").focusout(function() {
        popLayerNewClose()
    })
});
$(function() {
    $("#cms-gnb-new > ul > li").on({
        mouseover: function() {
            $(".header_gnb").addClass("open");
            $(this).addClass("on");
            if (!$("#cms-gnb-new > ul > li ul").is("[style]")) {
                $("#cms-gnb-new > ul > li ul").height($("#cms-gnb-new > ul").height() - 100)
            }
        },
        mouseleave: function() {
            $(".header_gnb").removeClass("open");
            $("#cms-gnb-new > ul > li").removeClass("on")
        }
    });
    $("#cms-gnb-new > ul > li > a").focus(function() {
        $(".header_gnb").addClass("open");
        $("#cms-gnb-new > ul > li:not('.curr')").removeClass("on");
        $(this).parent().addClass("on");
        if (!$("#cms-gnb-new > ul > li ul").is("[style]")) {
            $("#cms-gnb-new > ul > li ul").height($("#cms-gnb-new > ul").height() - 100)
        }
    });
    $("#cms-gnb-new > ul > li:last li a:last").focusout(function() {
        $(".header_gnb").removeClass("open")
    });
    fn_gnb2();

    // 퀵메뉴 높이계산
    const $top_height = parseInt($("#header-top").height() + $("header").height() + 48);
    const $top_bncloseH = $top_height - parseInt($(".main-swipe-wrap").height())  - 48;
    const $windowHeight = parseInt($(window).height());

    $("main aside#quick-menu").css("top",$top_height+"px"); // 상단 높이지정정

    setTimeout(() => {
        if($("body").hasClass("bn-hidden")) {
            $(".btn-helper").css("margin-top",($top_bncloseH - 32)+"px");
            $(".helper-wrap").css("padding-top",($top_bncloseH - 32)+"px");
            $(".helper-wrap > .helper-conts-area").css("height",($windowHeight - $top_bncloseH + 48)+"px");
        } else {
            $(".btn-helper").css("margin-top",($top_height - 48)+"px");
            $(".helper-wrap").css("padding-top",($top_height - 48)+"px");
            $(".helper-wrap > .helper-conts-area").css("height",($windowHeight - $top_height + 48)+"px");
        }
    }, 400);

    $(document).on('click',"button[aria-controls=main-swipe-wrap]",function() {
        let target = $(this).attr("aria-controls");

        if($(".urgent-ban").length >= 1) {
            header_height = parseInt($("header").height() + 160);
        } else {
            header_height = parseInt($("header").height() + 80);
        }

        $(this).toggleClass("on");
        $("."+target).stop().toggleClass("on").slideToggle(410);

        if(!$("."+target).hasClass("on")) {
            helperH = $windowHeight - $top_bncloseH;

            $(this).text("팝업 열기");
            // 퀵메뉴 초기 위치 header
            $("#quick-menu").css("top",header_height+"px");

            $(".btn-helper").css("margin-top",$top_bncloseH+"px");
            $(".helper-wrap").css("padding-top",$top_bncloseH+"px");
        } else {
            helperH = $windowHeight - $top_height + 48;
            $(this).text("팝업 닫기");
            $("#quick-menu").css("top",parseInt(header_height + 140)+"px");

            $(".btn-helper").css("margin-top",($top_height - 48)+"px");
            $(".helper-wrap").css("padding-top",($top_height - 48)+"px");
        }

        $(".helper-wrap > .helper-conts-area").css("height",(helperH)+"px");
    });
});
$(document).on("click", "ul.sound_list > li > .item-link", function(a) {
    a.stopPropagation();
    $(this).closest("ul").find("li").removeClass("select");
    $(this).closest('ul > li:not(".reflash")').addClass("select")
});
$(document).on("click", ".header_top .ui_accd .hBox .btn_nurizip", function() {
    var a = $(this).closest(".ui_accd");
    if (a.children(".cBox").is(":visible")) {
        a.children(".cBox").slideUp();
        a.removeClass("active")
    } else {
        a.addClass("active").children(".cBox").slideDown()
    }
});
$(document).on("click", ".drop_wrap .drop_btn", function(a) {
    a.stopPropagation();
    if ($(this).hasClass("on")) {
        $(this).toggleClass("active");
        $(this).find(".ir").text("열기");
        $(this).closest(".drop_wrap").find(".drop_menu").toggle()
    } else {
        $(".drop_wrap .drop_btn").removeClass("active");
        $(".drop_wrap").find(".ir").text("열기");
        $(".drop_wrap").find(".drop_menu").hide();
        $(this).addClass("active");
        $(this).closest(".drop_wrap").find(".drop_menu").show();
        $(this).find(".ir").text("닫기");
        $(this).next(".drop_menu").find("li:last .item-link").blur(function() {
            $(this).closest(".drop_menu").hide();
            $(".drop_wrap .drop_btn").removeClass("active")
        })
    }
});
$(document).on("click", function(a) {
    $(".drop_wrap").find(".drop_menu").hide();
    $(".drop_wrap .drop_btn").removeClass("on")
});

$(document).on('click','#header .m-gnb-wrap .m-gnb-menu .submenu-wrap .dl .dd > button.sm',function() {
    $(this).next().stop().slideToggle('400');
});

// 평가 - 의견을 남겨주셔서 감사합니다.
$(document).on('click','.assess-answer-wrap .input-group button',function() {
    $(this).stop().parents(".txt-box.content-foot").fadeOut(600,function() {
        $(this).siblings(".assess-end-message").stop().fadeIn(600).css("display","flex");
    });
});

// 도움말 포커싱
$(document).on('click','.btn-help-exec',function() {
    $idx = $(".btn-help-exec").index($(this));

    $(".helper-wrap .conts-box:eq("+ $idx +")").focus().siblings(".conts-box");
});

// calendar
if($(".datepicker")) {
    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true
    });
}

function fn_gnb2() {
    var a = $(".m-gnb-wrap");
    var b = $(".user_support .moblie_navi_btn");
    fn_destroy(a);
    fn_destroy(b);
    a.css("height", $(window).height());
    b.click(function() {
        a.addClass("is-open");
        $("#header").css("z-index", "auto");
        $("#container .section-left").removeClass("open");
        $("#container .section-left h2").css("z-index", "1");
        $("body").css("overflow", "hidden");
        $(".m-gnb-wrap").show().stop(true, true).animate({
            right: "0"
        }, 500, "easeOutCubic");
        a.find(".gnb-depth > ul > li:not(:has(ul))").addClass("no-sub")
    });
    a.find(".m-gnb > ul > li > a").click(function(c) {
        c.preventDefault();
        $(".m-gnb > ul > li").removeClass("on");
        $(this).closest("li").addClass("on");
        $(".m-gnb > ul > li").each(function() {
            $(this).find("> a").attr("title", $(this).find("> a").text())
        });
        $(this).attr("title", $(this).text() + " 선택됨");
        a.find(".gnb-depth > ul > li:not(:has(ul))").addClass("no-sub")
    });
    a.find(".gnb-depth > ul > li > a").click(function(c) {
        if (!$(this).closest("li").hasClass("no-sub")) {
            c.preventDefault();
            $(this).closest("li").toggleClass("on")
        }
    });
    a.find(".gnb-close").click(function(c) {
        c.preventDefault();
        $("#header, #container .section-left h2").removeAttr("style");
        $("body").css("overflow", "hidden");
        $(".m-gnb-wrap").stop(true).animate({
            right: "-100%"
        }, 500, "easeOutCubic", function() {
            $("body").removeAttr("style");
            $(".m-gnb > ul > li").removeClass("on");
            $(".m-gnb > ul > li.curr").addClass("on");
            $(".gnb-depth > ul > li").removeClass("on");
            $(".m-gnb-wrap").hide()
        });
        $(".m-gnb-wrap").removeClass("is-open")
    })
}

function popLayerNew() {
    $("[data-ui='pop-layer']").on("click", function(b) {
        var a = $(this).attr("pop-id");
        $("#" + a).attr("tabindex", "0").fadeIn(200).focus();
        $(this).attr("data-role", "#" + a);
        $("#" + a).attr("data-role", $(this).data("role"));
        $("body").css({
            overflow: "hidden"
        });
        $("#header").addClass("zindexOn");
        b.preventDefault()
    });
    $(".pop_layer .btnClose").on("click", function() {
        $(this).closest(".pop_layer").fadeOut(200);
        var a = $(this).closest(".pop_layer").data("role");
        $("[data-ui='pop-layer']").each(function() {
            $(this).data("role") == a && $(this).focus()
        });
        $("body").css({
            overflow: ""
        });
        $("#header").removeClass("zindexOn")
    })
}

function popLayerNewClose() {
    var a = $(".pop_layer:visible").attr("id");
    $("#" + a + " .btnClose").trigger("click");
    $("body").css({
        overflow: ""
    });
    $("#header").removeClass("zindexOn")
};

// TOP 버튼
function btnTopscroll() {
    if($(".urgent-ban").length >= 1) {
        header_height = parseInt($("#header-top").height() + $("header").height() + 128);
    } else {
        header_height = parseInt($("#header-top").height() + $("header").height() + 48);
    }

    // 퀵메뉴 초기 위치 header
    $("#quick-menu").css("top",header_height+"px");
    // 상단으로 이동
    $(document).on('click','#scrollUp',function() {
        $("html,body").stop().animate({scrollTop:"0"}, "600");
    });
}

//상단 배너
const mainBanner = document.querySelector('.main-swipe-wrap');
if(mainBanner) {
    const eleBanSwiper = new Swiper('.main-swipe-wrap .swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 400,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.main-swipe-wrap .swiper-button-next',
            prevEl: '.main-swipe-wrap .swiper-button-prev',
        },
        pagination: {
            el: ".main-swipe-wrap .swiper-pagination",
            type: "fraction",
        },
        breakpoints: {
            // 1024px 이상에서는 3개의 슬라이드를 보여줌
            1024: {
                slidesPerView: 2,
            }
        }
    });
    
    const $eleBanSwiperPlay = document.querySelector('.main-swipe-wrap .swiper-button-play');
    const $eleBanSwiperStop = document.querySelector('.main-swipe-wrap .swiper-button-stop');
    
    $eleBanSwiperPlay.style.display = "none";
    
    $eleBanSwiperPlay.addEventListener("click", () => {
        eleBanSwiper.autoplay.start();
        $eleBanSwiperStop.style.display = "";
        $eleBanSwiperPlay.style.display = "none";
    });
    
    $eleBanSwiperStop.addEventListener("click", () => {
        eleBanSwiper.autoplay.stop();
        $eleBanSwiperStop.style.display = "none";
        $eleBanSwiperPlay.style.display = "";
    });
}

$(document).ready(function() {
    if(($(".type01 > .col-table table").length >= 1) && (!$(".type01").hasClass("not-add-row"))) {
        const table_inner = [];
        const row_idx = $(".type01 > .col-table table tbody tr").length;
    
        $(".type01 > .col-table table thead th").each(function() {
            table_inner.push($(this).text());
        });
    
        for(let i = 0; i < row_idx; i++) {
            $(".type01 > .col-table table tbody tr:eq("+ i +") td").each(function(j) {
                $(this).before($('<th class="header-cell">'+ table_inner[j] +'</th>'));
            });
        }
    }
    
    // pagination
    function updatePagination(currentPage, totalPages) {
        var maxPagesToShow = $(window).width() < 1024 ? 7 : 11;
        var pageContainer = $('.pagination .page');
        pageContainer.empty();
        pageContainer.append(currentPage === 1 ? '<strong>1</strong>' : '<a href="#" data-page="1">1</a>');
        var startPage, endPage;

        if (maxPagesToShow === 7) {
            if (currentPage <= 4) {
                startPage = 2;
                endPage = 5;
            } else if (currentPage >= totalPages - 3) {
                startPage = totalPages - 4;
                endPage = totalPages - 1;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        } else {
            if (currentPage <= 6) {
                startPage = 2;
                endPage = 9;
            } else if (currentPage >= totalPages - 5) {
                startPage = totalPages - 8;
                endPage = totalPages - 1;
            } else {
                startPage = currentPage - 3;
                endPage = currentPage + 3;
            }
        }

        if (startPage > 2) {
            pageContainer.append('<span class="link-dot"></span>');
        }

        for (var i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                pageContainer.append('<strong>' + i + '</strong>');
            } else {
                pageContainer.append('<a href="#" data-page="' + i + '">' + i + '</a>');
            }
        }

        if (endPage < totalPages - 1) {
            pageContainer.append('<span class="link-dot"></span>');
        }

        if (currentPage === totalPages) {
            pageContainer.append('<strong>' + totalPages + '</strong>');
        } else {
            pageContainer.append('<a href="#" data-page="' + totalPages + '">' + totalPages + '</a>');
        }
    }

    $('.pagination').on('click', 'a', function(e) {
        e.preventDefault();
        var page = $(this).data('page');
        if (page) {
            updatePagination(page, 120);
        }
    });

    $('.pagination').on('click', '.prev', function(e) {
        e.preventDefault();
        var currentPage = $('.pagination .page strong').text();
        var newPage = Math.max(1, parseInt(currentPage) - 10);
        updatePagination(newPage, 120);
    });

    $('.pagination').on('click', '.next', function(e) {
        e.preventDefault();
        var currentPage = $('.pagination .page strong').text();
        var newPage = Math.min(120, parseInt(currentPage) + 10);
        updatePagination(newPage, 120);
    });

    updatePagination(1, 120);
    $(window).resize(function() {
        var currentPage = parseInt($('.pagination .page strong').text()) || 1;
        updatePagination(currentPage, 120);
    });

    // Page Tab 스크롤
    Page_Tab();
    
    // datepicker
    $(document).on('click','.form-btn-datepicker',function() {
        $(this).prev(".datepicker").trigger("focus");
    });

    $(document).on('click','.ico-pw-visible',function() {
        let $input_change = $(this).closest(".btn-ico-wrap");
        let $target = $input_change.find("input");
        
        $input_change.toggleClass("change").hasClass("change") ? $target.attr("type","text") : $target.attr("type","password");
    });

    // radio 디자인 링크버튼
    $(".label-group .bg-chk a").on('keydown',function(event) {
        let prevNode = $(this).parent().prev().children("a");
        let nextNode = $(this).parent().next().children("a");

        switch (event.key) {
            case 'ArrowUp': // 위 방향키
                prevNode.focus();
            break;

            case 'ArrowDown': // 아래 방향키
                nextNode.focus();
            break;

            case 'ArrowLeft': // 좌측 방향키
                prevNode.focus();
            break;

            case 'ArrowRight': // 우측 방향키
                nextNode.focus();
            break;
        }
    });

    //window 팝업
    $(document).on('click','.open-window',function() {
        popupWindow($(this).attr("data-target"));

        return false;
    });
});

$(window).resize(function() {
    // 퀵메뉴 높이계산
    const top_height = parseInt($("#header-top").height() + $("header").height() + 48);
    $("main aside#quick-menu").css("top",top_height+"px"); // 상단 높이지정정
    
    Page_Tab();
});

function Page_Tab() {
    $('.tab-wrap > .tab').each(function() {
        var $tab = $(this);

        if (!$tab.hasClass('scroll-wrap')) {
            return;
        }
    
        var $scrollableTabs = $tab.find('.scrollable-tabs');
        var $btnScrollLeft = $tab.find('.scroll-btn.left');
        var $btnScrollRight = $tab.find('.scroll-btn.right');
        var scrollAmount = 200;
        var isScrolling = false;
    
        $btnScrollLeft.click(function() {
            if (!isScrolling) {
                isScrolling = true;
                $scrollableTabs.stop().animate({ scrollLeft: '-=' + scrollAmount }, 100, function() {
                    isScrolling = false;
                    updateScrollButtons();
                });
            }
        });
    
        $btnScrollRight.click(function() {
            if (!isScrolling) {
                isScrolling = true;
                $scrollableTabs.stop().animate({ scrollLeft: '+=' + scrollAmount }, 100, function() {
                    isScrolling = false;
                    updateScrollButtons();
                });
            }
        });
    
        $scrollableTabs.on('mousewheel DOMMouseScroll', function(e) {
            e.preventDefault();
            if (!isScrolling) {
                isScrolling = true;
                var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                if (delta > 0) {
                    $scrollableTabs.stop().animate({ scrollLeft: '-=' + scrollAmount }, 100, function() {
                        isScrolling = false;
                        updateScrollButtons();
                    });
                } else {
                    $scrollableTabs.stop().animate({ scrollLeft: '+=' + scrollAmount }, 100, function() {
                        isScrolling = false;
                        updateScrollButtons();
                    });
                }
            }
        });
    
        $scrollableTabs.on('scroll', function() {
            updateScrollButtons();
        });
    
        function updateScrollButtons() {
            var scrollLeft = $scrollableTabs.scrollLeft();
            var scrollWidth = $scrollableTabs[0].scrollWidth;
            var clientWidth = $scrollableTabs.width();
    
            if (scrollLeft > 0) {
                $btnScrollLeft.css('display', 'block');
            } else {
                $btnScrollLeft.css('display', 'none');
            }
    
            if (scrollLeft + clientWidth >= scrollWidth) {
                $btnScrollRight.css('display', 'none');
            } else {
                $btnScrollRight.css('display', 'block');
            }
        }
        updateScrollButtons();
    });

    /* col-table card-type 체크박스 체크시 tr에 클래스 추가 */
    $('.col-table.card-type tbody th input[type="checkbox"]').on('change', function() {
        var $tr = $(this).closest('tr');
        
        if ($(this).is(':checked')) {
            $tr.addClass('checked');
        } else {
            $tr.removeClass('checked');
        }
    });

    /* 카드형 체크박스,라디오 추가 */
    $('input[type="radio"], input[type="checkbox"]').on('change', function() {
        var input = $(this);

        if (input.is('[type="radio"]')) {
            $('input[name="' + input.attr('name') + '"]').closest('label.chk-box').removeClass('checked');
        }

        input.closest('label.chk-box').toggleClass('checked', input.is(':checked'));
    });

    $('input[type="radio"], input[type="checkbox"]').each(function() {
        $(this).closest('label.chk-box').toggleClass('checked', $(this).is(':checked'));
    });
}