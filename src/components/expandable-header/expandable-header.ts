import { Component, ElementRef, Renderer, Input, QueryList, ContentChildren } from '@angular/core';
import { Content, Item, DomController } from "ionic-angular";

/**
 * Generated class for the ExpandableHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'expandable-header',
  templateUrl: 'expandable-header.html'
})
export class ExpandableHeaderComponent {

  @ContentChildren(Item, {read: ElementRef}) headerItems: QueryList<ElementRef>;
  @Input('scrollArea') scrollArea: Content;

  headerHeight: number = 0;

  constructor(
    private element: ElementRef,
    private renderer: Renderer,
    private domCtrl: DomController
  ) {

  }

  ngAfterViewInit(){

    this.domCtrl.read(() => {

      this.headerItems.forEach((item) => {
        this.headerHeight += item.nativeElement.clientHeight;
      });

      this.headerHeight += 10;

    });

    this.domCtrl.write(() => {

      this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');

      this.headerItems.forEach((item) => {

        this.renderer.setElementStyle(item.nativeElement, 'transition', 'opacity 0.5s linear');

      });

    });

    this.scrollArea.ionScroll.subscribe((event) => {
      this.resizeHeader(event);
    });
  }

  resizeHeader(event) {

      let itemsToHide = [];
      let itemsToShow = [];
      let newHeaderHeight = this.headerHeight - event.scrollTop;

      if (newHeaderHeight < 0) {
        newHeaderHeight = 0;
      }

      this.domCtrl.read(() => {

        this.headerItems.forEach((item) => {

          let totalHeight = item.nativeElement.offsetTop + item.nativeElement.clientHeight;

          if(totalHeight > newHeaderHeight) {
            itemsToHide.push(item);
          } else if (totalHeight <= newHeaderHeight) {
            itemsToShow.push(item);
          }

        });

      });

      this.domCtrl.write(() => {

        this.renderer.setElementStyle(this.element.nativeElement, 'height', newHeaderHeight + 'px');

        for(let item of itemsToHide) {
          this.renderer.setElementStyle(item.nativeElement, 'opacity', '0');
        }

        for(let item of itemsToShow) {
          this.renderer.setElementStyle(item.nativeElement, 'opacity', '0.7');
        }

      });

  }
}
