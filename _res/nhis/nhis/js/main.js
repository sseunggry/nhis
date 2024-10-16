$(document).stop().ready(function() {
    // 퀵메뉴
    if($(".urgent-ban").length >= 1) {
        const top_height = parseInt($("#header-top").height() + $("header").height() + 128);
        
        $("main aside#quick-menu").css("top",top_height+"px"); // 상단 높이지정정
    } else {
        header_height = parseInt($("header").height() + 80);
    }

    //나의 맞춤 정책제도
    const eleBanSwiper = new Swiper('.middle_group .swiper', {
        slidesPerView: 1,
        speed: 400,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.middle_group .swiper-button-next',
            prevEl: '.middle_group .swiper-button-prev',
        },
        pagination: {
            el: ".middle_group .swiper-pagination",
            type: "fraction",
        },
        breakpoints: {
            // 1024px 이상에서는 3개의 슬라이드를 보여줌
            1024: {
                slidesPerView: 3,
                spaceBetween: 16,
            }
        }
    });

    const $eleBanSwiperPlay = document.querySelector('.middle_group .swiper-button-play');
    const $eleBanSwiperStop = document.querySelector('.middle_group .swiper-button-stop');

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

    //고객만족도 조사
    const eleBanSwiper2 = new Swiper('.news_group .swiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 400,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.news_group .swiper-button-next',
            prevEl: '.news_group .swiper-button-prev',
        },
        pagination: {
            el: ".news_group .swiper-pagination",
            type: "fraction",
        },
    });

    const $eleBanSwiperPlay2 = document.querySelector('.news_group .swiper-button-play');
    const $eleBanSwiperStop2 = document.querySelector('.news_group .swiper-button-stop');

    $eleBanSwiperPlay2.style.display = "none";

    $eleBanSwiperPlay2.addEventListener("click", () => {
        eleBanSwiper2.autoplay.start();
        $eleBanSwiperStop2.style.display = "";
        $eleBanSwiperPlay2.style.display = "none";
    });

    $eleBanSwiperStop2.addEventListener("click", () => {
        eleBanSwiper2.autoplay.stop();
        $eleBanSwiperStop2.style.display = "none";
        $eleBanSwiperPlay2.style.display = "";
    });

    //SNS
    const eleBanSwiper3 = new Swiper('.sns .swiper', {
        slidesPerView: "auto",
        speed: 400,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.sns .swiper-button-next',
            prevEl: '.sns .swiper-button-prev',
        },
        pagination: {
            el: ".sns .swiper-pagination",
        },
        breakpoints: {
            // 1024px 이상에서는 3개의 슬라이드를 보여줌
            1024: {
                slidesPerView: 2,
                spaceBetween: 24,
            }
        }
    });

    const $eleBanSwiperPlay3 = document.querySelector('.sns .swiper-button-play');
    const $eleBanSwiperStop3 = document.querySelector('.sns .swiper-button-stop');

    $eleBanSwiperPlay3.style.display = "none";

    $eleBanSwiperPlay3.addEventListener("click", () => {
        eleBanSwiper3.autoplay.start();
        $eleBanSwiperStop3.style.display = "";
        $eleBanSwiperPlay3.style.display = "none";
    });

    $eleBanSwiperStop3.addEventListener("click", () => {
        eleBanSwiper3.autoplay.stop();
        $eleBanSwiperStop3.style.display = "none";
        $eleBanSwiperPlay3.style.display = "";
    });

    //홍보존
    const eleBanSwiper4 = new Swiper('.marketing .swiper', {
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 400,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.marketing .swiper-button-next',
            prevEl: '.marketing .swiper-button-prev',
        },
        pagination: {
            el: ".marketing .swiper-pagination",
            type: "fraction",
        },
    });

    const $eleBanSwiperPlay4 = document.querySelector('.marketing .swiper-button-play');
    const $eleBanSwiperStop4 = document.querySelector('.marketing .swiper-button-stop');

    $eleBanSwiperPlay4.style.display = "none";

    $eleBanSwiperPlay4.addEventListener("click", () => {
        eleBanSwiper4.autoplay.start();
        $eleBanSwiperStop4.style.display = "";
        $eleBanSwiperPlay4.style.display = "none";
    });

    $eleBanSwiperStop4.addEventListener("click", () => {
        eleBanSwiper4.autoplay.stop();
        $eleBanSwiperStop4.style.display = "none";
        $eleBanSwiperPlay4.style.display = "";
    });

    // swiper 배열처리
    $serviceSwiper_arr = [];

    $(document).on('click','.service_group .ui_tab a',function() {
        $idx = $(this).parent().index();
        $target = $(".service_group .tab_content:eq("+ $idx +")");
        
        if($(window).width() < 1024){
            if(!$target.find(".swiper").hasClass("init")) {
                $serviceSwiper = new Swiper($target.find(".swiper"), {
                    observer: true,
                    observeParents: true,
                    slidesPerView: 2,
                    spaceBetween: 16,
                    speed: 400,
                    loop: true,
                    autoplay: {
                        delay: 2500,
                        disableOnInteraction: false,
                    },
                    navigation: {
                        nextEl: $target.find('.swiper-button-next'),
                        prevEl: $target.find('.swiper-button-prev'),
                    },
                    pagination: {
                        el: $target.find('.swiper-pagination'),
                        type: 'fraction',
                    }
                });

                $serviceSwiperPlay = $target.find(".swiper-button-play");
                $serviceSwiperStop = $target.find(".swiper-button-stop");

                $serviceSwiperPlay.css("display","none");

                $target.find(".swiper").addClass("init"); // swipe init 구분자 재호출 방지
                $serviceSwiper_arr.push($serviceSwiper); // 배열로 swipe push
            }

            $serviceSwiperPlay = $target.find(".swiper-button-play");
            $serviceSwiperStop = $target.find(".swiper-button-stop");

            $serviceSwiperPlay.on('click',function() {
                $serviceSwiper_arr[$idx].autoplay.start();
                $serviceSwiperStop.css("display","");
                $serviceSwiperPlay.css("display","none");
            });
                
            $serviceSwiperStop.on('click',function() {
                $serviceSwiper_arr[$idx].autoplay.stop();
                $serviceSwiperStop.css("display","none");
                $serviceSwiperPlay.css("display","");
            });
        }
    });

    // 모바일인 경우 로딩시 강제 실행 - 자주 찾는 서비스
    if($(window).width() < 1024) {
        $active_idx = $(".service_group .ui_tab li.active").index();

        $(".service_group .ui_tab li.active a").trigger("click");
    }

    // 나의 맞춤 정책제도 - 나에게 맞는 상황을 선택해주세요.
    $(document).on('click','.middle_group .title-justify button,.middle_group .check-layer > .btn-group button',function() {
        $(".middle_group .check-layer").toggleClass("on");
    });

    //임시
    function getAllStyle2() {
        $('#wrap *').each((idx, el) => {
            let htmlEl = '';
            const $el = $(el);
            const elTag = $el.prop('tagName');
            // const elHeight = $el.outerHeight();
            // const color = $el.css('color') == $('body').css('color') ? '' : rgbToHex($el.css('color'));
            // const fontSize = $el.css('font-size') == $('body').css('font-size') ? '' : $el.css('font-size');
            // const backgroundColor = $el.css('background-color') == $('body').css('background-color') ? '' : rgbToHex($el.css('background-color'));

            // const styles = {
            //     color: $el.css('color') == $('body').css('color') ? '' : rgbToHex($el.css('color')),
            //     fontSize: $el.css('font-size') == $('body').css('font-size') ? '' : $el.css('font-size'),
            //     backgroundColor: $el.css('background-color') == 'rgba(0, 0, 0, 0)' ? '' : rgbToHex($el.css('background-color'))
            // };

            // let color = styles.color ? `c: ${styles.color},` : '';
            // let fontSize = styles.fontSize ? `${styles.fontSize},` : '';
            // let backgroundColor = styles.backgroundColor ? `bg: ${styles.backgroundColor}` : '';
            
            // $el.css('position', 'relative');
            if (elTag !== 'BR' && elTag !== 'I' && elTag !== 'IMG'){
                // htmlEl += `
                //     <p class="css-caption" style="position: absolute; font-size: 12px; color: #000; background-color: rgba(0, 0, 0, 0.5);">
                //         ${color}${fontSize}${backgroundColor}
                //     </p>
                // `;
                // if(color.length || fontSize.length || backgroundColor.length){
                //     $el.append(htmlEl);
                // }
            }

            // if (color || fontSize || backgroundColor) {
            //     console.log(styles, $(el).css('color'), $(el).parent().css('color'));
            // }
            

            const cssProperties = ['color', 'fontSize', 'backgroundColor'];
            let cssValue = {};
            $.each(cssProperties, (idx, property) => {
                if (property == 'color' && $(el).css(property) !== $('body').css('color')){
                    cssValue[property] = rgbToHex($(el).css(property));
                }
                if (property == 'fontSize' && $(el).css(property) !== $('body').css('font-size')){
                    cssValue[property] = $(el).css(property);
                }
                if (property == 'backgroundColor' && $(el).css(property) !== 'rgba(0, 0, 0, 0)'){
                    cssValue[property] = rgbToHex($(el).css(property));
                }
            });
            if (cssValue.color || cssValue.fontSize || cssValue.backgroundColor){
                if (elTag !== 'BR' && elTag !== 'I' && elTag !== 'IMG') {
                    cssValue = JSON.stringify(cssValue).replace(/[{\"}]/g, '').replace(/,/g, ', ');
                    htmlEl += `
                        <p class="css-caption" style="position: absolute; font-size: 12px !important; color: #000 !important;; background-color: rgba(0, 0, 0, 0.5) !important; margin-top: 0 !important;">
                            ${cssValue}
                        </p>
                    `;
                    $el.append(htmlEl);
                }
            }
        });

        $('.css-caption').each((idx, el) => {
            let elText = $(el).text().trim();
            let elParentText = $(el).parent().text().trim();

            while (elText == elParentText) {
                el = $(el).parent();
                // elParentCss = $(target).css(property);

                if (el.length == 0) {
                    return elText;
                }
            };
            // if($(el).text().trim() == $(el).parent().text().trim()){
            //     console.log(123);
            // }
            console.log(elText);
        });

        function removeDuplicateCss(target, property) {
            let elCss = $(target).css(property);
            let elParentCss = $(target).parent().css(property);
            
            while (elCss == elParentCss) {
                target = $(target).parent();
                elParentCss = $(target).css(property);

                if(target.length == 0) {
                    return elCss;
                }
            };
            if( property.toLowerCase().includes('color') ){
                elCss = rgbToHex(elCss);
            }
            return elCss;
        }

        $('.css-caption').each((idx, el) => {
            // console.log($(this), $(el));
            $(el).parent()
            .on('mouseenter', () => {
                $(el).css({ 'background-color':'#000', 'color': '#fff'});
            })
            .on('mouseleave', () => {
                $(el).css({ 'font-size': '12px !important', 'color': '#000 !important', 'background-color':'rgba(0, 0, 0, 0.5) !important', 'margin-top': '0 !important'});
            });
        });
    }
    function getAllStyle1() {
        const allElements = document.querySelectorAll('#wrap *');
        const stylesArray = [];

        allElements.forEach((el) => {
            const elStyle = window.getComputedStyle(el);
            const styles = {
                tagName: el.tagName,
                css: {}
            };

            for(let i = 0; i < elStyle.length; i++){
                const property = elStyle[i];
                if(property == 'fontSize' || property == 'backgroundColor'){
                    styles.css[property] = elStyle.getPropertyValue(property);
                } else if(property == 'color') {
                    styles.css[property] = rgbToHex(elStyle.getPropertyValue(property));
                }
            }

            stylesArray.push(styles);
        });

        return stylesArray;
    }
    function getAllStylePushHtml() {
        const allElements = document.querySelectorAll('#wrap *');
        const stylesArray = [];

        allElements.forEach((el) => {
            const elStyle = window.getComputedStyle(el);
            const styles = {};

            for(let i = 0; i < elStyle.length; i++){
                const property = elStyle[i];
                if(property == 'fontSize' || property == 'backgroundColor'){
                    styles.css[property] = elStyle.getPropertyValue(property);
                } else if(property == 'color') {
                    styles.css[property] = rgbToHex(elStyle.getPropertyValue(property));
                }
            }

            stylesArray.push(styles);
            console.log(styles);
        });

        return stylesArray;
    }
    function getAllStyle() {
        $('#wrap *').each((idx, el) => {
            let htmlEl = '';
            const $el = $(el);
            const elTag = $el.prop('tagName');
            const cssProperties = ['color', 'fontSize', 'backgroundColor'];
            let cssValue = {};
            const elHeight = $el.outerHeight();
            
            $.each(cssProperties, (idx, property) => {
                const initialColor = $('body').css('color');
                const initialFontSize = $('body').css('font-size');
                const initialBackgroundColor = 'rgba(0, 0, 0, 0)';

                if (property == 'color' && $(el).css(property) !== initialColor) {
                    cssValue[property] = rgbToHex($(el).css(property));
                }
                if (property == 'fontSize' && $(el).css(property) !== initialFontSize) {
                    cssValue[property] = $(el).css(property);
                }
                if (property == 'backgroundColor' && $(el).css(property) !== initialBackgroundColor) {
                    cssValue[property] = rgbToHex($(el).css(property));
                }
                // cssValue[property] = rgbToHex($(el).css(property));
            });
            if (cssValue.color || cssValue.fontSize || cssValue.backgroundColor) {
                if (elTag !== 'BR' && elTag !== 'I' && elTag !== 'IMG') {
                    cssValue = JSON.stringify(cssValue).replace(/[{\"}]/g, '').replace(/,/g, ', ');
                    htmlEl += `
                        <p class="css-caption" style="position: absolute; font-size: 12px !important; color: #000 !important; background-color: rgba(0, 0, 0, 0.5) !important; margin-top: 0 !important;">
                            ${cssValue}
                        </p>
                    `;
                    $el.append(htmlEl);
                }
            }
        });

        $('.css-caption').each((idx, el) => {
            removeCssCaption(el);

            $(el)
                .on('mouseenter', () => {
                    $(el).css({ 'background-color': '#000', 'color': '#fff', 'padding': '4px 10px', 'z-index': '9999' });
                })
                .on('mouseleave', () => {
                    $(el).css({ 'padding': '0', 'font-size': '12px !important', 'color': '#000 !important', 'background-color': 'rgba(0, 0, 0, 0.5) !important', 'margin-top': '0 !important', 'z-index': '' });
                });
        });

        $('.tab > ul, .banner-group > .inr > .box a > span sub').css('overflow', 'visible');
    }
    function removeCssCaption(el) {
        let elText = $(el).text().trim();
        

        while (true) {
            const $parent = $(el).parent();
            let elParentText = $parent.text().trim();

            if ($parent.length == 0) {
                return elText;
            }

            if(elText === elParentText){
                $parent.remove();
                el = $parent;
            } else {
                break;
            }
        };
    }
    // function removeCssCaption1(el){
    //     let elText = $(el).text().trim();
    //     let elParentText = $(el).parent().text().trim();

    //     while (elText == elParentText) {
    //         el = $(el).parent();
    //         // elParentCss = $(target).css(property);

    //         if (el.length == 0) {
    //             return elText;
    //         } else {
    //             $(el).remove();
    //         }
    //     };
    // }
    
    function rgbToHex(rgb) {
        const rgbArray = rgb.match(/\d+/g);
        return rgbArray ? `#${((1 << 24) + (parseInt(rgbArray[0]) << 16) + (parseInt(rgbArray[1]) << 8) + parseInt(rgbArray[2])).toString(16).slice(1)}` : null;
    }

    getAllStyle();
});

$(window).resize(function() {
    $target = $(".service_group .tab_content.active");
    
    if($(window).width() < 1024){
        if(!$target.find(".swiper").hasClass("init")) {
            $(".service_group .ui_tab li.active a").trigger("click");
        }
    } else {
        if($target.find(".swiper").hasClass("init")) {
            $(".service_group .tab_content").each(function(i) {
                if($serviceSwiper_arr[i]) {
                    $serviceSwiper_arr[i].destroy();
                }

                $serviceSwiperStop = $(this).find(".swiper-button-stop");

                $serviceSwiperStop.css("display","");

                $(this).find(".swiper").removeClass("init");
            });

            $serviceSwiper_arr = []; // swipe 배열 초기화
        }
    }
});