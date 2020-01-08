import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[scrollIntoView]'
})
export class LoadedDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }


  ngOnInit() {
    this.elementRef.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

}
