import { Component, OnInit } from '@angular/core';

import { Avion } from '../classes/avion';
import { Parachutiste } from '../classes/parachutiste';
import { Vol } from '../classes/vol';
import { AvionService } from '../services/avion.service';
import { VolService } from '../services/vol.service';
import { ParachutisteService } from '../services/parachutiste.service';
import { SautService } from '../services/saut.service';
import { Saut } from '../classes/saut';
import { Pilote } from '../classes/pilote';
import { PiloteService } from '../services/pilote.service';
import { EtatAvion } from '../enums/etat-avion.enum';
import { SituationVol } from '../enums/situation-vol.enum';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'composer-avion',
  templateUrl: './composer-avion.component.html',
  styleUrls: ['./composer-avion.component.css']
})
export class ComposerAvionComponent implements OnInit {

  public avion : Avion = null;
  public vol: Vol=null;

  public sauts: Array<Saut> = []
  public avions : Array<Avion> = [];
  public vols : Array<Vol> = [];
  public volsDispo : Array<Vol> = [];
  public volsIndispo : Array<Vol> = [];
  public pilotes: Array<Pilote> = [];

  volAltitudeMax: number;
  passagerVol: number;
  date: Date = null;
  
  vueVol=false;
  choixAvion = false;
  choixVol = false;
  choixSaut = false;
  okSaut = false;

  respoSol: Parachutiste=null;
  respoVol: Parachutiste=null;
  pilote: Pilote=null;

  constructor(public srvAvion:AvionService, 
              public srvVol: VolService, 
              public srvParachutiste: ParachutisteService,
              public srvSaut: SautService,
              public srvPilote: PiloteService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.listeAvions();
    this.listesVols();
    this.listesPara();
    this.listeSauts();
    this.listPilote();
  }

  listeAvions() {this.srvAvion.getAvions() ; setTimeout(() => this.avions=this.srvAvion.avions.filter(a => a.etat.toString==EtatAvion.DISPONIBLE.toString),500)}

  listesPara() {this.srvParachutiste.reload()}

  listeSauts() {this.srvSaut.loadCurrentSauts() ; setTimeout(() => this.sauts=this.srvSaut.sauts,500)}

  listPilote() {this.srvPilote.getPilote() ; setTimeout(() => this.pilotes=this.srvPilote.pilotes,500)}
  
  listesVols() {this.srvVol.getVol() ; setTimeout(() => this.vols=this.srvVol.vols,500); setTimeout(() => this.triListVol(),800)}


  affichageAvion(id) {

    if (this.choixAvion)
    {
      this.choixAvion=false;

      this.avion = null
      this.vol=null;

      this.vueVol=false;
      this.choixVol=false;
      this.choixSaut=false;
      this.okSaut=false;
    }
    else
    {
      this.choixAvion=true;
      this.avion = this.srvAvion.avions.find(a => a.idAvion == id)

      setTimeout( () => this.vol = this.srvVol.vols.find(v => v.idVol == id),200)

      if (this.avion?.vol!=null)
      {
        this.vueVol=true;
        this.vol=this.vols.find(v => v.idVol == this.avion.vol.idVol);
      }

    }
  }

  affichageVol(id) {
    if (this.choixVol)
    {
      this.choixVol=false;

      this.vol=null;

      this.vueVol=false;
      this.choixSaut=false;
      this.okSaut=false;
    }
    else 
    {
      this.choixVol=true;

      this.listesVols();

      setTimeout( () => this.vol = this.srvVol.vols.find(v => v.idVol == id),200)

      setTimeout(() => this.nombrePassager(),200);
      setTimeout(() => this.AltitudeMax(),200);
      
    }    
  }

  creationVol() {
    if (this.date==null)
    {
      alert("Choisissez une date valide")
    }
    else{
      this.vol=new Vol();
      this.vol.date=this.date;
      this.vol.situationVol=SituationVol.EN_ATTENTE;
      this.srvVol.addVol(this.vol);
      this.vol=null;
      this.date=null;
      setTimeout(() => this.listesVols(),250);
    }

  }

  ajouterSaut(saut) {
    saut.vol=this.vol;
    this.srvSaut.updateSaut(saut);

    this.vol.situationVol=SituationVol.EN_PREPARATION;
    this.vol.listSaut.push(saut);
    setTimeout(() => this.listesVols(),300)

    this.nombrePassager();
    this.AltitudeMax();
  }

  supprimerSaut(saut) {
    saut.vol=null;
    this.srvSaut.updateSaut(saut);

    for (let i=0 ; i<this.vol.listSaut.length ; i++) 
    {
      if (saut.idSaut==this.vol.listSaut[i].idSaut) {this.vol.listSaut.splice(i,1);break}
    }

    setTimeout(() => this.listesVols(),300)

    this.nombrePassager();
    this.AltitudeMax();
  }

  retirerSaut(s){
    this.vol.listSaut.splice(s,1)
  }

  triListVol() {
    this.volsDispo=[]
    this.volsIndispo=[]
    for (let v of this.vols)
    {
      let test=true;
      for (let a of this.avions)
      {
        if (a.vol?.idVol==v.idVol) {test=false}
      }
      if (test) {this.volsDispo.push(v)}
      else {this.volsIndispo.push(v)}
    }
  }

  sautDispo() {
    let tri: Array<Saut>=[];
    tri=tri.concat(this.sauts);

    for (let v of this.volsIndispo)
    {
      for (let s of v.listSaut)
      {
        for (let i=0; i<tri.length;i++)
        {
          if (tri[i].idSaut==s.idSaut) {tri.splice(i,1);break}
        }
      }
    }
    return tri;
  }

