import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ICard } from '../card/card.interface';

@Component({
  selector: 'jmw-card-content',
  templateUrl: './card-content.component.html',
  styleUrls: ['./card-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardContentComponent implements OnInit {
  @Input() station!: ICard

  constructor() { }

  ngOnInit(): void {}

}
