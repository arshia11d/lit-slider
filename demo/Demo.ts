import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('lit-slider-demo')
export class Demo extends LitElement {
	protected render() {
		return html`
			<style>
				lit-slider {
					--lit-slider-navigation-color: white;
				}
			</style>
			<div>
				<lit-slider style='height: 500px'>
					<lit-slide style='background: red'>Slide 1</lit-slide>
					<lit-slide style='background: yellow'>Slide 2</lit-slide>
				</lit-slider>
			</div>
		`
	}
}