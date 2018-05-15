import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Http, Response } from "@angular/http";
import { environment as env } from '../environments/environment';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private apiUrl = env.api + '/api/uvas?filter[limit]=31&filter[order]=id%20ASC';
  private uvas: Array<any> = [];

  constructor(private http: Http) {
    this.getUvas();
  }

  getUvas() {
    this.http.get(this.apiUrl).subscribe(data => {
      this.uvas = data.json();
      this.lineChartData[0].data = this.uvas.reverse().map(uva => uva.valor);
      this.lineChartLabels = this.uvas.map(uva => uva.fecha.split('T')[0]);



    });
  }

  // lineChart
  public lineChartData: Array<any> = [
    { data: [], label: 'Valor UVA' }
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'bar';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
