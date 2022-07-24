import { css, html, Component, component, property } from '@a11d/lit'

@component('lit-slide')
export class Slide extends Component {
	@property({
		type: Boolean,
		reflect: true,
		updated(this: Slide) { (this.active ? this.part.add : this.part.remove)('active') } }
	) active = false

	clone() {
		const slide = this.cloneNode(true) as Slide
		slide.part.add('slide')
		return slide
	}

	static override get styles() {
		return css`
			:host {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				width: 100%;
				background-size: cover !important;
				background-repeat: no-repeat !important;
				background-position: center !important;
			}
		`
	}

	protected override get template() {
		return html`
			<slot></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lit-slide': Slide
	}
}