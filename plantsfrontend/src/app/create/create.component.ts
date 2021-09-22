import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { dataURItoBlob, blobToBase64 } from './utility';
import "@material/button/dist/mdc.button.css";

let createPostArea = <HTMLElement>document.querySelector('#create-post');
// let videoPlayer = <HTMLVideoElement>document.querySelector('player');

let imagePicker = <HTMLElement>document.querySelector('#image-picker');
// let imagePickerArea = <HTMLElement>document.querySelector('#pick-image');

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  formGroup!: FormGroup;
  imageBase64!: '';

  constructor(
    private fb: FormBuilder,
    private bs: BackendService,
    private router: Router
  ) {
    // constructor function
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      inp_title: ['', Validators.required],
      inp_location: ['', Validators.required],
      // inp_image: ['', Validators.required],
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

  initializeMedia() {
    const n = <any>navigator;

    if (!('mediaDevices' in n)) {
      n.mediaDevices = {};
    }
    if (!('getUserMedia' in n.mediaDevices)) {
      n.mediaDevices.getUserMedia = function (constraints: any) {
        var getUserMedia = n.webkitGetUserMedia || n.mozGetUserMedia;
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented'));
        }
        return new Promise(function (resolve, reject) {
          getUserMedia.call(n, constraints, resolve, reject);
        });
      };
    }

    n.mediaDevices
      .getUserMedia({ video: true })
      .then((stream: MediaProvider | null) => {
        const videoPlayer = <HTMLVideoElement>document.querySelector('#player');
        videoPlayer.srcObject = stream;
        videoPlayer.style.display = 'block';
      })
      .catch((err: MediaProvider | null) => {
        const imagePickerArea = <HTMLElement>(
          document.querySelector('#pick-image')
        );
        imagePickerArea.style.display = 'block';
      });
  }

  captureImage() {
    const canvasElement = <HTMLCanvasElement>document.querySelector('#canvas');
    const videoPlayer = <HTMLVideoElement>document.querySelector('#player');
    const captureButton = <HTMLElement>document.querySelector('#capture-btn');
    canvasElement.style.display = 'block';
    videoPlayer.style.display = 'none';
    captureButton.style.display = 'none';
    const context = <CanvasRenderingContext2D>canvasElement.getContext('2d');
    context.drawImage(
      videoPlayer,
      0,
      0,
      canvasElement.width,
      videoPlayer.videoHeight / (videoPlayer.videoWidth / canvasElement.width)
    );

    // @ts-ignore
    videoPlayer.srcObject.getVideoTracks().forEach((track: any) => {
      track.stop();
    });

    const picture = dataURItoBlob(canvasElement.toDataURL());
    blobToBase64(picture).then((res: any) => {
      const base64String = res.substr(res.indexOf(',') + 1);
      console.log('base64String', base64String);

      this.imageBase64 = base64String;
    });
  }

  openCreatePostModal() {
    createPostArea!.style.transform = 'translateY(0)';
    this.initializeMedia();
  }

  closeCreatePostModal() {
    createPostArea.style.transform = 'translateY(100vH)';
    // imagePickerArea.style.display = 'none';
    // videoPlayer.style.display = 'none';
    // canvasElement.style.display = 'none';
  }

  onSubmit(): void {
    const plant = {
      id: null,
      title: this.inp_title.value,
      location: this.inp_location.value,
      image: this.imageBase64,
    };
    console.log('plant : ', plant);
    this.bs.addPlant(plant).then((res) => {
      console.log(res);
    });

    this.router.navigateByUrl('/');
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
          this.imageBase64 = imgBase64Path.substr(
            imgBase64Path.indexOf(',') + 1
          );
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
    }
  }
}
