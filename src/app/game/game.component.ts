import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';

import { Gamelogic } from '../gamelogic';
import { MarvelApiService } from '../services/marvelapi.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [Gamelogic]
})
export class GameComponent implements OnInit {
  buttonValidate: boolean;

  namePlayerOne: string;
  thumbnailPlayerOne: string;

  namePlayerTwo: string;
  thumbnailPlayerTwo: string;

  constructor(public game: Gamelogic, private marvelApi: MarvelApiService) { }

  ngOnInit(): void {   
  }

  mountPlayer(data: Object): number {
    let path: string = (data['data']['results'][0]['thumbnail']['path']);
    let extension: string = (data['data']['results'][0]['thumbnail']['extension']);
    let thumbnail: string = `${path}/standard_medium.${extension}`;

    if(this.namePlayerOne === undefined){
      this.thumbnailPlayerOne = thumbnail;
      this.namePlayerOne = (data['data']['results'][0]['name']);
    } else {
      this.thumbnailPlayerTwo = thumbnail;
      this.namePlayerTwo = (data['data']['results'][0]['name']);

      this.startGame();
    }
    return 0;
  }

  EmptyValidate(value: string, i: number): boolean {
    let msg = 'Campo obrigatório';
    if(value === "" ){
      const information = document.querySelectorAll('.validator');
      information.item(i).innerHTML = msg;
      const teste = document.querySelectorAll('.input');
      teste.item(i).classList.add('input-validator');
      return false;
    } else {
      msg = '';
      const information = document.querySelectorAll('.validator');
      information.item(i).innerHTML = msg;
      const teste = document.querySelectorAll('.input');
      teste.item(i).classList.remove('input-validator');
    }
    return true;
  }

  dataValidate(data: Object): boolean{
    if(data['data']['total'] === 0){
      return false;
    }
    else{
      return true;
    }
  }

  getCharacterByName(namePlayerOne: string, namePlayerTwo: string): boolean {
    this.marvelApi.getCharacterByName(namePlayerOne).subscribe(
      (dataPlayerOne) => {
        this.marvelApi.getCharacterByName(namePlayerTwo).subscribe(
          (dataPlayerTwo) => {
            let validateOne = this.dataValidate(dataPlayerOne);
            let validateTwo = this.dataValidate(dataPlayerTwo);
            if( validateOne === true && validateTwo === true ){
              this.mountPlayer(dataPlayerOne);
              this.mountPlayer(dataPlayerTwo);
            } else {
              let element = document.querySelectorAll('.validator')
              if( validateOne === false )
                element.item(0).innerHTML = 'Nome de personagem Marvel inválido.';
              if( validateTwo === false )
                element.item(1).innerHTML = 'Nome de personagem Marvel inválido.';
              return false;
            }
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );

    return true;
  }

  startGame(): void {
    this.game.gameStart();
    if(this.game.currentTurn === 1){
      const currentPlayer = `É a vez do jogador <span class="accent">${this.namePlayerOne}</span>`;
      const information = document.querySelector('.current-status');
      information.innerHTML = currentPlayer;
    } else {
      const currentPlayer = `É a vez do jogador <span class="accent">${this.namePlayerTwo}</span>`;
      const information = document.querySelector('.current-status');
      information.innerHTML = currentPlayer;
    }
  }

  async clickSubfield( subfield: any ): Promise<void> {
    if (this.game.gameStatus === 1) {
      const i = subfield.currentTarget.getAttribute('i');
      const j = subfield.currentTarget.getAttribute('j');
      const information = document.querySelector('.current-status');

      this.game.setField(i, j, this.game.currentTurn)
      const symbol = this.game.getSymbol();

      let id = subfield.currentTarget.id;
      document.querySelector(`#${id}`).innerHTML = `<p class="my-auto mx-auto">${symbol}</p>`;
      document.querySelector(`#${id}`).classList.add('no-click');

      await this.game.checkGameEndWinner().then ( (end: boolean) => {
        if(this.game.gameStatus === 0 && end === true) {
          this.game.increase(this.game.currentTurn);
          if(this.game.currentTurn === 1){
            information.innerHTML = `O jogador ${this.namePlayerOne} venceu ! <br><br>
            <img src="${this.thumbnailPlayerOne}" alt="Personagem marvel ${this.namePlayerOne}"> `;
          }
          else {
            information.innerHTML = `O jogador ${this.namePlayerTwo} venceu ! <br><br>
            <img src="${this.thumbnailPlayerTwo}" alt="Personagem marvel ${this.namePlayerTwo}">`;
          }
        }
      });

      await this.game.checkGameEndFull().then ( (end: boolean) => {
        if(this.game.gameStatus === 0 && end === true) {
          information.innerHTML = 'Deu velha, empate.';
        }
      });

      this.game.changePlayer();

      if(this.game.gameStatus === 1) {
        if(this.game.currentTurn === 1){
          const currentPlayer = `É a vez do jogador: <span class="accent">${this.namePlayerOne}</span>`;
          information.innerHTML = currentPlayer;

        } else {
          const currentPlayer = `É a vez do jogador: <span class="accent">${this.namePlayerTwo}</span>`;
          information.innerHTML = currentPlayer;
        }
      }
    }
  }
}