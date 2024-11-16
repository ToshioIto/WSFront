export class Registro {
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
