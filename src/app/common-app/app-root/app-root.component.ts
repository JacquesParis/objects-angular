import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { isObject, isString } from 'lodash-es';

@Component({
  selector: 'app-app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss'],
})
export class AppRootComponent implements OnInit {
  @ViewChild('modalTemplate') modalTemplate: TemplateRef<any>;

  modalRef: BsModalRef;
  imgBgSrc: SafeResourceUrl;
  imgName: string;
  constructor(
    private modalService: BsModalService,
    private sanitization: DomSanitizer
  ) {
    window['showImg'] = this.showImg.bind(this);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-full' })
    );
  }
  ngOnInit(): void {}

  showImg(
    img:
      | {
          base64?: string;
          size?: string;
          name?: string;
          type?: string;
          id?: string;
          uri?: string;
        }
      | string
  ) {
    if (isString(img)) {
      this.imgBgSrc = this.sanitization.bypassSecurityTrustStyle(
        "url('" + img + "')"
      );
      this.imgName = 'Image';
      this.openModal(this.modalTemplate);
    } else if (isObject(img)) {
      img = img as {
        base64?: string;
        size?: string;
        name?: string;
        type?: string;
        id?: string;
        uri?: string;
      };
      this.imgBgSrc = this.getImgBackground(img);
      this.imgName = img.name ? img.name : 'Image';
      this.openModal(this.modalTemplate);
    }
  }

  public getImg(img: {
    base64?: string;
    size?: string;
    name?: string;
    type?: string;
    id?: string;
    uri?: string;
  }): SafeResourceUrl {
    return img.base64 && img.type
      ? this.sanitization.bypassSecurityTrustResourceUrl(
          'data:' + img.type + ';base64,' + img.base64
        )
      : this.sanitization.bypassSecurityTrustResourceUrl(img.uri);
  }

  public getImgBackground(img: {
    base64?: string;
    type?: string;
    uri?: string;
  }): SafeResourceUrl {
    return img?.base64 && img?.type
      ? this.sanitization.bypassSecurityTrustStyle(
          "url('" + 'data:' + img.type + ';base64,' + img.base64 + "')"
        )
      : this.sanitization.bypassSecurityTrustStyle("url('" + img?.uri + "')");
  }
}
