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

	if($eleBanSwiperPlay){
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

	if($eleBanSwiperPlay2){
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
	}

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

	if($eleBanSwiperPlay3){
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
	}

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

	if($eleBanSwiperPlay4){
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
	}

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

//임시
$(document).ready(function(){
	$('#wrap').before('<button type="button" class="btn xlg" id="btn-show">hide</button>');

	getAllStyle();
	btnShowClick();
});

function btnShowClick() {
	$('#btn-show').on('click', (e) => {
		let $this = $(e.currentTarget);

		$this.toggleClass('hideBtn');
		
		$('.css-caption').each((idx, el) => {
			if($this.hasClass('hideBtn')){
				$(el).hide();
				$this.text('show');
			} else{
				$(el).show();
				$this.text('hide');
			}
		});
	});
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
		});
		if (cssValue.color || cssValue.fontSize || cssValue.backgroundColor) {
			if (elTag !== 'BR' && elTag !== 'I' && elTag !== 'IMG' && $el.is(':visible')) {
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
		// removeCssCaption(el, '.css-caption');
		// let $el = $(el);
		// let elText = $el.text().trim();
		// let elParentText = $el.parent().children('.css-caption').text().trim();

		// if(elText == elParentText){
		// }

		let parentUl = $(el).parents('ul');
		if(parentUl){
			parentUl.children('li').children('.css-caption').not(':first').remove();
		}

		$(el).parent()
			.on('mouseenter', () => {
				$(el).css({ 'background-color': '#000', 'color': '#fff', 'padding': '4px 10px', 'z-index': '9999' });
			})
			.on('mouseleave', () => {
				$(el).css({ 'padding': '0', 'font-size': '12px !important', 'color': '#000 !important', 'background-color': 'rgba(0, 0, 0, 0.5) !important', 'margin-top': '0 !important', 'z-index': '' });
			});
	});

	$('.tab > ul, .banner-group > .inr > .box a > span sub').css('overflow', 'visible');
}
function removeCssCaption(el, className) {
	let elText = $(el).text().trim();
	const textToRemove = elText;
	// let elParentText = $(el).parent().children(className).text().trim();

	while (true) {
		const $parent = $(el).parent();
		let elParentText = $parent.children(className).text().trim();

		if ($parent.length == 0) {
			break;
			// return elText;
		}

		if(elText === elParentText){
			// $parent.remove();
			$(el).remove();
			el = $parent;
		} else {
			break;
		}
	};
	// while (elText === elParentText) {
		
	// 	// const $parent = $(el).parent();
	// 	// let elParentText = $parent.text().trim();

	// 	$(el).remove();
	// 	// el = $parent;
	// 	el = $(el).parent();

	// 	if (elParentText.length == 0) {
	// 		break;
	// 		// return elText;
	// 	}

	// 	if(elText !== elParentText){
	// 		break;
	// 	}
	// };
}

function rgbToHex(rgb) {
	const rgbArray = rgb.match(/\d+/g);
	return rgbArray ? `#${((1 << 24) + (parseInt(rgbArray[0]) << 16) + (parseInt(rgbArray[1]) << 8) + parseInt(rgbArray[2])).toString(16).slice(1)}` : null;
}