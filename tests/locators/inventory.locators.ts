/**
 * Inventory/Products page locators
 */
export const inventoryLocators = {
    // Page elements
    sortDropdown: '[data-test="product-sort-container"]',
    shoppingCartLink: '[data-test="shopping-cart-link"]',
    inventoryContainer: '[data-test="inventory-container"]',

    // Product specific elements
    products: {
        backpack: {
            id: '4',
            name: 'Sauce Labs Backpack',
            description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
            price: 29.99,
            titleLink: '[data-test="item-4-title-link"]',
            imageLink: '[data-test="item-4-img-link"]',
            removeButton: '[data-test="remove-sauce-labs-backpack"]'
        },
        bikeLight: {
            id: '0',
            name: 'Sauce Labs Bike Light',
            description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
            price: 9.99,
            titleLink: '[data-test="item-0-title-link"]',
            imageLink: '[data-test="item-0-img-link"]',
            removeButton: '[data-test="remove-sauce-labs-bike-light"]'
        },
        boltTShirt: {
            id: '1',
            name: 'Sauce Labs Bolt T-Shirt',
            description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
            price: 15.99,
            titleLink: '[data-test="item-1-title-link"]',
            imageLink: '[data-test="item-1-img-link"]',
            removeButton: '[data-test="remove-sauce-labs-bolt-t-shirt"]'
        },
        fleeceJacket: {
            id: '5',
            name: 'Sauce Labs Fleece Jacket',
            description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
            price: 49.99,
            titleLink: '[data-test="item-5-title-link"]',
            imageLink: '[data-test="item-5-img-link"]',
            removeButton: '[data-test="remove-sauce-labs-fleece-jacket"]'
        },
        onesie: {
            id: '2',
            name: 'Sauce Labs Onesie',
            description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
            price: 7.99,
            titleLink: '[data-test="item-2-title-link"]',
            imageLink: '[data-test="item-2-img-link"]',
            removeButton: '[data-test="remove-sauce-labs-onesie"]'
        },
        redShirt: {
            id: '3',
            name: 'Test.allTheThings() T-Shirt (Red)',
            description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.',
            price: 15.99,
            titleLink: '[data-test="item-3-title-link"]',
            imageLink: '[data-test="item-3-img-link"]',
            removeButton: '[data-test="remove-test.allthethings()-t-shirt-(red)"]'
        }
    },

    // Helper functions to generate dynamic locators
    getProductLocators: (productId: string) => ({
        titleLink: `[data-test="item-${productId}-title-link"]`,
        imageLink: `[data-test="item-${productId}-img-link"]`
    })
} as const;
