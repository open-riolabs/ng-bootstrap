import { Directive, input, } from '@angular/core';
import { Color } from '../../shared/types';

@Directive({
  selector: '[rlb-placeholder]',
  host: {
    class: 'placeholder',
    '[class]': "color() ? 'bg-' + color() : ''",
    '[class.placeholder-xs]': "size() === 'xs'",
    '[class.placeholder-sm]': "size() === 'sm'",
    '[class.placeholder-lg]': "size() === 'lg'",
    '[class.placeholder-glow]': "animation() === 'glow'",
    '[class.placeholder-fade]': "animation() === 'fade'",
  },
  standalone: false
})
export class PlaceholderDirective {
  color = input<Color | undefined>(undefined, { alias: 'placeholder-color' });
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md', { alias: 'placeholder-size' });
  animation = input<'glow' | 'fade' | 'none'>('none', { alias: 'placeholder-animation' });
}
