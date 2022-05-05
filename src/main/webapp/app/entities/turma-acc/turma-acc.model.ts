import dayjs from 'dayjs/esm';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { ICurso } from 'app/entities/curso/curso.model';

export interface ITurmaACC {
  id?: number;
  inicio?: dayjs.Dayjs | null;
  termino?: dayjs.Dayjs | null;
  usuarios?: IUsuario[] | null;
  cursos?: ICurso[] | null;
}

export class TurmaACC implements ITurmaACC {
  constructor(
    public id?: number,
    public inicio?: dayjs.Dayjs | null,
    public termino?: dayjs.Dayjs | null,
    public usuarios?: IUsuario[] | null,
    public cursos?: ICurso[] | null
  ) {}
}

export function getTurmaACCIdentifier(turmaACC: ITurmaACC): number | undefined {
  return turmaACC.id;
}
