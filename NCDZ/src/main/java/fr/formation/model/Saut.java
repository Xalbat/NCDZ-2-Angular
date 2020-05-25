package fr.formation.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonView;

import fr.formation.projection.Views;



@Entity
@Table(name = "saut")
public class Saut {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonView(Views.Common.class)
	private int idSaut;
	
	@ManyToOne
	@JoinColumn(name = "id_vol")
	@NotNull
	@JsonView(Views.Saut.class)
	private Vol vol;
	
	@Column(name = "altitude")
	@NotNull
	@JsonView(Views.Saut.class)
	private int altitude;
	
	@OneToMany
	@JoinColumn(name = "list_parachutiste")
	@NotNull
	@JsonView(Views.Saut.class)
	private List<Parachutiste> listParachutiste = new ArrayList<Parachutiste>();
	
	@Column
	@NotNull
	@JsonView(Views.Saut.class)
	private boolean tandem;

	//___________________________________________________________
	
	public int getIdSaut() {
		return this.idSaut;
	}
	public void setIdSaut(int idSaut) {
		this.idSaut = idSaut;
	}
	public Vol getVol() {
		return this.vol;
	}
	public void setVol(Vol vol) {
		this.vol = vol;
	}
	public int getAltitude() {
		return this.altitude;
	}
	public void setAltitude(int altitude) {
		this.altitude = altitude;
	}
	public List<Parachutiste> getListParachutiste() {
		return this.listParachutiste;
	}
	public void setListParachutiste(List<Parachutiste> listParachutiste) {
		this.listParachutiste = listParachutiste;
	}
	public boolean isTandem() {
		return this.tandem;
	}
	public void setTandem(boolean tandem) {
		this.tandem = tandem;
	}
	
	
	
}
