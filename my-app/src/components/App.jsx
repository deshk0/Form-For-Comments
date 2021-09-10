import React from 'react';


export default class App extends React.Component{
    constructor(){
        super()

        this.state = {
            comments: [

            ],
            currentPage: 'Загрузка...',
            lastPage: 'no',

            validMessage_1: '',
            validMessage_2: '',

            pages: [

            ]
        }
    }

    componentDidMount(){
        let commentsField = document.getElementsByClassName('comments-field')
        let pages = []

        fetch(`https://jordan.ashton.fashion/api/goods/30/comments`)
        .then(response => response.json())
        .then(res => {
            this.setState({
                
                currentPage: res.last_page,
                lastPage: res.last_page

            })
        })
        .then( res => {
            fetch(`https://jordan.ashton.fashion/api/goods/30/comments?page=${this.state.lastPage}`)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    comments: res.data,
                    
                    currentPage: res.current_page,
                    lastPage: res.last_page

                })
            })
            .then(res => {
                this.state.comments.forEach(function(item){
                    commentsField[0].innerHTML += `
                        <div class = 'comment-box'>
                            <div class = "comment-box-name"><em>${item.name}:</em></div>
                            <div class = "comment-box-text">${item.text}</div>
                        </div>
                    `
                })
            })
            .then(res => {
                for(let i = 1; i <= this.state.lastPage; i++){
                    pages.push(<input onClick = {this.pagination = this.pagination.bind(this)} type = 'button' value = {i} readOnly = 'readonly' className = 'comments-pagination-pages-input' />)
                }
            })
            .then(res => {
                this.setState({
                    pages: pages
                })
            })
        })
        .catch(err => {
            commentsField[0].innerHTML = 
                `
                    <div class = 'comment-box'>
                        <h1>Упс, кажеться сервер не работает, попробуйте позже )</h1>
                    </div>
                `
        })
    }

    addComment(){
        let commentsField = document.getElementsByClassName('comments-field')

        let userName = document.getElementById('form-name')
        let userText = document.getElementById('form-text')

        
        let user = {
            name: userName.value,
            text: userText.value
        };
          
        if(user.name !== '' && user.text !== ''){
            fetch('https://jordan.ashton.fashion/api/goods/30/comments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
              body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(res => {
                commentsField[0].innerHTML += `
                    <div class = 'comment-box'>
                        <div class = "comment-box-name"><em>${user.name}:</em></div>
                        <div class = "comment-box-text">${user.text}</div>
                    </div>
                `

            })
            .catch(err => {
                commentsField[0].innerHTML = 
                    `
                        <div class = 'comment-box'>
                            <h1>Сервер по прежнему не работает )</h1>
                        </div>
                    `
            })
        }else{
            if(user.name === ''){
                this.setState({
                    validMessage_1: '*это обязательное поле'
                })
            }
            
            if(user.text === ''){
                this.setState({
                    validMessage_2: '*это обязательное поле'
                })
            }
        }
        

    }

    moreComments(e){
        e.preventDefault()
        let commentsField = document.getElementsByClassName('comments-field')

        if(this.state.currentPage > 1){
            fetch(`https://jordan.ashton.fashion/api/goods/30/comments?page=${this.state.currentPage}`)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    currentPage: this.state.currentPage - 1
                })
            })
            .then(res => {
                fetch(`https://jordan.ashton.fashion/api/goods/30/comments?page=${this.state.currentPage}`)
                .then(response => response.json())
                .then(res =>{
                    this.setState({

                        comments: res.data,

                    })
                })
                .then(res => {
                    this.state.comments.forEach(function(item){
                        commentsField[0].innerHTML += `
                            <div class = 'comment-box'>
                                <div class = "comment-box-name"><em>${item.name}:</em></div>
                                <div class = "comment-box-text">${item.text}</div>
                            </div>
                        `
                    })
                })
            })
            .catch(err => {
                commentsField[0].innerHTML = 
                    `
                        <div class = 'comment-box'>
                            <h1>ХВАТИТ ПРОБОВАТЬ СЕРВЕР НЕ ОТВЕЧАЕТ СКАЗАЛИ ЖЕ )</h1>
                        </div>
                    `
            })
        }
    }
    
    pagination(event){
        let current = Number(event.target.value)
        let commentsField = document.getElementsByClassName('comments-field')        

        
        fetch(`https://jordan.ashton.fashion/api/goods/30/comments?page=${current}`)
        .then(response => response.json())
        .then(res => {
            this.setState({

                comments: res.data,
                currentPage: current

            })
        })
        .then(res => {
            this.state.comments.forEach(function(item){
                commentsField[0].innerHTML = `
                    
                `
            })
        })
        .then(res => {
            this.state.comments.forEach(function(item){
                commentsField[0].innerHTML += `
                    <div class = 'comment-box'>
                        <div class = "comment-box-name"><em>${item.name}:</em></div>
                        <div class = "comment-box-text">${item.text}</div>
                    </div>
                `
            })
        })
        .catch(err => {
            commentsField[0].innerHTML = 
                `
                    <div class = 'comment-box'>
                        <h1>Упс, кажеться сервер не работает, попробуйте позже )</h1>
                    </div>
                `
        })

    }

    render(){
        return(
            <div className = 'container'>
                <div>
                    <h2>Комментарии от разработчиков</h2>
                    <h4>
                        Вы даже не представляете что здесь можно найти)
                    </h4>

                    <p>Страница {this.state.currentPage}</p>
                    <div className = "comments-field">
                        <div class = 'comment-box'>
                            
                        </div>
                    </div>
                    <div className = "comments-more">
                        <a  href='/' onClick = {this.moreComments = this.moreComments.bind(this)} >
                            Еще комменты
                        </a>
                    </div>
                    
                    <div className = "comments-pagination">
                        <div className = "comments-pagination-pages">
                            {this.state.pages}
                        </div>
                    </div>
                </div>
                <div className = "form-container">
                    <h5>Не забудте оставить свой комментарий на память )</h5>
                    <div className = 'Form'>
                        <div className="form-inpt-box">
                            <label className = 'form-label'>Ваше имя</label>
                            <input className="form-inpt-box-input" id = 'form-name' placeholder = 'Имя' type='text' name = 'name' />
                            <div className = 'validation'>{this.state.validMessage_1}</div>

                        </div>
                        <div className="form-inpt-box">
                            <label className = 'form-label'>Введите комментарий</label>
                            <textarea className="form-inpt-box-input" id = 'form-text' placeholder = 'Текст' type='text' />
                            <div className = 'validation'>{this.state.validMessage_2}</div>

                        </div>
                        <button className = 'form-button' onClick = {this.addComment = this.addComment.bind(this)}>Отправить</button>
                    </div>
                </div>
            </div>
        )
    }
}