/* Módulos */
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

/* Model Categoria */
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

router.get('/registro',function(req, res){
    res.render("usuarios/registro")
})

router.get('/login',function(req, res){
    res.render("usuarios/login")
})

router.post('/registro', function (req, res) {
    
    var erros = []

    if (!req.body.nome) {
        erros.push({texto: 'Nome Inválido!'})
    }
    if (!req.body.email) {
        erros.push({texto: 'Email Inválido!'})
    }   
    if (!req.body.senha) {
        erros.push({texto: 'Senha Inválida!'})
    }         
    if (req.body.senha != req.body.senha2) {
        erros.push({texto: 'Senha Não Indentica!'})
    }

    if (erros.length > 0) {
        res.render('usuarios/registro',{erros: erros})
    }
    else { 
       Usuario.findOne({email: req.body.email}).then(function(usuario) {

        if (usuario) {
            req.flash ("error_msg","Já Existe E-mail Cadastrado! ")
            res.redirect('usuario/registro')
        }
        else {
            const novoUsuario = new Usuario({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            })

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.senha, salt);   

                Usuario.create({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: hash
                }).then(function(){
                    req.flash("success_msg","Usuário Criado com Sucesso!")
                    res.redirect('/')
                }).catch(function(erro){
                    req.flash("error_msg","Erro Ao Criar Usuário: "+ erro)
                    res.redirect('/usuario/registro')
                })
        }

       }).catch(function(erro){
            req.flash("error_msg","Erro ao Buscar Email: "+ erro)
            res.redirect('/usuario/registro')
        })
    }
    

})

module.exports = router