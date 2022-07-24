import { Component, html, component, state } from '@a11d/lit'

@component('lit-slider-demo')
export class Demo extends Component {
	@state() private slidesBackgrounds = [
		'url("https://cdn.wallpaperhub.app/cloudcache/e/6/8/e/e/5/e68ee56be36553b1cd8f04a99ab5dca852ed2c17.jpg")',
		'url("https://cdn.wallpaperhub.app/cloudcache/b/c/0/4/b/d/bc04bdbb38ca1cefd03ebd730ae37d994fbcb99b.jpg")',
	]

	protected override get template() {
		return html`
			<button @click=${this.addSlide}>Add Slide</button>
			<button @click=${this.removeSlide}>Remove Slide</button>

			<lit-slider style='height: 500px' hasNavigation hasPagination hasThumb>
				${this.slidesBackgrounds.map((background, index) => html`
					<lit-slide style=${`background: ${background}`}>
						<h1>Slide ${index + 1}</h1>
					</lit-slide>
				`)}
			</lit-slider>
		`
	}

	private readonly addSlide = () => {
		this.slidesBackgrounds = [...this.slidesBackgrounds, 'red']
	}

	private readonly removeSlide = () => {
		this.slidesBackgrounds = this.slidesBackgrounds.slice(0, -1)
	}
}