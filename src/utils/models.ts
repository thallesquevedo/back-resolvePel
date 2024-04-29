export class ResponseWithoutDataModel {
  status: boolean;
  mensagem: {
    codigo: number;
    texto: string;
  };
}

export class ResponseListModel<T> extends ResponseWithoutDataModel {
  conteudo?: T[];
}

export class ResponseModel<T> {
  status: boolean;
  mensagem: {
    codigo: number;
    texto: string;
  };
  conteudo: T;
}
