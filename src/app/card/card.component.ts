import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ICard } from './card.interface';

@Component({
  selector: 'jmw-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  host: {'class': 'text-center shadow-xl rounded-b-lg text-white'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
  @Input() station!: ICard

  constructor() { }

  ngOnInit(): void {

  }

}
