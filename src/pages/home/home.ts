import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  letterObj = {
    to: '',
    from: '',
    text: ''
  }

  pdfObj = null;

  loading = null

  constructor(public navCtrl: NavController,
              private plt: Platform,
              private file: File,
              private fileOpener: FileOpener,
              public loadingController:LoadingController) {

    this.loading = this.loadingController.create({
      content: "Cargando..."
    });

  }

  createPdf() {
    // this.loading.present();
    var docDefinition = {
      content: [
        { text: 'Formato de muestra', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'De:', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'Para', style: 'subheader' },
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          text:'Andres Ramirez',
          style:'sign'
        },
        {
          text:'Mobile Developer',
          style:'sign'
        }

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        },
        sign:{
          fontSize: 14,
          margin:20
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    // this.loading.hide();
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }
}
