import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CertificadoDetailComponent } from './certificado-detail.component';

describe('Certificado Management Detail Component', () => {
  let comp: CertificadoDetailComponent;
  let fixture: ComponentFixture<CertificadoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificadoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ certificado: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CertificadoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CertificadoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load certificado on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.certificado).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
