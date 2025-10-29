import { Component } from "@angular/core";
import { IModal, ModalData, ModalDirective } from '../../index';
import { RlbBootstrapModule } from "../../../rlb-bootstrap.module";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
	standalone: true,
	template: `
		<div [class]="'modal-header' + headerColor">
			<h5 class="modal-title">Modal title</h5>
			<button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
		</div>
		<div class="modal-body">
			<p>Modal body text goes here.</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-modal-reason="cancel">
				Close
			</button>
			<button type="button" class="btn btn-primary" data-modal-reason="ok">
				Save changes
			</button>
		</div>
	`,
	hostDirectives: [
		{
			directive: ModalDirective,
			inputs: ['id', 'data-instance', 'data-options'],
		},
	],
	imports: [RlbBootstrapModule, FormsModule, CommonModule],
})
export class EventCreateEditComponent implements IModal<any, any>  {
	data!: ModalData<any>;
	valid?: boolean = true;
	result?: any;
	
	get headerColor() {
		return this.data.type ? ` bg-${this.data.type}` : '';
	}
}