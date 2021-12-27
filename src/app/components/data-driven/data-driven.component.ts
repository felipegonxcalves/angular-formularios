import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ValidatorsService} from '../../services/validators.service';

@Component({
  selector: 'app-data-driven',
  templateUrl: './data-driven.component.html',
  styleUrls: ['./data-driven.component.css']
})
export class DataDrivenComponent implements OnInit {

  myForm: FormGroup;

  states = [
    { nome: 'Bahia', sigla: 'BA' },
    { nome: 'São Paulo', sigla: 'SP' },
    { nome: 'Rio de Janeiro', sigla: 'RJ' },
    { nome: 'Paraná', sigla: 'PR' },
    { nome: 'Minas Gerais', sigla: 'MG' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private validatorService: ValidatorsService
  ) { }

  ngOnInit(): void {
    // this.myForm = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // });

    const fb = this.formBuilder;

    this.myForm = fb.group({
      informacoes: fb.group({
        nome: [null, [Validators.required, Validators.minLength(4), this.validatorService.nameValidation], [this.validatorService.userValidation.bind(this.validatorService)]],
        idade: [null],
        email: [null, [Validators.required, Validators.email]],
        confirmaEmail: [null],
        sexo: ['M'],
        empregado: [null, [Validators.pattern('true')]]
      }),
      endereco: fb.group({
        cep: [null],
        logradouro: [null],
        numero: [null],
        complemento: [null],
        bairro: [null],
        localidade: [null],
        uf: [null]
      })
    });

    this.myForm.get('informacoes.nome').valueChanges.subscribe(
      value => console.log('Nome alterado: ', value)
    );
    // this.myForm.valueChanges;

  }

  onSubmit() {
    console.log(this.myForm);
  }

  getAddress() {
    this.http.get(`http://viacep.com.br/ws/${this.myForm.get('endereco.cep').value}/json/`)
      .subscribe(
        endereco => {
                this.myForm.patchValue({endereco})
        }
      );
  }

}
