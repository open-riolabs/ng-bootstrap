import { Component } from '@angular/core';

@Component({
    selector: 'app-placeholder',
    templateUrl: './placeholder.component.html',
    standalone: false
})
export class PlaceholdersComponent {
	
	sample: string = `<rlb-placeholder-text/>`;
	
	color: string = `<h6>primary</h6>
<rlb-placeholder-text color="primary"/>
<h6>Secondary</h6>
<rlb-placeholder-text color="secondary"/>
<h6>success</h6>
<rlb-placeholder-text color="success"/>
<h6>danger</h6>
<rlb-placeholder-text color="danger"/>
<h6>info</h6>
<rlb-placeholder-text color="info"/>
<h6>warning</h6>
<rlb-placeholder-text color="warning"/>
<h6>light</h6>
<rlb-placeholder-text color="light"/>
<h6>dark</h6>
<rlb-placeholder-text color="dark"/>`;
	
	size: string = `<h6>xs</h6>
<rlb-placeholder-text size="xs"/>
<h6>sm</h6>
<rlb-placeholder-text size="sm"/>
<h6>md</h6>
<rlb-placeholder-text size="md"/>
<h6>lg</h6>
<rlb-placeholder-text size="lg"/>`;
	
	animation: string = `<h6>glow</h6>
<rlb-placeholder-text size="lg" animation="glow"/>
<h6>wave</h6>
<rlb-placeholder-text size="lg" animation="wave"/>`;
	
	advanced: string = `<h4 class="mt-3">Placeholder Advanced Usage</h4>
<rlb-placeholder animation="glow">
<rlb-placeholder-line width="100%"/>
<rlb-placeholder-line width="80%" color="primary" size="sm"/>
<rlb-placeholder-line width="60%" [rounded]="false"/>
</rlb-placeholder>`

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './placeholder.component.html',
})
export class PlaceholdersComponent {}`;
}
