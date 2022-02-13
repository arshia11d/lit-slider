import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('lit-slide')
export class Slide extends LitElement {
	@property({ type: Boolean, reflect: true }) active = false

	clone() {
		const slide = this.cloneNode(true) as Slide
		slide.part.add('slide')
		return slide
	}

	protected updated(changedProperties: PropertyValues<this>): void {
		if (changedProperties.has('active')) {
			if (this.active) {
				this.part.add('active')
			} else {
				this.part.remove('active')
			}
		}
	}

	static get styles() {
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

	protected render() {
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