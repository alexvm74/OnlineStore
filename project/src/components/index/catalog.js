class initCatalog {
    constructor() {
        this.items = [];
        this.container = null;
        this.basket = null;
        this.url = 'https://raw.githubusercontent.com/kellolo/static/master/JSON/catalog.json';
    }

    init(basket) {
        this.container = document.querySelector('#catalog');
        this.basket = basket;
        this._get(this.url)            // выполняем запрос,
            .then(catalog => {         // затем
                this.items = catalog;  // заполняем список,
                this._render();        // рендерим его
                this._handleEvents();  // и обрабатываем кнопки добавления товаров в корзину
            })
    }

    async _get(url) {
        return await fetch(url).then(r => r.json()); // сделает запрос за джейсоном,
        // дождётся ответа и преобразует джейсон в объект, который вернётся из данного метода.
    }

    // async _fetchGoods(url) {
    //     try { // если всё ok
    //         return await fetch(url).then(r => r.json());
    //     } catch (e) { // при ошибке
    //         console.error(e);
    //     } finally {  // завершение
    //         // console.log('end fetched');
    //     }
    // }

    _render() {
        let htmlStr = '';
        this.items.forEach(item => {
            htmlStr += this._renderCatalogTemplate(item);
        });
        this.container.innerHTML = htmlStr;
    }

    _handleEvents() {
        this.container.addEventListener('click', event => {
            if (event.target.name == 'add') {
                let id = event.target.dataset.id; // from data-id
                let item = this.items.find(el => el.productId == id);
                this.basket.add(item);  // add(item) from basket.js
            }
        });
    }

    _renderCatalogTemplate(item) {
        return `
            <div class="featuredItem">
                <div class="featuredImgWrap">
                    <div class="featuredBuy">
                        <button name="add" data-id="${item.productId}">
                            <img src="../src/assets/images/addToCart.png" alt="">
                            Add to Cart
                        </button>
                    </div>
                    <img class="featuredProduct" src="${item.productImg}" alt="img">
                </div>
                <div class="featuredNameAndPrice">
                    <div class="featuredItemName">
                        ${item.productName}
                    </div>
                    <div class="featuredItemPrice">$${item.productPrice}</div>
                </div>
            </div>
        `
    }
}
