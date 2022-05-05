import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICertificado, Certificado } from '../certificado.model';
import { CertificadoService } from '../service/certificado.service';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { TurmaACCService } from 'app/entities/turma-acc/service/turma-acc.service';
import { Modalidade } from 'app/entities/enumerations/modalidade.model';
import { StatusCertificado } from 'app/entities/enumerations/status-certificado.model';
import { TipoAtividade } from 'app/entities/enumerations/tipo-atividade.model';

@Component({
  selector: 'jhi-certificado-update',
  templateUrl: './certificado-update.component.html',
})
export class CertificadoUpdateComponent implements OnInit {
  isSaving = false;
  modalidadeValues = Object.keys(Modalidade);
  statusCertificadoValues = Object.keys(StatusCertificado);
  tipoAtividadeValues = Object.keys(TipoAtividade);

  turmaACCSSharedCollection: ITurmaACC[] = [];

  editForm = this.fb.group({
    id: [],
    titulo: [],
    descricao: [],
    dataEnvio: [],
    observacao: [],
    modalidade: [],
    chCuprida: [],
    pontuacao: [],
    status: [],
    caminhoArquivo: [],
    tipo: [],
    turmaAcc: [],
  });

  constructor(
    protected certificadoService: CertificadoService,
    protected turmaACCService: TurmaACCService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ certificado }) => {
      if (certificado.id === undefined) {
        const today = dayjs().startOf('day');
        certificado.dataEnvio = today;
      }

      this.updateForm(certificado);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const certificado = this.createFromForm();
    if (certificado.id !== undefined) {
      this.subscribeToSaveResponse(this.certificadoService.update(certificado));
    } else {
      this.subscribeToSaveResponse(this.certificadoService.create(certificado));
    }
  }

  trackTurmaACCById(_index: number, item: ITurmaACC): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICertificado>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(certificado: ICertificado): void {
    this.editForm.patchValue({
      id: certificado.id,
      titulo: certificado.titulo,
      descricao: certificado.descricao,
      dataEnvio: certificado.dataEnvio ? certificado.dataEnvio.format(DATE_TIME_FORMAT) : null,
      observacao: certificado.observacao,
      modalidade: certificado.modalidade,
      chCuprida: certificado.chCuprida,
      pontuacao: certificado.pontuacao,
      status: certificado.status,
      caminhoArquivo: certificado.caminhoArquivo,
      tipo: certificado.tipo,
      turmaAcc: certificado.turmaAcc,
    });

    this.turmaACCSSharedCollection = this.turmaACCService.addTurmaACCToCollectionIfMissing(
      this.turmaACCSSharedCollection,
      certificado.turmaAcc
    );
  }

  protected loadRelationshipsOptions(): void {
    this.turmaACCService
      .query()
      .pipe(map((res: HttpResponse<ITurmaACC[]>) => res.body ?? []))
      .pipe(
        map((turmaACCS: ITurmaACC[]) =>
          this.turmaACCService.addTurmaACCToCollectionIfMissing(turmaACCS, this.editForm.get('turmaAcc')!.value)
        )
      )
      .subscribe((turmaACCS: ITurmaACC[]) => (this.turmaACCSSharedCollection = turmaACCS));
  }

  protected createFromForm(): ICertificado {
    return {
      ...new Certificado(),
      id: this.editForm.get(['id'])!.value,
      titulo: this.editForm.get(['titulo'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      dataEnvio: this.editForm.get(['dataEnvio'])!.value ? dayjs(this.editForm.get(['dataEnvio'])!.value, DATE_TIME_FORMAT) : undefined,
      observacao: this.editForm.get(['observacao'])!.value,
      modalidade: this.editForm.get(['modalidade'])!.value,
      chCuprida: this.editForm.get(['chCuprida'])!.value,
      pontuacao: this.editForm.get(['pontuacao'])!.value,
      status: this.editForm.get(['status'])!.value,
      caminhoArquivo: this.editForm.get(['caminhoArquivo'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
      turmaAcc: this.editForm.get(['turmaAcc'])!.value,
    };
  }
}
