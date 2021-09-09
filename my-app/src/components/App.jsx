import React from 'react';


export default class App extends React.Component{
    constructor(){
        super()

        this.state = {
            comments: [

            ],
            currentPage: '',
            lastPage: 'no',

            validMessage_1: '',
            validMessage_2: '',

            pages: [

            ]
        }
    }

    componentDidMount(){
        let commentsField = document.getElementsByClassName('comments-field')
        let paginationContainer = document.getElementsByClassName('comments-pagination-pages')
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
    }

    onClick(){
        
        fetch(`https://jordan.ashton.fashion/api/goods/30/comments?page=${this.state.lastPage}`)
        .then(response => response.json())
        .then(res => console.log(res))
        console.log(this.state.comments)    
        console.log(this.state.currentPage)    
        console.log(this.state.lastPage)
    }

    addComment(){
        console.log('go')
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
            .then(res => console.log(res))
            .then(res => {
                commentsField[0].innerHTML += `
                    <div class = 'comment-box'>
                        <div class = "comment-box-name"><em>${user.name}:</em></div>
                        <div class = "comment-box-text">${user.text}</div>
                    </div>
                `

            })
        }else{
            if(user.name === ''){
                this.setState({
                    validMessage_1: 'Это обязательное поле'
                })
            }
            
            if(user.text === ''){
                this.setState({
                    validMessage_2: 'Это обязательное поле'
                })
            }
        }
        

    }
    moreComments(){
        console.log('more comments')
        console.log(this.state.lastPage)
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
        }
    }
    pagination(event){
        console.log(event.target.value)
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

    }

    render(){
        return(
            <div className = 'container'>
                <div>
                    <p>Страница {this.state.currentPage}</p>
                    <div className = "comments-field">
                        <div class = 'comment-box'>

                        </div>
                    </div>

                    <div onClick = {this.moreComments = this.moreComments.bind(this)} className = "comments-more">
                        Еще комменты
                    </div>
                    
                    <div className = "comments-pagination">
                        <div className = "comments-pagination-pages">
                            {this.state.pages}
                        </div>
                    </div>
                </div>
                <div className = "form-container">
                    <div className = 'Form'>
                        <div className="form-inpt-box">
                            <label>Ваше имя</label>
                            <input id = 'form-name' placeholder = 'Имя' />
                            {this.state.validMessage_1}

                        </div>
                        <div className="form-inpt-box">
                            <label>Введите комментарий</label>
                            <textarea id = 'form-text' placeholder = 'Текст' />
                            {this.state.validMessage_2}

                        </div>
                        <button onClick = {this.addComment = this.addComment.bind(this)}>Отправить</button>
                    </div>
                </div>
            </div>
        )
    }
}