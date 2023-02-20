import 'slick-carousel';

import {$window} from '../utils/globals';
import deviceType from '../utils/detect-device-type';

const $slider = $('.js-accordion');
const speed = parseInt($slider.attr('data-time'));

const settings = {
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	dots: true,
	mobileFirst: true,
	infinite:true,
	autoplay: true,
	autoplaySpeed: speed,
	responsive: [
		{
			breakpoint: 768,
			settings: 'unslick'
		}
	]
}

$slider.slick(settings);

$slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
	$slider.attr({
		"data-active": currentSlide,
	});
});

$window.on('load resize', function(event) {
	const initSliderIndex = parseInt($slider.attr('data-active'));
	const newSettings = {...settings, initialSlide:initSliderIndex,}

	if (deviceType() == "mobile" && !$slider.hasClass('slick-initialized')) {
		$slider.slick(newSettings);
	}
});
