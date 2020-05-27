import { Parachute } from './parachute';

export class Parachutiste {
    public parachute: Parachute;

    constructor(public numeroLicence?: number,
                public nom?: string, 
                public prenom?: string, 
                public niveau?: string, 
                public dateVisite?: Date,
                public id_parachute?: number) {
    }
}
