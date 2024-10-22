import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './collapse.component.html',
})
export class CollapesesComponent {

  html: string = `<div class="py-3">
    <button rlb-button toggle="collapse" toggle-target="collapse-id" class="me-2">
      Collapse
    </button>
  </div>
  <div>
    <rlb-collapse id="collapse-id">
      <rlb-card style="width: 300px" [overlay]="false">
        <rlb-card-body>
          <h5 rlb-card-title>Card title</h5>
          <p rlb-card-text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
        </rlb-card-body>
      </rlb-card>
    </rlb-collapse>
  </div>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './collapse.component.html',
})
export class CollapesesComponent {}`;
}
