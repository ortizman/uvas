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
  private uvasAnual: Array<any> = [];

  private uvasUltMes: Array<any> = [];

  constructor(private http: Http) {
    this.getUvasAnual();
    this.getUvasUltimoMes();
  }

  getUvasAnual() {
    this.http.get(env.api + '/api/uvas/lastYear?filter[limit]=12&filter[order]=id%20ASC').subscribe(data => {
      this.uvasAnual = data.json();
      this.lineChartData[0].data = this.uvasAnual.filter(uva => new Date(uva.fecha).getDate() == 1).map(uva => uva.valor);
      this.lineChartData[1].data = this.uvasAnual.filter(uva => new Date(uva.fecha).getDate() != 1).map(uva => uva.valor);

      this.lineChartLabels = this.uvasAnual.filter(uva => new Date(uva.fecha).getDate() == 1).map(uva => new Date(uva.fecha).toLocaleString(navigator.language, {month: "long"}) );
    });
  }

  getUvasUltimoMes() {
    var today = new Date();
    let currentDate = today.getFullYear() + '-' + (today.getMonth()) + '-01';
    this.http.get(env.api + '/api/uvas?filter[order]=id%20ASC&filter[where][fecha][gt]=' + currentDate).subscribe(data => {
      this.uvasUltMes = data.json();
      this.lineChartDataUltMes[0].data = this.uvasUltMes.reverse().map(uva => uva.valor);
      this.lineChartLabelsUltMes = this.uvasUltMes.map(uva => uva.fecha.split('T')[0]);
    });
  }

  // Anual
  public lineChartData: Array<any> = [
    { data: [], label: 'Principio de Mes' },
    { data: [], label: 'Fin de Mes'}
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'bar';


  // Mensual
  public lineChartDataUltMes: Array<any> = [
    { data: [], label: 'Ultimo Mes' }
  ];
  public lineChartLabelsUltMes: Array<any> = [];
  public lineChartOptionsUltMes: any = {
    responsive: true
  };

  public lineChartLegendUltMes: boolean = true;
  public lineChartTypeUltMes: string = 'bar';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
