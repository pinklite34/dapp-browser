;(function () {

    'use strict'

    const strRand = function ( count = 30 ) {
        let result = String()
        let words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
        let max = words.length - 1
    
        while ( count > 0 ) {
            let position = Math.floor( Math.random() * max )
            result += words.substring(position, position + 1)
            count--
        }
    
        return result
    }

    new Vue({
        el: '#app',
        data: {
            unic: strRand(),
            rooms: {},
            target: null,
            current: {},
        },
        methods: {
            getroom ( object ) {
                if ( !object || !object.room ) return

                for (const key in this.rooms) {
                    if ( object.room.toLowerCase() == this.rooms[key].name.toLowerCase() ) {
                        this.target = this.rooms[key].key
                        this.current = this.rooms[this.target]

                        API.Room.connect( this.target )

                        this.$nextTick(function () {
                            let container = document.getElementById( 'overflow' )
                            container.scrollTop = container.scrollHeight
                        })

                        break
                    }    
                }
            }
        },
        mounted () {
            API.Http.post('/web', {message_type: 'find'}, response => {
                let object = JSON.parse( response )
                let rooms = Object.assign({}, this.rooms)
                
                for (let i = 0; i < object.response.length; i++) {
                    rooms[object.response[i].key] = object.response[i]
                }

                this.rooms = rooms
            }, true)

            API.Room.message(response => {
                let object = JSON.parse( response )
                let message = object.message
                
                message.from = message.unic != this.unic 
                message.datetime = object.datetime
                message.username = object.username

                this.current.introtext = message.content
                this.current.messages.push( message )

                for (let i = 0; i < this.current.messages.length; i++) {
                    delete this.current.messages[i].unic
                }
                
                API.Http.post('/web', {message_type: 'update', where: {key: this.current.key}, message: this.current})
            })

            window.addEventListener('message', event => {
                this.getroom( event.data )
            })
        }
    })
})();