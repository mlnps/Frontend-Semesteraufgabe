import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { BackendService } from '../backend.service';
import {Router} from '@angular/router';



let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let createPostArea = document.querySelector('#create-post');



 
    







@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  formGroup!: FormGroup;
  imageBase64!: '';

  constructor(private fb: FormBuilder, private bs: BackendService, private router: Router) {
    // constructor function
  }

  



  ngOnInit(): void {
    this.formGroup = this.fb.group({
      inp_title: ['', Validators.required],
      inp_location: ['', Validators.required],
      inp_image: ['', Validators.required]
    });
  }

  get inp_title(): FormControl {
    return this.formGroup.get('inp_title') as FormControl;
  }

  get inp_location(): FormControl {
    return this.formGroup.get('inp_location') as FormControl;
  }

  get inp_image(): FormControl {
    return this.formGroup.get('inp_image') as FormControl;
  }

  onSubmit(): void
  {
    const plant = {
      id : null,
      title: this.inp_title.value,
      location: this.inp_location.value,
      image: this.imageBase64
    }
    console.log('plant : ', plant);
    this.bs.addPlant(plant)
      .then( res => {
        console.log(res);
      })

      this.router.navigateByUrl('/')
  }

  uploadFileEvt(imgFile: any): void {
    console.log('upload', imgFile.target.files);
    if (imgFile.target.files && imgFile.target.files[0]) {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {

          // Return Base64 Data URL
          const imgBase64Path = e.target.result;
          console.log('base64', imgBase64Path);
          this.imageBase64 = imgBase64Path.substr(imgBase64Path.indexOf(',') + 1);

        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);

    }
  }

}