  nombrePassager() {
    this.passagerVol=0;
    for (let s of this.sauts)
    {
      if (s.vol?.idVol==this.vol?.idVol)
      {
        this.passagerVol=this.passagerVol+s.listParachutiste.length;
      }
    }
  }

  AltitudeMax() {
    this.volAltitudeMax=0;
    for (let s of this.sauts)
    {
      if (s.vol?.idVol==this.vol?.idVol)
      {
        if (s.altitude>this.volAltitudeMax) {this.volAltitudeMax=s.altitude}
      }
    }
  }

  validerSaut() {
    if (this.passagerVol>this.avion.capacite)
    {
      alert("Le vol a trop de passger pour l'avion")
    }
    else if (this.volAltitudeMax>this.avion.altitudeMax)
    {
      alert("L'avion ne peux pas monter si haut")
    }
    else if (this.checkDoublon())
    {
      this.choixSaut=true;

      this.respoSol=null;
      this.respoVol=null;
    }
  }

  checkDoublon() {
    for (let i=0 ; i<this.vol.listSaut.length -1 ; i++)
    {
      for (let p1 of this.vol.listSaut[i].listParachutiste)
      {
        for (let j=i+1 ; j<this.vol.listSaut.length ; j++)
        {
          for (let p2 of this.vol.listSaut[j].listParachutiste)
          {
            if (p1.numeroLicence==p2.numeroLicence) {alert("Le parachutiste "+ p1.nom + " " + p2.prenom +" est présent sur plusieurs sauts. Veuillez n'en choisir qu'un."); return false;}
          }
        }
      }
    }
    return true;
  }

  ListeInstructeurLibre() {
    return this.srvParachutiste.parachutistes.filter(p => p.niveau.toString() != "ELEVE" && p.listSaut.length==0)
  }

  ListeParachutiste() {
    let list: Array<Parachutiste>=[];
    for (let s of this.vol.listSaut)
    {
      for (let p of s.listParachutiste)
      {
        if (p.niveau!="ELEVE") {list.push(p);}
      }
    }
    return list;
  }

  listePiloteLibre() {
    let list: Array<Pilote>=[];
    let test: boolean;
    for (let i=0; i<this.pilotes?.length; i++)
    {
      test=true;
      for (let v of this.vols)
      {
        if (v.pilote?.licence==this.pilotes[i].licence) {test=false};
      }
      if (test) {list.push(this.pilotes[i]);}
    }
    return list
  }

  attributionRespoSol() {
    if (this.vol==null || this.respoSol==null) {alert('Choisissez un vol et un respo Sol')}
    else {
      let test= false;
      for (let v of this.vols)
      {
        if (this.respoSol.numeroLicence==v.respoVol?.numeroLicence) {test=true}
      }
      if (test) {alert('Ce respo Sol est déjà respoVol')}
      else
      {
        this.vol.respoSol=this.respoSol;
        for (let i=0; i<this.vols.length; i++)
        {
          if (this.vols[i].idVol==this.vol.idVol) {this.vols[i]=this.vol;break}
        }
        this.srvVol.updateVol(this.vol);
      }
    }
  }

  attributionRespoVol() {
    if (this.vol==null || this.respoVol==null) {alert('Choisissez un vol et un respo Vol')} 
    else {
      this.vol.respoVol=this.respoVol;
      for (let i=0; i<this.vols.length; i++)
      {
        if (this.vols[i].idVol==this.vol.idVol) {this.vols[i]=this.vol;break}
      }
      this.srvVol.updateVol(this.vol);
    }
  }

  attributionPilote() {
    this.vol.pilote=this.pilote;
    this.srvVol.updateVol(this.vol);
  }

  validationRespo() {
    this.okSaut=true;
  }

  verificationParachutiste() {

    for (let a of this.avions)
    {
      if (a.vol!=null )
      {
        for (let s1 of this.vols.find(v => a.vol.idVol==v.idVol).listSaut)
        {
          for (let p1 of s1.listParachutiste)
          {
            for (let s2 of this.vol.listSaut)
            {
              for (let p2 of s2.listParachutiste)
              {
                if (p2.numeroLicence==p1.numeroLicence) 
                {
                  alert ("Le parachutiste " + p1.nom + " " + p1.prenom + " est déjà dans un avion . Veuillez attendre qu'il finisse son saut.");
                  return false;
                }
              }
            }
          }
        }
      }
    }  
    return true;                
  }

  attributionVolAvion() {
    if (this.avion==null) {alert('Choissiez un avion !')}
    else if (this.vol==null) {alert('Choissiez un vol !')}
    else if (this.verificationParachutiste())
    {
      this.vol.situationVol=SituationVol.EMBARQUEMENT
      this.srvVol.updateVol(this.vol);
      this.avion.vol=this.vol;

      for (let i=0; i<this.avions.length; i++)
      {
        if (this.avions[i].idAvion==this.avion.idAvion) {this.avions[i]=this.avion;break}
      }
      
      this.srvAvion.updateAvion(this.avion);
    
      this.triListVol();

      this.choixAvion=false;
      this.avion=null;
      this.choixVol=false;
      this.vol=null;
      this.choixSaut=false;
      this.okSaut=false;
    }
  }

  retirerVol() {
    this.vol.situationVol=SituationVol.EN_PREPARATION

    this.volsDispo.push(this.vol)

    for (let i=0; i<this.volsIndispo.length; i++)
    {
      if (this.volsIndispo[i].idVol==this.vol.idVol) {this.volsIndispo.splice(i,1);break}
    }

    this.srvVol.updateVol(this.vols.find(v => v.idVol==this.avion.vol.idVol));

    this.avion.vol=null;
    this.srvAvion.updateAvion(this.avion);
    this
    this.vueVol=false;
    this.choixVol=false;
    this.choixAvion=false;
  }

}
