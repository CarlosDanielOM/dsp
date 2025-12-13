import { Codes } from "./codes";

export interface Building {
    id: string;
    address: string;
    name: string;
    accessCode: Codes[];
    lockerCodes: Codes[];
    notes: string;
}
