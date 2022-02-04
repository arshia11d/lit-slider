import { html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { swiperStyles } from './styles.min.css'
import * as SwiperLibrary from 'swiper'

@customElement('lit-slider')
export class Swiper extends LitElement {
	@property({ type: Boolean, reflect: true }) hasThumb = false
	@property({ type: Boolean, reflect: true }) autoplay = true

	@query('#divContainer') private readonly divContainer!: HTMLDivElement
	@query('#divSlides') private readonly divSlides?: HTMLDivElement
	@query('#divGallery') private readonly divGallery!: HTMLDivElement
	@query('#divPagination') private readonly divPagination!: HTMLDivElement
	@query('#divPrevious') private readonly divPrevious!: HTMLDivElement
	@query('#divNext') private readonly divNext!: HTMLDivElement

	slider?: SwiperLibrary.Swiper

	static get styles() {
		return swiperStyles
	}

	get slides() {
		return [
			...Array.from(this.querySelectorAll('lit-slide')),
			...Array.from(this.divSlides?.querySelectorAll('lit-slide') ?? [])
		]
	}

	protected firstUpdated() {
		// Core library features at https://swiperjs.com/api/#custom-build
		SwiperLibrary.Swiper.use([
			SwiperLibrary.Navigation,
			SwiperLibrary.Pagination,
			SwiperLibrary.Scrollbar,
			SwiperLibrary.Autoplay,
			SwiperLibrary.Thumbs,
			SwiperLibrary.Keyboard
		])
		this.slider = new SwiperLibrary.Swiper(this.divContainer, {
			navigation: {
				prevEl: this.divPrevious,
				nextEl: this.divNext,
			},
			pagination: this.hasThumb ? {} : {
				el: this.divPagination
			},
			autoplay: this.autoplay ? {
				delay: 5000,
				disableOnInteraction: false,
				reverseDirection: false,
				stopOnLastSlide: false,
				waitForTransition: true,
			} : false,
			thumbs: this.hasThumb ? {
				swiper: new SwiperLibrary.Swiper(this.divGallery, {
					spaceBetween: 10,
					slidesPerView: Math.min(Math.max(4, this.slides.length), 8),
					watchSlidesProgress: true,
				}),
			} : {},
			preventClicks: false,
			preventClicksPropagation: false,
		})
	}

	protected render() {
		return html`
			<style>
				:host {
					display: block;
					--swiper-theme-color: var(--lit-slider-theme-color);
					--swiper-navigation-color: var(--lit-slider-navigation-color);
					--swiper-gallery-height: 0px;
					--swiper-slider-margin-bottom: 0px;
				}

				:host([hasThumb]) {
					--swiper-slider-margin-bottom: 10px;
					--swiper-gallery-height: calc(100px - var(--swiper-slider-margin-bottom));
				}

				#divContainer {
					height: calc(100% - calc(var(--swiper-gallery-height)) - var(--swiper-slider-margin-bottom));
					margin-bottom: var(--swiper-slider-margin-bottom);
				}

				#divGallery {
					height: var(--swiper-gallery-height);
				}

				.gallery-thumbs .swiper-slide {
					height: 100%;
					opacity: 0.25;
					transition: 200ms;
					cursor: pointer;
				}

				.gallery-thumbs .swiper-slide-thumb-active {
					opacity: 1;
				}

				.gallery-thumb {
					background-position: center !important;
					background-repeat: no-repeat !important;
					background-size: cover !important;
				}
			</style>
			<div id='divContainer' class='swiper-container gallery-top'>
				<div id='divSlides' class='swiper-wrapper'>
					${this.slides.map(slide => html`<div class='swiper-slide'>${slide}</div>`)}
				</div>

				<div id='divPagination' class='swiper-pagination'></div>
				<div id='divPrevious' class='swiper-button-prev'></div>
				<div id='divNext' class='swiper-button-next'></div>
			</div>
			<div id='divGallery' class='swiper-container gallery-thumbs'>
				<div class='swiper-wrapper'>
					${this.slides.map((_, index) => html`
						<div class='swiper-slide gallery-thumb'
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
		'lit-slider': Swiper
	}
}