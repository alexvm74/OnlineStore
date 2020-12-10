class initBasket {
    constructor() {
        // инициализии ниже лучше делать вне конструктора....
        this.items = [];
        this.total = null; // можно просто ставить ";" без null
        this.basketUrl = 'https://raw.githubusercontent.com/kellolo/static/master/JSON/basket.json';
        this.addUrl    = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/addToBasket.json';
        this.removeUrl = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/deleteFromBasket.json';
        this.getUrl    = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json';
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
        this._get(this.basketUrl)
            .then(basket => {
                this.items = basket.content;
                this._render();
                this._handleEvents();
            });

        this._getBasket(); // temp: (для получения списка товаров в корзине Git-JSON)
    }

    async _get(url) {
        return await fetch(url).then(r => r.json()); // сделает запрос за джейсоном,
        // дождётся ответа и преобразует джейсон в объект, который вернётся из данного метода.
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
        // fetch(this.addUrl, {
        //     method: "post",     // будет выдавать ошибку (POST 403 Forbidden), т.к. запрос в Git к JSON, а не к real серверу.
        //     body: JSON.stringify(item),
        // }).finally(() =>
        //     this._get(this.url).then((basket) => {
        //         this.items = basket.content;
        //         this._render();
        //     })
        // );

        let find = this.items.find(el => item.productId == el.productId);
        if (find) {
            find.amount++;
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
            // console.log(event.target.offsetParent);
            if (event.target.offsetParent?.id != 'basket-inner' && // "?" - костыль для ссылки "remove" (TypeError: Cannot read property 'id' of null)
                event.target.id != 'basket-btn' &&
                this.wrapper.classList != 'hidden' &&
                event.target.name !== "remove") {                  // и это тоже
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
            <a href="#" class="cart_remove fas fa-times-circle" name="remove" data-id="${item.productId}"></a>
        </div>
        <hr> `
    }

    // temp, для получения списка товаров в корзине Git-JSON (не в корзине этого магазина) 
    // (авто вызов 1 раз после init корзины)
    _getBasket() {
        this._get(this.getUrl)
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



