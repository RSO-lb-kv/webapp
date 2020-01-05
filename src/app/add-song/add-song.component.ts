import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ImageUploadService } from '../services/image-upload.service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})
export class AddSongComponent implements OnInit {
  imageUrl: string;
  songForm: FormGroup;
  formInvalid: boolean;

  constructor(
    private imageUploadService: ImageUploadService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.songForm = this.formBuilder.group({
      createdBy: ["", Validators.required],
      title: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  uploadImage(event) {
    if (!event.target || !event.target.files[0])
      return;

    const img = event.target.files[0];
    if (img.type.substring(0, 5) === 'image')
      this.imageUploadService.uploadFile(img).subscribe(
        ({ imageUrl }) => this.imageUrl = imageUrl
      );
  }

  removeImage() {
    this.imageUrl = null;
  }

  saveSong() {
    if (this.songForm.invalid) {
      this.songForm.markAllAsTouched();
      this.formInvalid = true;
      return;
    }
    else {
      this.formInvalid = false;
    }
  }


  home() {
    this.router.navigate(['/home']);
  }

  get createdBy() {
    return this.songForm.get('createdBy');
  }
  get title() {
    return this.songForm.get('title');
  }
  get description() {
    return this.songForm.get('description');
  }

}
