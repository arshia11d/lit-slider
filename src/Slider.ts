import { css, html, LitElement } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { swiperStyles } from './styles.min.css'
import * as SwiperCore from 'swiper'
import { Slide } from '.'
import type { PaginationOptions } from 'swiper/types/modules/pagination'

SwiperCore.Swiper.use([
	SwiperCore.A11y,
	SwiperCore.Autoplay,
	SwiperCore.Controller,
	SwiperCore.EffectCoverflow,
	SwiperCore.EffectCube,
	SwiperCore.EffectFade,
	SwiperCore.EffectFlip,
	SwiperCore.EffectCreative,
	SwiperCore.EffectCards,
	SwiperCore.HashNavigation,
	SwiperCore.History,
	SwiperCore.Keyboard,
	SwiperCore.Lazy,
	SwiperCore.Mousewheel,
	SwiperCore.Navigation,
	SwiperCore.Pagination,
	SwiperCore.Parallax,
	SwiperCore.Scrollbar,
	SwiperCore.Thumbs,
	SwiperCore.Virtual,
	SwiperCore.Zoom,
	SwiperCore.FreeMode,
	SwiperCore.Grid,
	SwiperCore.Manipulation,
])

/**
 * @csspart slide - Slide element.
 * @csspart active - Active slide element.
 * @csspart pagination - Pagination element.
 * @csspart previousButton - Previous button navigation element.
 * @csspart nextButton - Next button navigation element.
 */
@customElement('lit-slider')
export class Slider extends LitElement {
	// TODO Events

	//#region Core Properties
	/** Disables swiping to next slide direction (to right or bottom) */
	@property({ type: Boolean, reflect: true }) preventSlideNext = false
	/** Disables swiping to previous slide direction (to left or top) */
	@property({ type: Boolean, reflect: true }) preventSlidePrevious = false
	/** Adapts the slider wrapper height to the height of the currently active slide */
	@property({ type: Boolean, reflect: true }) autoHeight = false
	/** Centers slides if the amount of slides less than `slidesPerView`. Not intended to be used `loop` mode and `grid.rows` */
	@property({ type: Boolean, reflect: true }) centerInsufficientSlides = false
	/** Centers active slide, not always on the left side. */
	@property({ type: Boolean, reflect: true }) centeredActiveSlides = false
	/** Centers active slide without adding gaps at the beginning and end of slider. Required `centeredActiveSlides`. Not intended to be used with `loop` or `pagination` */
	@property({ type: Boolean, reflect: true }) centeredActiveSlidesBounds = false
	@property({ type: String, reflect: true }) direction: SwiperCore.SwiperOptions['direction'] = 'horizontal'
	/** Transition effect. Can be 'slide', 'fade', 'cube', 'coverflow', 'flip' or 'creative' */
	// @property({ type: String, reflect: true }) effect: SwiperCore.SwiperOptions['effect'] = 'slide'
	/** Enables continuous loop mode */
	@property({ type: Boolean, reflect: true }) loop = false
	/** Addition number of slides that will be cloned after creating of loop */
	@property({ type: Number, reflect: true }) loopAdditionalSlides = 0
	/** Enable and loop mode will fill groups with insufficient number of slides with blank slides. Good to be used with `slidesPerGroup` parameter */
	@property({ type: Boolean, reflect: true }) loopFillGroupWithBlank = false
	/** Allows Swiper slide prev/next transitions when transitions is already in progress (has effect when loop enabled) */
	@property({ type: Boolean, reflect: true }) loopAllowSlide = false
	/** Enables "rewind" mode. Clicking "next" navigation button (or calling .slideNext()) when on last slide will slide back to the first slide. Clicking "prev" navigation button (or calling .slidePrev()) when on first slide will slide forward to the last slide. */
	@property({ type: Boolean, reflect: true }) rewind = false
	/** Set numbers of slides to define and enable group sliding. Useful to use with slidesPerView > 1 */
	@property({ type: Number, reflect: true }) slidesPerGroup = 1
	/** Skips all slides in view on .slideNext() & .slidePrev() methods calls, on Navigation "buttons" clicks and in autoplay. This is intended to be used only with slidesPerView: 'auto' and slidesPerGroup: 1 */
	@property({ type: Boolean, reflect: true }) slidesPerGroupAuto = false
	/**
	 * If equals 0 (default), no slides are excluded from grouping, and the resulting behavior is the same as without this change.
	 * If slidesPerGroupSkip is equal or greater than 1 the first X slides are treated as single groups, whereas all following slides are grouped by the slidesPerGroup value.
	 */
	@property({ type: Number, reflect: true }) slidesPerGroupSkip = 0
	/**
	 * Number of slides per view (slides visible at the same time on slider's container).
	 * If you use it with "auto" value and along with loop: true then you need to specify loopedSlides parameter with amount of slides to loop (duplicate)
	 * slidesPerView: 'auto' is currently not compatible with multirow mode, when grid.rows > 1
	 */
	@property({ type: String, reflect: true }) slidesPerView: SwiperCore.SwiperOptions['slidesPerView'] = 1
	/** Distance between slides in px. If you use "margin" css property to the elements which go into Swiper in which you pass "spaceBetween" into, navigation might not work properly. */
	@property({ type: Number, reflect: true }) spaceBetween = 0
	/** Duration of transition between slides (in ms) */
	@property({ type: Number, reflect: true }) speed = 300
	/** Threshold value in px. If "touch distance" will be lower than this value then swiper will not move */
	@property({ type: Number, reflect: true }) threshold = 0
	/** Allowable angle (in degrees) to trigger touch move */
	@property({ type: Number, reflect: true }) touchAngle = 45
	/** Enable this feature to calculate each slides progress and visibility. */
	@property({ type: Boolean, reflect: true }) watchSlidesProgress = true
	//#endregion

