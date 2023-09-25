	/*
		商城範例
	*/
    let products = [
        {
            'id'   : 1,
            'title': '哈利波特: 神秘的魔法石',
            'price': 250,
            'thumbnail': '_assets/images/harryPotter-1.webp'
        },
        {
            'id'   : 2,
            'title': '哈利波特: 消失的密室',
            'price': 280,
            'thumbnail': '_assets/images/harryPotter-2.webp'
        },
        {
            'id'   : 3,
            'title': '哈利波特: 阿茲卡班的逃犯',
            'price': 299,
            'thumbnail': '_assets/images/harryPotter-3.webp'
        }
    ];
    let shop = {
        'allProducts': [],
            'addToCartButtons': [], // 由於此按鈕現在是被 js 加到 HTML 中的, 稍後在 getElements() 中再選擇

            'cartToggle': document.getElementById('cart-toggle'), // 選擇 #cart-toggle, 即展開/關閉購物車的 button
            'productsContainer': document.getElementById('products-container'), // 選擇 #products-container, 即裝有商品的 div
            'addedProductsContainer': document.getElementById('added-products-container'), // 選擇 #added-products-container, 即裝有購物車中商品的 div
            'cartAmount': document.getElementById('cart-amount'), // 選擇 #cart-amount, 即裝有購物車中商品數量的 span
            'cartSubtotal': document.getElementById('cart-subtotal'), // 選擇 #cart-subtotal, 即裝有購物車中商品總價的 span

            'checkoutButton': document.getElementById('checkout-button'), // 先不用選, 最後送出購物車中商品的按鈕
            'cookieName': 'cartItems',
        'urls': {
            'getProducts': 'https://cart-handler.weihaowang.work/api/products',
            'submit': 'https://cart-handler.weihaowang.work/api/cartHandler'
        },
        'cart': {
            'items': [] ,  // 加入購物車的商品的 id
            'subtotal': 0, // 加入購物車的商品的總價
            'amount': 0    // 加入購物車的商品的數量
        },
        'init': function(productsInCookie){
            this.renderElements();// 向作業網站請求商品列表
            this.getElements();
            this.addListeners();
            if(productsInCookie){
                // 如果有存在 cookie 的商品 id...
                /* 
                    8.
                    productsInCookie 為已經入購物車的商品 id 的陣列, 
                    我們可以用 for 迴圈來檢視此陣列中的每個值, 
                    現在要呼叫 shop 的哪個方法來把有這些 id 的商品加入購物車?
                */
                for(let i = 0 ; i < productsInCookie.length ; i++){
                this.updateCart(productsInCookie[i]);
               }
            }
            
        },
        'renderElements': function(){
            /*
                    1.
                    對 this.allProducts 使用 for 迴圈
                    將以下商品 HTML 的模板加入 this.productsContainer 中
                    記得將「書名」, 「縮圖」, 「價格」, 「商品id」換成正確的值 
                */
            for (let i = 0; i < this.allProducts.length; i++) {
                    let p = this.allProducts[i]; //1.指定為陣列 2.讓程式碼更簡潔(類似SQL別名的作用)
                    this.productsContainer.innerHTML += `<div class="product" id="product-` + (i + 1) + `">
                    <div class="product-thumbnail-wrapper"><img class="product-thumbnail" src="` + p.thumbnail + `"></div>
                    <div class="product-name">` + p.title + `</div>
                    <div class="product-price-wrapper"><span class="product-price">`+ p.price + `</span> 元</div>
                    <button class="add-to-cart-button" productId = "`+ p.id + `">加入購物車</button>
                </div>`
                }
        },
        'getElements': function(){
            this.addToCartButtons = document.getElementsByClassName('add-to-cart-button');
        },
        'addListeners': function(){
           /*
                    2
                    如同前一個練習, 對 this.addToCartButtons 使用 for 迴圈,
                    按下「加入購物車」按鈕時呼叫 this.updateCart(), 但這次要傳入商品id
                    商品 id 在 this.renderElements() 中被存為按鈕的 HTML Attribute "productId"
                    如何得到 HTML Attribute?
                */
                for (let i = 0; i < this.addToCartButtons.length; i++) {
                    let add = this.addToCartButtons[i];
                    add.addEventListener('click', function () {
                        let productId = add.getAttribute("productId"); //為甚麼要宣告???
                        this.updateCart(productId);
                        console.log(productId);
                    }.bind(this));
                }

                /*
                    3
                    當按下 this.cartToggle 時, body 加上 "viewing-cart" 這個 class
                    再次按下 this.cartToggle 時, body 移除 "viewing-cart" 這個 class
                    ...
                */
                this.cartToggle.addEventListener('click', function () {
                    document.body.classList.toggle("viewing-cart");
                });

        },
        'updateCart': function(p_id){
            console.log("updateCart()");

            for(let i = 0; i < this.allProducts.length; i++)
            {
                if(this.allProducts[i].id == p_id){
                    /* 
                        4.1
                        如果 p_id 等於 this.allProducts[i] 的 id
                        更新 this.cart.items, this.cart.subtotal, this.cart.amount
                        */
                        let p = this.allProducts[i];
                        this.cart.items.push(p_id); //push()把值從後面加進去，以維持第一個加入的值在前
                        this.cart.subtotal += p.price; //累加
                        this.cart.amount += 1; //按1次按鈕 加1下
                        /* 
                            4.2
                            呼叫 this.updateCartUI(), 並將商品名稱跟價格傳進去
                        */
                        this.updateCartUI(p.title, p.price);
                        /* 
                        6.
                        更新 cookie 
                        用 setCookie() 將 this.cart.items 存在 cookie 中
                        由於 cookie 的值只能是字串, 我們這裡會使用 JSON.stringify(this.cart.items) 來將陣列準換成文字且保留其格式
                        cookie 名稱儲存在 this.cookieName
                        */
                       
                       let data = JSON.stringify(this.cart.items);
                       setCookie(this.cookieName,data);
                       
                       break; //完成動作找到東西後break迴圈

                    }
            }
            
            console.log(this.cart);
        },
        'updateCartUI': function(p_name, p_price){
            // 更新購物車的 UI
            /*
                    5.1
                    將以下商品 HTML 的模板加入 this.addedProductsContainer 中
                    記得將「商品名稱」, 「價格」換成傳入的參數 
                */
                this.addedProductsContainer.innerHTML += `<div class="added-product">
                    <span class="added-product-title">` + p_name + `</span>
                    <span class="added-product-price">` + p_price + `</span>
                </div>`;

                /*
                    5.2
                    更新 this.cartAmount 跟 this.cartSubtotal 的 innerText
                */
                // let carAmount = document.getElementById('cart-amount');
                // let cartSubtotal = document.getElementById('cart-subtotal');
                this.cartAmount.innerText = this.cart.amount; //左側的this在html的span中有定義，右側的this是shop
                this.cartSubtotal.innerText = this.cart.subtotal;
            },
        'fetchProducts': function(){
            // 從資料庫請求商品資料
            let request = new XMLHttpRequest();
            request.addEventListener('readystatechange', function(){
                if ( request.readyState === 4 && request.status === 200) {
                        // request 成功, 開始處理 response
                        this.allProducts = JSON.parse(request.responseText);
                    } 
            }.bind(this));
            request.open('GET', this.urls.getProducts, false);
            request.send();            
        },
        'submit': function(){
            // 向資料庫傳送購物車資料
            console.log("submit");
            let request = new XMLHttpRequest();
            request.addEventListener('readystatechange', function () {
                if (request.readyState === 4 && request.status === 200) {
                    console.log(request.responseText);
                    eraseCookie(this.cookieName); // 成功送出後記得清除 cookie
                }
            }.bind(this));
            request.open('POST', this.urls.submit, true);
            request.setRequestHeader('Content-type', 'application/json');
            let data = {
                'token': 'd4744db9e7b14fb757d0fd621b975dc0c7fdfdb0bf130e37c0510c9f27171f5f',
                'items': this.cart.items,
                'subtotal': this.cart.subtotal,
            }
            data = JSON.stringify(data);
            request.send(data);
        },
    }
    /*
        7. 
        用 getCookie(name) 來讀取儲存購物車中商品的 cookie,
        此時讀取的 cookie 為字串, 我們可以用 JSON.parse( getCookie(name) ) 將其轉換回陣列,
        並存到 productsInCookie(宣告這個變數，將值存入此變數中),
        cookie 名稱儲存在 shop.cookieName
    */
    
