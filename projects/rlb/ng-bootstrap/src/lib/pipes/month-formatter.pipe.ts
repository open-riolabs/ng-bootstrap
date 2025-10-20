import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'monthFormatter', standalone: false })
export class MonthFormatterPipe implements PipeTransform {
	private readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	transform(value: string): string {
		if (!value) return '';
		const parts = value.trim().split(' ');
		if (parts.length < 2) return value;
		const day = parts[0];
		const monthIndex = parseInt(parts[1], 10) - 1;
		if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
			return value;
		}
		const month = this.months[monthIndex];
		const rest = parts.slice(2).join(' ');
		return `${day} ${month}${rest ? ' ' + rest : ''}`;
	}
}