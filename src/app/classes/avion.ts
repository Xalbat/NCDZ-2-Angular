import { SituationAvion } from '../enums/situation-avion.enum';
import { EtatAvion } from '../enums/etat-avion.enum';
import { Vol } from './vol';

export class Avion {

    constructor(
        public idAvion?: number,
        public altitudeMax?: number, 
        public capacite?: number, 
        public etat?: EtatAvion, 
        public matricule?: string, 
        public modele?: string, 
        public rotation?: number, 
        public rotationMax?: number, 
        public tempsMontee?: number, 
        public situation?: SituationAvion, 
        public vol?:Vol) 
        {}
}
