export interface Person {
  ID: string;
  NAME: string;
  LAST_NAME: string;
  EXPORT: "Y" | "N"; 
  ASSIGNED_BY_ID: string; 
  DATE_CREATE: string;
  BIRTHDATE:string;
  EMAIL: Email[];
}

interface Email {
  ID: string;
  VALUE_TYPE: "WORK" | string; 
  VALUE: string;
  TYPE_ID: "EMAIL";
}
