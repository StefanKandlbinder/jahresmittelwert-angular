import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ICard } from '../card/card.interface';

@Component({
  selector: 'jmw-card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeaderComponent implements OnInit {
  @Input() station!: ICard

  constructor() {}

  ngOnInit(): void {
  }

}
