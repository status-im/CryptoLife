import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dapp-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public itemId: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.itemId = this.activatedRoute.snapshot.params.itemId;
  }

}