	//#region Autoplay Properties
	/** Enable autoplay */
	@property({ type: Boolean, reflect: true }) autoplay = false
	/** Delay between transitions (in ms) */
	@property({ type: Number, reflect: true }) autoplayDelay = 3000
	/** Stop autoplay when it reaches last slide (has no effect in loop mode) */
	@property({ type: Boolean, reflect: true }) stopOnLastSlide = false
	/** Disable autoplay after user interactions e.g. swipes */
	@property({ type: Boolean, reflect: true }) disableAutoplayOnInteraction = false
	/** Reverses the autoplay in reverse direction */
	@property({ type: Boolean, reflect: true }) reverseAutoplayDirection = false
	/**
	 * Waits for wrapper transition to continue. Can be disabled
	 * in case of using Virtual Translate when your slider may not have transition
	 */
	@property({ type: Boolean, reflect: true }) waitForAutoplayTransition = false
	/**
	 * Pause autoplay on mouse enter over Swiper container.
	 * If `disableOnInteraction` is also enabled, it will stop autoplay instead of pause.
	 */
	@property({ type: Boolean, reflect: true }) pauseAutoplayOnMouseEnter = false
	//#endregion

	//#region Pagination Properties
	/** Enables pagination */
	@property({ type: Boolean, reflect: true }) hasPagination = false
	/** Type of pagination. Can be `'bullets'`, `'fraction'`, `'progressbar'` or `'custom'` */
	@property({ type: String, reflect: true }) paginationType: PaginationOptions['type'] = 'bullets'
	/** Good to enable if you use bullets pagination with a lot of slides. So it will keep only few bullets visible at the same time. */
	@property({ type: Boolean, reflect: true }) dynamicPaginationBullets: PaginationOptions['dynamicBullets'] = false
	/** The number of main bullets visible when `dynamicBullets` enabled. */
	@property({ type: Number, reflect: true }) dynamicPaginationMainBullets: PaginationOptions['dynamicMainBullets'] = 1
	/** Toggle (hide/show) pagination container visibility after click on Slider's container */
	@property({ type: Boolean, reflect: true }) showPaginationOnClick: PaginationOptions['hideOnClick'] = false
	/** If `true` then clicking on pagination button will cause transition to appropriate slide. Only for bullets pagination type */
	@property({ type: Boolean, reflect: true }) clickablePagination: PaginationOptions['clickable'] = false
	/**
	 * Makes pagination progressbar opposite to Swiper's `direction` parameter, means vertical progressbar for horizontal swiper
	 * direction and horizontal progressbar for vertical swiper direction
	 */
	@property({ type: Boolean, reflect: true }) oppositePaginationProgressBar: PaginationOptions['progressbarOpposite'] = false
	/** Format fraction pagination current number. Function receives current number, and you need to return formatted value */
	@property({ type: Object }) formatPaginationFractionCurrent?: PaginationOptions['formatFractionCurrent']
	/** Format fraction pagination total number. Function receives total number, and you need to return formatted value */
	@property({ type: Object }) formatPaginationFractionTotal?: PaginationOptions['formatFractionTotal']
	//#endregion

