import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICertificado } from '../certificado.model';

@Component({
  selector: 'jhi-certificado-detail',
  templateUrl: './certificado-detail.component.html',
})
export class CertificadoDetailComponent implements OnInit {
  certificado: ICertificado | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ certificado }) => {
      this.certificado = certificado;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
