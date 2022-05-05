import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CertificadoService } from '../service/certificado.service';
import { ICertificado, Certificado } from '../certificado.model';
import { ITurmaACC } from 'app/entities/turma-acc/turma-acc.model';
import { TurmaACCService } from 'app/entities/turma-acc/service/turma-acc.service';

import { CertificadoUpdateComponent } from './certificado-update.component';

describe('Certificado Management Update Component', () => {
  let comp: CertificadoUpdateComponent;
  let fixture: ComponentFixture<CertificadoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let certificadoService: CertificadoService;
  let turmaACCService: TurmaACCService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CertificadoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CertificadoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CertificadoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    certificadoService = TestBed.inject(CertificadoService);
    turmaACCService = TestBed.inject(TurmaACCService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TurmaACC query and add missing value', () => {
      const certificado: ICertificado = { id: 456 };
      const turmaAcc: ITurmaACC = { id: 54012 };
      certificado.turmaAcc = turmaAcc;

      const turmaACCCollection: ITurmaACC[] = [{ id: 57904 }];
      jest.spyOn(turmaACCService, 'query').mockReturnValue(of(new HttpResponse({ body: turmaACCCollection })));
      const additionalTurmaACCS = [turmaAcc];
      const expectedCollection: ITurmaACC[] = [...additionalTurmaACCS, ...turmaACCCollection];
      jest.spyOn(turmaACCService, 'addTurmaACCToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      expect(turmaACCService.query).toHaveBeenCalled();
      expect(turmaACCService.addTurmaACCToCollectionIfMissing).toHaveBeenCalledWith(turmaACCCollection, ...additionalTurmaACCS);
      expect(comp.turmaACCSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const certificado: ICertificado = { id: 456 };
      const turmaAcc: ITurmaACC = { id: 54476 };
      certificado.turmaAcc = turmaAcc;

      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(certificado));
      expect(comp.turmaACCSSharedCollection).toContain(turmaAcc);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Certificado>>();
      const certificado = { id: 123 };
      jest.spyOn(certificadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: certificado }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(certificadoService.update).toHaveBeenCalledWith(certificado);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Certificado>>();
      const certificado = new Certificado();
      jest.spyOn(certificadoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: certificado }));
      saveSubject.complete();

      // THEN
      expect(certificadoService.create).toHaveBeenCalledWith(certificado);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Certificado>>();
      const certificado = { id: 123 };
      jest.spyOn(certificadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ certificado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(certificadoService.update).toHaveBeenCalledWith(certificado);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTurmaACCById', () => {
      it('Should return tracked TurmaACC primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTurmaACCById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
