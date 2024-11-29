import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './card.component.html',
    standalone: false
})
export class CardsComponent {

  sample: string = `<rlb-card>
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>`;

  align: string = `<rlb-card [align]="'right'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>`;

  overlay: string = `<rlb-card [overlay]="true">
  <div rlb-card-image>
    <h5>Card Image</h5>
  </div>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>`;

  background: string = `<rlb-card [background]="'primary'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [background]="'secondary'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [background]="'success'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [background]="'danger'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [background]="'warning'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [background]="'info'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [background]="'light'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [background]="'dark'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>`;

  border: string = `<rlb-card [border]="'primary'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [border]="'secondary'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [border]="'success'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [border]="'danger'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [border]="'warning'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [border]="'info'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [border]="'light'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>
<rlb-card [border]="'dark'">
  <rlb-card-body>
    <h5>Card Body</h5>
  </rlb-card-body>
  <rlb-card-footer>
    <p>Card Footer</p>
  </rlb-card-footer>
</rlb-card>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './card.component.html',
})
export class CardsComponent {}`;
}
