class initBasket {
    constructor() {
        this.items = [];
        this.total = null;
        this.url = 'https://raw.githubusercontent.com/kellolo/static/master/JSON/basket.json';
        this.wrapper = null;   // basket all
        this.container = null; // basket-items
        this.sum = 0; // сумма товара в корзине
        this.num = 0; // кол-во товара в корзине
        this.totalContainer = null;
    }

    init() {
        this.wrapper = document.querySelector('#basket-inner');
        this.container = document.querySelector('#basket-items');
        this.totalContainer = document.querySelector('#basket-sum');
        // async (асинхронный запрос для тестовой загрузки товаров в корзину по умолчанию)
        this._get(this.url)
            .then(basket => {
                this.items = basket.content;
                this._render();
                this._handleEvents();
            })
    }

    // _get(url) {
    //     return fetch(url).then(d => d.json()); // сделает запрос за джейсоном,
    //     // дождётся ответа и преобразует джейсон в объект, который вернётся из данного метода.
    // }

    async _get(url) {
        try { // если всё ok
            return await fetch(url).then(r => r.json());
        } catch (e) { // при ошибке
            console.error(e);
        } finally {  // завершение
            console.log('end fetched');
        }
    }

    _render() {
        let htmlStr = '';
        this.items.forEach(item => {
            htmlStr += this._renderBasketTemplate(item);
        });
        this.container.innerHTML = htmlStr;
        this._calcSum();
    }

    _calcSum() {
        this.sum = 0;
        this.num = 0;
        this.items.forEach(item => {
            this.sum += item.amount * item.productPrice;
            this.num += item.amount;
        });

        this.totalContainer.innerText = this.sum;
        num.innerText = this.num;
    }

    add(item) {
        let find = this.items.find(el => item.productId == el.productId);
        if (find) {
            find.amount++;
             this._addToBasket(); // temp для примера
        }
        else {
            this.items.push(Object.assign({}, item, { amount: 1 }));
        }

        this._render();
    }

    _remove(id) {
        let find = this.items.find(el => el.productId == id);
        if (find.amount > 1) {
            find.amount--;
        }
        else {
            this.items.splice(this.items.indexOf(find), 1);
        }

        this._render();
    }

    _handleEvents() {
        document.querySelector('#basket-btn').addEventListener('click', event => {
            this.wrapper.classList.toggle('hidden');
        });

        document.addEventListener('click', event => {
            if (event.target.offsetParent.id != 'basket-inner'
                && event.target.id != 'basket-btn'
                && this.wrapper.classList != 'hidden') {
                this.wrapper.classList.toggle('hidden');
            }
        });

        this.container.addEventListener('click', event => {
            if (event.target.name == 'remove') {
                this._remove(event.target.dataset.id);

            }
        });
    }

    _renderBasketTemplate(item) {
        return `
        <div class="cart_item">
            <img src="${item.productImg}" alt="product">
            <div class="cart_descr">
                <div class="cart_title">${item.productName}</div>
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
                <div class="cart_price">${item.amount} x ${item.productPrice}</div>
            </div>
            <a href="#" class="cart_close fas fa-times-circle" name="remove" data-id="${item.productId}"></a>
        </div>
        <hr>
    `
    }

    // temp, вызов выше, в add(item) (удаление по аналогии, делать не стал...)
    _addToBasket() {
        this.url = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/addToBasket.json';
        this._get(this.url)
            .then(result => {
                this.quantity = result;
                console.log('addGoods = ' + this.quantity.result);
            });

         this._getBasket(); // вызов для примера
    }

    // temp, получение списка товаров в корзине
    _getBasket() {
        this.url = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json';
        this._get(this.url)
            .then(basket => {
                // this.basketItem = basket.contents;
                this.amount = basket.amount;
                this.countGoods = basket.countGoods;
                this.contents = basket.contents;
                console.log('getBasket:');
                console.log('amount: ' + this.amount);
                console.log('countGoods: ' + this.countGoods);
                console.log('contents:');
                console.log(this.contents);
            });
    }
}



