import { Component, OnInit } from '@angular/core';
import { BackendService, Plant } from '../backend.service';
import { DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allPlants!: Plant[];

  constructor(
    private bs: BackendService,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {
    this.bs.getAll()
      .then( res => {   //dieses then könnte man sich auch sparen; siehe zweites..
        console.log(res);
        return res;
      })
      .then( arr => {
        this.allPlants = arr;
        arr.forEach(el => console.log(el))
      })
      .catch(( err => {
        console.log(err);
      }))
  }

  imageSrc(base64code: string): SafeResourceUrl {
    const src = 'data:image/png;base64,'+base64code;
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

}