	@property({ type: Boolean, reflect: true }) hasNavigation = false
	// TODO: Navigation Properties

	// TODO: Other modules

	@property({ type: Boolean, reflect: true }) hasThumb = false

	@query('.gallery-top') protected readonly sliderElement!: HTMLElement
	@query('.gallery-top > .swiper-wrapper') protected readonly slidesContainerElement?: HTMLElement
	@query('.swiper-pagination') protected readonly paginationElement!: HTMLElement
	@query('.swiper-button-prev') protected readonly previousButtonElement!: HTMLElement
	@query('.swiper-button-next') protected readonly nextButtonElement!: HTMLElement
	@query('.gallery-thumbs') protected readonly thumbsSliderElement!: HTMLElement

	@state() protected slides = new Array<Slide>()

	private extractSlides() {
		this.slides = [...new Set(this.children)]
			.filter((child): child is Slide => child instanceof Slide)
			.map(s => s.clone())
	}

	protected firstUpdated() {
		this.initializeSlider()
	}

	protected updated() {
		this.updateSlider()
	}

	protected slider?: SwiperCore.Swiper
	protected thumbsSlider?: SwiperCore.Swiper

	protected initializeSlider() {
		this.thumbsSlider = new SwiperCore.Swiper(this.thumbsSliderElement, {
			spaceBetween: 10,
			slidesPerView: Math.min(Math.max(4, this.slides.length), 8),
			watchSlidesProgress: true,
		})
		this.slider = new SwiperCore.Swiper(this.sliderElement, {
			navigation: {
				prevEl: this.previousButtonElement,
				nextEl: this.nextButtonElement,
				hideOnClick: true,
			},
			pagination: {
				el: this.paginationElement,
			},
			thumbs: {
				swiper: this.thumbsSlider,
			},
			on: {
				activeIndexChange: () => this.requestUpdate()
			}
		})
	}

