import deviceType from '../utils/detect-device-type';
import {$window} from '../utils/globals';

const $accordion = $('.js-accordion');
let timeOut;

/**
 * Handle hide the inactive sections
 * @return {void}
 */
const handleHideTheInactiveSections = () => {
	const isSmallDesktopOrTouch = deviceType() === "tablet" || deviceType() === "mobile" || $window.width() < 1024;
	const $accordionSection = $('.js-accordion .accordion__section');
	const initSection = $accordionSection.closest('.js-accordion').attr('data-active');

	$accordionSection.each(function(index, el) {
		const $element = $(el);

		if ($element.index() === initSection) {
			return
		}

		if (isSmallDesktopOrTouch) {
			$accordionSection
				.not('.accordion__section--current')
					.find('.accordion__body')
						.hide()
					.find('.accordion__entry')
						.show()
		}

		if (!isSmallDesktopOrTouch) {
			$accordionSection
				.not('.accordion__section--current')
					.find('.accordion__entry')
						.hide()
					.closest('.accordion__body')
						.show()
		}
	});
}

$window.on('load resize', () => {
	handleHideTheInactiveSections();
});

/**
 * Toggle accordion content
 * @param  {dom element} $element
 * @param  {string} target
 * @return {void}
 */
const accordionToggle = ($element, target) => {
	$element
		.closest('.accordion__section')
			.find(`${target}`)
				.stop()
				.slideToggle(300)
			.closest('.accordion__section')
				.toggleClass('accordion__section--current')
			.siblings()
			.removeClass('accordion__section--current')
				.find(`${target}`)
					.slideUp();

	if (!$('.accordion__section--current').length) {
		return
	}

	const $parent = $element.closest('.js-accordion');
	const initSlide = $parent.find('.accordion__section--current').index();

	$parent.attr({
		"data-active": `${initSlide}`,
	});	

	const scrollTo = $('.accordion__section--current').offset().top;

	$('html, body').animate({
		scrollTop: scrollTo
	}, 400);
}

/**
 * Changing the active state after a definite time.
 * @return {void}
 */
const handleAutoChangeAccordion = () => {
	$accordion.each(function() {
		const $this = $(this);
		const accordionTimeOut = $this.attr('data-time') || 7000;

		$('body').get(0).style.setProperty('--dur', accordionTimeOut);
		
		timeOut = setTimeout(() => {

			const $activeSection = $this .find('.accordion__section--current');
			const $nextSection =  $activeSection.next('.accordion__section');

			if ($nextSection.length) {
				$nextSection
					.find('.accordion__head')
					.trigger('click')
			} else {
				$this
					.find('.accordion__section:first')
					.find('.accordion__head')
					.trigger('click')
			}

		}, accordionTimeOut)
	});
}

handleAutoChangeAccordion()

$accordion.on('click', '.accordion__head', function (event) {
	const $this = $(this);
	const $scrollTo = $this.parent();
	const isSmallDesktopOrTouch = deviceType() === "tablet" || deviceType() === "mobile" || $window.width() < 1024;

	if (isSmallDesktopOrTouch) {
		accordionToggle($this, '.accordion__body');
	}

	if (!isSmallDesktopOrTouch) {
		accordionToggle($this, '.accordion__entry');
	}

	clearTimeout(timeOut);
	handleAutoChangeAccordion();
});
