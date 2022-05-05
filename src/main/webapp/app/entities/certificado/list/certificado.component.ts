import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICertificado } from '../certificado.model';
import { CertificadoService } from '../service/certificado.service';
import { CertificadoDeleteDialogComponent } from '../delete/certificado-delete-dialog.component';

@Component({
  selector: 'jhi-certificado',
  templateUrl: './certificado.component.html',
})
export class CertificadoComponent implements OnInit {
  certificados?: ICertificado[];
  isLoading = false;

  constructor(protected certificadoService: CertificadoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.certificadoService.query().subscribe({
      next: (res: HttpResponse<ICertificado[]>) => {
        this.isLoading = false;
        this.certificados = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICertificado): number {
    return item.id!;
  }

  delete(certificado: ICertificado): void {
    const modalRef = this.modalService.open(CertificadoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.certificado = certificado;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
