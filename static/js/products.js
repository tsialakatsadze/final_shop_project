const productListSelector = document.querySelector('#productList');
const products = [
    {
        id: 1,
        title: 'პაუჩი მსხალი 120გ 7234 გუდ გოუტი - Good Gout',
        image: '/static/images/products/1.webp',
        price: 8.07,
        currency: '₾',
    },
    {
        id: 2,
        title: 'რძის ნაზავი სტანდარტ 2 5908 დანალაკ - Danalac',
        image: '/static/images/products/2.webp',
        price: 33.90,
        currency: '₾',
    },
    {
        id: 3,
        title: 'HappyNights Overnight Comfort Diapers',
        image: '/static/images/products/3.webp',
        price: 33.90,
        currency: '₾',
    },
    {
        id: 4,
        title: 'FRISO - ფრისო პეპ AC 0273',
        image: '/static/images/products/4.webp',
        price: 46.50,
        currency: '₾',
    },
    {
        id: 5,
        title: 'Heinz - ჰეინცი პიურე საქონლის ხორცით 0787',
        image: '/static/images/products/5.webp',
        price: 7.35,
        currency: '₾',
    },
    {
        id: 6,
        title: 'Heinz - ჰეინცი პიურე ინდაური 0824',
        image: '/static/images/products/6.webp',
        price: 7.35,
        currency: '₾',
    }
]

products.map(product => {
    const productElement = `
            <article class="product-card cart-type-xenon h-full transform overflow-hidden rounded border border-border-200 border-opacity-70 bg-light transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow">
                <div class="relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64 m-4 mb-0">
                    <span class="sr-only">Product Image</span>
                    <img
                        alt="${product.title}"
                        class="product-image object-contain"
                        src="${product.image}"
                        style="position: absolute; height: 100%; width: 100%; inset: 0; color: transparent;"
                    >
                </div>
                <header class="p-3 md:p-6">
                    <h3 class="cursor-pointer truncate text-xs text-body md:text-sm" title="${product.title}">${product.title}</h3>
                    <div class="mt-2 flex items-center justify-between">
                        <div class="flex flex-col md:flex-row md:items-center">
                            <span class="text-sm font-semibold text-heading md:text-base">${product.currency + product.price}</span>
                        </div>
                        <div>
                            <button class="flex h-7 w-7 items-center justify-center rounded border border-border-200 bg-light text-sm text-heading transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-0 md:h-9 md:w-9">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5 stroke-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>
            </article>
        `;
    productListSelector.innerHTML += productElement;
});