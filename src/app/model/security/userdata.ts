//Puedo obtener los detalles del usuario para mostrarlos en la API
export class UserData {
  id: number = 0;
  username: string = "";
  password: string = "";
  enabled: boolean = true;
  name: string = "";
  lastName: string = "";
  dni: string = "";
  birthDate: Date = new Date();
  email: string = "";
  roles: string[] = [];
  }