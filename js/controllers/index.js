main();
let ProductsList = [];
let cart = [];
// Lấy danh sách sản phẩm
function main() {
	getProductsAPI().then(response => {
		ProductsList = response.data;
		for (let product of ProductsList) {
			product = new Product(
				product.id,
				product.name,
				product.price,
				product.screen,
				product.backCamera,
				product.frontCamera,
				product.img,
				product.desc,
				product.type
			);
		}
		
		cart = JSON.parse(localStorage.getItem("cart")) || [];
		renderCart(cart);
		
		display(ProductsList);
	});
}

// Hiển thị danh sách sản phẩm ra giao diện
function display(products) {
	const show = products.reduce((result, product) => {
		return (
			result +
			`
            <div class="col-md-3 animate__animated animate__bounceInDown wow">
                <div class="card" style="width: 18rem;">
                    <div class="card-img">
                        <img src="${product.img}" class="card-img-top">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">
                            ${product.name}
                            <span id="heart-${
								product.id
							}" class="heart" onclick="heart(${product.id})">
                                <i class="fa-solid fa-heart"></i>
                            </span>
                        </h5>
                        <div class="card-price">
                            <span>$ ${Number(
								product.price
							).toLocaleString()}</span>
                        </div>
                        <div id="card-${product.id}" class="card-text">
                            <span id="dots"></span>
                            <p>Màn hình: ${product.screen}</p>
                            <p>Camera Sau: ${product.backCamera}</p>
                            <p>Camera Trước: ${product.frontCamera}</p>
                            <p>${product.desc}</p>
                        </div>
                        <div class="card-add">
                            <a id="read-more-${
								product.id
							}" class="read-more" onclick="readMore(${
				product.id
			})">Read more...</a>
                            <a onclick="addToCart(${product.id})">
                                <span data-attr="Add"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            `
		);
	}, "");
	document.getElementById("phoneList").innerHTML = show;
}

// Hiển thị theo hãng điện thoại
function changePhone() {
	const type = document.getElementById("selectProduct").value;
	let newList = [];
	if (type === "Iphone") {
		newList = ProductsList.filter(
			product => product.type.toLowerCase() === "iphone"
		);
	} else if (type === "Samsung") {
		newList = ProductsList.filter(
			product => product.type.toLowerCase() === "samsung"
		);
	} else {
		newList = ProductsList;
	}
	display(newList);
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
	const index = ProductsList.findIndex(product => product.id == productId);
	// Tìm sản phẩm có tồn tại hay ko
	// Nếu sản phẩm có chỉ mục >= 0 sản phẩm có tồn tại
	if (index >= 0) {
		// Tìm sản phẩm trong cart xem có tồn tại hay chưa
		const idx = cart.findIndex(
			cartItem => cartItem.product.id == productId
		);
		// Nếu chưa tồn tại thì tạo mới
		if (idx < 0) {
			const cartItem = {
				product: ProductsList[index],
				quantity: 1
			};

			cart.push(cartItem);
		} else {
			// Nếu đã tồn tại thì tăng số lượng lên 1
			const cartItem = cart[idx];
			cartItem.quantity = cartItem.quantity + 1;
		}
	}
	renderCart(cart);
}

// Hiển thị thông báo giỏ hàng
function showQuantity(cart) {
	const alert = document.querySelector(".quantity");
	if (cart.length == 0) {
		alert.classList.remove("show-quantity");
		return;
	}
	if (!alert.classList.contains("show-quantity")) {
		alert.classList.add("show-quantity");
	}
	const quantity = cart.reduce((result, cartItem) => {
		return result + cartItem.quantity;
	}, 0);
	// alert.style.display = "block";
	alert.innerHTML = quantity;
}

// Hiển thị danh sách sản phẩm đã thêm vào giỏ hàng
function renderCart(cart) {
	localStorage.setItem("cart", JSON.stringify(cart));

	// Thông báo giỏ hàng trống
	if (cart.length == 0) {
		document.getElementById("empty").style.display = "block";
	} else {
		document.getElementById("empty").style.display = "none";
	}

	let total = 0;

	const html = cart.reduce((result, cartItem) => {
		total = total + cartItem.product.price * cartItem.quantity;
		return (
			result +
			`
                <tr class="cart-item">
                    <td class="cart-img">
                        <img src="${cartItem.product.img}">
                    </td>
                    <td class="cart-name">
                        <span class="name">${cartItem.product.name}</span>
                    </td>
                    <td class="cart-quanlity">
                        <button onclick="decrease(${cartItem.product.id})">
                            <i class="fa-solid fa-angle-left"></i>
                        </button>
                        <span class="quan">${cartItem.quantity}</span>
                        <button onclick="increase(${cartItem.product.id})">
                            <i class="fa-solid fa-angle-right"></i>
                        </button>
                    </td>
                    <td class="cart-price">
                        <span>${Number(
							cartItem.product.price * cartItem.quantity
						).toLocaleString()}</span>
                    </td>
                    <td class="cart-delete">
                        <a onclick="remove(${cartItem.product.id})">
                            <i class="fa-solid fa-trash"></i>
                        </a>
                    </td>
                </tr>
            `
		);
	}, "");
	document.getElementById(
		"cartTotal"
	).innerHTML = `Total: $ ${total.toLocaleString()}`;
	document.getElementById("tbodyCartList").innerHTML = html;
	showQuantity(cart);
}

// Táng số lượng sản phẩm
function increase(idProduct) {
	// Duyệt mảng tìm ra item có id = idProduct
	const newItem = cart.find(item => {
		return item.product.id == idProduct;
	});
	// Lấy quantity ra + thêm 1
	newItem.quantity = newItem.quantity + 1;

	// Gán lại item vừa thay đổi vào mảng cart
	cart = cart.map(item => {
		if (item.product.id == idProduct) {
			return newItem;
		} else {
			return item;
		}
	});
	renderCart(cart);
}

// Giảm số lượng sản phẩm
function decrease(idProduct) {
	const newItem = cart.find(item => {
		return item.product.id == idProduct;
	});
	if (newItem.quantity > 1) {
		newItem.quantity = newItem.quantity - 1;
		cart = cart.map(item => {
			if (item.product.id == idProduct) {
				return newItem;
			} else {
				return item;
			}
		});
	} else {
		cart = cart.filter(item => item.product.id != idProduct);
	}
	renderCart(cart);
}

// Xóa sản phẩm
function remove(idProduct) {
	cart = cart.filter(item => item.product.id != idProduct);
	renderCart(cart);
}

// Thanh toán sản phẩm
function buy() {
	const total = cart.reduce((result, item) => {
		return result + item.product.price * item.quantity;
	}, 0);
	document.getElementById(
		"spanGiaTien"
	).innerHTML = `Total: $${total.toLocaleString()}`;
}
function order() {
	cart = [];
	renderCart(cart);
}

// Clear giỏ hàng
function clearCart() {
	cart = [];
	renderCart(cart);
}
