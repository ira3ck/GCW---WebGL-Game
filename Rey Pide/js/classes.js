class Pickable {
    constructor(objeto, reco, seguirA, entregado) {
      this.Objeto = objeto;
      this.Recogido = reco;
      this.Seguir = seguirA;
      this.Entregado = entregado;
    }
    
}

class Player {
    constructor(Score, Battery, Nitro){
        this.Bateria = Battery;
        this.Puntaje = Score;
        this.Turbo = Nitro;
        this.Aturdido = false;
        this.Descargado= false;
    }
}