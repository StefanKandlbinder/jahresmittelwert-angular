import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jmw-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() label!: string;

  constructor() {}

  ngOnInit(): void {}
}
