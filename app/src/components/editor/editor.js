import axios from "axios";
import React, {Component} from "react";
import '../../helpers/iframeLoader'
import DOMHelper from "../../helpers/dom-helper";
import EditorText from "../editorText";
import UIkit from 'uikit'

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html'
        this.state = {
            pageList: [],
            newPageName: ''
        }

        this.createNewPage = this.createNewPage.bind(this)
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page) {
        this.iframe = document.querySelector("iframe");
        this.open(page);
        this.loadPageList();
    }

    open(page) {
        this.currentPage = page;

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then(res => DOMHelper.parseStrToDom(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then(html => axios.post('./api/saveTempPage.php', {html}))
            .then(() => this.iframe.load('../temp.html'))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
    }

    save(onSucces, onError) {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom)
        const html = DOMHelper.serializeDOMToString(newDom)
        axios
            .post('./api/savePage.php', {'pageName': this.currentPage, html})
            .then(onSucces)
            .catch(onError)
    }

    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
            const id = element.getAttribute('nodeid');
            const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`)

            new EditorText(element, virtualElement)
        })
    }

    injectStyles() {
        const style = this.iframe.contentDocument.createElement('style')
        style.innerHTML = `
        text-editor:hover {
          outline: 3px solid orange;
          outline-offset: 8px;
        }

        text-editor:focus {
          outline: 3px solid red;
          outline-offset: 8px;
        }
      `

        this.iframe.contentDocument.head.appendChild(style)
    }

    loadPageList() {
        axios.get('./api').then(res => this.setState({pageList: res.data}))
    }

    createNewPage() {
        axios.post('./api/createNewPage.php', {
            name: this.state.newPageName
        }).then(res => this.loadPageList())
            .catch(e => alert('Страница уже существует!'))
    }

    deletePage(page) {
        axios.post('./api/deletePage.php', {
            "name": page
        }).then(res => this.loadPageList())
            .catch(e => alert('Страницы не существует!'))
    }

    render() {
        const modal = true;

        return (
            <>
                <iframe src={this.currentPage}/>

                <div className='panel'>
                    <button
                        className="uk-button uk-button-primary"
                        // uk-toggle='target: #modal-save'
                        onClick={() => this.save(
                            () => {
                                UIkit.notification({message: 'Успешно сохранено', status: 'success'})
                            },
                            () => {
                                UIkit.notification({message: 'Ошибка сохранения', status: 'danger'})
                            }
                        )}>Опубликовать
                    </button>
                </div>

                {/*<div id="modal-save" uk-modal={modal.toString()}>*/}
                {/*<div className="uk-modal-dialog uk-modal-body">*/}
                {/*        <h2 className="uk-modal-title">Сохранение</h2>*/}
                {/*        <p>Вы действительно хотите сохранить изменения?</p>*/}
                {/*        <div className="uk-text-right">*/}
                {/*            <button*/}
                {/*                className="uk-button uk-button-default uk-modal-close" type="button">Отменить*/}
                {/*            </button>*/}
                {/*            <button*/}
                {/*                className="uk-button uk-button-primary"*/}
                {/*                type="button"*/}
                {/*            >Сохранить</button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </>
        )
    }
}