import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ImageUploadService } from '../services/image-upload.service';
import { SongUploadService } from '../services/song-upload.service';

@Component({
  selector: "app-add-song",
  templateUrl: "./add-song.component.html",
  styleUrls: ["./add-song.component.scss"]
})
export class AddSongComponent implements OnInit {
  imageUrl: string;
  songForm: FormGroup;
  formInvalid: boolean;
  audioFile: File;
  uploading: boolean;
  afterUpload: boolean;

  constructor(
    private imageUploadService: ImageUploadService,
    private songUploadService: SongUploadService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.songForm = this.formBuilder.group({
      createdBy: ["", Validators.required],
      title: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  uploadImage(event) {
    if (!event.target || !event.target.files[0]) return;

    const img = event.target.files[0];
    if (img.type.substring(0, 5) === "image")
      this.imageUploadService
        .uploadFile(img)
        .subscribe(({ imageUrl }) => (this.imageUrl = imageUrl));
  }

  uploadSong(event) {
    if (!event.target || !event.target.files[0]) return;

    this.audioFile = event.target.files[0];
  }

  removeImage() {
    delete this.imageUrl;
  }

  saveSong() {
    if (this.uploading) {
      return;
    }
    if (this.songForm.invalid || !this.audioFile) {
      this.songForm.markAllAsTouched();
      this.formInvalid = true;
      return;
    } else {
      this.formInvalid = false;

      this.uploading = true;
      this.songUploadService
        .upload({
          file: this.audioFile,
          title: this.songForm.value.title,
          description: this.songForm.value.description,
          uploadedBy: this.songForm.value.createdBy,
          imageUrl: this.imageUrl
        })
        .subscribe(() => {
          this.uploading = false;
          this.afterUpload = true;
          delete this.imageUrl;
          delete this.audioFile;
          this.ngOnInit();
        });
    }
  }

  home() {
    this.router.navigate(["/home"]);
  }

  get createdBy() {
    return this.songForm.get("createdBy");
  }
  get title() {
    return this.songForm.get("title");
  }
  get description() {
    return this.songForm.get("description");
  }
}