	protected updateSlider() {
		if (this.slider) {
			this.slider.params = {
				...this.slider.params,
				allowSlideNext: this.preventSlideNext === false,
				allowSlidePrev: this.preventSlidePrevious === false,
				autoHeight: this.autoHeight,
				centerInsufficientSlides: this.centerInsufficientSlides,
				centeredSlides: this.centeredActiveSlides,
				centeredSlidesBounds: this.centeredActiveSlidesBounds,
				direction: this.direction,
				loop: this.loop,
				loopAdditionalSlides: this.loopAdditionalSlides,
				loopFillGroupWithBlank: this.loopFillGroupWithBlank,
				loopPreventsSlide: this.loopAllowSlide === false,
				rewind: this.rewind,
				slidesPerGroup: this.slidesPerGroup,
				slidesPerGroupAuto: this.slidesPerGroupAuto,
				slidesPerGroupSkip: this.slidesPerGroupSkip,
				slidesPerView: this.slidesPerView === 'auto' ? 'auto' : Number(this.slidesPerView),
				spaceBetween: this.spaceBetween,
				speed: this.speed,
				threshold: this.threshold,
				touchAngle: this.touchAngle,
				watchSlidesProgress: this.watchSlidesProgress,
				autoplay: typeof this.slider.params.autoplay === 'boolean' || typeof this.slider.params.autoplay === 'undefined' ? undefined : {
					...this.slider.params.autoplay,
					delay: this.autoplayDelay,
					disableOnInteraction: this.disableAutoplayOnInteraction,
					reverseDirection: this.reverseAutoplayDirection,
					waitForTransition: this.waitForAutoplayTransition,
					stopOnLastSlide: this.stopOnLastSlide,
					pauseOnMouseEnter: this.pauseAutoplayOnMouseEnter,
				},
				pagination: typeof this.slider.params.pagination === 'boolean' ? false : {
					...this.slider.params.pagination,
					type: this.paginationType,
					dynamicBullets: this.dynamicPaginationBullets,
					dynamicMainBullets: this.dynamicPaginationMainBullets,
					hideOnClick: this.showPaginationOnClick === false,
					clickable: this.clickablePagination,
					progressbarOpposite: this.oppositePaginationProgressBar,
					formatFractionCurrent: this.formatPaginationFractionCurrent ?? this.slider.params.pagination?.formatFractionCurrent,
					formatFractionTotal: this.formatPaginationFractionTotal ?? this.slider.params.pagination?.formatFractionTotal,
				},
			}
			this.slider.update()
			this.slider.pagination.render()
			this.slider.pagination.update()
			this.thumbsSlider?.update()
			this.slider.allowSlideNext = this.preventSlideNext === false
			this.slider.allowSlidePrev = this.preventSlidePrevious === false
		}
	}

	static get styles() {
		return css`
			${swiperStyles}

			:host {
				display: block;
				--swiper-theme-color: white;
				--swiper-navigation-color: white;
			}

			.swiper-button-prev, .swiper-button-next {
				visibility: hidden;
			}

			:host([hasNavigation]) .swiper-button-prev, :host([hasNavigation]) .swiper-button-next {
				visibility: visible;
			}

			.swiper-pagination {
				visibility: hidden;
			}

			:host([hasPagination]) .swiper-pagination {
				visibility: visible;
			}

			.gallery-top {
				height: 100%;
			}

			:host([hasThumb]) .gallery-top {
				height: calc(100% - var(--swiper-thumb-height, 100px) - var(--swiper-thumb-margin, 10px));
			}

			:host(:not([hasThumb])) .gallery-thumbs {
				display: none;
			}

			.gallery-thumbs {
				margin-top: var(--thumbs-margin-top, 10px);
				height: var(--swiper-thumb-height, 100px);
			}

			.gallery-thumbs .swiper-slide {
				height: 100%;
				opacity: 0.25;
				transition: 200ms;
				cursor: pointer;
				background-position: center !important;
				background-repeat: no-repeat !important;
				background-size: cover !important;
			}

			.gallery-thumbs .swiper-slide-thumb-active {
				opacity: 1;
			}
		`
	}

	protected render() {
		return html`
			<div class='swiper-container gallery-top'>
				<slot style='display: none' @slotchange=${() => this.extractSlides()}></slot>
				<div class='swiper-wrapper'>
					${this.slides.map((slide, index) => this.renderSlide(slide, index))}
				</div>
				${this.renderPagination()}
				${this.renderNavigation()}
			</div>
			${this.renderThumbsSlider()}
		`
	}

	protected renderSlide(slide: Slide, index: number) {
		slide.active = this.slider?.activeIndex === index ?? false
		return html`
			<div class='swiper-slide'>
				${slide}
			</div>
		`
	}

	protected renderPagination() {
		return html`
			<div part='pagination' class='swiper-pagination'></div>
		`
	}

	protected renderNavigation() {
		return html`
			<div part='previousButton' class='swiper-button-prev'></div>
			<div part='nextButton' class='swiper-button-next'></div>
		`
	}

	protected renderThumbsSlider() {
		return html`
			<div class='swiper-container gallery-thumbs'>
				<div class='swiper-wrapper'>
					${this.slides.map((slide, index) => html`
						<div style='background: ${slide.style.background}' class='swiper-slide gallery-thumb'
							@click=${() => this.slider?.slideTo(index)}
						></div>
					`)}
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lit-slider': Slider
	}
}