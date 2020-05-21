export class Music {
    constructor () {
        let self = this
        this.play = function (id) {
            // let tmp = document.getElementById(id)
            // console.log(tmp)
            // tmp.play()
            // let play = localStorage.get('music_switch')
            // console.log(play)
            // if (play !== 'OK') return
            // localStorage.setItem('music_switch', JSON.stringify(''))
            let audio = new Audio()
            audio.src = 'http://pubif.com/audio/' + id + '.mp3'
            audio.play()
        }
    }
}
