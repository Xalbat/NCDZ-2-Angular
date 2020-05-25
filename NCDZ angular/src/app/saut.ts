import { Vol } from './vol';
import { Parachutiste } from './parachutiste';

export class Saut {
    public vol: Vol;
    public parachutiste: Parachutiste;
    constructor(public idSaut?: number, public hauteur?: number, public tandem?: boolean ){}
}